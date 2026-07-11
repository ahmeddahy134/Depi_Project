module "vpc" {
  source                = "../../modules/vpc"
  project               = var.project
  environment           = var.environment
  vpc_cidr              = "10.0.0.0/16"
  azs                   = ["us-east-1a", "us-east-1b"]
  public_subnet_cidrs   = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnet_cidrs  = ["10.0.11.0/24", "10.0.12.0/24"]
  data_subnet_cidrs     = ["10.0.21.0/24", "10.0.22.0/24"]
}

module "eks" {
  source               = "../../modules/eks"
  cluster_name         = "${var.project}-${var.environment}-eks"
  vpc_id               = module.vpc.vpc_id
  subnet_ids           = module.vpc.private_subnet_ids
  node_instance_types  = var.node_instance_types
  node_desired_size    = 2
  node_min_size        = 2
  node_max_size        = 4
}

module "iam" {
  source            = "../../modules/iam"
  project           = var.project
  environment       = var.environment
  github_org        = var.github_org
  github_repo       = var.github_repo
  oidc_provider_arn = module.eks.oidc_provider_arn
  # The real OIDC issuer URL, not the API server endpoint.
  oidc_provider_url = replace(module.eks.cluster_oidc_issuer_url, "https://", "")
}

module "ecr" {
  source = "../../modules/ecr"
}

module "rds" {
  source                     = "../../modules/rds"
  project                    = var.project
  environment                = var.environment
  vpc_id                     = module.vpc.vpc_id
  subnet_ids                 = module.vpc.data_subnet_ids
  # Real security group ID (sg-xxxxxxxxxxxxxxxxx), not the cluster's name.
  allowed_security_group_ids = [module.eks.node_security_group_id]
  multi_az                   = false
}

module "redis" {
  source                     = "../../modules/redis"
  project                    = var.project
  environment                = var.environment
  vpc_id                     = module.vpc.vpc_id
  subnet_ids                 = module.vpc.data_subnet_ids
  allowed_security_group_ids = [module.eks.node_security_group_id]
}

module "s3" {
  source      = "../../modules/s3"
  project     = var.project
  environment = var.environment
}

# Route 53 + ACM are entirely optional. When disabled (the dev default),
# CloudFront is provisioned below using its own default certificate and no
# custom domain, and no hosted zone / certificate is created at all.
module "route53" {
  count                  = var.enable_route53 ? 1 : 0
  source                 = "../../modules/route53"
  domain_name            = var.domain_name
  cloudfront_domain_name = module.cloudfront.distribution_domain_name
  providers = {
    aws.us_east_1 = aws.us_east_1
  }
}

module "cloudfront" {
  source                      = "../../modules/cloudfront"
  project                     = var.project
  environment                 = var.environment
  alb_dns_name                = "PLACEHOLDER-set-after-alb-controller-provisions-alb"
  static_assets_bucket_domain = "${module.s3.static_assets_bucket}.s3.amazonaws.com"
  acm_certificate_arn         = var.enable_route53 ? module.route53[0].certificate_arn : ""
  domain_aliases              = var.enable_route53 ? [var.domain_name] : []
}
