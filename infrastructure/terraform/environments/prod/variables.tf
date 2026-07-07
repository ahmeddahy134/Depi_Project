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

variable "domain_name" {
  type    = string
  default = "shop.example.com"
}

variable "github_org" {
  type    = string
  default = "your-org"
}

variable "github_repo" {
  type    = string
  default = "ecommerce-platform"
}
