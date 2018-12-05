import {
  XHR_START,
  XHR_END,
} from 'actions/actions';

export const initialState = false;
export const xhr = (state = initialState, action) => {
  switch (action.type) {
  case XHR_START: {
    return true;
  }
  case XHR_END: {
    return false;
  }
  default: return state;
  }
};
