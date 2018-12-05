variable "region" {
  description = "The aws region to use for S3 bucket."
  default = "us-east-1"
}

variable "bucket_name" {
  description = "The name of the S3 bucket used to store terraform state. Must be globally unique."
}

variable "shared_credentials_file" {
  description = "Absolute path the AWS credentials file."
}

variable "aws_profile" {
  description = "AWS profile name referenced in the credentials file."
}

variable "state_lock_table" {
  description = "Name of state lock table used for remote state management."
}
