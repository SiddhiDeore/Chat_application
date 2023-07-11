const database = require('mongoose');
const crypto = require('crypto');
const { MODEL_CHAT, MODEL_MESSAGES, MODEL_USER } = require('./models');

const ChatSchema = new database.Schema(
  {
    before: {
      type: database.Schema.Types.ObjectId,
      ref: MODEL_CHAT,
    },

    participant1: {
      type: database.Schema.Types.ObjectId,
      ref: MODEL_USER,
      required: true,
    },

    participant2: {
      type: database.Schema.Types.ObjectId,
      ref: MODEL_USER,
      required: true,
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
      createChatId(participant1, participant2) {
        const data = participant1 + participant2;
        const chatId = crypto
          .createHash('sha256')
          .update(data)
          .digest('hex')
          .toString();
        console.log('Chat Id created : ' + chatId);
        return chatId;
      },

      findByChatId(chatId) {
        return this.findOne({ chatId: chatId });
      },

      createChat(participant1, participant2) {
        return this.create({
          participant1: participant1,
          participant2: participant2,
        });
      },

      addMessageToChat(id, message) {
        return this.findByIdAndUpdate(id, {
          $push: {
            messages: message._id,
          },
        }).exec();
      },

      fetchMessages(chatId) {
        const notIncludedFields = { currentChatIds: 0, password: 0 };
        return this.findById(chatId)
          .populate({
            path: 'messages',
          })
          .populate('participant1', notIncludedFields)
          .populate('participant2', notIncludedFields);
      },

      findOtherParticipant(chatId, participantId) {
        return chatId ^ participantId;
      },
    },
    timestamps: true,
  }
);

const Chat = database.model(MODEL_CHAT, ChatSchema);
module.exports = Chat;
