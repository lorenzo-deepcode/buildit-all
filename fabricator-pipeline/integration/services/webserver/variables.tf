variable "region" {
  description = "The aws region from which everything will be based on."
  default = "us-west-2"
}

variable "vpc_cidr_block" {
  description = "VPC CIDR block (i.e. 0.0.0.0/0)"
  default = "10.1.0.0/16"
}

variable "cluster_name" {
  description = "The name to use for all the cluster resources"
}

variable "environment" {
  description = "Either int, stg or prd"
}

variable "shared_credentials_file" {
  description = "Absolute path the AWS credentials file."
}

variable "aws_profile" {
  description = "AWS profile name referenced in the credentials file."
}

variable "public_subnet_cidr_block" {
  description = "Public Subnet CIDR block (i.e. 0.0.0.0/0)"
  default = "10.1.1.0/24"
}

variable "private_subnet_cidr_block" {
  description = "Public Subnet CIDR block (i.e. 0.0.0.0/0)"
  default = "10.1.2.0/24"
}

variable "ssh_cidr_block" {
  description = "SSH CIDR block (i.e. 0.0.0.0/0)"
}

variable "key_pair_name" {
  description = "Existing key pair name in same region as the EC2 instance"
}

variable "codepipeline_bucket" {
  description = "The S3 bucket used by CodePipeline to store artifacts."
  default = "fabricator-artifact-bucket-uswest-2"
}

variable "git_owner" {
  description = "The ower of the Git repository where code will be pulled from."
}

variable "git_repo" {
  description = "The Git repo name for this pipeline"
}

variable "git_branch" {
  description = "The Git repo branch for this pipeline"
  default = "master"
}

variable "git_oauth_token" {
  description = "The Git OAuth token used to conect to the repo"
}

variable "ssh_key_bucket" {
  description = "The name of the S3 bucket which has the encrypted ssh key to access web server EC2 instance"
}

variable "ssh_key_filename" {
  description = "The name of the SSH key file"
  default = "key.pem"
}
