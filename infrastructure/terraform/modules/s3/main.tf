variable "project" { type = string }
variable "environment" { type = string }

resource "aws_s3_bucket" "static_assets" {
  bucket = "${var.project}-${var.environment}-static-assets"
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
  bucket = "${var.project}-${var.environment}-alb-logs"
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
