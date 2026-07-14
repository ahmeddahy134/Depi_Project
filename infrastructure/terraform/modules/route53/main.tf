terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      configuration_aliases = [aws.us_east_1]
    }
  }
}

variable "domain_name" {
  type = string
  validation {
    condition     = var.domain_name != "" && !can(regex("(^|\\.)example\\.(com|net|org)$", var.domain_name))
    error_message = "domain_name must be a real, delegatable domain you control. IANA-reserved domains such as example.com (and its subdomains) cannot be used with Route 53 — AWS rejects them with InvalidDomainName."
  }
}
variable "cloudfront_domain_name" { type = string }
variable "cloudfront_zone_id" {
  type    = string
  default = "Z2FDTNDATAQYW2" # fixed CloudFront hosted zone ID
}

resource "aws_route53_zone" "this" {
  name = var.domain_name
}

resource "aws_acm_certificate" "this" {
  provider                  = aws.us_east_1
  domain_name                = var.domain_name
  subject_alternative_names = ["*.${var.domain_name}"]
  validation_method          = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "cert_validation" {
  for_each = {
    for dvo in aws_acm_certificate.this.domain_validation_options : dvo.domain_name => {
      name  = dvo.resource_record_name
      type  = dvo.resource_record_type
      value = dvo.resource_record_value
    }
  }
  zone_id = aws_route53_zone.this.zone_id
  name    = each.value.name
  type    = each.value.type
  ttl     = 300
  records = [each.value.value]
}

# Forces Terraform to wait until the certificate has actually reached the
# ISSUED state (backed by the real validation records above) before anything
# downstream (e.g. the cloudfront module) is allowed to reference the
# certificate ARN. Without this, a certificate that never validates (for
# example because the hosted zone's real-world NS delegation was never
# completed) causes the *next* resource that references it to fail instead
# of failing here with a clear, attributable error.
resource "aws_acm_certificate_validation" "this" {
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.this.arn
  validation_record_fqdns = [for r in aws_route53_record.cert_validation : r.fqdn]

  timeouts {
    create = "20m"
  }
}

resource "aws_route53_record" "root" {
  zone_id = aws_route53_zone.this.zone_id
  name    = var.domain_name
  type    = "A"
  alias {
    name                   = var.cloudfront_domain_name
    zone_id                = var.cloudfront_zone_id
    evaluate_target_health = false
  }
}

output "zone_id" { value = aws_route53_zone.this.zone_id }
# Only resolves once validation has actually completed successfully.
output "certificate_arn" { value = aws_acm_certificate_validation.this.certificate_arn }
output "name_servers" { value = aws_route53_zone.this.name_servers }
