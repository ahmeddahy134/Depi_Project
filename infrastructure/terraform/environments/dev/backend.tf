terraform {
  backend "s3" {
    bucket         = "ecommerce-platform-tfstate"
    key            = "dev/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "ecommerce-platform-tf-locks"
    encrypt        = true
  }
}
