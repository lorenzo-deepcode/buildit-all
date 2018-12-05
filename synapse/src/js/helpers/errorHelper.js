// Takes a thing from the api and returns a string that represents the error.
// TODO: Clarify the expected cases,
// and use meaningful variable names that make these cases apparent.

export const stockErrorMessage = 'An unknown error occurred.';
export const xhrErrorMessage = 'We are unable to reach the server at this time.';
export const xhrInternalErrorMessage = 'Internal XMLHttpRequest Error';

export const errorHelper = thing => {
  if (thing && thing.body) {
    let innerThing;
    try {
      innerThing = JSON.parse(thing.body);
    } catch (err) {
      innerThing = thing.body;
    }
    if (innerThing.error && innerThing.error.message) return innerThing.error.message;
    if (innerThing.error && innerThing.error.statusCode) return innerThing.error.statusCode;
    return stockErrorMessage;
  }

  if (thing && thing.statusText) {
    return thing.statusText;
  }

  if (thing && thing.message) {
    if (thing.message === xhrInternalErrorMessage) {
      return xhrErrorMessage;
    }
    return thing.message;
  }

  return stockErrorMessage;
};
