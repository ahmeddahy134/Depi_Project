variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "project" {
  type    = string
  default = "ecom"
}

variable "environment" {
  type    = string
  default = "dev"
}

# Route 53 / ACM are OFF by default for dev, since dev environments typically
# don't have a real, delegatable domain yet. Set to true and provide a real
# domain_name you control once one exists. Leaving this false is what lets
# terraform apply succeed with no domain at all (CloudFront falls back to its
# default *.cloudfront.net certificate — see modules/cloudfront).
variable "enable_route53" {
  type    = bool
  default = false
}

# Only used when enable_route53 = true. Must be a real domain you control —
# IANA-reserved domains such as example.com are rejected by Route 53 (see
# modules/route53's validation block).
variable "domain_name" {
  type    = string
  default = ""
}

variable "github_org" {
  type    = string
  default = "your-org"
}

variable "github_repo" {
  type    = string
  default = "ecommerce-platform"
}

# Free-Tier-eligible by default. Override only after confirming the target
# AWS account's service quotas actually permit a larger instance type.
variable "node_instance_types" {
  type    = list(string)
  default = ["t3.micro"]
}
