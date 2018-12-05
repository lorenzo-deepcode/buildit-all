import { callback, event, icarusAccessToken, uri } from "../Api";
import { parse as parseEncodedForm } from "querystring"

/**
  Takes a Promise, and uses it to complete a callback.
 */
export const complete = <T>(cb: callback, p: Promise<T>) => {

  return p.then(res => cb(null, res))
    .catch(err => {
      console.log(err)
      cb(null, {
        statusCode: 500
      })
    })
};

// Call the callback sending back a synchronous response object
export const sendResponse = (cb: callback, response: any) => {
  cb(null, response)
} 

// Create a response object with a status code and a given (optional) payload
export const response = (statusCode: number, bodyObject?: string|any) => ({
  statusCode: statusCode,
  headers: {
    "Content-Type": (typeof bodyObject === 'string') ? 'text/plain' : "application/json",
    "Access-Control-Allow-Origin": "*"
  },
  body: bodyObject ? ( (typeof bodyObject === 'string') ? bodyObject : JSON.stringify(bodyObject) ) : null
})

// Create a redirect response object
export function redirectToResponse(uri: uri) {
  console.log('Replying with redirect to: ' + uri)
  return {
    statusCode: 302,
    headers: {
      Location: uri
    }
  };
}

export const parseBody = (evt: event ) => {
  const contentType = getHeaderCaseUnsensitive(evt, 'content-type')
  return ( contentType == 'application/x-www-form-urlencoded' ) ? parseEncodedForm(evt.body) : JSON.parse(evt.body) 
}
 
// Extract `X-AccessToken` header value, with case-insensitive header name 
export const xAccessTokenHeader = (evt:event): icarusAccessToken|undefined => {
  return getHeaderCaseUnsensitive(evt, 'X-AccessToken')
}

const getHeaderCaseUnsensitive = (evt: event, headerName:string): string|undefined => {
  if ( !evt.headers ) return
  
  const headerNames = Object.keys(evt.headers)
  .reduce( (keys, k) => { keys[k.toLowerCase()] = k; return keys}, {} )

  return evt.headers[headerNames[ headerName.toLowerCase() ]]
}