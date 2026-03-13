output "cluster_id" {
  description = "The name/id of the EKS cluster"
  value       = aws_eks_cluster.test1.id
}

output "cluster_arn" {
  description = "The Amazon Resource Name (ARN) of the cluster"
  value       = aws_eks_cluster.test1.arn
}

output "cluster_endpoint" {
  description = "The endpoint for your Kubernetes API server"
  value       = aws_eks_cluster.test1.endpoint
}

output "cluster_version" {
  description = "The Kubernetes server version for the cluster"
  value       = aws_eks_cluster.test1.version
}

output "cluster_certificate_authority_data" {
  description = "Base64 encoded certificate data required to communicate with the cluster"
  value       = aws_eks_cluster.test1.certificate_authority[0].data
}

output "cluster_log_types" {
  description = "Enabled control plane log types"
  value       = var.enable_cluster_log_types
}

output "service_ipv4_cidr" {
  description = "Service CIDR configured on cluster"
  value       = var.service_ipv4_cidr
}

output "pod_ipv4_cidr" {
  description = "Pod CIDR configured on cluster"
  value       = var.pod_ipv4_cidr
}

output "node_group_id" {
  description = "EKS Node Group ID"
  value       = aws_eks_node_group.test1.id
}

output "node_group_arn" {
  description = "EKS Node Group ARN"
  value       = aws_eks_node_group.test1.arn
}