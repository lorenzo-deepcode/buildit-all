locals {
  storage_bucket_name = "${var.storage_bucket}-${var.env}"
}

variable "storage_bucket" {
  default = "search-documents"
}

resource "aws_s3_bucket" "terraform_bucket" {
  bucket        = "${local.storage_bucket_name}"
  force_destroy = "${var.env == "prod" ? false : true}"
}
