locals {
  lambda_function_name = "${var.indexer_lambda_function}-${var.env}"
  lamda_role_name      = "${var.env}-lambda-role"
}

variable "indexer_lambda_function_runtime" {
  default = "java8"
}

variable "indexer_lambda_function_timeout" {
  default = "300"
}

variable "indexer_lambda_function_memory_size" {
  default = "2048"
}

variable "indexer_lambda_function" {
  default = "document-indexer-lambda"
}

variable "indexer_lambda_function_handler" {
  default = "com.buildit.documents.DocumentIndexer::handleRequest"
}

variable "indexer_lambda_function_artifact" {
  default = "document-indexer-lambda"
}

variable "indexer_lambda_function_version" {
  default = "1.0.0"
}

resource "aws_iam_role" "iam_for_lambda" {
  name = "${local.lamda_role_name}"

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
  role       = "${aws_iam_role.iam_for_lambda.id}"
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy_attachment" "lambda_iam_policy_s3_read_access" {
  role       = "${aws_iam_role.iam_for_lambda.id}"
  policy_arn = "arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess"
}

resource "aws_lambda_permission" "allow_terraform_bucket" {
  statement_id  = "AllowExecutionFromS3Bucket"
  action        = "lambda:InvokeFunction"
  function_name = "${aws_lambda_function.terraform_func.arn}"
  principal     = "s3.amazonaws.com"
  source_arn    = "${aws_s3_bucket.terraform_bucket.arn}"
}

resource "aws_lambda_function" "terraform_func" {
  function_name = "${local.lambda_function_name}"
  role          = "${aws_iam_role.iam_for_lambda.arn}"
  handler       = "${var.indexer_lambda_function_handler}"
  runtime       = "${var.indexer_lambda_function_runtime}"
  timeout       = "${var.indexer_lambda_function_timeout}"
  memory_size   = "${var.indexer_lambda_function_memory_size}"
  s3_bucket     = "${var.lambda_function_bucket}"
  s3_key        = "${var.indexer_lambda_function_artifact}-all-${var.indexer_lambda_function_version}.jar"

  environment {
    variables = {
      DOCUMENT_INDEX = "https://${aws_elasticsearch_domain.es.endpoint}"
      ACCESS_KEY     = "${aws_iam_access_key.es.id}"
      SECRET_KEY     = "${aws_iam_access_key.es.secret}"
    }
  }
}

resource "aws_s3_bucket_notification" "bucket_terraform_notification" {
  bucket = "${aws_s3_bucket.terraform_bucket.id}"

  lambda_function {
    lambda_function_arn = "${aws_lambda_function.terraform_func.arn}"
    events              = ["s3:ObjectCreated:*"]
    filter_suffix       = ".pdf"
  }
}
