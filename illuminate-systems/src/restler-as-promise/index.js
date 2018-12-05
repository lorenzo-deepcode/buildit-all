const Rest = require('restler');

function handleFinish(func) {
  return (data, response) => func({ data, response});
}

function promiseWrapper(method) {
  return function wrapped(url, options) {
    return new Promise((resolve, reject) => {
      const request = method.apply(Rest, [url, options]);
      request.on('success', handleFinish(resolve));
      request.on('fail', handleFinish(reject));
      request.on('error', handleFinish(reject));
    });
  }
}

function promiseWrapperWithData(method) {
  return function wrapped(url, data, options) {
    return new Promise((resolve, reject) => {
      const request = method.apply(Rest, [url, data, options]);
      request.on('success', handleFinish(resolve));
      request.on('fail', handleFinish(reject));
      request.on('error', handleFinish(reject));
    });
  }
}

module.exports = {
  del: promiseWrapper(Rest.del),
  get: promiseWrapper(Rest.get),
  head: promiseWrapper(Rest.head),
  patch: promiseWrapper(Rest.patch),
  post: promiseWrapper(Rest.post),
  put: promiseWrapper(Rest.put),
  json: promiseWrapperWithData(Rest.json),
  patchJson: promiseWrapperWithData(Rest.patchJson),
  postJson: promiseWrapperWithData(Rest.postJson),
  putJson: promiseWrapperWithData(Rest.putJson),
}