locals {
  effective_cluster_subnet_ids    = var.cluster_subnet_ids != null ? var.cluster_subnet_ids : var.subnet_ids
  effective_node_group_subnet_ids = var.node_group_subnet_ids != null ? var.node_group_subnet_ids : var.subnet_ids
}

resource "aws_eks_cluster" "test1" {
  name     = var.cluster_name
  role_arn = var.cluster_role_arn
  version  = var.cluster_version

  access_config {
    authentication_mode = var.authentication_mode
  }

  vpc_config {
    subnet_ids              = local.effective_cluster_subnet_ids
    endpoint_private_access = var.endpoint_private_access
    endpoint_public_access  = var.endpoint_public_access
    public_access_cidrs     = var.public_access_cidrs
  }

  kubernetes_network_config {
    service_ipv4_cidr = var.service_ipv4_cidr != "" ? var.service_ipv4_cidr : null
    ip_family         = "ipv4"
  }

  tags = var.tags
}

resource "aws_eks_node_group" "test1" {
  cluster_name    = aws_eks_cluster.test1.name
  node_group_name = var.node_group_name
  node_role_arn   = var.node_group_role_arn
  subnet_ids      = local.effective_node_group_subnet_ids

  scaling_config {
    desired_size = var.desired_size
    max_size     = var.max_size
    min_size     = var.min_size
  }

  instance_types = var.instance_types

  tags = var.tags
}

# ------------------------------------------------------------------ #
#  OIDC Provider (required for IRSA)                                  #
# ------------------------------------------------------------------ #
data "tls_certificate" "eks_oidc" {
  url = aws_eks_cluster.test1.identity[0].oidc[0].issuer
}

resource "aws_iam_openid_connect_provider" "eks" {
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = [data.tls_certificate.eks_oidc.certificates[0].sha1_fingerprint]
  url             = aws_eks_cluster.test1.identity[0].oidc[0].issuer
  tags            = var.tags
}

locals {
  oidc_issuer = replace(aws_iam_openid_connect_provider.eks.url, "https://", "")
}

# ------------------------------------------------------------------ #
#  IRSA: VPC CNI                                                       #
# ------------------------------------------------------------------ #
data "aws_iam_policy_document" "vpc_cni_assume_role" {
  statement {
    effect = "Allow"
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.eks.arn]
    }
    actions = ["sts:AssumeRoleWithWebIdentity"]
    condition {
      test     = "StringEquals"
      variable = "${local.oidc_issuer}:sub"
      values   = ["system:serviceaccount:kube-system:aws-node"]
    }
    condition {
      test     = "StringEquals"
      variable = "${local.oidc_issuer}:aud"
      values   = ["sts.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "vpc_cni" {
  name               = "${var.cluster_name}-vpc-cni"
  assume_role_policy = data.aws_iam_policy_document.vpc_cni_assume_role.json
  tags               = var.tags
}

resource "aws_iam_role_policy_attachment" "vpc_cni" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.vpc_cni.name
}

# ------------------------------------------------------------------ #
#  IRSA: EBS CSI Driver                                                #
# ------------------------------------------------------------------ #
data "aws_iam_policy_document" "ebs_csi_assume_role" {
  statement {
    effect = "Allow"
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.eks.arn]
    }
    actions = ["sts:AssumeRoleWithWebIdentity"]
    condition {
      test     = "StringEquals"
      variable = "${local.oidc_issuer}:sub"
      values   = ["system:serviceaccount:kube-system:ebs-csi-controller-sa"]
    }
    condition {
      test     = "StringEquals"
      variable = "${local.oidc_issuer}:aud"
      values   = ["sts.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "ebs_csi" {
  name               = "${var.cluster_name}-ebs-csi"
  assume_role_policy = data.aws_iam_policy_document.ebs_csi_assume_role.json
  tags               = var.tags
}

resource "aws_iam_role_policy_attachment" "ebs_csi" {
  policy_arn = "arn:aws:iam::aws:policy/service-role/AmazonEBSCSIDriverPolicy"
  role       = aws_iam_role.ebs_csi.name
}

# ------------------------------------------------------------------ #
#  EKS Addons                                                          #
# ------------------------------------------------------------------ #
resource "aws_eks_addon" "vpc_cni" {
  cluster_name                = aws_eks_cluster.test1.name
  addon_name                  = "vpc-cni"
  addon_version               = var.addon_vpc_cni_version
  service_account_role_arn    = aws_iam_role.vpc_cni.arn
  resolve_conflicts_on_create = "OVERWRITE"
  resolve_conflicts_on_update = "OVERWRITE"
  tags                        = var.tags

  depends_on = [aws_eks_node_group.test1]
}

resource "aws_eks_addon" "coredns" {
  cluster_name                = aws_eks_cluster.test1.name
  addon_name                  = "coredns"
  addon_version               = var.addon_coredns_version
  resolve_conflicts_on_create = "OVERWRITE"
  resolve_conflicts_on_update = "OVERWRITE"
  tags                        = var.tags

  depends_on = [aws_eks_node_group.test1]
}

resource "aws_eks_addon" "kube_proxy" {
  cluster_name                = aws_eks_cluster.test1.name
  addon_name                  = "kube-proxy"
  addon_version               = var.addon_kube_proxy_version
  resolve_conflicts_on_create = "OVERWRITE"
  resolve_conflicts_on_update = "OVERWRITE"
  tags                        = var.tags

  depends_on = [aws_eks_node_group.test1]
}

resource "aws_eks_addon" "ebs_csi" {
  cluster_name                = aws_eks_cluster.test1.name
  addon_name                  = "aws-ebs-csi-driver"
  addon_version               = var.addon_ebs_csi_version
  service_account_role_arn    = aws_iam_role.ebs_csi.arn
  resolve_conflicts_on_create = "OVERWRITE"
  resolve_conflicts_on_update = "OVERWRITE"
  tags                        = var.tags

  depends_on = [aws_eks_node_group.test1]
}