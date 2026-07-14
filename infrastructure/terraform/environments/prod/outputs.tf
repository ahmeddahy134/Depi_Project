output "eks_cluster_name" { value = module.eks.cluster_name }
output "eks_cluster_endpoint" { value = module.eks.cluster_endpoint }
output "rds_endpoint" { value = module.rds.endpoint }
output "redis_endpoint" { value = module.redis.primary_endpoint }
output "ecr_repository_urls" { value = module.ecr.repository_urls }
output "cloudfront_domain" { value = module.cloudfront.distribution_domain_name }
output "route53_name_servers" {
  value       = var.enable_route53 ? module.route53[0].name_servers : []
  description = "Empty when enable_route53 = false."
}
output "waf_web_acl_arn" {
  value       = var.alb_arn != "" ? module.waf[0].web_acl_arn : ""
  description = "Empty until alb_arn is set on a second apply."
}
