locals {
  all_subnets = concat(module.vpc.public_subnets, module.vpc.private_subnets)
}

module "vpc" {
  source = "../../modules/vpc"

  name               = var.vpc_name
  cidr_block         = var.cidr_block
  public_subnets     = var.public_subnets
  private_subnets    = var.private_subnets
  availability_zones = var.availability_zones
  tags               = var.common_tags
}

module "iam" {
  source = "../../modules/iam"

  cluster_role_name        = var.cluster_role_name
  node_group_role_name     = var.node_group_role_name
  github_repository        = var.github_repository
  github_branches          = var.github_branches
  github_environments      = var.github_environments
  github_actions_role_name = var.github_actions_role_name
  ecr_repository_name      = var.ecr_name
  eks_cluster_name         = var.cluster_name
  tags                     = var.common_tags
}

module "eks" {
  source = "../../modules/eks"

  cluster_name        = var.cluster_name
  cluster_version     = var.cluster_version
  authentication_mode = var.eks_authentication_mode
  cluster_role_arn    = module.iam.cluster_role_arn
  node_group_name     = var.node_group_name
  node_group_role_arn = module.iam.node_group_role_arn
  desired_size        = var.desired_size
  max_size            = var.max_size
  min_size            = var.min_size
  instance_types      = var.instance_types
  subnet_ids                         = local.all_subnets
  cluster_subnet_ids                 = local.all_subnets
  node_group_subnet_ids              = module.vpc.public_subnets
  enable_github_actions_access_entry = var.github_repository != ""
  github_actions_principal_arn       = module.iam.github_actions_role_arn
  grant_github_actions_cluster_admin = var.grant_github_actions_cluster_admin
  cluster_admin_principal_arns       = var.cluster_admin_principal_arns
  cluster_admin_principal_arn        = var.cluster_admin_principal_arn
  tags                               = var.common_tags
}

module "ecr" {
  source = "../../modules/ecr"

  name = var.ecr_name
  tags = var.common_tags
}

# ------------------------------------------------------------------ #
#  AWS Load Balancer Controller IAM Role (IRSA)                      #
# ------------------------------------------------------------------ #
data "aws_iam_policy_document" "alb_controller_assume_role" {
  statement {
    effect = "Allow"
    principals {
      type        = "Federated"
      identifiers = [module.eks.oidc_provider_arn]
    }
    actions = ["sts:AssumeRoleWithWebIdentity"]
    condition {
      test     = "StringEquals"
      variable = "${replace(module.eks.oidc_issuer, "https://", "")}:sub"
      values   = ["system:serviceaccount:kube-system:aws-load-balancer-controller"]
    }
    condition {
      test     = "StringEquals"
      variable = "${replace(module.eks.oidc_issuer, "https://", "")}:aud"
      values   = ["sts.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "alb_controller" {
  name               = "${var.cluster_name}-alb-controller"
  assume_role_policy = data.aws_iam_policy_document.alb_controller_assume_role.json
  tags               = var.common_tags
}

data "aws_iam_policy_document" "alb_controller_policy" {
  statement {
    effect = "Allow"
    actions = [
      "elbv2:AddListenerCertificates",
      "elbv2:AddTags",
      "elbv2:CreateListener",
      "elbv2:CreateLoadBalancer",
      "elbv2:CreateTargetGroup",
      "elbv2:DeleteListener",
      "elbv2:DeleteLoadBalancer",
      "elbv2:DeleteTargetGroup",
      "elbv2:DeregisterTargets",
      "elbv2:DescribeListenerCertificates",
      "elbv2:DescribeListeners",
      "elbv2:DescribeLoadBalancerAttributes",
      "elbv2:DescribeLoadBalancers",
      "elbv2:DescribeTags",
      "elbv2:DescribeTargetGroupAttributes",
      "elbv2:DescribeTargetHealth",
      "elbv2:DescribeTargetGroups",
      "elbv2:ModifyListener",
      "elbv2:ModifyLoadBalancerAttributes",
      "elbv2:ModifyTargetGroup",
      "elbv2:ModifyTargetGroupAttributes",
      "elbv2:RegisterTargets",
      "elbv2:RemoveListenerCertificates",
      "elbv2:RemoveTags"
    ]
    resources = ["*"]
  }

  statement {
    effect = "Allow"
    actions = [
      "ec2:AuthorizeSecurityGroupIngress",
      "ec2:CreateSecurityGroup",
      "ec2:CreateTags",
      "ec2:DeleteSecurityGroup",
      "ec2:DeleteTags",
      "ec2:DescribeInstanceStatus",
      "ec2:DescribeInstances",
      "ec2:DescribeNetworkInterfaces",
      "ec2:DescribeSecurityGroups",
      "ec2:DescribeTags",
      "ec2:RevokeSecurityGroupIngress"
    ]
    resources = ["*"]
  }

  statement {
    effect = "Allow"
    actions = [
      "wafv2:GetWebACL"
    ]
    resources = ["*"]
  }

  statement {
    effect = "Allow"
    actions = [
      "waf:GetWebACL"
    ]
    resources = ["*"]
  }

  statement {
    effect = "Allow"
    actions = [
      "tag:GetResources",
      "tag:TagResources"
    ]
    resources = ["*"]
  }

  statement {
    effect = "Allow"
    actions = [
      "logs:CreateLogGroup",
      "logs:CreateLogStream",
      "logs:PutLogEvents"
    ]
    resources = ["*"]
  }
}

resource "aws_iam_policy" "alb_controller" {
  name   = "${var.cluster_name}-alb-controller-policy"
  policy = data.aws_iam_policy_document.alb_controller_policy.json
  tags   = var.common_tags
}

resource "aws_iam_role_policy_attachment" "alb_controller" {
  role       = aws_iam_role.alb_controller.name
  policy_arn = aws_iam_policy.alb_controller.arn
}