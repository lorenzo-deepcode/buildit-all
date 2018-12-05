import * as types from 'actions/actions';

// Destination is kind of hacky.  Basically, if you send a second arg, the saga will
// send you somewhere else after the save is completed.
export const saveFormData = (project, destination) => ({
  type: types.SAVE_PROJECT_REQUEST,
  project,
  destination,
});

export const onInputChange = (section, key, value) => ({
  type: types.UPDATE_FORM_DATA,
  section,
  key,
  value,
});

export const initializeFormData = project => ({
  type: types.INITIALIZE_FORM_DATA,
  project,
});

export const onListItemRemove = (section, list, index) => ({
  type: types.REMOVE_LIST_ITEM,
  section,
  list,
  index,
});

export const addItemToDemandFlowList = name => ({
  type: types.ADD_DEMAND_FLOW_LIST_ITEM,
  name,
});

export const addItemToDefectFlowList = name => ({
  type: types.ADD_DEFECT_FLOW_LIST_ITEM,
  name,
});

export const addItemToRoleList = (name, groupWith) => ({
  type: types.ADD_ROLE_LIST_ITEM,
  name,
  groupWith,
});

export const addItemToSeverityList = (name, groupWith) => ({
  type: types.ADD_SEVERITY_LIST_ITEM,
  name,
  groupWith,
});

export const moveListItemUp = (section, list, index) => ({
  type: types.MOVE_LIST_ITEM_UP,
  section,
  list,
  index,
});

export const moveListItemDown = (section, list, index) => ({
  type: types.MOVE_LIST_ITEM_DOWN,
  section,
  list,
  index,
});
