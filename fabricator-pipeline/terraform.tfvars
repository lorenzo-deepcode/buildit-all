terragrunt = {
  remote_state {
    backend = "s3"
    config {
      bucket         = "rig.fabricator-pipeline.us-west-2"
      key            = "${path_relative_to_include()}/terraform.tfstate"
      region         = "us-west-2"
      encrypt        = true
      dynamodb_table = "fabricator-pipeline-lock-table"
      profile        = "fabricator-pipeline"
    }
  }
}
