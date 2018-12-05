const rp = require('request-promise-native');
const config = require('./config');

/**
 * Login and keep the cookie.
 *
 * @returns RequestPromise.
 */
function login() {
  const options = {
    method: 'POST',
    uri: `${config.apiUrl}/login`,
    body: {
      email: config.email,
      password: config.password,
    },
    json: true,
    jar: true,
  };
  return rp(options);
}

/**
 * Gets the latest revision number from twiglet then patches the nodes and links.
 *
 * @param {any} twiglet
 * @returns RequestPromise
 */
function patchTwiglet(twiglet) {
  const getOptions = {
    method: 'GET',
    uri: `${config.apiUrl}/twiglets/${config.name}`,
    transform(body) {
      return JSON.parse(body);
    },
  };
  return rp(getOptions).then((response) => {
    const putOptions = {
      method: 'PATCH',
      uri: response.url,
      body: {
        _rev: response._rev, // eslint-disable-line
        commitMessage: twiglet.commitMessage,
        links: twiglet.links,
        nodes: twiglet.nodes,
      },
      json: true,
      jar: true,
    };
    return rp(putOptions);
  });
}

/**
 * Creates an event on the twiglet.
 *
 * @param {any} eventName what the event should be called.
 * @returns RequestPromise
 */
function createEvent(eventName) {
  const getOptions = {
    method: 'GET',
    uri: `${config.apiUrl}/twiglets/${config.name}`,
    transform(body) {
      return JSON.parse(body);
    },
  };
  return rp(getOptions).then((response) => {
    const postOptions = {
      method: 'POST',
      uri: response.events_url,
      body: {
        name: eventName,
      },
      json: true,
      jar: true,
    };
    return rp(postOptions);
  });
}

module.exports = {
  login,
  patchTwiglet,
  createEvent,
};
