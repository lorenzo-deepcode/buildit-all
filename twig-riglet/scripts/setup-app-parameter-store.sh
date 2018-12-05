#!/usr/bin/env bash

: ${PROJECT?"Need to set project name in PROJECT env var"}
: ${ENV?"Need to set environment in ENV env var"}

echo 'Please provide the following AWS parameter store values'
echo
read -p 'Use Azure (true, false): ' USE_AZURE
echo

echo "aws ssm put-parameter --name \"/${PROJECT}/${ENV}/USE_AZURE\" --description \"Use GraphAPI or not\" --type \"String\" --value \"${USE_AZURE}\" --overwrite"
#aws ssm put-parameter --name "/${PROJECT}/${ENV}/USE_AZURE" --description "Use GraphAPI or not" --type "String" --value "${USE_AZURE}" --overwrite

echo 'Saved parameters!'
echo
