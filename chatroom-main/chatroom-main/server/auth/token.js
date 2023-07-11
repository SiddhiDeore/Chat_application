const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const { promisify } = require('util');
const tokenSign = promisify(jwt.sign);
const tokenVerify = promisify(jwt.verify);
dotenv.config();

const signUser = async (data) => {
  return tokenSign(data, process.env.JWT_SECRET);
};

const verifyUser = (token) => {
  return tokenVerify(token, process.env.JWT_SECRET);
};

module.exports = {
  signUser,
  verifyUser,
};
