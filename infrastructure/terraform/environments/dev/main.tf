module "vpc" {
  source               = "../../modules/vpc"
  project              = var.project
  environment          = var.environment
  vpc_cidr             = "10.0.0.0/16"
  azs                  = ["us-east-1a", "us-east-1b"]
  public_subnet_cidrs  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnet_cidrs = ["10.0.11.0/24", "10.0.12.0/24"]
  data_subnet_cidrs    = ["10.0.21.0/24", "10.0.22.0/24"]

  # Dev cost optimization: no NAT Gateway (~$32/mo + data charges just to sit
  # idle). The EKS node group below runs in the PUBLIC subnets instead, so
  # nodes still reach the internet (to pull images, join the cluster, etc.)
  # via the Internet Gateway at no extra cost. See modules/vpc for details.
  enable_nat_gateway = false
}

module "eks" {
  source              = "../../modules/eks"
  cluster_name        = "${var.project}-${var.environment}-eks"
  vpc_id              = module.vpc.vpc_id
  # Dev cost optimization: public subnets (no NAT Gateway needed — see the
  # vpc module above). Nodes get a public IP because these subnets have
  # map_public_ip_on_launch = true; this is fine for a graduation-project
  # dev environment but is a deliberate prod/dev tradeoff — see README.
  subnet_ids          = module.vpc.public_subnet_ids
  node_instance_types = var.node_instance_types
  associate_public_ip = true

  # Fixed at exactly 2 nodes as required for this dev environment (no
  # autoscaling range) to keep cost predictable.
  node_desired_size = 2
  node_min_size     = 2
  node_max_size     = 2
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

# ---------------------------------------------------------------------------
# Intentionally NOT deployed in dev, to stay inside Free Tier / minimize cost:
#
#   - RDS (module "rds")        -> db.t3.medium is NOT Free Tier and runs
#                                  ~$50+/mo alone, plus storage. Application
#                                  Secrets still define a DATABASE_URL key
#                                  (see k8s/base/*/secret.yaml) so services
#                                  boot without erroring; point it at a real
#                                  database only if/when you need one — e.g.
#                                  a lightweight in-cluster Postgres, or by
#                                  re-enabling this module.
#   - ElastiCache Redis (module "redis") -> same reasoning, no Free Tier.
#   - CloudFront (module "cloudfront") + Route53 (module "route53") -> not
#                                  needed for a single-account dev cluster
#                                  reachable directly via the ALB; adds cost
#                                  and requires a real domain to be useful.
#   - S3 (module "s3")           -> only existed to back CloudFront's static
#                                  assets / ALB access logs; not needed
#                                  without CloudFront in this environment.
#
# All four remain fully defined and used in environments/prod/main.tf —
# uncomment/copy them here if you need to test one specifically.
# ---------------------------------------------------------------------------
