output "vpc_id" {
  value = "${aws_vpc.vpc.id}"
}

output "internet_gateway_id" {
  value = "${aws_internet_gateway.internet_gateway.id}"
}

output "eip_nat_id" {
  value = "${aws_eip.webserver-eip.id}"
}

output "subnet_public_id" {
  value = "${aws_subnet.subnet_public.id}"
}

output "availability_zone_name_zero" {
  value = "${data.aws_availability_zones.available.names[0]}"
}

output "web_server_ip" {
  value = "${aws_instance.web-server.private_ip}"
}

output "vpc_security_group_id" {
  value = "${aws_security_group.webserver-sg.id}"
}

output "vpc_private_subnet_id" {
  value = "${aws_subnet.subnet_private.id}"
}

output "webserver_public_ip" {
  value = "${aws_eip.webserver-eip.public_ip}"
}