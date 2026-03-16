output "cluster_role_arn" {
  description = "ARN of the EKS cluster IAM role"
  value       = aws_iam_role.test1_cluster.arn
}

output "node_group_role_arn" {
  description = "ARN of the EKS node group IAM role"
  value       = aws_iam_role.test1_node.arn
}

output "github_actions_role_arn" {
  description = "ARN of the GitHub Actions IAM role for CI/CD"
  value       = length(aws_iam_role.github_actions_deploy) > 0 ? aws_iam_role.github_actions_deploy[0].arn : null
}