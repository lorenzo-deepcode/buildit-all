#!/usr/bin/env sh

COMMAND=${1}
SLACK_CHANNEL_PATH=${2}

ALL_REGIONS=`aws ec2 describe-regions --region us-east-1 --output text | cut -f 3`

for region in ${ALL_REGIONS}
do
    echo "Running '${COMMAND} in '${region} ..."
    sls ${COMMAND} --region ${region} --slack-webhook-path ${SLACK_CHANNEL_PATH}
done;

