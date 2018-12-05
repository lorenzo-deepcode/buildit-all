# Twig "Metal Rig" ECS Execution Environment"

This set of CloudFormation (Cfn) templates and supporting scripts creates an "execution environment" (implemented as 
a set of Cfn stacks) for Twig using pure AWS "to the metal" techniques.  That is, no software (other 
than the AWS CLI) is required to create the environment.  However, we have included approaches, such as leveraging 
`make`, that can make the process even easier.

## Getting Started

1. Install the AWS CLI if you don't already have it.  This is not strictly necessary, but other work-saving tools
use it, so it's probably best to just install it.  Be sure your CLI configuration is set up properly
following the Amazon instructions:
http://docs.aws.amazon.com/cli/latest/userguide/installing.html

1. Ensure sure you have an EC2 Key Pair (https://console.aws.amazon.com/ec2/v2/home#KeyPairs:sort=keyName) 
available in the region you're targeting.

## Make-based Instructions
The `make`-based approach allows you to easily manage the creation and update of the execution stack from the command-line.
It is essentially automation for the Console-based Instructions you can find below.

### Setup
Copy `.make.example` to `.make`.  Make changes to the `.make` file as suggested below:

```
ENV = Environment name (tst|dev|stg|prd)
KEY_NAME = Your EC2 Key Pair name from above.
PROFILE = AWS CLI profile name.  If you haven't set up custom profiles, leave this set to 'default'.
PROJECT = Overall name for the environment you're going to be creating (i.e. "twig" or "bookit" or whatever...)
REGION = AWS Region
NAME_SUFFIX = Your name ie: 'firstlastname'.  This is used to identify various resources created by/for the rig.
```

After completing the above run `make deps`, which creates an S3 bucket for you `s3://metalrig.$(NAME_SUFFIX)`.  This
bucket is used by subsequent steps.

### Managing the environment

#### To **create** a new stack: `make create`
This creates a set of Cfn stacks from the templates.  Once completed you'll have a running environment 
(but no code deployed).

#### To know the **status** of the stack: `make status`
This simply reports the current state of the main Cfn stack.

### To **update** the existing stack: `make update`
If the stack templates are changed, use this command to update the running stack to reflect the changes.

### To completely **delete** the stack: `make delete`
This removes the Cfn stacks and all resources created by them.


## Console-based Instructions

1. Create an S3 bucket for the template bundle, in your preferred region.  It is helpful to give it the eventual 
name you'll give the Cfn stack.
1. Run `./bin/deployTemplates <s3 bucket name>`.  This bundles the templates and places them in the S3 bucket 
you created above.
1. Using the AWS console, create a Cfn stack using the the S3 location of the template bundle (the URL is output 
from the script).  Update parameters as required (most have reasonable defaults).
1. Once the stack completes, you'll have a VPC running an ECS cluster and a couple of ELBs.  Complete the setup 
of a build stack in order to deploy to this environment.

### Maintenance

Parameter changes to the stack can be made though the Cfn console, or with the CLI.

Changes to the environment through actual Cfn templates can be applied by re-deploying the changed templates 
(step 2 above), and then updating the stack in the console.