
module.exports.createBasicAuthHeader = function(encodedUser) {
  var headers = {
    'Authorization': 'Basic ' +  encodedUser,
    'Accept':'application/json',
    'Content-Type':'application/json'};
  return headers;
}

module.exports.validationResponseMessageFormat = function(message) {
  return {
    message,
  };
}

module.exports.logHttpError = function(logger, error) {
  if (error.data) {
    logger.error(`ERROR: ${error.data.message} / ${error.response}`);
  } else if (error.response && error.response.statusCode) {
    logger.error("FAIL: " + error.response.statusCode + " MESSAGE " + error.response.statusMessage);
  } else {
    logger.error(error);
  }
}