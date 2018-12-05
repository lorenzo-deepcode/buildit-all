provider "aws" {
  access_key = "${var.accessKey}"
  secret_key = "${var.secretKey}"
  region = "${var.region}"
}

locals {
  storageBucketName = "${var.storageBucket}-${var.env}"
  iamLamdaRoleName = "iam-${var.env}-lambda-role"
  iamEsRoleName = "iam-${var.env}-es-role"
  iamEsUserName = "es-${var.env}-user"
  lambdaFunctionName = "${var.lambdaFunction}-${var.env}"
  esDomainName = "${var.searchDomain}-${var.env}"
}


resource "aws_iam_user" "iam_for_es" {
  name = "${local.iamEsUserName}"
}

resource "aws_iam_access_key" "es" {
  user    = "${aws_iam_user.iam_for_es.name}"
}

resource "aws_iam_role" "iam_for_lambda" {
  name = "${local.iamLamdaRoleName}"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "lambda.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "lambda_iam_policy_basic_execution" {
  role = "${aws_iam_role.iam_for_lambda.id}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_iam_policy_s3_read_access" {
  role = "${aws_iam_role.iam_for_lambda.id}"
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess"
}

resource "aws_lambda_permission" "allow_terraform_bucket" {
  statement_id = "AllowExecutionFromS3Bucket"
  action = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.terraform_func.arn}"
  principal = "s3.amazonaws.com"
  source_arn = "${aws_s3_bucket.terraform_bucket.arn}"
}

resource "aws_lambda_function" "terraform_func" {
  function_name = "${local.lambdaFunctionName}"
  role = "${aws_iam_role.iam_for_lambda.arn}"
  handler = "${var.lambdaFunctionHandler}"
  runtime = "${var.runtime}"
  timeout = "${var.timeout}"
  memory_size = "${var.memorySize}"
  s3_bucket = "${var.lambdaFunctionBucket}"
  s3_key = "${var.artifactId}-all-${var.version}.jar"
  environment {
    variables = {
      DOCUMENT_INDEX = "https://${aws_elasticsearch_domain.es.endpoint}"
      ACCESS_KEY = "${aws_iam_access_key.es.id}"
      SECRET_KEY = "${aws_iam_access_key.es.secret}"
    }
  }
}

resource "aws_lambda_function" "terraform_func" {
  function_name = "${local.lambdaFunctionName}"
  role = "${aws_iam_role.iam_for_lambda.arn}"
  handler = "${var.lambdaFunctionHandler}"
  runtime = "${var.runtime}"
  timeout = "${var.timeout}"
  memory_size = "${var.memorySize}"
  s3_bucket = "${var.lambdaFunctionBucket}"
  s3_key = "${var.artifactId}-all-${var.version}.jar"
  environment {
    variables = {
      DOCUMENT_INDEX = "https://${aws_elasticsearch_domain.es.endpoint}"
      ACCESS_KEY = "${aws_iam_access_key.es.id}"
      SECRET_KEY = "${aws_iam_access_key.es.secret}"
    }
  }
}

resource "aws_s3_bucket" "terraform_bucket" {
  bucket = "${local.storageBucketName}"
  force_destroy = "${var.env == "dev" ? true : false}"
}

resource "aws_s3_bucket_notification" "bucket_terraform_notification" {
  bucket = "${aws_s3_bucket.terraform_bucket.id}"
  lambda_function {
    lambda_function_arn = "${aws_lambda_function.terraform_func.arn}"
    events = ["s3:ObjectCreated:*"]
    filter_suffix = ".pdf"
  }
}

resource "aws_elasticsearch_domain" "es" {
  domain_name           = "${local.esDomainName}"
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

output "esEndpoint" {
  value = "https://${aws_elasticsearch_domain.es.endpoint}"
}
