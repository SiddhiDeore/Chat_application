const database = require('mongoose');
const { MODEL_USER, MODEL_MESSAGES } = require('./models');

const MessageSchema = new database.Schema(
  {
    text: {
      type: String,
      required: true,
    },

    recieved: {
      type: Boolean,
      default: false
    },

    seen: {
      type: Boolean,
      default: false
    },

    sent: {
      type: Boolean,
      default: true,
    },

    from: {
      type: database.Schema.Types.ObjectId,
      ref: MODEL_USER,
      required: true,
    },

    to: {
      type: database.Schema.Types.ObjectId,
      ref: MODEL_USER,
      required: true,
    },
  },

  {
    statics: {
      setMessageSeen(messageId) {
        return this.findByIdAndUpdate(messageId, { seen: true }).exec();
      },

      setMessageRecieved(messageId) {
        return this.findByIdAndUpdate(messageId, { recieved: true }).exec();
      },

      setMessageSent(messageId) {
        return this.findByIdAndUpdate(messageId, { sent: true }).exec();
      },

      createMessage(text, from, to) {
        return this.create({
          text: text,
          from: from,
          to: to,
        });
      },
    },

    timestamps: true
  }
);

const Message = database.model(MODEL_MESSAGES, MessageSchema);

module.exports = { Message, MessageSchema };