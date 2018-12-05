variable "project_name" {
  description = "The name of the codebuild project"
}

variable "web_server_ip" {
  description = "The private IP address of the web server where the application will be installed"
}

variable "VPC_ID" {
  description = "The ID of the VC to be used by CodeBuild to provision the build container."
}

variable "VPC_Private_Subnet_ID" {
  description = "The ID of the private subnet in the VPC to be used for CodeBuild container provisioning."
}

variable "VPC_Security_Group_ID" {
  description = "The ID of the attached security group for the VPC"
}

variable "ssh_key_bucket" {
  description = "The name of the S3 bucket which has the encrypted ssh keys to access internal EC2 instance"
}

variable "ssh_key_filename" {
  description = "The name of the SSH key file"
}
