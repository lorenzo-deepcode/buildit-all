import { createGetSelector } from 'reselect-immutable-helpers'

export const getUser = state => state.user
export const getTokens = state => state.tokens

export const getUserId = createGetSelector(getUser, 'oid', null)
export const getUserEmail = createGetSelector(getUser, 'email', null)

export const getAuthenticationToken = createGetSelector(getTokens, 'authn', null)

export const isRefreshingAuthentication = state => state.refreshAuthentication
