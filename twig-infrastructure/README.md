# Twig AWS Riglet

## Overview
> This is a long README.  You might consider installing this browser plugin for presenting a README TOC:  
> https://github.com/arthurhammer/github-toc

This riglet is based completely on AWS technologies.  The idea is that it should require nothing but
the AWS CLI to fire up an operational riglet with appropriate environments and a ready-to-execute 
build pipeline.

To accomplish this the following AWS technologies are leveraged:
 - _AWS CloudFormation_ (Cfn) to automate the provisioning of network, compute, and build resources
 - _AWS Command Line Interface_ (CLI) to execute Cfn commands
 - _Make_ to help simplify the use of the AWS CLI and for basic dependency management
 - A long list of Amazon services: VPC, EC2, ECS, S3, CodePipeline, CodeBuild, etc.
 
> This documentation cannot possibly give you everything you need to know about these technologies, 
> so some liberties are taken with definitions and detailed usage instructions (or lack thereof).


## Architecture

### Foundation
A "standard" riglet starts with a foundation:  three identical _Virtual Private Cloud_s (VPC), each 
representing an _environment_: _integration_ testing, _staging_ and _production_.  Each VPC has separate 
pairs of private subnets for application and database instances, with appropriate NATs and routing to 
give EC2 instances access to the internet.

Into each VPC a number of EC2 instances is allocated:
 - a configurable number of instances to comprise the EC2 Container Service (ECS) cluster
 - a single EC2 instance running CouchDb (launched from a custom AMI)

An Application Load Balancer (ALB) is also configured for the VPC.  This ALB is configured at build/deployment
time to route traffic to the appropriate system.

ALB and application security groups are created is defined to disallow traffic to the ECS cluster from
anywhere but the ALB, and over appropriate ports.

An SNS "operations" topic is created, with the expectation that pertinent error messages and alarm message
will be published there. An email address can optionally be subscribed to this topic at foundation creation time.

> Unfortunately, no such monitoring had been put in place as of this writing.  Route53 External Health Check
> alarms were attempted, but currently such alarms can only be defined in us-east-1, and the riglet 
> runs in us-west-2. 


```

                  +----------------+
                  |      ALB       |
+-----------------+                +------------------+
|                 +----------------+                  |
|                                                     |
|  +---------------------+  +----------------------+  |                      +---------------+
|  |      App Subnet     |  |      App Subnet      |  |        +-------------+   Web Build   |
|  | +-------------------------------------------+ |  |        |             +---------------+
|  | |  +-------+                  +-------+     +<------------+
|  | |  |  EC2  |        E C S     |  EC2  |     | |  |           Deployments
|  | |  +-------+                  +-------+     +<------------+
|  | +-------------------------------------------+ |  |        |             +---------------+
|  +---------------------+  +----------------------+  |        +-------------+   API Build   |
|                                                     |                      +---------------+
|  +---------------------+  +----------------------+  |
|  |                     |  |                      |  |
|  |      DB Subnet      |  |      DB Subnet       |  |
|  |                     |  |                      |  |
|  |     +---------+     |  |                      |  |
|  |     | CouchDb |     |  |                      |  |
|  |     |   EC2   |     |  |                      |  |
|  |     +---------+     |  |                      |  |
|  +---------------------+  +----------------------+  |
|                                                     |
+-----------------------------------------------------+
                     Standard VPC
    (one each for integration, staging, and production)
```

### Compute Layer
The "compute layer" in this rig is an ECS Cluster.  ECS allows you to deploy arbitrary code in Docker images,
and ECS handles the allocation of containers to run the images (a process known as "scheduling").

The Docker containers are hosted in what ECS calls "Tasks", and the Tasks are managed by "Services".  A 
Task can be defined to run one or more containers.  For this riglet we've chosen to define a separate Task
for each container (Twig and Twig API). 

A Service knows what version of a Task's definition is running at a given time, and how many instances
(desired count) of the Task should be maintained.  The running Tasks are automatically allocated to
the appropriate ECS cluster member.  Because we've chosen to have separate Task definitions for Twig 
and Twig API, we also have Separate services for these components.

### Database Layer
The "database layer" in this rig is CouchDb deployed on an EC2 instance, running in a dedicated subnet.
The EC2 instance is created from an AMI that was created from a running CouchDb instance in the old Rig 2.0
based riglet.  At instantiation time, a cron job is defined to back up the database files to an appropriate
S3 bucket.

A security group is created that allows access to the CouchDb instance only from the application
group and only over the CouchDb port.


### Build "Layer"
OK, it's not really a "layer", but the final piece of the riglet is the build pipeline.  In this case
we use AWS CodePipeline and CodeBuild to define and execute the pipeline.  Builds are triggered by
changes to either the source code of the application(s) or by changes to the Cfn templates that define
how applications are deployed.

Speaking of application deployments, those are also accomplished using Cfn, but the creation of the
application Cfn stacks is automated in the build pipelines.  (_Note:_  one will seldom, if ever, create
an application stack by hand.  However, the capability is there, and might be used to create a load
testing environment with selected Docker images deployed.)

An SNS "build" topic is created, and the build pipeline is configured to publish CodeBuild success/failure
messages there. An email address can optionally be subscribed to this topic at foundation creation time.
  

## Setup
This setup will create a CloudFormation, AWS CodePipeline/CodeBuild/CodeDeploy powered Rig on AWS.

### Dependencies

To follow these instructions you'll need:

* The AWS CLI, and working credentials: `brew install awscli && aws configure`
* Setup `.make` for local settings

This can either be done by copying settings from the template `.make.example`
and save in a new file `.make`:

```ini
DOMAIN = <Domain to use for Foundation>
KEY_NAME = <Existing EC2 SSH key name>
OWNER = <The owner of the stack, either personal or corporate>
PROFILE = <AWS CLI Profile Name (most likely "default", unless you've customized)>
PROJECT = <Project Name>
REGION = <AWS Region>
REPO_TOKEN = <Github OAuth or Personal Access Token>
CERT_ARN = <unique ID of TLS certificate defined in AWS Certificate manager>
```

Or also done interactively through `make .make`.

For the "real" twig riglet:

```ini
DOMAIN = buildit.tools
KEY_NAME = buildit-twig-ssh-keypair-us-east-1 (example: actual is dependent upon actual riglet/region)
OWNER = buildit
PROFILE = default (or whatever your configured profile is named)
PROJECT = twig
REGION = us-west-2
REPO_TOKEN = <ask a team member>
CERT_ARN = <unique ID of buildit.tools TLS certificate in us-west-2>
```

Confirm everything is valid with `make check-env`

### Firing it up

#### Make
Yes, Make.  Make is used to create, update, and delete riglets.  Get used to it.  To see all the available
Make targets type `make` with no arguments.

#### Feeling Lucky?  Uber-Scripts!
There are a couple of scripts that fully automate the detailed steps found further down.  They hide the
details, which is both a good and bad thing.

* `./create-standard-riglet.sh [branch name]` to create a full riglet with standard environments (integration/staging/production).
* `./delete-standard-riglet.sh [branch name]` to delete it all.  Note that you must delete your ECR images first.

#### Individual Makefile Targets
If you're not feeling particularly lucky, or you want to understand how things are assembled, or 
create a custom environment, or what-have-you, follow this guide.

##### Building it up
The full build pipeline requires at least integration, staging, and production environments, so the typical
installation is:

###### Execution/runtime Infrastructure and Environments
* Run `make create-foundation ENV=integration`
  * (optional) EMAIL_ADDRESS_OPS for ops notifications
* Run `make create-compute ENV=integration`
* Run `make create-db ENV=integration`
* Run `make create-foundation ENV=staging`
  * (optional) EMAIL_ADDRESS_OPS for ops notifications
* Run `make create-compute ENV=staging`
* Run `make create-db ENV=staging`
* Run `make create-foundation ENV=production`
  * (optional) EMAIL_ADDRESS_OPS for ops notifications
* Run `make create-compute ENV=production`
* Run `make create-db ENV=production`


###### Build "Environments"
In this case there's no real "build environment", unless you want to consider AWS services an environment.
We are using CodePipeline and CodeBuild, which are build _managed services_ run by Amazon (think Jenkins in 
the cloud, sort-of).  So what we're doing in this step is creating the build pipeline(s) for our code repo(s).

* Run `make create-build REPO=<repo_name> REPO_BRANCH=<branch> CONTAINER_PORT=<port> HEALTH_CHECK_PATH=<path> LISTENER_RULE_PRIORITY=<priority>`, same options for status: `make status-build` and outputs `make outputs-build`
  * REPO is the repo that hangs off buildit organization (e.g "twig-api")
  * REPO_BRANCH is the branch name for the repo - MUST NOT CONTAIN SLASHES!
  * CONTAINER_PORT is the port that the application exposes (e.g. 8080)
  * HEALTH_CHECK_PATH is the path that is checked by the target group to determine health of the container (e.g. `/ping`)
  * LISTENER_RULE_PRIORITY is the priority of the the rule that gets created in the ALB.  While these won't ever conflict, ALB requires a unique number across all apps that share the ALB.  See [Application specifics](#application-specifics)
  * (optional) EMAIL_ADDRESS_BUILD for build notifications
  * (optional) PREFIX is what goes in front of the URI of the application.  Defaults to OWNER but for the "real" riglet should be set to blank (e.g. `PREFIX=`)

###### Deployed Applications
It gets a little weird here.  You never start an application yourself in this riglet.  The build environments 
actually dynamically create "app" stacks in CloudFormation as part of a successful build.  These app stacks 
represent deployed and running code (they basically map to ECS Services and TaskDefinitions).


##### Tearing it down

To delete a running riglet, in order:

* Run `make delete-app ENV=<environment> REPO=<repo_name> REPO_BRANCH=<branch>` to delete any running App stacks.
  > If for some reason you deleted the pipeline first, you'll find you can't delete the app stacks because 
  > the role under which they were created was deleted with the pipeline. In this case you'll have to create 
  > a temporary "god role" (holding the AWS-maintained AdministratorAccess policy) and manually delete the app via 
  > the `aws cloudformation delete-stack` command, supplying the `--role-arn` override with your temporary role.
* Run `make delete-build REPO=<repo_name> REPO_BRANCH=<branch>` to delete the Pipline stack.
* Run `make delete-db ENV=<environment>` to delete the Database stack.
* Run `make delete-compute ENV=<environment>` to delete the Compute stack.
* Run `make delete-foundation ENV=<environment>` to delete the Foundation stack.
* Run `make delete-deps ENV=<environment>` to delete the required S3 buckets.


### Checking on things
* Check the outputs of the activities above with `make outputs-foundation ENV=<environment>`
* Check the status of the activities above with `make status-foundation ENV=<environment>`
* Check AWS CloudWatch Logs for application logs.  In the Log Group Filter box search 
  for for <owner>-<application> (at a minimum).  You can then drill down on the appropriate
  log group and individual log streams.

## Environment specifics
For simplicity's sake, the templates don't currently allow a lot of flexibility in network CIDR ranges.
The assumption at this point is that these VPCs are self-contained and "sealed off" and thus don't need 
to communicate with each other, thus no peering is needed and CIDR overlaps are fine.

Obviously, the templates can be updated if necessary.

| Environment  | CidrBlock |
| :---         | :---      |
| integration  | 10.10.0.0/16  |
| staging      | 10.20.0.0/16  |
| production   | 10.30.0.0/16  |

## Application specifics

| Application | ContainerPort | ListenerRulePriority 
| :---        | :---          | :---
| twig-api    | 3000          | 100                  
| twig        | 80            | 200 


## Maintenance
### Logging
ECS is automatically configured to capture application logs in CloudWatch Logs.  The logs are accessible
in the AWS Console or with the CLI.  The log groups for the applications are named following the same
convention as other stack resources, e.g. `buildit-twig-production-app-twig-api-master`.

### Updating the environments
Except in very unlikely and unusual circumstances _all infrastructure/build changes should be made via CloudFormation 
updates_ either by submitting template file changes via the appropriate make command, or by changing parameters in
the existing CloudFormation stacks using the console.  Failure to do so will cause the running environment(s) to diverge 
from the as-declared CloudFormation resources and may (will) make it impossible to do updates in 
the future via CloudFormation.

> An alternative to immediate execution of stack updates in the CloudFormation console is to use the "change set" 
> feature. This creates a pending update to the CloudFormation stack that can be executed immediately, or go through an 
> approval process.  This is a safe way to preview the "blast radius" of planned changes, too before committing.

### Updating ECS AMIs
The ECS cluster runs Amazon-supplied AMIs.  The AMIs are captured in a map in the `compute-ecs/main.yaml`
template.  Occasionally, Amazon releases newer AMIs and marks existing instances as out-of-date in the
ECS console.  To update to the latest set of AMIs, run the `./cloudformation/scripts/ecs-optimized-ami.sh`
script and copy the results into the `compute-ecs/main.yaml` template's `AWSRegionToAMI` mapping. 

### Debugging and/or Database Maintenance
Rarely, it might be necessary to access EC2 internals to either debug

### Scaling
There are a few scaling "knobs" that can be twisted in running stacks, using CloudFormation console.  
Conservative defaults are established in the templates, but the values can (and should) be updated 
in specific running riglets later.

For example, production ECS should probably be scaled up, at least horizontally, if only for high availability, 
so increasing the number of cluster instances to at least 2 (and arguably 4) is probably a good idea.
 
Also, running a number of ECS Tasks for each of twig-api and twig (web) is important.  ECS automatically 
distributes the Tasks to the ECS cluster instances.

> Note that desired task counts are currently actually hard-coded to reasonable per-environment defaults
> in a mapping in the deployment-pipeline.yaml file.  This is not great, but is a side-effect
> of using the CloudFormation provider in CodePipeline to deploy the Services.  To change these allocations
> change the template and use `make update-build` to have the scaling occur.

> On the to-do list is to implement ECS cluster auto-scaling (based, say, on load), as well as Task scaling
> (based, say, on experiencing 500 errors).

The same goes for the CouchDB instance, but in this case the only scaling option is vertical:  give it
a larger box.  Note that a resize of the instance type does not result in any lost data.

Most of these scaling changes can be made in the CloudFormation console.  To make changes find the appropriate stack, 
select it, choose "update", and specify "use current template".  On the resulting parameters page make appropriate 
changes and submit.

It's a good idea to always pause on the final submission page to see the predicted actions for your changes 
before proceeding, or consider using a Change Set.

#### Application Scaling Parameters

| Parameter                    | Scaling Style | Stack                      | Parameter  
| :---                         | :---          | :---                       | :---
| # of ECS cluster instances   | Horizontal    | compute-ecs                | ClusterSize/ClusterMaxSize
| Size of ECS Hosts            | Vertical      | compute-ecs                | InstanceType    |


#### Database Scaling Parameters
And here are the available *database* scaling parameters.  
 
| Parameter             | Scaling Style | Stack         | Parameter  
| :---                  | :---          | :---          | :---
| Size of Couch Host    | Vertical      | db-couch      | InstanceType  |


## Deployment information

### Deployments
* [Integration](https://builditintegration-twig-api.buildit.tools/ping)
* [Staging](https://builditstaging-twig-api.buildit.tools/ping)
* [Production](https://builditproduction-twig-api.buildit.tools/ping)

### Logging

* [Integration](https://console.aws.amazon.com/cloudwatch/home?region=us-west-2#logStream:group=buildit-twig-integration-app-twig-api-master)
* [Staging](https://console.aws.amazon.com/cloudwatch/home?region=us-west-2#logStream:group=buildit-twig-staging-app-twig-api-master)
* [Production](https://console.aws.amazon.com/cloudwatch/home?region=us-west-2#logStream:group=buildit-twig-production-app-twig-api-master)



## Architectural Decisions

We are documenting our decisions [here](../master/docs/architecture/decisions)
