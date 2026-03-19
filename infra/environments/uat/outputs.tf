output "vpc_id" {
  value = module.vpc.vpc_id
}

output "eks_cluster_endpoint" {
  value = module.eks.cluster_endpoint
}

output "ecr_repository_url" {
  value = module.ecr.repository_url
}

output "github_actions_role_arn" {
  value = module.iam.github_actions_role_arn
}

output "alb_controller_role_arn" {
  value = aws_iam_role.alb_controller.arn
}

output "eks_oidc_issuer" {
  value = module.eks.oidc_issuer
}
