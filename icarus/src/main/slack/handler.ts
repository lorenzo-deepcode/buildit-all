import { oAuthEndpoint, identityEndpoint } from "./App";


// OAuth
export const oauth = (event, context, callback) => oAuthEndpoint.oauth(callback, event)

// Identity management
export const forgetMe = (event, context, callback) => identityEndpoint.forgetMe(callback, event)