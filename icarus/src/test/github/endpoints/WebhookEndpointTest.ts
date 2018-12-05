import { expect } from 'chai';
import 'mocha';
import { mock, instance, when, anything, anyString, verify, resetCalls } from 'ts-mockito';

import { toPromise } from '../../common/TestUtils';

import { WebhookEventService } from "../../../main/github/services/WebhookEventService"
import { WebhookEndpoint } from "../../../main/github/endpoints/WebhookEndpoint";

import * as sampleEvents from "../sampleEvents"



describe('Github webhook endpoints', () => {

  describe('Receive event', () => {

    it('should return 201 and process an event when signature is validated', async () => {
      const serviceMock = mock(WebhookEventService)
      const service = instance(serviceMock)
      const unit = new WebhookEndpoint(service)
      const _handler = (callback, lambdaProxyEvent) => unit.receive(callback, lambdaProxyEvent)

      when(serviceMock.verifySignature(anything(), anything() )).thenReturn(true) // Signature is valid
      when(serviceMock.processWebhookEvent(anything())).thenReturn( Promise.resolve() )

      const request = lambdaProxyEvent('an-event-type', sampleEvents.sampleJsonPayload, 'delivery-id', 'a-valid-signature')

      const result = await toPromise(_handler, request)

      expect(result.statusCode).to.be.equal(201)

      verify(serviceMock.verifySignature(anyString(), anyString())).once()
      verify(serviceMock.processWebhookEvent(anything())).once()
    })

    it('should return 400 and process no event when signature is rejected', async () => {
      const serviceMock = mock(WebhookEventService)
      const service = instance(serviceMock)
      const unit = new WebhookEndpoint(service)
      const _handler = (callback, lambdaProxyEvent) => unit.receive(callback, lambdaProxyEvent)

      when(serviceMock.verifySignature(anything(), anything() )).thenReturn(false) // Signature is not valid

      const request = lambdaProxyEvent('an-event-type', sampleEvents.sampleJsonPayload, 'delivery-id', 'a-valid-signature')

      const result = await toPromise(_handler, request)

      expect(result.statusCode).to.be.equal(400)

      verify(serviceMock.verifySignature(anyString(), anyString())).once()
      verify(serviceMock.processWebhookEvent(anything())).never()
    })

  })
})


const lambdaProxyEvent = (eventType:string, eventPayload:string, deliveryId:string, signature:string) => ({
  headers : {
    Host: 'http://my.host',
    "Content-Type": 'application/json',
    "X-GitHub-Event": eventType,
    "X-Hub-Signature": signature,
    "X-GitHub-Delivery": deliveryId,
  },
  body: JSON.stringify( eventPayload ),
});
