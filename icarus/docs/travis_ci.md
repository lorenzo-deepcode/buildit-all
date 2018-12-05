# Travis CI setup

## Prerequisites

The deploy script expects the [DNS domains and SSL certificate](./custom_domain.md) being set up.
 
It also expect [Slack](./slack_integration.md), [Dropbox](./dropbox_integration.md) and [Github](./github_integration.md) to be setup correctly and a test user being set-up in all of them.

## Build Environment

Building on Travis requires setting up the following variables:

- `ICARUS_API_DOMAIN`: DNS record for API 
- `ICARUS_SITE_BASE_DOMAIN`: base DNS domain for frontend
- `SLACK_TEAM_URL`, `SLACK_CLIENT_ID` and `SLACK_CLIENT_SECRET`: Slack integration
- `DROPBOX_CLIENT_ID` and `DROPBOX_CLIENT_SECRET`: Dropbox integration
- `GITHB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` and `GITHUB_WEBHOOK_SECRET`: Github integration
- `RDS_USER` and `RDS_PWD`: credentials for RDS instance (could be anything)
- `AWS_ACCESS_KEY_ID` and `AWS_SECRET_ACCESS_KEY`: AWS user credentials
- `SLACK_TEST_USER_ID` and `SLACK_TEST_USER_PASSWORD`: Slack user for tests
- `GITHUB_TEST_USER_ID` and `GITHUB_TEST_USER_PASSWORD`: Github user for tests
- `DROPBOX_TEST_USER_ID` and `DROPBOX_TEST_USER_PASSWORD`: Dropbox user for tests

Note that `ICARUS_STAGE` and `CERTIFICARTE_ARN` must NOT be set. 
They are determined by the build script when running on Travis.

### Optional switched

The following environment variables may be defined to tweak the build process:

- `FORCE_DEPLOY_STAGE`: force deploying any branch to an arbitrary Stage. **Use with care**.
- `SKIP_E2E`: force skipping end-to-end testing.

## Deployment and end2end testing

The build currently only deploys `master` branch to `test` stage.

You may force deploying any build to any stage setting `FORCE_DEPLOY_STAGE` to the name of target stage.

End-to-end tests run only if the branch has been successfully deployed.

## Known limitations
* Need to run a complete login, integration link journey MANUALLY, using the test users againts stages deployed by the CI/CD before running e2e tests for the first time
* The first deployment of a stage creates a CloudFront Distribution. It takes a while to set up (up to 45 mins) and causes Travis to timeout (default timeout is 10 mins). Deploy from console once to the target stage, before letting Travis to deploy.