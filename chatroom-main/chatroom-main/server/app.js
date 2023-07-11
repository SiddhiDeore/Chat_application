const express = require('express');
const dotenv = require('dotenv');
const { createServer } = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const { Server } = require('socket.io');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/user');
const morgan = require('morgan');
const database = require('./database/database');
const { errorHandler } = require('./utils/response');
const { verifyUser } = require('./auth/token');
const cache = require('./database/cache');
const {
  onUserTyping,
  onMessageSeen,
  onMessageRecieved,
} = require('./chat/messages');
const { onUserDisconnect, onUserConnect } = require('./chat/user');

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan('dev'));
app.use((req, res, next) => {
  console.log(req.body);
  next();
});

// routes
app.use('/auth', authRouter);
app.use('/', userRouter);

app.use(errorHandler);
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
  },
});

io.on('connection', async (socket) => {
  const token = socket.handshake.auth.token;
  const { id: userId } = await verifyUser(token);
  onUserConnect(userId, io, socket);

  console.log(`User : ${userId} <=> ${socket.id} got connected🥹🥹🥹🥹`);
  socket.on('message', (message) => {
    console.log(`Message ${message} came from ${socket.id}`);
    onMessageRecieved(message, io, userId, socket);
  });

  socket.on('typing', (data) => {
    const { recieverId } = data;
    onUserTyping(userId, recieverId, io);
  });

  socket.on('disconnect', () => {
    onUserDisconnect(socket.id, userId, io);
  });

  socket.on('seen', (messages) => {
    console.log('seen')
    onMessageSeen(messages, io);
  });
});

process.on('SIGINT', () => {
  cache.FLUSHDB();
});

httpServer.listen(process.env.SERVER_PORT, () => {
  console.log(`server running on port ${process.env.SERVER_PORT}😎`);
  database.connect(process.env.MONGODB_URI, {}, () => {
    console.log('connected to the database');
  });
});
