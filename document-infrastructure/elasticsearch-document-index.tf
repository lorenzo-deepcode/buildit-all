locals {
  es_role_name   = "${var.env}-es-role"
  es_user_name   = "${var.env}-user"
  es_domain_name = "${var.search_domain}-${var.env}"
}

variable "search_domain" {
  default = "search-documents"
}

resource "aws_elasticsearch_domain" "es" {
  domain_name           = "${local.es_domain_name}"
  elasticsearch_version = "6.2"

  cluster_config {
    instance_type = "t2.small.elasticsearch"
  }

  ebs_options {
    ebs_enabled = true
    volume_size = 10
    volume_type = "standard"
  }

  advanced_options {
    "rest.action.multi.allow_explicit_index" = "true"
  }

  snapshot_options {
    automated_snapshot_start_hour = 23
  }
}

resource "aws_elasticsearch_domain_policy" "main" {
  domain_name = "${aws_elasticsearch_domain.es.domain_name}"

  access_policies = <<POLICIES
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "AWS": "${aws_iam_user.iam_for_es.arn}"
      },
      "Action": "es:*",
      "Resource": "${aws_elasticsearch_domain.es.arn}/*"    }
  ]
}
POLICIES
}

resource "aws_iam_user" "iam_for_es" {
  name = "${local.es_user_name}"
}

resource "aws_iam_access_key" "es" {
  user = "${aws_iam_user.iam_for_es.name}"
}
