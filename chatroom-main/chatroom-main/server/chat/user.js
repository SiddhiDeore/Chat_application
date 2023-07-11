const Chat = require('../models/chat');
const { Message } = require('../models/message');
const MessageQueue = require('../models/message-queue');
const User = require('../models/user');
const {
  removeUserSocket,
  isUserOffline,
  isUserOnline,
  addUserSocket,
  getUserSockets,
} = require('./connection');

async function onUserConnect(userId, io, socket) {
  const userWasOffline = await isUserOffline(userId);
  await addUserSocket(socket.id, userId);
  const newMessages = await MessageQueue.fetchUnreadMessages(userId);
  newMessages.messages.forEach(async (message) => {
    await Message.setMessageRecieved(message.toString());
  });
  const user = await User.findById(userId).exec();
  const chatIds = user.currentChatIds;
  const chats = [];

  for (const chatId of chatIds) {
    const chat = await Chat.fetchMessages(chatId.toString()).exec();
    if (chat) {
      const recipient =
        chat.participant1._id.toString() === userId
          ? chat.participant2
          : chat.participant1;
      const isOnline = await isUserOnline(recipient._id.toString());
      const composed = {
        recipient: { ...recipient._doc, isOnline },
        chats: chat.messages,
        chatId: chat._id,
      };
      console.log(composed);
      chats.push(composed);
    }
  }

  console.log(chats);
  socket.emit('chats', { chats: chats, user: user });
  MessageQueue.emptyMessages(user._id.toString());
  if (userWasOffline) sendUserOnlineEvent(user.contacts, io);
}

async function onAddUser(userId, contactPhone, io) {
  const user = await User.findById(userId);
  const contact = await User.findByPhone(contactPhone);
  const alreadyContact = user.contacts.find(
    (userContact) => userContact === contact._id
  );

  if (!alreadyContact) user.contacts.push(contact._id);
  await user.save();
}

async function onUserDisconnect(socketId, userId, io) {
  await removeUserSocket(socketId, userId);
  console.log(
    `User with userId: ${userId} and with socket id: ${socketId} got disconnected 🥹🥹`
  );
  if (await isUserOffline(userId)) {
    console.log(`User ${userId} went offline 🙂🙂`);
    sendUserOfflineEvent(userId, io);
  }
}

async function sendUserOfflineEvent(userId, io) {
  const user = await User.findById(userId);
  const contacts = user.contacts;
  contacts.forEach((contact) => {
    const contactId = contact.toString();
    sendUserEvent(userId, 'offline', { userId: contactId }, io);
  });
}

async function sendUserOnlineEvent(contacts, io) {
  contacts.forEach(async (contact) => {
    const userId = contact.toString();
    const userOnline = await isUserOnline(userId);
    if (userOnline) {
      sendUserEvent(userId, 'online', { userId: userId }, io);
    }
  });
}

async function sendUserEvent(userId, event, data, io) {
  const userSockets = await getUserSockets(userId);
  userSockets.forEach((userSocket) => {
    io.to(userSocket).emit(event, data);
  });
}

module.exports = {
  onUserConnect,
  onAddUser,
  onUserDisconnect,
  sendUserEvent,
};
