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
  private_subnet_cidr_block = "${var.private_subnet_cidr_block}"
  ssh_cidr_block            = "${var.ssh_cidr_block}"
  key_pair_name             = "${var.key_pair_name}"
  instance_type             = "t2.micro"
}

module "codebuild" {
  source                    = "../../../modules/codebuild"
  project_name              = "${var.cluster_name}"
  web_server_ip             = "${module.webserver.web_server_ip}"
  VPC_ID                    = "${module.webserver.vpc_id}"
  VPC_Private_Subnet_ID     = "${module.webserver.vpc_private_subnet_id}"
  VPC_Security_Group_ID     = "${module.webserver.vpc_security_group_id}"
  ssh_key_bucket            = "${var.ssh_key_bucket}"
  ssh_key_filename          = "${var.ssh_key_filename}"
}

module "codepipeline" {
  source                    = "../../../modules/pipeline"
  pipeline_name             = "${var.cluster_name}"
  codepipeline_bucket       = "${var.codepipeline_bucket}"
  git_owner                 = "${var.git_owner}"
  git_repo                  = "${var.git_repo}"
  git_branch                = "${var.git_branch}"
  git_oauth_token           = "${var.git_oauth_token}"
}
