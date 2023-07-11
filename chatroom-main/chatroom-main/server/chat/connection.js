const cache = require('../database/cache');

const addUserSocket = (socketId, userId) => {
  return cache.SADD(userId, socketId);
};

const removeUserSocket = (socketId, userId) => {
  return cache.SREM(userId, socketId);
};

const isUserOffline = async (userId) => {
  const sockets = await cache.SCARD(userId);
  return sockets === 0;
};

const getUserSockets = (userId) => {
  return cache.SMEMBERS(userId);
};

const isUserOnline = async (userId) => {
  const sockets = await cache.SCARD(userId)
  return sockets > 0;
}


module.exports = {
  addUserSocket,
  removeUserSocket,
  isUserOffline,
  getUserSockets,
  isUserOnline
};
