import { actionCreators as ApiActionCreators } from './api'
import { actionCreators as AppActionCreators } from './app'
import { actionCreators as AuthActionCreators } from './auth'

export const actionCreators = {
  ...ApiActionCreators,
  ...AppActionCreators,
  ...AuthActionCreators,
}
