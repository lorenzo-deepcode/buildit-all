output "alb_hostname" {
  value = "${aws_alb.main.dns_name}"
}

output "esEndpoint" {
  value = "https://${aws_elasticsearch_domain.es.endpoint}"
}
