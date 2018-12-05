import blankProject from 'helpers/blankProject';
import fixerUpper from 'reducers/fixerUppers/project';

import {
  ADD_DEFECT_FLOW_LIST_ITEM,
  ADD_DEMAND_FLOW_LIST_ITEM,
  ADD_ROLE_LIST_ITEM,
  ADD_SEVERITY_LIST_ITEM,
  FETCH_PROJECT_SUCCESS,
  INITIALIZE_FORM_DATA,
  MOVE_LIST_ITEM_DOWN,
  MOVE_LIST_ITEM_UP,
  REMOVE_LIST_ITEM,
  RESET_PROJECT,
  UPDATE_FORM_DATA,
  UPDATE_PROJECTION,
  FETCH_EVENT_HISTORY_SUCCESS,
} from 'actions/actions';

export const initialState = blankProject.create();

// Some helpers
const moveListItem = (formData, section, list, index, steps) => {
  const newList = formData[section][list];
  if (index > (newList.length - 1)) {
    return {
      ...formData,
    };
  }
  const temp = newList[index + steps];
  newList[index + steps] = newList[index];
  newList[index] = temp;

  const newFormData = Object.assign({}, formData);
  newFormData[section][list] = newList;
  return newFormData;
};

const addListItem = (formData, section, property, newItem) => {
  const newFormData = Object.assign({}, formData);
  newFormData[section][property].push(newItem);
  return newFormData;
};

export const project = (state = initialState, action) => {
  switch (action.type) {
  case UPDATE_PROJECTION: {
    return {
      ...state,
      projection: action.projection,
    };
  }
  case FETCH_PROJECT_SUCCESS: {
    const fetchedProject = fixerUpper(action.project);
    fetchedProject.new = ('new' in fetchedProject) ? fetchedProject.new : false;
    return fetchedProject;
  }
  case RESET_PROJECT: {
    return blankProject.create();
  }
  case UPDATE_FORM_DATA: {
    const newFormData = Object.assign({}, state);
    newFormData.id = state.id ? state.id.toString() : '';
    switch (action.section) {
    case 'header': {
      newFormData[action.key] = action.value;
      return newFormData;
    }
    case 'demand': {
      newFormData.demand[action.key] = action.value;
      return newFormData;
    }
    case 'defect': {
      newFormData.defect[action.key] = action.value;
      return newFormData;
    }
    case 'effort': {
      newFormData.effort[action.key] = action.value;
      return newFormData;
    }
    default: return state;
    }
  }
  case INITIALIZE_FORM_DATA: {
    return action.project;
  }
  case REMOVE_LIST_ITEM: {
    let newList = state[action.section][action.list];
    newList = newList.slice(0, action.index).concat(newList.slice(action.index + 1));
    const newFormData = Object.assign({}, state);
    newFormData[action.section][action.list] = newList;
    return newFormData;
  }
  /*
   * MOVE_LIST_ITEM_UP and MOVE_LIST_ITEM_UP are not all that intuitive.  Moving something up
   * actually moves something further back in an array, because this is a UI component, and the
   * array items are displayed top to bottom.
   */
  case MOVE_LIST_ITEM_UP: {
    return moveListItem(state, action.section, action.list, action.index, -1);
  }
  case MOVE_LIST_ITEM_DOWN: {
    return moveListItem(state, action.section, action.list, action.index, 1);
  }
  case ADD_DEMAND_FLOW_LIST_ITEM: {
    const newItem = { name: action.name };
    return addListItem(state, 'demand', 'flow', newItem);
  }
  case ADD_DEFECT_FLOW_LIST_ITEM: {
    const newItem = { name: action.name };
    return addListItem(state, 'defect', 'flow', newItem);
  }
  case ADD_ROLE_LIST_ITEM: {
    const newItem = { name: action.name, groupWith: action.groupWith };
    return addListItem(state, 'effort', 'role', newItem);
  }
  case ADD_SEVERITY_LIST_ITEM: {
    const newItem = { name: action.name, groupWith: action.groupWith };
    return addListItem(state, 'defect', 'severity', newItem);
  }
  case FETCH_EVENT_HISTORY_SUCCESS: {
    return {
      ...state,
      events: action.events,
    };
  }
  default: return state;
  }
};
