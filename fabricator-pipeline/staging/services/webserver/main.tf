terraform {
  backend "s3" {}
}

provider "aws" {
  region                  = "${var.region}"
  shared_credentials_file = "${var.shared_credentials_file}"
  profile                 = "${var.aws_profile}"
}

module "webserver" {
  source                    = "../../../modules/services/webserver"
  vpc_cidr_block            = "${var.vpc_cidr_block}"
  cluster_name              = "${var.cluster_name}"
  environment               = "${var.environment}"
  public_subnet_cidr_block  = "${var.public_subnet_cidr_block}"
  ssh_cidr_block            = "${var.ssh_cidr_block}"
  key_pair_name             = "${var.key_pair_name}"
  instance_type             = "t2.micro"
}
