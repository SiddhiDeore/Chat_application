module.exports.sendResponse = (statuscode, response, message) => {
  response.status(statuscode).json({ message: message });
};

module.exports.sendJson = (statuscode, response, json) => {
  response.status(statuscode).json(json);
};

module.exports.sendError = (error, response) => {
  response.status(error.statuscode).json({message: error.message});
};

module.exports.errorHandler = (error, _req, res, _next) => {
  console.log('error ' + error.statuscode)
    module.exports.sendError(error, res);
}

