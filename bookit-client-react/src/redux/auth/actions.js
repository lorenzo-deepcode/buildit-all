import { createAction } from 'redux-actions'

export const authRequest = createAction('AUTH_REQUEST')
export const authSuccess = createAction('AUTH_SUCCESS')
export const authFailure = createAction('AUTH_FAILURE')

export const loginSuccess = createAction('LOGIN_SUCCESS')
export const logoutSuccess = createAction('LOGOUT_SUCCESS')

export const refreshAuthRequest = createAction('REFRESH_AUTH_REQUEST')
export const refreshAuthSuccess = createAction('REFRESH_AUTH_SUCCESS')
export const refreshAuthFailure = createAction('REFRESH_AUTH_FAILURE')

export const clearAuthentication = createAction('CLEAR_AUTHENTICATION')

export const setAuthenticationToken = createAction('SET_AUTHENTICATION_TOKEN')

export const actionCreators = {
  authRequest,
  authSuccess,
  authFailure,
  loginSuccess,
  logoutSuccess,
  refreshAuthRequest,
  refreshAuthSuccess,
  refreshAuthFailure,
  clearAuthentication,
  setAuthenticationToken,
}
