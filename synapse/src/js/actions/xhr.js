import * as types from 'actions/actions';

export const startXHR = () => ({
  type: types.XHR_START,
});
export const endXHR = () => ({
  type: types.XHR_END,
});
