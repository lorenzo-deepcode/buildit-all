import * as types from 'actions/actions';

export const fetchProjection = name => ({
  type: types.FETCH_PROJECTION_REQUEST,
  name,
});

export const saveProjection = (projection, name) => ({
  type: types.SAVE_PROJECTION_REQUEST,
  projection,
  name,
});

export const updateProjection = projection => ({
  type: types.UPDATE_PROJECTION,
  projection,
});
