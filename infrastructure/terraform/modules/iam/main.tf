variable "project" { type = string }
variable "environment" { type = string }
variable "github_org" { type = string }
variable "github_repo" { type = string }
variable "oidc_provider_arn" { type = string }

# Must be the EKS cluster's real OIDC ISSUER URL with the "https://" prefix
# stripped (e.g. "oidc.eks.us-east-1.amazonaws.com/id/XXXXXXXX") — this is
# module.eks.cluster_oidc_issuer_url from the eks module, NOT its API server
# cluster_endpoint. Passing the wrong URL silently breaks IRSA trust matching.
variable "oidc_provider_url" { type = string }

data "aws_iam_policy_document" "github_actions_assume" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect  = "Allow"
    principals {
      type        = "Federated"
      identifiers = ["arn:aws:iam::${data.aws_caller_identity.current.account_id}:oidc-provider/token.actions.githubusercontent.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = ["repo:${var.github_org}/${var.github_repo}:*"]
    }
  }
}

data "aws_caller_identity" "current" {}

resource "aws_iam_role" "github_actions" {
  name               = "${var.project}-${var.environment}-github-actions"
  assume_role_policy = data.aws_iam_policy_document.github_actions_assume.json
}

# Least-privilege: scope down in production; broad policy here for demo/portfolio purposes.
resource "aws_iam_role_policy_attachment" "github_actions_ecr" {
  role       = aws_iam_role.github_actions.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryPowerUser"
}

resource "aws_iam_role_policy_attachment" "github_actions_eks" {
  role       = aws_iam_role.github_actions.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

# IRSA role for the AWS Load Balancer Controller
data "aws_iam_policy_document" "lb_controller_assume" {
  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    effect  = "Allow"
    principals {
      type        = "Federated"
      identifiers = [var.oidc_provider_arn]
    }
    condition {
      test     = "StringEquals"
      variable = "${var.oidc_provider_url}:sub"
      values   = ["system:serviceaccount:kube-system:aws-load-balancer-controller"]
    }
  }
}

resource "aws_iam_role" "lb_controller" {
  name               = "${var.project}-${var.environment}-lb-controller"
  assume_role_policy = data.aws_iam_policy_document.lb_controller_assume.json
}

output "github_actions_role_arn" { value = aws_iam_role.github_actions.arn }
output "lb_controller_role_arn" { value = aws_iam_role.lb_controller.arn }
