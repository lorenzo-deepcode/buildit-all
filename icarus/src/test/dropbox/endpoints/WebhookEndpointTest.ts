import { toPromise } from '../../common/TestUtils';
import { expect } from 'chai';
import 'mocha';
import { NotificationService, Notification } from "../../../main/dropbox/services/NotificationService";
import { WebhookEndpoint } from "../../../main/dropbox/endpoints/WebhookEndpoint";
import { mock, instance, when, anything, verify, deepEqual } from 'ts-mockito';

const mockedNotificationService = mock(NotificationService);
const notificationService = instance(mockedNotificationService);
when(mockedNotificationService.processNotification(anything())).thenReturn(Promise.resolve());

const endpoint = new WebhookEndpoint(notificationService);

const _challenge = (cb, e) => endpoint.challenge(cb, e);
const _notify = (cb, e) => endpoint.notify(cb, e);

describe("Webhook Endpoint", () => {
  it("should echo a challenge", async () => {
      const result = await toPromise(_challenge, {
        queryStringParameters: { challenge: "the challenge" }
      });

      expect(result.statusCode).to.equal(200);
      expect(result.body).to.equal("the challenge");
  });

  it("should pass through a notification for processing", async () => {
    const notification: Notification = {
      list_folder: {
        accounts: []
      },
      delta: {
        users: []
      }
    };

    const result = await toPromise(_notify, {
      body: JSON.stringify(notification)
    });

    expect(result.statusCode).to.equal(200);
    verify(mockedNotificationService.processNotification(deepEqual(notification))).once();
  });
});
