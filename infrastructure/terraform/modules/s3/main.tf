variable "project" { type = string }
variable "environment" { type = string }

# S3 bucket names must be globally unique across ALL AWS accounts, not just
# this one. Suffixing with the account ID (itself globally unique) guarantees
# no collision with any other AWS customer's bucket, without hardcoding any
# account-specific value into the module.
data "aws_caller_identity" "current" {}

locals {
  account_id           = data.aws_caller_identity.current.account_id
  static_assets_bucket = "${var.project}-${var.environment}-static-assets-${local.account_id}"
  alb_logs_bucket      = "${var.project}-${var.environment}-alb-logs-${local.account_id}"
}

resource "aws_s3_bucket" "static_assets" {
  bucket = local.static_assets_bucket
}

resource "aws_s3_bucket_public_access_block" "static_assets" {
  bucket                  = aws_s3_bucket.static_assets.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "static_assets" {
  bucket = aws_s3_bucket.static_assets.id
  versioning_configuration { status = "Enabled" }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "static_assets" {
  bucket = aws_s3_bucket.static_assets.id
  rule {
    apply_server_side_encryption_by_default { sse_algorithm = "AES256" }
  }
}

resource "aws_s3_bucket" "alb_logs" {
  bucket = local.alb_logs_bucket
}

resource "aws_s3_bucket_public_access_block" "alb_logs" {
  bucket                  = aws_s3_bucket.alb_logs.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

output "static_assets_bucket" { value = aws_s3_bucket.static_assets.bucket }
output "static_assets_bucket_arn" { value = aws_s3_bucket.static_assets.arn }
output "alb_logs_bucket" { value = aws_s3_bucket.alb_logs.bucket }
