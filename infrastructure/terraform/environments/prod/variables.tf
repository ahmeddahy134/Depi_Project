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
  default = "prod"
}

# Unlike dev, production is expected to have a real domain before its first
# apply — but the flag still defaults to false so a fresh prod environment
# can be stood up and validated end-to-end before DNS cutover.
variable "enable_route53" {
  type    = bool
  default = false
}

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

variable "node_instance_types" {
  type    = list(string)
  default = ["t3.medium"]
}
