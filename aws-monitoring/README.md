# AWS Monitoring 

This repo uses the [serverless](serverless.com) framework to create Lambda functions that can post to the #aws-alerts 
Slack channel.  Specifically, the intention of this repo is to provide monitoring functionality to help us manage
cost and security in AWs.

There is a generic Lambda function that can be attached to any SNS topic.
It will send the subject+message to the #aws-alerts channel.

There is a very specific Lambda function that is attached to a CloudWatch Events rule (defined in-line), which
detects "large instance" starts and posts custom messages to the `#aws-alerts` channel.

Note that in the latter case, the combined Lambda-and-CloudWatch-Events-rule is a bit coupled and static.
The trade-off is self-containment and convenience.  To see an example of creating a CloudWatch Events rule 
and binding it to a pre-existing Lambda, check out the `buildit/aws_management` repo.  See To-dos for more ideas.

Docker (cleanroom) Development
--------------------------
By using Docker we remove the need to install any global dependencies on the host. In this case NodeJS, the serverless NodeJS framework, and the AWS CLI.

- `docker build --tag sls-sns .`
- `docker run -itv <fully qualified path to this project on host>:/src sls-sns`
- `aws configure`
- `cd /src`
- `sls deploy --region <deployment region> --slack-webhook-path <slack webhook uri>`

(or you can install the stuff mentioned in the Dockerfile in your host environment and work there, if you like)

Testing
-------
- `sls invoke --function postSnsMessage --stage <stage> --path ./sns-test-event.json --region <region>`
- `sls invoke --function postIfLargeEc2Instance --stage <stage> --path ./cwe-test-event-ec2-runinstance.json --region <region>`

Deployment
----------
Once you're convinced the CloudWatch Event rule(s) and Lambda(s) are working well together, you can run serverless commands
un all regions (if you dare) by running the deployment script.

- `./sls-everywhere.sh <deploy|remove|etc...> <slack-webhook-path>`

To-Dos
------
- It would arguably be better to have one Lambda that just knows how to post to Slack, and have others delegate to it.
- Would be nice to be able to post to different channels.  Yes, we could just add a parameter, but many calling
  sites where we expect to execute these functions just pass events in.  For example, an SNS subscription wouldn't
  be able to pass in a channel name.
- AWS provides a _lot_ of options for deploying this sort of stuff.  There might be some other more elegant or robust 
  way to approach the overall problem, but we tried to keep the initial effort to about a week or so. For example, it 
  might have been better for the `postIfLargeEc2Instance()` Lambda to post a nicely-formatted message to an SNS 
  topic rather than directly posting to Slack.  Then, a Lambda subscription on that topic could be bound to the 
  postSnsMessage() function.  Or, the CloudWatch Event rule could post the event JSON to SNS and a Lambda could
  listen for that.  You get the idea.  The approach taken at this writing was the simplest and most direct, with the 
  least amount of code.
