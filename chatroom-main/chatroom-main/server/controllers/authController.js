const { createError } = require('../utils/error');
const { StatusCodes, ReasonPhrases } = require('http-status-codes');
const { sendJson, sendResponse } = require('../utils/response');
const { signUser, verifyUser } = require('../auth/token');
const User = require('../models/user');
const { validatePassword } = require('../auth/password');

// Creats a json web token and sends it to the user with the user phone as its body
async function sendUserToken(req, res) {
  const { user } = req.body;
  const completeProfile = Boolean(user.name);
  const tokenBody = {
    id: user._id.toString(),
    completeProfile: completeProfile,
  };
  console.log(user);
  const token = await signUser(tokenBody);
  sendJson(StatusCodes.OK, res, { token });
}

async function toggleTwoFactorAuthentication(req, res) {
  const { userId, choice } = req.body;
  await User.toggleTwoFactorAuthentication(userId, Boolean(choice)).exec();
  sendResponse(StatusCodes.OK, res, ReasonPhrases.OK);
}

// Function used for user verification from the json web token
async function verifyUserToken(req, res, next) {
  const token = req.headers.authorization;
  console.log('token', token);
  if (!token)
    return next(
      createError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST)
    );
  const decoded = await verifyUser(token);
  if (!decoded)
    return next(
      createError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST)
    );

  const user = await User.findById(decoded.id);
  req.body['user'] = user;
  next();
}

async function validateUser(req, _res, next) {
  const { phone, password } = req.body;

  if (!phone || !password)
    return next(
      createError(StatusCodes.BAD_REQUEST, ReasonPhrases.BAD_REQUEST)
    );

  const user = await User.findByPhone(phone);
  console.log(user);
  if (!user) return next();

  if (!validatePassword(user.password, password))
    return next(createError(StatusCodes.NOT_FOUND, ReasonPhrases.NOT_FOUND));
  req.body['user'] = user;
  next();
}

module.exports = {
  sendUserToken,
  toggleTwoFactorAuthentication,
  verifyUserToken,
  validateUser,
};
