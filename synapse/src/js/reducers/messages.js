import {
  SET_MESSAGE,
} from 'actions/actions';

export const initialState = { text: '', type: undefined };

export const messages = (state = initialState, action) => {
  switch (action.type) {
  case SET_MESSAGE: return {
    text: action.message,
    type: action.messageType,
  };

  default: return state;
  }
};
