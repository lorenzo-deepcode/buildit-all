variable "pipeline_name" {
  description = "The name of the pipeline project"
  default = "fabricator"
}

variable "codepipeline_bucket" {
  description = "The name of the S3 bucket to store the pipeline artifacts"
}

variable "git_owner" {
  description = "Owner of the Git repositoy"
}

variable "git_repo" {
  description = "The Git repo name for this pipeline"
}

variable "git_branch" {
  description = "The Git repo branch for this pipeline"
}

variable "git_oauth_token" {
  description = "The Git OAuth token used to conect to the repo"
}
