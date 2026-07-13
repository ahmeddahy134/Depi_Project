variable "project" { type = string }
variable "environment" { type = string }
variable "alb_dns_name" { type = string }
variable "static_assets_bucket_domain" { type = string }

# Empty string (the default) means "no custom domain yet" — the distribution
# falls back to CloudFront's own default certificate and *.cloudfront.net
# domain name. Only pass a real ACM certificate ARN once Route 53/ACM are
# enabled and the certificate has actually validated (see modules/route53).
variable "acm_certificate_arn" {
  type    = string
  default = ""
}
variable "domain_aliases" {
  type    = list(string)
  default = []
}

locals {
  use_custom_domain = var.acm_certificate_arn != ""
}

resource "aws_cloudfront_distribution" "this" {
  enabled         = true
  is_ipv6_enabled = true
  # CloudFront rejects any alias unless a matching custom (non-default)
  # certificate is also configured, so aliases must stay empty until a real
  # ACM certificate exists.
  aliases = local.use_custom_domain ? var.domain_aliases : []
  comment = "${var.project}-${var.environment} CDN"

  origin {
    domain_name = var.alb_dns_name
    origin_id   = "alb-origin"
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }

  origin {
    domain_name = var.static_assets_bucket_domain
    origin_id   = "s3-static-origin"
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.this.cloudfront_access_identity_path
    }
  }

  default_cache_behavior {
    target_origin_id       = "alb-origin"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD", "OPTIONS", "PUT", "POST", "PATCH", "DELETE"]
    cached_methods          = ["GET", "HEAD"]
    forwarded_values {
      query_string = true
      headers      = ["Authorization", "Host"]
      cookies { forward = "all" }
    }
    min_ttl     = 0
    default_ttl = 0
    max_ttl     = 0
  }

  ordered_cache_behavior {
    path_pattern           = "/static/*"
    target_origin_id       = "s3-static-origin"
    viewer_protocol_policy = "redirect-to-https"
    allowed_methods        = ["GET", "HEAD"]
    cached_methods          = ["GET", "HEAD"]
    forwarded_values {
      query_string = false
      cookies { forward = "none" }
    }
    min_ttl     = 86400
    default_ttl = 604800
    max_ttl     = 31536000
  }

  restrictions {
    geo_restriction { restriction_type = "none" }
  }

  viewer_certificate {
    cloudfront_default_certificate = !local.use_custom_domain
    acm_certificate_arn            = local.use_custom_domain ? var.acm_certificate_arn : null
    ssl_support_method             = local.use_custom_domain ? "sni-only" : null
    minimum_protocol_version       = local.use_custom_domain ? "TLSv1.2_2021" : null
  }
}

resource "aws_cloudfront_origin_access_identity" "this" {
  comment = "${var.project}-${var.environment} OAI"
}

output "distribution_domain_name" { value = aws_cloudfront_distribution.this.domain_name }
output "distribution_id" { value = aws_cloudfront_distribution.this.id }
