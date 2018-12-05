variable "region" {
  description = "The aws region from which everything will be based on."
  default = "us-west-2"
}

variable "vpc_cidr_block" {
  description = "VPC CIDR block (i.e. 0.0.0.0/0)"
}

variable "cluster_name" {
  description = "The name to use for all the cluster resources"
}

variable "environment" {
  description = "Either int, stg or prd"
}

variable "public_subnet_cidr_block" {
  description = "Public Subnet CIDR block (i.e. 0.0.0.0/0)"
}

variable "private_subnet_cidr_block" {
  description = "Private Subnet CIDR block (i.e. 0.0.0.0/0)"
}

variable "ssh_cidr_block" {
  description = "SSH CIDR block (i.e. 0.0.0.0/0)"
}

variable "key_pair_name" {
  description = "Existing key pair name in same region as the EC2 instance"
}

variable "instance_type" {
  description = "The type of EC2 instances to run (e.g. t2.micro)"
}

variable "region_to_ami" {
  description = "Mapping of AWS region to an AMI to use"
  type = "map"

  default = {
    us-east-1      = "ami-28456852"
    us-east-2      = "ami-ce1c36ab"
    us-west-1      = "ami-74262414"
    us-west-2      = "ami-decc7fa6"
    eu-west-1      = "ami-1d46df64"
    eu-west-2      = "ami-67cbd003"
    eu-west-3      = "ami-9aef59e7"
    eu-central-1   = "ami-509a053f"
    ap-northeast-1 = "ami-872c4ae1"
    ap-northeast-2 = "ami-c212b2ac"
    ap-southeast-1 = "ami-910d72ed"
    ap-southeast-2 = "ami-58bb443a"
    ca-central-1   = "ami-435bde27"
    ap-south-1     = "ami-00491f6f"
    sa-east-1      = "ami-af521fc3"
  }
}
