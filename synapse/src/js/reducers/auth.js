import {
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  LOGOUT_SUCCESS,
} from 'actions/actions';

const user = JSON.parse(localStorage.getItem('user'));

const isAuthenticated = !!user;

export const initialState = {
  isAuthenticated,
  message: '',
  user,
};

const loggedOutState = {
  isAuthenticated: false,
  message: '',
  user: undefined,
};

export const auth = (state = initialState, action) => {
  switch (action.type) {

  case LOGIN_SUCCESS: {
    return {
      isAuthenticated: true,
      user: action.user,
    };
  }

  case LOGIN_FAILURE: {
    return {
      isAuthenticated: false,
      message: 'Wrong email or password',
    };
  }

  case LOGOUT_SUCCESS: {
    return loggedOutState;
  }

  default: return state;
  }
};
