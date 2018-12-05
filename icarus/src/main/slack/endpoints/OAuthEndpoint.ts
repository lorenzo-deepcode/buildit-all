import { complete, response, sendResponse, redirectToResponse, parseBody } from "../../common/endpoints/EndpointUtils";
import { slackAuthCode } from "../Api";
import { OAuthService } from "../services/OAuthService";
import { callback, event, uri, host, lambdaStage } from "../../common/Api";

export class OAuthEndpoint {

  constructor(
    private readonly oAuthService: OAuthService) {}

    oauth(callback: callback, evt: event) {
      const resource = evt.resource;
      switch(resource) {
        case '/slack-oauth-initiate': {
          this.initiate(callback, evt)
          break
        }
        case '/slack-oauth-complete': {
          this.complete(callback, evt)
          break
        }
        default: {
          console.log('Unexpected resource mapped to this handler: ', resource)
          sendResponse(callback, response(400, 'Resource not supported'))
        }
      }
    }

  /** 
    Initiate OAuth flow, sending the user to the Slack Authorise endpoint
    Expects the following querystring params:
      - returnUri: return URI after Slack authorise
    Redirects user to the Slack authorize page
  */
  private initiate(callback: callback, evt: event) {
    const returnUri:uri = evt.queryStringParameters.returnUri
    
    sendResponse(callback, redirectToResponse(this.oAuthService.getOAuthAuthoriseUri(returnUri)))
  }


  /** 
    Complete OAuth flow

    Expects the following params in body:
      - code: Slack auth code
      - returnUri: return URI of the Authorize call, for verification by Slack
    Accepts application/json and 'application/x-www-form-urlencoded
    Returns an IcarusUserToken
  */
  private complete(cb: callback, evt: event) {
    const body = parseBody(evt)
    const slackAuthCode = body.code
    const returnUri:uri = body.returnUri
    console.log('Request body: %j', body)
    return complete(cb, this.oAuthService.processCode(slackAuthCode, returnUri)
      .then(icarusUserToken => response(200, icarusUserToken)));
  }

}
