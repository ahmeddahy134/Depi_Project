variable "cluster_name" { type = string }
variable "vpc_id" { type = string }
variable "subnet_ids" { type = list(string) }

# List (not a single string) so a fallback/spread of Free-Tier-eligible instance
# types can be supplied without changing the interface later. Default is the
# smallest generally-available Free Tier-eligible type; override per environment
# via node_instance_types if the account's Free Tier / service-quota limits allow
# a larger type.
variable "node_instance_types" {
  type    = list(string)
  default = ["t3.micro"]
}

variable "node_disk_size" {
  type    = number
  default = 20
}

variable "node_desired_size" {
  type    = number
  default = 2
}
variable "node_min_size" {
  type    = number
  default = 2
}
variable "node_max_size" {
  type    = number
  default = 5
}
variable "cluster_version" {
  type    = string
  default = "1.30"
}

module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = var.cluster_name
  cluster_version = var.cluster_version

  vpc_id     = var.vpc_id
  subnet_ids = var.subnet_ids

  cluster_endpoint_public_access = true

  eks_managed_node_groups = {
    default = {
      instance_types = var.node_instance_types
      disk_size      = var.node_disk_size
      min_size       = var.node_min_size
      max_size       = var.node_max_size
      desired_size   = var.node_desired_size
      capacity_type  = "ON_DEMAND"
    }
  }

  enable_irsa = true

  tags = {
    Project = "ecommerce-platform"
  }
}

output "cluster_name" { value = module.eks.cluster_name }
output "cluster_endpoint" { value = module.eks.cluster_endpoint }
output "cluster_certificate_authority_data" { value = module.eks.cluster_certificate_authority_data }
output "oidc_provider_arn" { value = module.eks.oidc_provider_arn }

# The real OIDC issuer URL (https://oidc.eks.<region>.amazonaws.com/id/<id>) —
# NOT the same as cluster_endpoint. Required for correctly scoping IRSA trust
# policy conditions (see modules/iam).
output "cluster_oidc_issuer_url" { value = module.eks.cluster_oidc_issuer_url }

# Real AWS security group IDs (sg-xxxxxxxxxxxxxxxxx), safe to pass into any
# module's allowed_security_group_ids input (e.g. rds, redis).
output "node_security_group_id" { value = module.eks.node_security_group_id }
output "cluster_security_group_id" { value = module.eks.cluster_security_group_id }
output "cluster_primary_security_group_id" { value = module.eks.cluster_primary_security_group_id }
