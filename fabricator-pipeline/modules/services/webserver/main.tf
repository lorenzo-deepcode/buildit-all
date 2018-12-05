data "aws_availability_zones" "available" {}

  resource "aws_vpc" "vpc" {
    cidr_block           = "${var.vpc_cidr_block}"
    enable_dns_hostnames = true
    enable_dns_support   = true
    instance_tenancy     = "default"

    tags {
      "Name"        = "${var.cluster_name}-${var.environment}-vpc"
      "Environment" = "${var.environment}"
    }
  }

  resource "aws_internet_gateway" "internet_gateway" {
    vpc_id = "${aws_vpc.vpc.id}"

    tags {
      "Name"        = "${var.cluster_name}-${var.environment}-internet-gateway"
      "Environment" = "${var.environment}"
    }
  }

  resource "aws_subnet" "subnet_public" {
    vpc_id                  = "${aws_vpc.vpc.id}"
    cidr_block              = "${var.public_subnet_cidr_block}"
    availability_zone       = "${data.aws_availability_zones.available.names[0]}"
    map_public_ip_on_launch = true

    tags {
      "Name"        = "${var.cluster_name}-${var.environment}-subnet-public"
      "Environment" = "${var.environment}"
    }
  }

  resource "aws_route_table" "custom_route_table" {
    vpc_id = "${aws_vpc.vpc.id}"

    tags {
      "Name"        = "${var.cluster_name}-${var.environment}-custom-route-table"
      "Environment" = "${var.environment}"
    }
  }

  resource "aws_route" "internet_access" {
    route_table_id         = "${aws_route_table.custom_route_table.id}"
    destination_cidr_block = "0.0.0.0/0"
    gateway_id             = "${aws_internet_gateway.internet_gateway.id}"
  }

  # Associate public subnet to custom route table
  resource "aws_route_table_association" "subnet_public_association" {
    subnet_id      = "${aws_subnet.subnet_public.id}"
    route_table_id = "${aws_route_table.custom_route_table.id}"
  }

  resource "aws_subnet" "subnet_private" {
    vpc_id                  = "${aws_vpc.vpc.id}"
    cidr_block              = "${var.private_subnet_cidr_block}"
    availability_zone       = "${data.aws_availability_zones.available.names[0]}"

    tags {
      "Name"        = "${var.cluster_name}-${var.environment}-subnet-private"
      "Environment" = "${var.environment}"
    }
  }

  resource "aws_route_table" "private_route_table" {
    vpc_id = "${aws_vpc.vpc.id}"

    tags {
      "Name"        = "${var.cluster_name}-${var.environment}-private-route-table"
      "Environment" = "${var.environment}"
    }
  }

  # Associate private subnet to private route table
  resource "aws_route_table_association" "subnet_private_association" {
    subnet_id      = "${aws_subnet.subnet_private.id}"
    route_table_id = "${aws_route_table.private_route_table.id}"
  }

  resource "aws_eip" "gateway_eip" {
    vpc      = true
    depends_on = ["aws_internet_gateway.internet_gateway"]
  }

  resource "aws_nat_gateway" "nat-gateway" {
    subnet_id = "${aws_subnet.subnet_public.id}"
    allocation_id = "${aws_eip.gateway_eip.id}"
  }

  resource "aws_route" "nat-gateway-access" {
    route_table_id         = "${aws_route_table.private_route_table.id}"
    destination_cidr_block = "0.0.0.0/0"
    gateway_id             = "${aws_nat_gateway.nat-gateway.id}"
  }

  resource "aws_security_group" "webserver-sg" {
    description = "Security group for the web server"
    name        = "${var.cluster_name}-${var.environment}-webserver-sg"
    vpc_id      = "${aws_vpc.vpc.id}"

    lifecycle {
      create_before_destroy = true
    }

    tags {
      "Name"        = "${var.cluster_name}-${var.environment}-webserver-sg"
      "Environment" = "${var.environment}"
    }
  }

  resource "aws_security_group_rule" "allow_http_inbound" {
    description       = "Security group ingress rule to allow all inbound traffic to the web server on port 80."
    type              = "ingress"
    from_port         = 80
    to_port           = 80
    protocol          = "tcp"
    cidr_blocks       = ["0.0.0.0/0"]

    security_group_id = "${aws_security_group.webserver-sg.id}"
  }

  resource "aws_security_group_rule" "allow_ssh_inbound" {
    description       = "Security group ingress rule to allow a specific IP inbound traffic to the web server on port 22."
    type              = "ingress"
    from_port         = 22
    to_port           = 22
    protocol          = "tcp"
    cidr_blocks       = ["${var.ssh_cidr_block}"]

    security_group_id = "${aws_security_group.webserver-sg.id}"
  }

  resource "aws_security_group_rule" "allow_codebuild_ssh_inbound" {
    description       = "Security group ingress rule to allow a CodeBuild container IPs inbound traffic to the web server on port 22."
    type              = "ingress"
    from_port         = 22
    to_port           = 22
    protocol          = "tcp"
    cidr_blocks       = ["${var.private_subnet_cidr_block}"]

    security_group_id = "${aws_security_group.webserver-sg.id}"
  }

  resource "aws_security_group_rule" "allow_http_outbound" {
    description       = "Security group egress rule to allow all outbound traffic from the web server."
    type              = "egress"
    from_port         = 0
    to_port           = 0
    protocol          = "-1"
    cidr_blocks       = ["0.0.0.0/0"]

    security_group_id = "${aws_security_group.webserver-sg.id}"
  }

  resource "aws_instance" "web-server" {
    ami                    = "${lookup(var.region_to_ami, var.region)}"
    instance_type          = "${var.instance_type}"
    vpc_security_group_ids = ["${aws_security_group.webserver-sg.id}"]
    subnet_id              = "${aws_subnet.subnet_public.id}"
    key_name               = "${var.key_pair_name}"

    tags {
      "Name"        = "${var.cluster_name}-${var.environment}-webserver-sg"
      "Environment" = "${var.environment}"
    }
  }

  resource "aws_eip" "webserver-eip" {
    vpc        = true
    depends_on = ["aws_internet_gateway.internet_gateway"]
    instance   = "${aws_instance.web-server.id}"

    tags {
      "Name"        = "${var.cluster_name}-${var.environment}-webserver-eip"
      "Environment" = "${var.environment}"
    }
  }
