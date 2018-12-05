import {
  DELETE_PROJECT_SUCCESS,
  FETCH_PROJECTS_RECEIVE,
  FETCH_STARTER_PROJECTS_RECEIVE,
} from 'actions/actions';
import fixerUpper from 'reducers/fixerUppers/project';

export const initialState = {
  projectList: [],
  starterProjectList: [],
};

export const projects = (state = initialState, action) => {
  switch (action.type) {
  case FETCH_PROJECTS_RECEIVE: {
    return {
      ...state,
      projectList: action.response,
    };
  }
  case FETCH_STARTER_PROJECTS_RECEIVE: {
    const starterProjectList =
      action.response.map(_project => (fixerUpper(_project)));
    return {
      ...state,
      starterProjectList,
    };
  }
  case DELETE_PROJECT_SUCCESS: {
    const updatedList = [];
    state.projectList.forEach((iteritem) => {
      if (iteritem.name !== action.name) {
        updatedList.push(iteritem);
      }
    });
    return {
      ...state,
      projectList: updatedList,
    };
  }
  default: return state;
  }
};
