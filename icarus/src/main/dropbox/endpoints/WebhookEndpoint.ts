/**
Classes in this module handle the protocol-level tasks of handling Events and returning HTTP responses.
*/
import { complete, sendResponse, response } from "../../common/endpoints/EndpointUtils";
import { event, callback, uri } from "../../common/Api";
import { challenge } from "../Api";
import { Notification, NotificationService } from "../services/NotificationService";

export class WebhookEndpoint {

  constructor(private readonly service: NotificationService) {}

  challenge(cb: callback, event: event) {
    const challenge = event.queryStringParameters.challenge
    sendResponse(cb, response(200, challenge))
  }

  notify(cb: callback, event: event) {
    const notification: Notification = JSON.parse(event.body)
    complete(cb, this.processAndReturn200( notification ));
  }

  private async processAndReturn200(notification: Notification): Promise<any> {
    await this.service.processNotification(notification);
    return response(200)
  }
}
