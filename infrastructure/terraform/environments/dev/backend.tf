terraform {
  backend "s3" {
    # Must match the exact bucket created during the one-time bootstrap step
    # (aws s3api create-bucket ...). This project's bootstrap created
    # "ecommerce-platform-tfstate-291761344539" (suffixed with the AWS
    # account ID for global uniqueness — see modules/s3 for the same pattern
    # applied to the alb-logs/static-assets buckets). If you bootstrapped a
    # different bucket name or are using a different AWS account, update
    # this value to match exactly — Terraform cannot create this bucket
    # itself, since the backend must already exist before init can run.
    bucket         = "ecommerce-platform-tfstate-291761344539"
    key            = "dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "ecommerce-platform-tf-locks"
    encrypt        = true
  }
}
