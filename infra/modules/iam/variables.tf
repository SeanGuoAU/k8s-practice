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

variable "extra_policies" {
  description = "List of additional IAM policy ARNs to attach to both cluster and node roles"
  type        = list(string)
  default     = []
}

variable "tags" {
  description = "Map of tags to apply to IAM resources"
  type        = map(string)
  default     = {}
}

variable "github_repository" {
  description = "GitHub repository in owner/repo format allowed to assume the CI role"
  type        = string
  default     = ""

  validation {
    condition     = var.github_repository == "" || can(regex("^[^/]+/[^/]+$", var.github_repository))
    error_message = "github_repository must use owner/repo format when set."
  }
}

variable "github_branches" {
  description = "Git branches allowed to assume the CI role"
  type        = list(string)
  default     = ["main"]
}

variable "github_oidc_thumbprints" {
  description = "Thumbprints for the GitHub Actions OIDC provider"
  type        = list(string)
  default     = ["6938fd4d98bab03faadb97b34396831e3780aea1"]
}

variable "create_github_oidc_provider" {
  description = "Whether to create the GitHub OIDC provider"
  type        = bool
  default     = true
}

variable "github_oidc_provider_arn" {
  description = "Existing GitHub OIDC provider ARN. If set, this provider will be used instead of creating one"
  type        = string
  default     = ""
}

variable "github_actions_role_name" {
  description = "Name of the IAM role for GitHub Actions CI/CD"
  type        = string
  default     = "github-actions-k8s-deploy"
}

variable "ecr_repository_name" {
  description = "ECR repository name GitHub Actions can push to"
  type        = string
  default     = ""

  validation {
    condition     = var.github_repository == "" || var.ecr_repository_name != ""
    error_message = "ecr_repository_name is required when github_repository is set."
  }
}

variable "eks_cluster_name" {
  description = "EKS cluster name GitHub Actions can target"
  type        = string
  default     = ""

  validation {
    condition     = var.github_repository == "" || var.eks_cluster_name != ""
    error_message = "eks_cluster_name is required when github_repository is set."
  }
}

variable "grant_github_actions_cluster_admin" {
  description = "Whether to grant the GitHub Actions role EKS cluster-admin access"
  type        = bool
  default     = true
}