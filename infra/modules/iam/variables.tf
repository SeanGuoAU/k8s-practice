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