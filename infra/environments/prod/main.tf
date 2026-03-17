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