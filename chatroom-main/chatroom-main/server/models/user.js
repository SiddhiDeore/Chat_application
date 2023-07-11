const database = require('../database/database');
const { MODEL_USER, MODEL_CHAT } = require('./models');
const UserSchema = new database.Schema(
  {
    name: {
      type: String,
    },
    phone: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    profilePictureUri: {
      type: String,
    },

    about: {
      type: String,
    },

    twoFactorAuthenticationEnabled: {
      type: Boolean,
      default: false,
    },

    currentChatIds: [
      {
        type: database.Schema.Types.ObjectId,
        ref: MODEL_CHAT,
      },
    ],

    blockedUsers: [
      {
        type: database.Schema.Types.ObjectId,
        ref: MODEL_USER,
      },
    ],

    contacts: [
      {
        type: database.Schema.Types.ObjectId,
        ref: MODEL_USER,
      },
    ],
  },
  {
    statics: {
      findByPhone(phone) {
        return this.findOne({ phone: phone });
      },

      createUser(phone, hashedPassword) {
        return this.create({
          phone: phone,
          password: hashedPassword,
        });
      },

      updateAbout(phone, about) {
        return this.updateOne({ phone: phone }, { about: about });
      },

      toggleTwoFactorAuthentication(id, choice) {
        return this.findByIdAndUpdate(id, {
          twoFactorAuthenticationEnabled: choice,
        });
      },

      addBlockedUser(userId, userToBlockId) {
        return this.findByIdAndUpdate(userId, {
          $push: {},
        });
      },

      deleteUser(userId) {
        return this.findByIdAndDelete(userId);
      },

      getUserChatIds(userId) {
        return this.findById(userId)
          .select({ currentChatIds: 1 })
          .populate('currentChatIds')
          .exec();
      },

      getUserProfile(userId) {
        return this.findById(userId).populate('contacts').exec();
      },
    },

    timestamps: true,
  }
);

const User = database.model(MODEL_USER, UserSchema);

module.exports = User;
