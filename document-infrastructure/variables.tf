variable "env" {}

variable "region" {
  default = "us-east-1"
}

variable "application_prefix" {
  default = "search-documents"
}

variable "ecs_az_count" {
  default = "2"
}

variable "default_ecs_cpu" {
  default = "256"
}

variable "default_ecs_memory" {
  default = "1024"
}

variable "default_ecs_count" {
  default = 1
}

variable "lambda_function_bucket" {
  default = "search-documents-functions"
}
