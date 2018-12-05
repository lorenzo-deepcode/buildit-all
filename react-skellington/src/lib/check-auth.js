import { setClient } from '../actions'

function checkStoredAuthorization(dispatch) {
  const storedUser = localStorage.getItem('user')

  if (storedUser) {
    const user = JSON.parse(storedUser)
    // const created = Math.round(createdDate.getTime() / 1000)
    // const ttl = 1209600
    // const expiry = created + ttl

    // if the user has expired return false
    // if (created > expiry) return false

    dispatch(setClient(user))
    return true
  }

  return false
}

export function isAuthorized(user, dispatch) {
  if (user.token) return true
  if (checkStoredAuthorization(dispatch)) return true
  return false
}
