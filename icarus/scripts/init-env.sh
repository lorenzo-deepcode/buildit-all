#!/bin/bash
BRANCH=${TRAVIS_BRANCH:-$(git rev-parse --abbrev-ref HEAD)} 
PR=${TRAVIS_PULL_REQUEST:-false}
REGION="us-east-1" # This is hardwired


# Maps branch to stage
if [ $BRANCH == 'master' ]; then
  STAGE="test"
elif [ -n "$FORCE_DEPLOY_STAGE" ]; then
  echo "Forcing deploy to $FORCE_DEPLOY_STAGE"
  STAGE=$FORCE_DEPLOY_STAGE
fi
echo "Branch: $BRANCH, Mapped Stage: $STAGE, Is a PR? ${TRAVIS_PULL_REQUEST}"

# Only deploy branches with stages, but not PR
if [ -z "$STAGE" ] || [ ! "$PR" = false ]
then
  echo "Not deploying this branch";
else
  export ICARUS_STAGE=$STAGE
  echo "Will deploy to stage $ICARUS_STAGE"
fi

# Check we know what domain we are deploying FE to (CloudFormation must be able to create the DNS record)
if [ -z "$ICARUS_SITE_BASE_DOMAIN" ] ; then
  echo "No ICARUS_SITE_BASE_DOMAIN env variable defined"
  exit 1
fi

# Get ACM Certificate ARN (this cannot be done in CloudFormation)
CERTIFICATE_ARN="$(scripts/getCertificateArnByDomain.sh $ICARUS_SITE_BASE_DOMAIN $REGION)"
if [ -z "$CERTIFICATE_ARN" ]; then
  echo "No certificate for $ICARUS_SITE_BASE_DOMAIN in ACM"
  exit 1
fi
export CERTIFICATE_ARN
echo "Using certificate $CERTIFICATE_ARN"
