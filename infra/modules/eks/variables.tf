variable "cluster_name" {
  description = "Name of the EKS cluster"
  type        = string
  default     = "k8s"
}

variable "cluster_role_arn" {
  description = "ARN of the IAM role for the EKS cluster"
  type        = string
}

variable "cluster_version" {
  description = "Kubernetes version for the EKS cluster"
  type        = string
  default     = "1.27"
}

variable "subnet_ids" {
  description = "List of subnet IDs for the EKS cluster"
  type        = list(string)
}

variable "cluster_subnet_ids" {
  description = "Optional list of subnet IDs for the EKS control plane ENIs (defaults to subnet_ids)"
  type        = list(string)
  default     = null
}

variable "node_group_subnet_ids" {
  description = "Optional list of subnet IDs for the EKS managed node group (defaults to subnet_ids)"
  type        = list(string)
  default     = null
}

variable "endpoint_private_access" {
  description = "Whether the Amazon EKS private API server endpoint is enabled"
  type        = bool
  default     = false
}

variable "endpoint_public_access" {
  description = "Whether the Amazon EKS public API server endpoint is enabled"
  type        = bool
  default     = true
}

variable "public_access_cidrs" {
  description = "List of CIDR blocks that can access the Amazon EKS public API server endpoint"
  type        = list(string)
  default     = ["0.0.0.0/0"]
}

variable "authentication_mode" {
  description = "Cluster authentication mode. Required to use aws_eks_access_entry resources"
  type        = string
  default     = "API_AND_CONFIG_MAP"

  validation {
    condition     = contains(["CONFIG_MAP", "API", "API_AND_CONFIG_MAP"], var.authentication_mode)
    error_message = "authentication_mode must be one of CONFIG_MAP, API, or API_AND_CONFIG_MAP."
  }
}

variable "enable_cluster_log_types" {
  description = "Types of cluster control plane logs to enable"
  type        = list(string)
  default     = []
}

variable "service_ipv4_cidr" {
  description = "CIDR block to reserve for service IPs"
  type        = string
  default     = ""
}

variable "pod_ipv4_cidr" {
  description = "CIDR block to reserve for pod IPs"
  type        = string
  default     = ""
}

variable "node_group_name" {
  description = "Name of the EKS node group"
  type        = string
  default     = "k8s"
}

variable "node_group_role_arn" {
  description = "ARN of the IAM role for the EKS node group"
  type        = string
}

variable "desired_size" {
  description = "Desired number of worker nodes"
  type        = number
  default     = 2
}

variable "max_size" {
  description = "Maximum number of worker nodes"
  type        = number
  default     = 4
}

variable "min_size" {
  description = "Minimum number of worker nodes"
  type        = number
  default     = 1
}

variable "instance_types" {
  description = "List of instance types for the node group"
  type        = list(string)
  default     = ["t3.medium"]
}

variable "tags" {
  description = "A map of tags to add to all resources"
  type        = map(string)
  default     = {}
}

# ------------------------------------------------------------------ #
#  Addon versions — null means use the AWS-recommended default        #
# ------------------------------------------------------------------ #
variable "addon_vpc_cni_version" {
  description = "Version of the vpc-cni addon (null = use cluster default)"
  type        = string
  default     = null
}

variable "addon_coredns_version" {
  description = "Version of the coredns addon (null = use cluster default)"
  type        = string
  default     = null
}

variable "addon_kube_proxy_version" {
  description = "Version of the kube-proxy addon (null = use cluster default)"
  type        = string
  default     = null
}

variable "addon_ebs_csi_version" {
  description = "Version of the aws-ebs-csi-driver addon (null = use cluster default)"
  type        = string
  default     = null
}