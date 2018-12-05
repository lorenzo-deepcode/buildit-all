import * as crypto from "crypto"
const uuidv4 = require('uuid/v4');
const moment = require('moment');

import { githubWebhookSecret, json } from "../Api";
import { UserEventRepository, UserEvent } from "../repositories/UserEventRepository";

export type webhookDeliveryId = string;
export type webhookPayloadSignature = string;
export type webhookPayload = any;
export type webhookEventType = string

// Webhook event (i.e. event delivered by Github webhook)
export interface WebhookEvent {
  eventType: webhookEventType;
  deliveryId: webhookDeliveryId;
  payload: webhookPayload;
}



// Service for processing Github webhook events
export class WebhookEventService {
  constructor(private readonly eventRepository:UserEventRepository, private readonly secret:githubWebhookSecret){}

  // Verify webhook delivery payload signature
  verifySignature(jsonPayload:json, signature:webhookPayloadSignature,): Boolean {
    const computedSignature:string = 'sha1=' + crypto.createHmac('sha1', this.secret).update(jsonPayload).digest('hex');
    return (computedSignature == signature)
  }

  // Process a webhook event, possibli splitting into multiple user events
  async processWebhookEvent(webhookEvent:WebhookEvent): Promise<void> {
    console.log(`Processing a '${webhookEvent.eventType}' webhook event`)

    if( webhookEvent.eventType ==  'ping' ) {
      console.log("Received a 'ping'")
      return Promise.resolve();
    } else {
      const userEvents:UserEvent[] = toUserEvents(webhookEvent);
      console.log(`storing ${userEvents.length} user event(s)`)
      await Promise.all( userEvents.map( event =>  this.eventRepository.store(event) ) )
    }
  }
}

const isoNow = () => moment().toISOString();

function toUserEvents(webhookEvent:WebhookEvent): UserEvent[] {
  switch(webhookEvent.eventType) {
    case 'push':
      return pushToCommits(webhookEvent)
    case 'issues':
      return [ issuesEvent(webhookEvent) ]
    case 'commit_comment':
      return [ commitCommentEvent(webhookEvent) ]
    case 'pull_request':
      return [ pullRequestEvent(webhookEvent) ]
    case 'pull_request_review':
      return [ pullRequestReviewEvent(webhookEvent) ]
    case 'pull_request_review_comment':
      return [ pullRequestReviewCommentEvent(webhookEvent) ]
    case 'create':
      return [ createEvent(webhookEvent) ]
    case 'delete':
      return [ deleteEvent(webhookEvent) ]

    default:
      console.log(`Unknowns webhook event type: '${webhookEvent.eventType}'`)
      return [];
  }
}


function pushToCommits(webhookEvent:WebhookEvent): UserEvent[] {
  const repository = webhookEvent.payload.repository
  const commits:any[] = webhookEvent.payload.commits
  return commits.map( commit => ({
    id: `${commit.committer.username}-${commit.id}`, // The same commit may be included in multiple pushes but get de-duplicated
    username: commit.committer.username,
    eventType: 'commit',
    timestamp: commit.timestamp
  }))
}


function issuesEvent(webhookEvent:WebhookEvent): UserEvent {
  const payload = webhookEvent.payload;
  return {
    id: uuidv4(),
    username: payload.sender.login,
    eventType: `issues-${payload.action}`,
    timestamp: isoNow() // No timestamp in the payload
  }
}

function commitCommentEvent(webhookEvent:WebhookEvent): UserEvent {
  const payload = webhookEvent.payload;
  return {
    id: uuidv4(),
    username: payload.sender.login,
    eventType: `commit_comment-${payload.action}`,
    timestamp: isoNow()
  }
}

function pullRequestEvent(webhookEvent:WebhookEvent): UserEvent {
  const payload = webhookEvent.payload;
  return {
    id: uuidv4(),
    username: payload.sender.login,
    eventType: `pull_request-${payload.action}`,
    timestamp: isoNow()
  }
}

function pullRequestReviewEvent(webhookEvent:WebhookEvent): UserEvent {
  const payload = webhookEvent.payload;
  return {
    id: uuidv4(),
    username: payload.sender.login,
    eventType: `pull_request_review-${payload.action}`,
    timestamp: isoNow()
  }
}

function pullRequestReviewCommentEvent(webhookEvent:WebhookEvent): UserEvent {
  const payload = webhookEvent.payload;
  return {
    id: uuidv4(),
    username: payload.sender.login,
    eventType: `pull_request_review_comment-${payload.action}`,
    timestamp: isoNow()
  }
}

function createEvent(webhookEvent:WebhookEvent): UserEvent {
  // Create a repository, branch or tag
  const payload = webhookEvent.payload
  const refType = payload.ref_type // 'repository', 'branch' or 'tag'
  const ref = payload.ref // null if ref_type == 'repository'
  const url = payload.repository.url + ( ref ? `/tree/${ref}` : '' ) // Repo URi or Tag/Branch tree URL
  return {
    id: uuidv4(),
    username: payload.sender.login,
    eventType: `create-${refType}`,
    timestamp: isoNow()
  }
}

function deleteEvent(webhookEvent:WebhookEvent): UserEvent {
  // Create a branch or tag
  const payload = webhookEvent.payload
  const refType = payload.ref_type // 'branch' or 'tag'
  const ref = payload.ref
  const url = `${payload.repository.url}/tree/${ref}` // Tag/Branch tree URL
  return {
    id: uuidv4(),
    username: payload.sender.login,
    eventType: `delete-${refType}`,
    timestamp: isoNow()
  }
}
