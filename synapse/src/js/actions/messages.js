import * as types from 'actions/actions';

export const setErrorMessage = message => {
  if (typeof message !== 'string') {
    throw new Error('setErrorMessage takes a string as its parameter');
  }
  return ({
    type: types.SET_MESSAGE,
    message,
    messageType: 'ERROR',
  });
};

export const setMessage = message => ({
  type: types.SET_MESSAGE,
  message,
});
export const clearMessage = () => ({
  type: types.SET_MESSAGE,
  message: '',
});

export const dismissMessage = () => ({
  type: types.SET_MESSAGE,
  message: '',
});
