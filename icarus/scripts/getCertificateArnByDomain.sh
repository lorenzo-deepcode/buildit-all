#!/bin/bash

# Get the ARN of a Certificate loaded in ACM, by Domain Name
DOMAIN_NAME=$1
REGION=$2
if [ -z "$DOMAIN_NAME" ]; then
    exit 1
fi
if [ -z "$REGION" ]; then
    exit 1
fi

aws acm list-certificates --region $REGION \
    --certificate-statuses ISSUED \
    --query 'CertificateSummaryList[*].[CertificateArn,DomainName]' \
    --output text \
    | grep $DOMAIN_NAME \
    | cut -f1