terraform {
  backend "s3" {}
}

provider "aws" {
  region                  = "${var.region}"
  shared_credentials_file = "${var.shared_credentials_file}"
  profile                 = "${var.aws_profile}"
}

module "foundation" {
  source = "git::github.com:buildit/terraform-modules//foundation"

  vpc_cidr_block              = "10.1.0.0/16"
  public_subnet_a_cidr_block  = "10.1.1.0/24"
  public_subnet_b_cidr_block  = "10.1.2.0/24"
  private_subnet_a_cidr_block = "10.1.11.0/24"
  private_subnet_b_cidr_block = "10.1.12.0/24"

  app_lb_name                 = "${var.app_lb_name}"

  environment                 = "integration"
  owner                       = "${var.owner}"
  project                     = "${var.project}"
}
