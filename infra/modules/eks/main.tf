resource "aws_eks_cluster" "test1" {
  name     = var.cluster_name
  role_arn = var.cluster_role_arn
  version  = var.cluster_version

  vpc_config {
    subnet_ids              = var.subnet_ids
    endpoint_private_access = var.endpoint_private_access
    endpoint_public_access  = var.endpoint_public_access
    public_access_cidrs     = var.public_access_cidrs
  }

  dynamic "cluster_logging" {
    for_each = length(var.enable_cluster_log_types) > 0 ? [1] : []
    content {
      enabled = true
      types   = var.enable_cluster_log_types
    }
  }

  kubernetes_network_config {
    dynamic "service_ipv4_cidr" {
      for_each = var.service_ipv4_cidr != "" ? [1] : []
      content  { service_ipv4_cidr = var.service_ipv4_cidr }
    }
    dynamic "pod_ipv4_cidr" {
      for_each = var.pod_ipv4_cidr != "" ? [1] : []
      content  { pod_ipv4_cidr = var.pod_ipv4_cidr }
    }
  }

  tags = var.tags
}

resource "aws_eks_node_group" "test1" {
  cluster_name    = aws_eks_cluster.test1.name
  node_group_name = var.node_group_name
  node_role_arn   = var.node_group_role_arn
  subnet_ids      = var.subnet_ids

  scaling_config {
    desired_size = var.desired_size
    max_size     = var.max_size
    min_size     = var.min_size
  }

  instance_types = var.instance_types

  tags = var.tags
}