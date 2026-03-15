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

variable "cidr_block" {
  description = "The CIDR block for the VPC"
  type        = string
  default     = "10.0.0.0/16"
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

variable "node_group_name" {
  description = "Name of the EKS node group"
  type        = string
  default     = "k8s"
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

variable "common_tags" {
  description = "Tags applied to all resources"
  type        = map(string)
  default     = { Environment = "uat" }
}
