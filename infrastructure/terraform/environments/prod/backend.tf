terraform {
  backend "s3" {
    # See environments/dev/backend.tf for the naming rationale — same
    # bucket, separate state key so dev and prod state can never collide.
    bucket         = "ecommerce-platform-tfstate-291761344539"
    key            = "prod/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "ecommerce-platform-tf-locks"
    encrypt        = true
  }
}
