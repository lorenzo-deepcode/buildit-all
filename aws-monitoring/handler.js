"use strict";
const postMessage = require("./lib/post-message");

module.exports.postSnsMessage = (event, context, callback) => {
  postMessage(`${event.Records[0].Sns.Subject}: ${event.Records[0].Sns.Message}`);
};

// This method expects a CloudWatch Event for EC2 RunInstances executions.
// It assumes the event is in CloudTrail event format.
module.exports.postIfLargeEc2Instance = (event, context, callback) => {
  if (event["detail-type"] === "AWS API Call via CloudTrail") {
    let instances = event.detail.responseElements.instancesSet.items;
    let bigInstances = instances.filter(i => i.instanceType.match(/\.[0-9]+xlarge/));
    let detail = event.detail;
    bigInstances.forEach(i =>
      postMessage(`*WARNING*  _${i.instanceType}_ instance started by _${detail.userIdentity.userName}_ in region _${detail.awsRegion}_.  Instance ID: _${i.instanceId}_.`)
    );
  } else {
    console.log("WARNING:  Received an event that can't be processed.  The 'detail type' field is missing or incorrect, so the event is probably of the wrong type.");
    console.log('Received event:', JSON.stringify(event, null, 2));
  }
};
