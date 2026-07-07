output "eks_cluster_name" { value = module.eks.cluster_name }
output "eks_cluster_endpoint" { value = module.eks.cluster_endpoint }
output "rds_endpoint" { value = module.rds.endpoint }
output "redis_endpoint" { value = module.redis.primary_endpoint }
output "ecr_repository_urls" { value = module.ecr.repository_urls }
output "cloudfront_domain" { value = module.cloudfront.distribution_domain_name }
output "route53_name_servers" { value = module.route53.name_servers }
