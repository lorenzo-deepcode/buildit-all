import * as types from 'actions/actions';

export const fetchProjects = () => ({
  type: types.FETCH_PROJECTS,
});

export const receiveProjects = response => ({
  type: types.FETCH_PROJECTS_RECEIVE,
  response,
});

export const fetchStarterProjects = () => ({
  type: types.FETCH_STARTER_PROJECTS_REQUEST,
});

export const receiveStarterProjects = response => ({
  type: types.FETCH_STARTER_PROJECTS_RECEIVE,
  response,
});

export const fetchProject = name => ({
  type: types.FETCH_PROJECT_REQUEST,
  name,
});

export const fetchProjectSuccess = project => ({
  type: types.FETCH_PROJECT_SUCCESS,
  project,
});

export const updateProject = project => ({
  type: types.UPDATE_PROJECT_REQUEST,
  project,
});

export const resetProject = () => ({ type: types.RESET_PROJECT });

export const deleteProject = name => ({
  type: types.DELETE_PROJECT,
  name,
});
export const deleteProjectSuccess = name => ({
  type: types.DELETE_PROJECT_SUCCESS,
  name,
});

export const setIsNewProject = value => ({
  type: types.SET_IS_NEW_PROJECT,
  value,
});

export const initializeNewProject = harvestId => ({
  type: types.INITIALIZE_NEW_PROJECT,
  harvestId,
});
