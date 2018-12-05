resource "aws_ecs_cluster" "main" {
  name = "${var.application_prefix}-${var.env}-cluster"
}