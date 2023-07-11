const database = require('../database/database');

async function toObjectId(id) {
  return new database.Schema.Types.ObjectId(id);
}

async function Log(body) {
  console.log(body);
  console.dir(body);
}
module.exports = {
  toObjectId,
  Log,
};
