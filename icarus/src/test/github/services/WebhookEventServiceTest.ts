import { expect } from 'chai';
import 'mocha';
import { mock, instance, when, verify, resetCalls, anyString, anything } from 'ts-mockito';

import { WebhookEventService } from "../../../main/github/services/WebhookEventService";
import { UserEventRepository } from "../../../main/github/repositories/UserEventRepository";
import { WebhookEvent } from "../../../main/github/services/WebhookEventService";

import * as sampleEvents from "../sampleEvents"

const userEventRepositoryMock = mock(UserEventRepository)
const userEventRepository = instance(userEventRepositoryMock)

when(userEventRepositoryMock.store(anything())).thenReturn(Promise.resolve())

beforeEach(() => {
  resetCalls(userEventRepositoryMock)
})

describe('GitHub Webhook Event Service', () =>{


  describe('Process Webhook Event', () =>{
    const unit = new WebhookEventService(userEventRepository, 'secret')

      it('should save one event processing a push containing a single commit' , async () => {
        const webhookEvent:WebhookEvent = {
          eventType: 'push',
          deliveryId: 'delivery-id',
          payload: sampleEvents.pushWithOneCommit
        }
        await unit.processWebhookEvent(webhookEvent); // should not fail

        verify(userEventRepositoryMock.store(anything())).once();
      } )


      it('should save two events processing a push containing two commits' , async () => {
        const webhookEvent:WebhookEvent = {
          eventType: 'push',
          deliveryId: 'delivery-id',
          payload: sampleEvents.pushWithTwoCommits
        }
        await unit.processWebhookEvent(webhookEvent); // should not fail

        verify(userEventRepositoryMock.store(anything())).twice();
      } )


      it('should store one event processing a "issues" event', async () =>{
        const webhookEvent:WebhookEvent = {
          eventType: 'issues',
          deliveryId: 'delivery-id',
          payload: sampleEvents.issueOpenedEvent
        }
        await unit.processWebhookEvent(webhookEvent);

        verify(userEventRepositoryMock.store(anything())).once();
      })

      it('should store one event processing a "commit_comment" event', async () =>{
        const webhookEvent:WebhookEvent = {
          eventType: 'commit_comment',
          deliveryId: 'delivery-id',
          payload: sampleEvents.commitCommentEvent
        }
        await unit.processWebhookEvent(webhookEvent);

        verify(userEventRepositoryMock.store(anything())).once();
      })

      it('should store one event processing a "pull_request" event', async () =>{
        const webhookEvent:WebhookEvent = {
          eventType: 'pull_request',
          deliveryId: 'delivery-id',
          payload: sampleEvents.pullRequestOpenedEvent
        }
        await unit.processWebhookEvent(webhookEvent);

        verify(userEventRepositoryMock.store(anything())).once();
      })

      it('should store one event processing a "pull_request_review" event', async () =>{
        const webhookEvent:WebhookEvent = {
          eventType: 'pull_request_review',
          deliveryId: 'delivery-id',
          payload: sampleEvents.pullRequestReviewSubmittedEvent
        }
        await unit.processWebhookEvent(webhookEvent);

        verify(userEventRepositoryMock.store(anything())).once();
      })

      it('should store one event processing a "pull_request_review_comment" event', async () =>{
        const webhookEvent:WebhookEvent = {
          eventType: 'pull_request_review_comment',
          deliveryId: 'delivery-id',
          payload: sampleEvents.pullRequestReviewCommentCreatedEvent
        }
        await unit.processWebhookEvent(webhookEvent);

        verify(userEventRepositoryMock.store(anything())).once();
      })

      it('should store one event processing a "create" tag event', async () =>{
        const webhookEvent:WebhookEvent = {
          eventType: 'create',
          deliveryId: 'delivery-id',
          payload: sampleEvents.createTagEvent
        }
        await unit.processWebhookEvent(webhookEvent);

        verify(userEventRepositoryMock.store(anything())).once();
      })

      it('should store one event processing a "create" repository event', async () =>{
        const webhookEvent:WebhookEvent = {
          eventType: 'create',
          deliveryId: 'delivery-id',
          payload: sampleEvents.createRepositoryEvent
        }
        await unit.processWebhookEvent(webhookEvent);

        verify(userEventRepositoryMock.store(anything())).once();
      })

      it('should store one event processing a "delete" tag event', async () =>{
        const webhookEvent:WebhookEvent = {
          eventType: 'delete',
          deliveryId: 'delivery-id',
          payload: sampleEvents.deleteTagEvent
        }
        await unit.processWebhookEvent(webhookEvent);

        verify(userEventRepositoryMock.store(anything())).once();
      })

      it('should save no event processing a ping' , async () => {
        const webhookEvent:WebhookEvent = {
          eventType: 'ping',
          deliveryId: 'delivery-id',
          payload: sampleEvents.ping
        }
        await unit.processWebhookEvent(webhookEvent); // should not fail

        verify(userEventRepositoryMock.store(anything())).never();
      } )

      it('should save no event processing an unknown event type' , async () => {
        const webhookEvent:WebhookEvent = {
          eventType: 'unknown-type',
          deliveryId: 'delivery-id',
          payload: { foo: 'bar' }
        }
        await unit.processWebhookEvent(webhookEvent); // should not fail

        verify(userEventRepositoryMock.store(anything())).never();
      } )
  })

  describe('Verify Webhook payload signature', () => {
    const unit = new WebhookEventService(userEventRepository, sampleEvents.sampleJsonPayloadSecret)

    it('should successfully verify a valid signature', ()=>{
      const result = unit.verifySignature( sampleEvents.sampleJsonPayload, sampleEvents.sampleJsonPayloadSignature )

      expect(result).is.true
    })

    it('should reject an invalid signature', () => {
      const result = unit.verifySignature( sampleEvents.sampleJsonPayload, 'invalidsignature' )

      expect(result).is.false
    })
  })
})
