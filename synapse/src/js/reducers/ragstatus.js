import { FETCH_RAGSTATUS_SUCCESS } from 'actions/actions';
export const initialState = {
  statuses: [],
};

export const statuses = (state = initialState, action) => {
  switch (action.type) {
  case FETCH_RAGSTATUS_SUCCESS: {
    return {
      ...state,
      statuses: action.statuses || [],
    };
  }
  default: return state;
  }
};
