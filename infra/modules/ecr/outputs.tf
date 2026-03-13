output "repository_arn" {
  description = "ARN of the ECR repository"
  value       = aws_ecr_repository.test1.arn
}

output "repository_url" {
  description = "URL of the ECR repository"
  value       = aws_ecr_repository.test1.repository_url
}

output "registry_id" {
  description = "Registry ID of the ECR repository"
  value       = aws_ecr_repository.test1.registry_id
}