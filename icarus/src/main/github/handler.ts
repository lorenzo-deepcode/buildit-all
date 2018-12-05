import { webhookEndpoint, oauthEndpoint } from "./App"


// Webhook
export const webhookReceive = (lambdaProxyEvent, context, callback) => webhookEndpoint.receive(callback, lambdaProxyEvent)

// OAuth
export const oauth = (event, context, callback) => oauthEndpoint.oauth(callback, event);
