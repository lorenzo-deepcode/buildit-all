locals {
  document_repository_image                = "${var.document_repository_image_name}:${var.document_repository_image_version}"
  document_repository_alb_path             = "${var.document_repository_base_path}*"
  document_repository_alb_health_check_url = "${var.document_repository_base_path}/${var.document_repository_alb_health_check_path}"
}

variable "document_repository_app_name" {
  default = "document_repository"
}

variable "document_repository_image_name" {
  default = "builditdigital/document-repository-web"
}

variable "document_repository_image_version" {
  default = "0.4.0"
}

variable "document_repository_image_port" {
  default = 8080
}

variable "document_repository_base_path" {
  default = "/repository"
}

variable "document_repository_alb_health_check_path" {
  default = "/health"
}

resource "aws_iam_role" "document_repository_task_execution_role" {
  name = "${var.document_repository_app_name}_task_execution_role_${var.env}"

  assume_role_policy = <<EOF
{
  "Version": "2008-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Effect": "Allow"
    }
  ]
}
EOF
}

resource "aws_iam_role_policy_attachment" "document_repository_policy_cloudwatch" {
  role       = "${aws_iam_role.document_repository_task_execution_role.id}"
  policy_arn = "arn:aws:iam::aws:policy/CloudWatchFullAccess"
}

resource "aws_ecs_task_definition" "document_repository" {
  family                   = "${var.document_repository_app_name}"
  execution_role_arn       = "${aws_iam_role.document_repository_task_execution_role.arn}"
  network_mode             = "awsvpc"
  requires_compatibilities = ["FARGATE"]
  cpu                      = "${var.default_ecs_cpu}"
  memory                   = "${var.default_ecs_memory}"

  container_definitions = <<DEFINITION
[
  {
    "cpu": ${var.default_ecs_cpu},
    "image": "${local.document_repository_image}",
    "memory": ${var.default_ecs_memory},
    "name": "${var.document_repository_app_name}",
    "networkMode": "awsvpc",
    "portMappings": [
      {
        "containerPort": ${var.document_repository_image_port},
        "hostPort": ${var.document_repository_image_port}
      }
    ],
    "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
            "awslogs-group": "${aws_cloudwatch_log_group.document_repository.name}",
            "awslogs-region": "${var.region}",
            "awslogs-stream-prefix": "/ecs"
        }
    },
    "environment": [
      {
        "name": "cloud.aws.credentials.accessKey",
        "value": "${aws_iam_access_key.es.id}"
      },
      {
        "name": "cloud.aws.credentials.secretKey",
        "value": "${aws_iam_access_key.es.secret}"
      },
      {
        "name": "cloud.aws.es.domain",
        "value": "https://${aws_elasticsearch_domain.es.endpoint}"
      }
    ]
  }
]
DEFINITION
}

resource "aws_ecs_service" "document_repository" {
  name            = "${var.document_repository_app_name}_service"
  cluster         = "${aws_ecs_cluster.main.id}"
  task_definition = "${aws_ecs_task_definition.document_repository.arn}"
  desired_count   = "${var.default_ecs_count}"
  launch_type     = "FARGATE"

  network_configuration {
    security_groups = ["${aws_security_group.document_repository_ecs_tasks.id}"]
    subnets         = ["${aws_subnet.private.*.id}"]
  }

  load_balancer {
    target_group_arn = "${aws_alb_target_group.document_repository_target_group.id}"
    container_name   = "${var.document_repository_app_name}"
    container_port   = "${var.document_repository_image_port}"
  }

  depends_on = [
    "aws_alb_listener.app",
  ]
}

# Traffic to the ECS Cluster should only come from the ALB
resource "aws_security_group" "document_repository_ecs_tasks" {
  name        = "${var.document_repository_app_name}_ecs_tasks"
  description = "allow inbound access from the ALB only"
  vpc_id      = "${aws_vpc.main.id}"

  ingress {
    protocol        = "tcp"
    from_port       = "${var.document_repository_image_port}"
    to_port         = "${var.document_repository_image_port}"
    security_groups = ["${aws_security_group.lb.id}"]
  }

  egress {
    protocol    = "-1"
    from_port   = 0
    to_port     = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_cloudwatch_log_group" "document_repository" {
  name = "/ecs/${var.document_repository_app_name}_${var.env}"
}

resource "aws_cloudwatch_log_stream" "document_repository" {
  name           = "${var.document_repository_app_name}"
  log_group_name = "${aws_cloudwatch_log_group.document_repository.name}"
}

resource "aws_alb_listener_rule" "document_repository" {
  listener_arn = "${aws_alb_listener.app.arn}"
  priority     = 99

  action {
    type             = "forward"
    target_group_arn = "${aws_alb_target_group.document_repository_target_group.arn}"
  }

  condition {
    field  = "path-pattern"
    values = ["${local.document_repository_alb_path}"]
  }
}

resource "aws_alb_target_group" "document_repository_target_group" {
  name        = "document-repository-${var.env}"
  port        = 80
  protocol    = "HTTP"
  vpc_id      = "${aws_vpc.main.id}"
  target_type = "ip"

  health_check {
    path = "${local.document_repository_alb_health_check_url}"
  }
}
