locals {
  all_subnets = concat(var.public_subnets, var.private_subnets)
}

module "vpc" {
  source = "../../modules/vpc"

  name               = var.vpc_name
  public_subnets     = var.public_subnets
  private_subnets    = var.private_subnets
  availability_zones = var.availability_zones
  environment        = "prod"
  tags               = var.common_tags
}

module "iam" {
  source = "../../modules/iam"

  cluster_role_name    = var.cluster_role_name
  node_group_role_name = var.node_group_role_name
}

module "eks" {
  source = "../../modules/eks"

  cluster_name        = var.cluster_name
  cluster_role_arn    = module.iam.cluster_role_arn
  node_group_name     = var.node_group_name
  node_group_role_arn = module.iam.node_group_role_arn
  subnet_ids          = local.all_subnets
  tags                = var.common_tags
}

module "ecr" {
  source = "../../modules/ecr"

  name = var.ecr_name
  tags = var.common_tags
}
