# Overview

This projects purpose is to provide infrastructure as code for a pure terraform rig flavor. The infrastructure is currently broken down into the follow modules:

* Modules
  * modules - general reusable modules consumed by other modules
  * global - top level general modules
    * s3 - manage AWS s3 buckets that will be used for storing Terraform state of all modules in this project
  * integration - environment used for CI/CD build, test and deployments.
    * data-stores - Database persistence as needed
    * foundation - VPC, Networking, Subnets, Gateways
    * services - RESTful APIs, CI/CD and other backend services
    * apps - UI based application for web and such

Currently, only the base foundation is implemented. As the platform gets build out, more foundation will be added (for resources like load balancers and DNS).

The current foundation has the following resources/characteristics:

* 1 - VPC
* 2 - Public Subnets
* 2 - Private Subnets
* 1 - Internet Gateway
* 1 - Public Route (Internet access)
* 2 - Elastic IPs (one for each NAT Gateway)
* 2 - NAT Gateways
* 2 - Private Route Tables
* 2 - Private Routes
* 2 - Public Route Table Associations
* 2 - Private Route Table Associations

## Pre-build Requirements

### AWSCLI

You will need to install the [AWSCLI](https://aws.amazon.com/cli/). It is highly recommended that you setup your home directory to support the AWSCLI tool as described [here](https://docs.aws.amazon.com/cli/latest/userguide/cli-config-files.html).

### Terraform

There are several ways to install Terraform. If you are a Homebrew user, I strongly encourage you to install Terraform as:

```
brew update
brew doctor
brew install terraform
```

### Terragrunt

This is an open sources free tool for managing Terraform configurations. There are several ways to install [Terragrunt](https://github.com/gruntwork-io/terragrunt). If you are a Homebrew user, I strongly encourage you to install it this way:

```
brew install terragrunt
```

## Build

### 1. Setup Remote State Management

You need to setup an S3 bucket that will be used to store Terraform state for each of the modules. This is a bit of a cart-horse thing since the S3 bucket setup is itself a module. In addition, because Terraform backend configuration doesn't allow any interpolation and Terragrunt configuration only allows function calls interpolation, this part is a little wonkie.

### 1.1 Manual Change Remote State Settings
```
cd <project_root_dir>
```

where 'project_root_dir' is the directory where you checked this source out to.

Then edit the root Terragrunt configuration file named 'terraform.tfvars' and change the following values:

* bucket - This value needs to be globally unique name.
* region - Even though the S3 buckets are global and not regional specific, you still have to supply a AWS region. Weird I know.
* dynamodb_table - A unique table name that will be used to store the lock when making changes to remote state.
* profile - A local AWS CLI profile name in the AWS credentials file.

The current values for the above a sure not to be unique nor correct, so please make sure to change them all.

### 1.2 Setup S3 Bucket to Store Remote State
```
cd <project_root_dir>/global/s3
```

Run the Terragrunt apply to create the bucket which will also create the Dynamo DB table for you too.
```
terragrunt apply
```

You will be prompted to supply some input values.
* var.aws_profile - AWS profile name referenced in the credentials file.
  * Provide the same profile name you entered above in the root terraform.tfvars file.
* var.bucket_name - The name of the S3 bucket used to store terraform state. Must be globally unique.
  * Provide the same bucket name you entered above in the root terraform.tfvars file.
* var.shared_credentials_file - Absolute path the AWS credentials file.
  * Provide an absolute path to the AWS credentials file on your local workstation.
* var.state_lock_table - Name of state lock table used for remote state management.
  * Enter value: global/s3/terraform.tfstate

If all goes well (no errors), you will be asked to confirm changes before it creates the S3 bucket. You need to enter 'yes' to proceed.

If this finishes successfully, you will see the ARN name of the S3 bucket in the output.

You can verify the S3 bucket by logging into the AWS console for digital-rig, going to the S3 console and then filtering by the bucket name. Inside the bucket should be folders for global and then s3 and in the s3 folder, you will see the terraform.tfstate file.
