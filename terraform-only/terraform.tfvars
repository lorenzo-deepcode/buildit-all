terragrunt = {
  remote_state {
    backend = "s3"
    config {
      bucket         = "rig.hap.terra-foo.us-east-1.foundation"
      key            = "${path_relative_to_include()}/terraform.tfstate"
      region         = "us-east-1"
      encrypt        = true
      dynamodb_table = "hap-terra-foo-lock-table"
      profile        = "digital-rig-hap-terraform"
    }
  }
}
