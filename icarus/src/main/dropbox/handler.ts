import { webhookEndpoint, oauthEndpoint } from "./App";

// Webhook lambdas
export const webhookChallenge = (event, context, cb) => webhookEndpoint.challenge(cb, event);
export const webhookNotify = (event, context, cb) => webhookEndpoint.notify(cb, event);

// Oauth lambdas
export const oauth = (event, context, cb) => oauthEndpoint.oauth(cb, event)