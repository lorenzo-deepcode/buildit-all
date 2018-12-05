const STORE_KEY_PREFIX = '_bookit'

const makeStoreKey = key => `${STORE_KEY_PREFIX}|${key}`

export const storeItem = (key, item) => {
  localStorage.setItem(makeStoreKey(key), JSON.stringify(item))
}

export const getItem = (key) => {
  const result = localStorage.getItem(makeStoreKey(key))
  try {
    return result ? JSON.parse(result) : undefined
  } catch(error) {
    return undefined
  }
}

export const getItems = (...items) => items.reduce((out, key) => {
  const value = getItem(key)
  if (value !== undefined)
    return { ...out, [key]: value }
  return out
}, {})

export const clearItem = (...items) => {
  for (const key of items) {
    localStorage.removeItem(makeStoreKey(key))
  }
}

export const setStoredAuthentication = authn => storeItem('authn', authn)
export const getStoredAuthentication = () => getItem('authn')
export const clearStoredAuthentication = () => clearItem('authn')
