import QS from 'query-string'

export const parseOauthFragment = (qs, ...keys) => {
  let result

  const fragment = QS.parse(qs)

  if (keys.length) {
    result = keys.reduce((out, key) => ({ ...out, [key]: fragment[key] }), {})
  }

  if (keys.length === 1) {
    return result[keys[0]]
  }

  return result
}
