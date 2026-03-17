region               = "ap-southeast-2"
availability_zones   = ["ap-southeast-2a", "ap-southeast-2b"]
public_subnets       = ["10.2.1.0/24", "10.2.2.0/24"]
private_subnets      = ["10.2.3.0/24", "10.2.4.0/24"]
cidr_block           = "10.2.0.0/16"
vpc_name             = "k8s-uat"
cluster_name         = "k8s-uat"
cluster_version      = "1.35"
node_group_name      = "k8s-uat"
desired_size         = 1
max_size             = 4
min_size             = 1
instance_types       = ["t3.medium"]
ecr_name             = "k8s-uat"
cluster_role_name    = "k8s-uat-cluster-role"
node_group_role_name = "k8s-uat-node-group-role"
common_tags          = { Environment = "uat" }
github_repository    = "sean/k8s-practice"
github_branches      = ["*"]
github_environments  = ["frontend-cd-approval"]
cluster_admin_principal_arns = [
	"arn:aws:iam::715227881960:user/SG-test-home"
]
