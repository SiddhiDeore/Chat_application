const database = require('../database/database');
const { MODEL_USER, MODEL_MESSAGES, MODEL_MESSAGE_QUEUE } = require('./models');

const MessageQueueSchema = new database.Schema(
  {
    userId: {
      type: database.Schema.Types.ObjectId,
      ref: MODEL_USER,
      index: true
    },

    messages: [
      {
        type: database.Schema.Types.ObjectId,
        ref: MODEL_MESSAGES,
      },
    ],
  },
  {
    statics: {
      pushMessage(userId, message) {
        return this.findOneAndUpdate(
          { userId: userId },
          { $push: { messages: message._id } }
        ).exec();
      },

      fetchUnreadMessages(userId) {
        return this.findOne({ userId: userId }).exec();
      },

      emptyMessages(userId) {
        return this.findOneAndUpdate(
          { userId: userId },
          {
            $set: { messages: [] },
          }
        ).exec();
      },

      findByUserId(userId){
        return this.findOne({
          userId: userId
        })
      },
      
      createMessageQueue(userId) {
        return this.create({
          userId: userId,
        });
      },
    },
  }
);

const MessageQueue = database.model(MODEL_MESSAGE_QUEUE, MessageQueueSchema);
module.exports = MessageQueue;
