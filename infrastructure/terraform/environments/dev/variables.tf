variable "aws_region" {
  type    = string
  default = "us-east-1"
}

variable "project" {
  type    = string
  default = "ecom"
}

variable "environment" {
  type    = string
  default = "dev"
}

variable "github_org" {
  type    = string
  default = "your-org"
}

variable "github_repo" {
  type    = string
  default = "ecommerce-platform"
}

# t3.micro (the Free-Tier-eligible default) was tried first and failed:
# AWS's VPC CNI hands out one pod IP per ENI slot, and t3.micro only supports
# 2 ENIs x 2 IPv4 each = 4 pods per node total (2 of which are already used by
# aws-node/kube-proxy system pods). Real symptom seen in this project's
# pod_desc.txt: "0/2 nodes are available: 2 Too many pods" and
# "failed to assign an IP address to container". t3.small raises that ceiling
# to 11 pods/node (22 across both nodes), comfortably fitting the 8
# single-replica microservices plus system pods. t3.small is NOT covered by
# the AWS Free Tier (~$0.0208/hr each, ~$30/mo for both nodes combined) — this
# is a deliberate "must actually schedule and run" tradeoff over "strictly
# free". Fall back to t2.micro only if t3.small is unavailable in your
# account/region; note t2.micro has the same ~4-pod ceiling as t3.micro, so
# expect the same scheduling failures unless you also reduce the number of
# services or replicas further.
variable "node_instance_types" {
  type    = list(string)
  default = ["t3.small"]
}
