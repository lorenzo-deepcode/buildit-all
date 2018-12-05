# Github integration

Icarus may gather events from GitHub webhooks.

App integration is used only for retrieving user's GitHub username and link it with
the Icarus identity.

Note that webhooks delivers information about all involved users, regardless they
have an identity in Icarus.

On Github, the Webhook and the App are not connected. 
The App is used only for OAuth, while the webhook may be sent to any endpoint.

## Github application setup

Setup an "**OAuth App**" (not a "Github App")

* Client ID, Client Secret: `GITHB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` set in environment
* Homepage URL: `<frontend-url>/`
* Authorisation callback URL: `<frontend-url>/github-post-login`

## Webhook setup

Setup one or more webhooks, at repository or organisation level.

* *Payload URL*: `<service-endpoint>/github-webhook`
* *Content type*: `application/json`
* *Secret*: `GITHUB_WEBHOOK_SECRET` set in your environment
* *Which events would you like to trigger this webhook?*: "Send me everything" (or "Select individual events")

## Supported webhook events

Webhook events are not stored *raw*, as received from Github.
Icarus extracts *user events* from supported *webhook events* and store them individually.

Supported Webhook events and stored events:

* `push`: stores individual commits (implicitly de-duplicate commits)
* `issues`: stores the action on the issue
* `commit_comment`: stores the action on the comment
* `pull_request`: stores the action on the PR
* `pull_request_review`: stores the action on the review
* `pull_request_review_comment`: stores the action on the comment
* `create`: stores the creation of a repository, branch or tag
* `delete`: stores the creation of a branch or tag

Any other event is ignored at the moment
