import { FETCH_STATUS_SUCCESS } from 'actions/actions';
export const initialState = {
  demand: [],
  defect: [],
  effort: [],
  ragStatus: [],
};

export const status = (state = initialState, action) => {
  switch (action.type) {
  case FETCH_STATUS_SUCCESS: {
    return {
      ...state,
      demand: action.status.demand,
      defect: action.status.defect,
      effort: action.status.effort,
      ragStatus: action.status.ragStatus,
    };
  }
  default: return state;
  }
};
