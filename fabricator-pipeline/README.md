This projects purpose is to provide a pipeline for a [Fabricator](http://fbrctr.github.io) based project.

The current foundation has the following resources/characteristics:

* 1 - VPC
* 1 - Internet Gateway
* 1 - Public Subnet
* 1 - Private Subnet
* 1 - Custom Route Table
* 1 - Custom Route (for internet access)
* 1 - Route Association (public subnet to custom route table)
* 1 - Route Association (private subnet to custom route subnet)
* 1 - NAT Gateway (routing to public subnet)
* 1 - Route Association (private subnet to NAT)
* 1 - Security Groups (for web server)
* 4 - Security Group Rules
  * HTTP inbound (any IP)
  * SSH inbound (specific IP for admin purposes)
  * SSH inbound (from local private subnet - used by CodeBuild containers)
  * Anything outbound
* 1 - EC2 instance
* 1 - Elastic IP

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

### AWS User Access Credentials 

As a best practice, create a dedicated user in AWS and associate it to the 'Terraform' group. This user will own and 
operate all the resources in AWS. A default user **fabricator-pipeline** is already created and is referenced in 
scripts.

Add the user id and secret in the AWS credentials file on your local machine in the ~/.aws/credentials:

```
[fabricator-pipeline]
aws_access_key_id = XXXXXXXXXXXXX
aws_secret_access_key = XXXXXXXXXXXXXXX
```

### Choose an AWS Region

Pick a region to work in. From this point onwards, everything you do will only apply to that region. If you decide to deploy the infrastructure in a different region, you will need to follow all the steps below again for that region.

The default region hard-coded in the scripts is **us-west-2** (Oregon) which you change per instructions below. 

### AWS Key Pair

SSH Key Pair is essential to access the EC2 web server for CI/CD pipeline and administrative purposes. 
 
Create a Key Pair in AWS to access the EC2 web sever instance. Save the key (.pem) file locally and record the key name to be used later as a parameter when creating the infrastructure. 

In order for CodeBuild to deploy the artifacts to the web server automatically, you will need to place the SSH key file (.pem) file in a private encrypted S3 bucket:

* Create a private S3 bucket with the following naming convention:
  * **fabricator-support-\<\<aws region>>** (replace the aws region appropriately)
   e.g. **fabricator-support-us-west-2**
* Encrypt the S3 bucket with a custom AWS-KSM 
* Add the SSH key file (.pem) with the following name:
  * **key.pem**

### Project Build Specification

The Codebuild service will utilize the **buildspec.yml** file to build, package, and deploy the target application.

Please ensure that the *buildspec.yml* is configured and available in the project root directory of your target Git project.

The following environment variables are made available to the Codebuild container which can be used in the buildspec.yml as needed:

* WEB_SERVER_IP : The **private** IP address of the EC2 web server
* SSH_KEY_S3_BUCKET : The name of the S3 bucket where SSH key file is stored
* SSH_KEY_FILE : The name of the encrypted SSH key file which can be used to SSH in to the EC2 web server 

## Build

### 1. Setup Remote State Management

You need to setup an S3 bucket that will be used to store Terraform state for each of the modules. This is a bit of a cart-horse thing since the S3 bucket setup is itself a module. In addition, because Terraform backend configuration doesn't allow any interpolation and Terragrunt configuration only allows function calls interpolation, this part is a little wonkie.

### 1.1 Manual Change Remote State Settings
```
cd <project_root_dir>
```

where 'project_root_dir' is the directory where you checked this source out to.

If you want to setup your own pipeline, then edit the root Terragrunt configuration file named 'terraform.tfvars' and change the following values:

* bucket - This value needs to be globally unique name.
  * Default: rig.fabricator-pipeline.us-west-2
* region - Even though the S3 buckets are global and not regional specific, you still have to supply a AWS region. Weird I know.
  * Default: us-west-2
* dynamodb_table - A unique table name that will be used to store the lock when making changes to remote state.
  * Default: fabricator-pipeline-lock-file.
* profile - A local AWS CLI profile name in your AWS credentials file.
  * Default: fabricator-pipeline

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
  * Enter value: fabricator-pipeline-lock-table

If all goes well (no errors), you will be asked to confirm changes before it creates the S3 bucket. You need to enter 'yes' to proceed.

If this finishes successfully, you will see the ARN name of the S3 bucket in the output.

You can verify the S3 bucket by logging into the AWS console for digital-rig, going to the S3 console and then filtering by the bucket name. Inside the bucket should be folders for global and then s3 and in the s3 folder, you will see the terraform.tfstate file.

### 2. Setup Environment Infrastructure

Next you need to create all the Infrastructure (networking, routes, security, instance, etc...) and the code pipeline for CI/CD. This project creates a new VPC so everything is isolated and self contained.

### 2.1 Verify Integration Environment

You need to know your public IP address to allow SSH to the web server. You can get that IP address at [CheckIP](http://checkip.amazonaws.com). Once you have your IP, you need to build the infrastructure.

```
cd <project_root_dir>/integration/services/webserver
terragrunt plan
```

There are many common parameters built into the terraform scripts to provision the infrastructure. Most of the parameters have default values which can be common across multiple deployments but you can change them if you wish.

To change any default parameters in the scripts, edit the **integration/services/webserver/variables.tf** file.

**Note**: the default region is **us-west-2** so change this to your specific region where you provisioned your Key Pair and named your S3 bucket   
 
You will be prompted for the following information which is environment and deployment specific:
* Cluster Name
  * Enter: Name of the cluster which will be pre-fixed to all the resources created in AWS
* Environment
  * Enter:  int or stg
* AWS shared credentials file
  * Provide an absolute path to the AWS credentials file on your local workstation
* AWS Profile
  * Name of the user you created in Pre-build Requirements
* SSH IP CIDR
  * Enter: \<your public ip address from ckeckip>/32 or any other valid CIDR
* Key pair name
  * Enter: <valid key pair name from region>
* Git Repo Name
  * Name of the Git repo from which to pull code and deploy to the web server
* Git Auth Token
  * Auth token you created in Pre-build Requirements
* SSH Key Bucket Name
  * Name of the S3 Key Pair bucket you created above in the Pre-build Requirements  
* SSH Key File Name
  * Name of the .pem key file name 

If all is ok, proceed to the next step.

### 2.2 Build Integration Environment
```
terragrunt apply
```

Once the deployment is completed, you should see the public IP address of the 
EC2 web server in the output from Terraform. You will need this IP address in the next step and to SSH into the web server for administrative purposes. 

```
Apply complete! Resources: 26 added, 0 changed, 0 destroyed.
Releasing state lock. This may take a few moments...

Outputs:

webserver_public_ip = 54.218.191.159
```

**NOTE**- At this point, all of the infrastructure and CI/CD pipeline should be up and running 
but Codebuild will fail because the nginx is not deployed yet on our web server.

Not to worry, you will deploy and configure nginx web server in the next step.   

### 3. Setup Nginx

Next you need to configure an nginx web server on the ec2 instance. This project is using Ansible for configuration management.

### 3.1 Setup configuration

There are two sample configuration files in the <project_root_dir>/ansible/playbook folder:
  * ancible.cfg.example
  * hosts.example

Make a copy the above files without the ".example" extension, i.e. "ancible.cfg" and "hosts"

Make the following changes in the configuration files:

* **<project_root_dir>/ansible/playbook/ansible.cfg**
  * *private_key_file* = Absolute path of the SSH key pair file you downloaded above in the Pre-build Requirements
* **<project_root_dir>/ansible/playbook/hosts**
  * *ansible_ssh_host* = Public IP address of the EC2 web server instance from the deployment above 

### 3.2 Run configuration

```
cd <project_root_dir>/ansible/playbook
ansible-playbook web-notls.yml
```

where 'project_root_dir' is the directory where you checked this source out to.

### 4. Run the Codepipeline to deploy the latest code

Now that nginx server is installed and configured, run the CI/CD pipeline again in AWS to push the latest code successfully to the web server. After the deployment is complete, you should see your deployment by going to the public IP address of your web server in a browser.
  