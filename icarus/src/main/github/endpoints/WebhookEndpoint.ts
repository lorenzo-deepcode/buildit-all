import { complete, sendResponse, response } from "../../common/endpoints/EndpointUtils";
import { event, callback } from "../../common/Api";
import { WebhookEventService, WebhookEvent, webhookEventType } from "../services/WebhookEventService";

export class WebhookEndpoint {
  constructor(private readonly service:WebhookEventService) {}

  receive(callback:callback, lambdaProxyEvent:event) {
    const webhookEventType = lambdaProxyEvent.headers['X-GitHub-Event']
    const signature = lambdaProxyEvent.headers['X-Hub-Signature']
    const requestJsonBody = lambdaProxyEvent.body

    console.log(`Received '${webhookEventType}' Github webhook event`)

    if( this.service.verifySignature(requestJsonBody, signature) ) {

      const webhookEvent:WebhookEvent = {
        eventType: webhookEventType,
        deliveryId: lambdaProxyEvent.headers['X-GitHub-Delivery'],
        payload: JSON.parse(requestJsonBody)
      }

      this.service.processWebhookEvent(webhookEvent)
        .then(res => sendResponse(callback, response(201)) )
        .catch(err => sendResponse(callback, response(500, err )) )

    } else {
      sendResponse(callback, response(400, "Invalid payload signature"))
    }

  }
}
