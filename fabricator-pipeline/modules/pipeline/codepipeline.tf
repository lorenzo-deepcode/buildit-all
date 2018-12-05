resource "aws_s3_bucket" "codepipeline_bucket" {
  bucket = "${var.pipeline_name}-${var.codepipeline_bucket}"
  acl    = "private"
}

resource "aws_iam_role" "codepipeline_role" {
  name = "${var.pipeline_name}-codepipeline-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "codepipeline.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "codepipeline_policy" {
  name = "${var.pipeline_name}-codepipeline-policy"
  role = "${aws_iam_role.codepipeline_role.id}"
  policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect":"Allow",
      "Action": [
        "s3:PutObject",
        "s3:GetObject",
        "s3:GetObjectVersion",
        "s3:GetBucketVersioning"
      ],
      "Resource": [
        "${aws_s3_bucket.codepipeline_bucket.arn}",
        "${aws_s3_bucket.codepipeline_bucket.arn}/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "codebuild:BatchGetBuilds",
        "codebuild:StartBuild"
      ],
      "Resource": "*"
    }
  ]
}
EOF
}

resource "aws_codepipeline" "fabricator_codepipeline" {
  name     = "${var.pipeline_name}-codepipeline"
  role_arn = "${aws_iam_role.codepipeline_role.arn}"

  artifact_store {
    location = "${aws_s3_bucket.codepipeline_bucket.bucket}"
    type     = "S3"
//    encryption_key {
//      id   = "${data.aws_kms_alias.s3kmskey.arn}"
//      type = "KMS"
//    }
  }

  stage {
    name = "Source"

    action {
      name             = "Source"
      category         = "Source"
      owner            = "ThirdParty"
      provider         = "GitHub"
      version          = "1"
      output_artifacts = ["${var.pipeline_name}-artifacts"]

      configuration {
        Owner      = "${var.git_owner}"
        Repo       = "${var.git_repo}"
        Branch     = "${var.git_branch}"
        OAuthToken = "${var.git_oauth_token}"
      }
    }
  }

  stage {
    name = "BuildDeploy"

    action {
      name            = "BuildDeploy"
      category        = "Build"
      owner           = "AWS"
      provider        = "CodeBuild"
      input_artifacts = ["${var.pipeline_name}-artifacts"]
      version         = "1"
      output_artifacts = ["${var.pipeline_name}-output"]

      configuration {
        ProjectName = "${var.pipeline_name}-codebuild-project"
      }
    }
  }
}