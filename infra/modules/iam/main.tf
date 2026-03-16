data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["eks.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

locals {
  github_actions_enabled = var.github_repository != ""
  github_subjects        = [for branch in var.github_branches : "repo:${var.github_repository}:ref:refs/heads/${branch}"]
}

resource "aws_iam_role" "test1_cluster" {
  name               = var.cluster_role_name
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
  tags               = var.tags
}

resource "aws_iam_role_policy_attachment" "test1_cluster_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.test1_cluster.name
}

# Additional user-defined policies for cluster role
resource "aws_iam_role_policy_attachment" "test1_cluster_extra" {
  count      = length(var.extra_policies)
  policy_arn = var.extra_policies[count.index]
  role       = aws_iam_role.test1_cluster.name
}

# Optionally, attach more policies if needed

data "aws_iam_policy_document" "assume_role_node" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["ec2.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "test1_node" {
  name               = var.node_group_role_name
  assume_role_policy = data.aws_iam_policy_document.assume_role_node.json
  tags               = var.tags
}

resource "aws_iam_role_policy_attachment" "test1_node_policy1" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
  role       = aws_iam_role.test1_node.name
}

resource "aws_iam_role_policy_attachment" "test1_node_policy2" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
  role       = aws_iam_role.test1_node.name
}

resource "aws_iam_role_policy_attachment" "test1_node_policy3" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  role       = aws_iam_role.test1_node.name
}

resource "aws_iam_openid_connect_provider" "github" {
  count = local.github_actions_enabled && var.create_github_oidc_provider && var.github_oidc_provider_arn == "" ? 1 : 0

  url             = "https://token.actions.githubusercontent.com"
  client_id_list  = ["sts.amazonaws.com"]
  thumbprint_list = var.github_oidc_thumbprints
  tags            = var.tags
}

data "aws_iam_policy_document" "github_actions_assume_role" {
  count = local.github_actions_enabled ? 1 : 0

  statement {
    effect = "Allow"

    principals {
      type = "Federated"
      identifiers = [
        var.github_oidc_provider_arn != "" ? var.github_oidc_provider_arn : aws_iam_openid_connect_provider.github[0].arn
      ]
    }

    actions = ["sts:AssumeRoleWithWebIdentity"]

    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }

    condition {
      test     = "StringLike"
      variable = "token.actions.githubusercontent.com:sub"
      values   = local.github_subjects
    }
  }
}

resource "aws_iam_role" "github_actions_deploy" {
  count = local.github_actions_enabled ? 1 : 0

  name               = var.github_actions_role_name
  assume_role_policy = data.aws_iam_policy_document.github_actions_assume_role[0].json
  tags               = var.tags
}

data "aws_iam_policy_document" "github_actions_permissions" {
  count = local.github_actions_enabled ? 1 : 0

  statement {
    sid    = "AllowEcrLogin"
    effect = "Allow"
    actions = [
      "ecr:GetAuthorizationToken"
    ]
    resources = ["*"]
  }

  statement {
    sid    = "AllowEcrPush"
    effect = "Allow"
    actions = [
      "ecr:BatchCheckLayerAvailability",
      "ecr:BatchGetImage",
      "ecr:CompleteLayerUpload",
      "ecr:DescribeImages",
      "ecr:GetDownloadUrlForLayer",
      "ecr:InitiateLayerUpload",
      "ecr:ListImages",
      "ecr:PutImage",
      "ecr:UploadLayerPart"
    ]
    resources = ["arn:aws:ecr:*:*:repository/${var.ecr_repository_name}"]
  }

  statement {
    sid    = "AllowEksDescribeCluster"
    effect = "Allow"
    actions = [
      "eks:DescribeCluster"
    ]
    resources = ["arn:aws:eks:*:*:cluster/${var.eks_cluster_name}"]
  }
}

resource "aws_iam_policy" "github_actions_permissions" {
  count = local.github_actions_enabled ? 1 : 0

  name   = "${var.github_actions_role_name}-policy"
  policy = data.aws_iam_policy_document.github_actions_permissions[0].json
  tags   = var.tags
}

resource "aws_iam_role_policy_attachment" "github_actions_permissions" {
  count = local.github_actions_enabled ? 1 : 0

  role       = aws_iam_role.github_actions_deploy[0].name
  policy_arn = aws_iam_policy.github_actions_permissions[0].arn
}