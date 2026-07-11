terraform {
  required_version = ">= 1.7.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# Separate provider alias required for ACM certs used by CloudFront (must be us-east-1)
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
}
