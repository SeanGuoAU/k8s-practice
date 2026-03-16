variable "region" {
  description = "AWS region"
  type        = string
  default     = "ap-southeast-2"
}

variable "availability_zones" {
  description = "List of availability zones"
  type        = list(string)
}

variable "public_subnets" {
  description = "List of public subnet CIDRs"
  type        = list(string)
}

variable "private_subnets" {
  description = "List of private subnet CIDRs"
  type        = list(string)
}

variable "common_tags" {
  description = "Tags applied to all resources"
  type        = map(string)
  default     = { Environment = "prod" }
}

variable "vpc_name" {
  description = "Name of the VPC"
  type        = string
  default     = "k8s"
}

variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
  default     = "k8s"
}

variable "cluster_version" {
  description = "Kubernetes version for the EKS cluster"
  type        = string
  default     = "1.31"
}

variable "eks_authentication_mode" {
  description = "EKS auth mode required for access entry resources"
  type        = string
  default     = "API_AND_CONFIG_MAP"
}

variable "node_group_name" {
  description = "Name of the EKS node group"
  type        = string
  default     = "k8s"
}

variable "ecr_name" {
  description = "Name of the ECR repository"
  type        = string
  default     = "k8s"
}

variable "cluster_role_name" {
  description = "Name of the EKS cluster IAM role"
  type        = string
  default     = "k8s-cluster-role"
}

variable "node_group_role_name" {
  description = "Name of the EKS node group IAM role"
  type        = string
  default     = "k8s-node-group-role"
}

variable "github_repository" {
  description = "GitHub repository in owner/repo format allowed to assume the CI role"
  type        = string
  default     = ""
}

variable "github_branches" {
  description = "Git branches allowed to assume the CI role"
  type        = list(string)
  default     = ["main"]
}

variable "github_actions_role_name" {
  description = "IAM role name for GitHub Actions CI/CD"
  type        = string
  default     = "github-actions-k8s-deploy-prod"
}

variable "grant_github_actions_cluster_admin" {
  description = "Whether to grant GitHub Actions role EKS cluster-admin access"
  type        = bool
  default     = true
}

variable "cluster_admin_principal_arn" {
  description = "Optional IAM role/user ARN to grant EKS cluster-admin access for human operators"
  type        = string
  default     = ""
}
