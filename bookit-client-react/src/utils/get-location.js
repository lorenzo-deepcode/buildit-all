const LOCAL_SERVER_HOST = 'http://localhost:8080'

// From bookit-web/super-refactor branch
// let W = global.window
// if (!W) W = { location: { origin: 'http://localhost:8080' } }
//
// const currentHostname = () => W.location.origin

export const getAPIEndpoint = () => {
  if (!window.location) {
    return LOCAL_SERVER_HOST
  }

  return deriveAPIEndpoint(window.location.origin)
}

/**
 * this expects the URL to be something of the forms:
 * bookit-client-react.buildit.tools for production
 * <env>-bookit-client-react.buildit.tools for everything else
 */
export const deriveAPIEndpoint = (location) => {
  if (location.indexOf('localhost') != -1) {
    return LOCAL_SERVER_HOST
  }
  if (location.indexOf('client-react') != -1)
    return location.replace('client-react', 'api')
  return location.replace('bookit', 'bookit-api')
}
