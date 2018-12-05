
import * as constants from 'Constants/token-states'

import { decodeJWT } from './decode-jwt'

export const validateToken = (token) => {
  if (!token) {
    return constants.TOKEN_MISSING
  }
  const decoded = decodeJWT(token)
  if (!decoded) {
    return constants.TOKEN_BADLY_FORMED
  }
  const expires = new Date(decoded.exp * 1000)
  const hasExpired = new Date >= expires
  if (hasExpired) {
    return constants.TOKEN_EXPIRED
  }
  return constants.TOKEN_VALID
}
