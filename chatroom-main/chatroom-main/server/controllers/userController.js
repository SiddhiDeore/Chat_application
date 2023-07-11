const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { hashPassword } = require('../auth/password');
const { isUserOnline } = require('../chat/connection');
const User = require('../models/user');
const { sendResponse, sendJson } = require('../utils/response');
const { Log } = require('../utils/utilities');
const { createError } = require('../utils/error');
const MessageQueue = require('../models/message-queue');

const createUser = async (req, _res, next) => {
  const { user } = req.body;
  console.log(user);
  if (user) return next();
  const { phone, password } = req.body;
  const hashedPassword = await hashPassword(password);
  const newUser = await User.createUser(phone, hashedPassword);

  // Create the message queue for the user
  MessageQueue.createMessageQueue(newUser._id);
  console.log(newUser);

  req.body['user'] = newUser;
  req.body['new-user'] = true;
  next();
};

const userExists = async (req, _res, next) => {
  const { phone } = req.body;
  const user = await User.findOne({ phone });
  console.log(user);

  if (!user) return next();
  req.body['user'] = user;
  next();
};

async function deleteUserAccount(req, res) {
  const { userId } = req.body;
  User.deleteUser(userId);
  sendResponse(
    StatusCodes.MOVED_PERMANENTLY,
    res,
    ReasonPhrases.MOVED_PERMANENTLY
  );
}

async function getUserByPhone(req, _res, next) {
  const { phone } = req.body;
  const user = await User.findByPhone(phone);

  // If the user is not found which means the user has deleted has account
  if (!user) return next(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND);
  Log(user);
  req.body['userId'] = user._id;
  return next();
}

async function getUserDetails(req, res, _next) {
  const { user } = req.body;
  const userId = user._id.toString();
  const profile = await User.getUserProfile(userId);
  let contacts = profile.contacts;
  console.log(contacts)

  const contactsInfo = []
  for (const contact of contacts){
    const contactId = contact._doc._id.toString()
    const isOnline = await isUserOnline(contactId);
    contactsInfo.push({...contact._doc, isOnline})
  }
  sendJson(StatusCodes.OK, res, { profile: profile, contacts: contactsInfo });
}


async function addContact(req, res, next) {
  const { phone, user: userBody } = req.body;
  const contact = await User.findByPhone(phone);
  if (!contact)
    return next(createError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));

  const user = await User.findById(userBody._id).exec();

  const contacts = user.contacts;
  const contactExists = contacts.find(
    (userContact) => userContact.toString() === contact._id.toString()
  );

  if (contactExists)
    return next(
      createError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST)
    );

  user.contacts.push(contact._id);
  await user.save();
  sendResponse(StatusCodes.OK, res, ReasonPhrases.OK);
}

async function completeUserProfile(req, _res, next) {
  const { name, user } = req.body;
  const userId = user._id.toString();
  const updatedUser = await User.findByIdAndUpdate(userId, {
    name: name,
  }).exec();
  console.log(updatedUser);
  req.body['user'] = updatedUser;
  next();
}

module.exports = {
  createUser,
  userExists,
  deleteUserAccount,
  getUserByPhone,
  getUserDetails,
  addContact,
  completeUserProfile,
};
