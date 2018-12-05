const xhr = require('xhr');
import { errorHelper } from 'helpers/errorHelper';

// Is there a better way to structure this function so it has an expilcit return value?
/* eslint-disable consistent-return */
const makeRequest = (uri, method = 'GET', body = undefined) => new Promise((resolve, reject) => {
  const options = {
    uri,
    method,
    timeout: 30000,
  };
  if (method === 'GET' && body) {
    options.uri = `${options.uri}?payload=${JSON.stringify(body)}`;
  } else if (body) {
    options.json = body;
  }
  xhr(options, (error, response) => {
    if (error) {
      const message = errorHelper(error);
      return reject(message);
    }
    // TODO: clean this up
    if ([200, 201, 304].indexOf(response.statusCode) === -1) {
      return reject(errorHelper(response));
    }
    let output;
    try {
      output = JSON.parse(response.body);
    } catch (err) {
      output = response.body;
    }
    resolve(output);
  });

  return xhr;
});
/* eslint-enable consistent-return */

export const fetch = (uri, body) => makeRequest(uri, 'GET', body);
export const put = (uri, body) => makeRequest(uri, 'PUT', body);
export const post = (uri, body) => makeRequest(uri, 'POST', body);
export const erase = uri => makeRequest(uri, 'DELETE');
