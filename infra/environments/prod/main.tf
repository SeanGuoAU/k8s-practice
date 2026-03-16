locals {
  all_subnets = concat(module.vpc.public_subnets, module.vpc.private_subnets)
}

module "vpc" {
  source = "../../modules/vpc"

  name               = var.vpc_name
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
  github_actions_role_name = var.github_actions_role_name
  ecr_repository_name      = var.ecr_name
  eks_cluster_name         = var.cluster_name
  tags                     = var.common_tags
}

module "eks" {
  source = "../../modules/eks"

  cluster_name        = var.cluster_name
  authentication_mode = var.eks_authentication_mode
  cluster_role_arn    = module.iam.cluster_role_arn
  node_group_name     = var.node_group_name
  node_group_role_arn = module.iam.node_group_role_arn
  subnet_ids            = local.all_subnets
  cluster_subnet_ids    = local.all_subnets
  node_group_subnet_ids = module.vpc.public_subnets
  tags                = var.common_tags
}

module "ecr" {
  source = "../../modules/ecr"

  name = var.ecr_name
  tags = var.common_tags
}

resource "aws_eks_access_entry" "github_actions" {
  count = var.github_repository != "" ? 1 : 0

  cluster_name  = module.eks.cluster_id
  principal_arn = module.iam.github_actions_role_arn
  type          = "STANDARD"

  depends_on = [module.eks, module.iam]
}

resource "aws_eks_access_policy_association" "github_actions_cluster_admin" {
  count = var.github_repository != "" && var.grant_github_actions_cluster_admin ? 1 : 0

  cluster_name  = module.eks.cluster_id
  principal_arn = module.iam.github_actions_role_arn
  policy_arn    = "arn:aws:eks::aws:cluster-access-policy/AmazonEKSClusterAdminPolicy"

  access_scope {
    type = "cluster"
  }

  depends_on = [aws_eks_access_entry.github_actions]
}