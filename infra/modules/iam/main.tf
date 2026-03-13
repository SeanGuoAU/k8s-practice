terraform {
  required_version = ">= 1.0"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 4.0"
    }
  }
}

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