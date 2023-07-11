const redis = require('redis');
const dotenv = require('dotenv');
dotenv.config();
const cache = redis.createClient({
  url: process.env.REDIS_URI,
});
cache.connect().then(() => {
  console.log('CACHE READY😊');
});

cache.on('error', console.log);

module.exports = cache;
