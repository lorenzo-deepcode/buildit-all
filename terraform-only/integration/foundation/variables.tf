variable "region" {
  description = "The aws region to use for S3 bucket."
  default = "us-east-1"
}

variable "shared_credentials_file" {
  description = "Absolute path the AWS credentials file."
}

variable "aws_profile" {
  description = "AWS profile name referenced in the credentials file."
}

variable "app_lb_name" {
  description = "Name to give to the application load balancer (cannot be more than 18 characters and cannot include spaces)."
}

variable "owner" {
  description = "Name of the owner of the project. Could be your name or organization name for instance."
  default = "buildit"
}

variable "project" {
  description = "Name for the project that this foundation is being setup for."
  default = "foo"
}

variable "environment" {
  description = "Either integration, staging or production"
  default = "integration"
}
