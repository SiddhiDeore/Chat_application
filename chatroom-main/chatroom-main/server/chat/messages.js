const Chat = require('../models/chat');
const { Message } = require('../models/message');
const { isUserOnline } = require('./connection');
const database = require('../database/database');
const MessageQueue = require('../models/message-queue');
const { sendUserEvent } = require('../chat/user');
const User = require('../models/user');

async function onMessageRecieved(messageBody, io, userId, socket) {
  const to = new database.Types.ObjectId(messageBody.to);
  const from = new database.Types.ObjectId(userId);
  const text = messageBody.text;
  let chatId = messageBody.chatId;

  const message = await (
    await Message.createMessage(text, from, to)
  ).populate('to');

  const recieverId = to.toString();
  let chat = await Chat.findById(chatId).exec();

  // If chat doesn't exists then create chat
  if (!chat) {
    chat = await Chat.createChat(to, from);
    const sender = await User.findById(userId).exec();
    const reciever = await User.findById(recieverId).exec();
    onNewChat(sender, reciever, chat);
  }
  chat.messages.push(message._id);
  chat.save();

  const recieverOnline = await isUserOnline(recieverId);
  message.recieved = recieverOnline;
  const finalMessage = await message.save();

  socket.emit('message-acknowledged', {
    message: finalMessage,
    chatId: chat._id.toString(),
  });
  // If the user is online then send the messages to the user
  // Else send the messages to the message queue
  if (isUserOnline(recieverId))
    sendUserEvent(recieverId, 'new-message', message, io);
  else pushMessagesToMessageQueue(to, message._id);
}

async function onMessageSeen(messages, io) {
  messages.forEach((message) => {
    const messageId = message._id;
    Message.setMessageSeen(messageId);
  });

  const recieverId = messages[0].from.toString();
  if (await isUserOnline(recieverId)) sendUserEvent(recieverId, 'message-seen', messages, io);
}

async function pushMessagesToMessageQueue(userId, messageId) {
  const queue = await MessageQueue.findByUserId(userId);
  queue.messages.push(messageId);
  await queue.save();
}

async function onUserTyping(userId, recieverId, io) {
  if (isUserOnline(recieverId)) {
    sendUserEvent(recieverId, 'user-typing', { recipientId: userId }, io);
  }
}

async function onNewChat(sender, reciever, chat) {
  sender.currentChatIds.push(chat._id);
  reciever.currentChatIds.push(chat._id);
  await sender.save();
  await reciever.save();
}

module.exports = {
  onMessageRecieved,
  onMessageSeen,
  onUserTyping,
};
