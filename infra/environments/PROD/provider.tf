terraform {
  required_version = ">= 1.15.0"

  backend "s3" {
    bucket         = "k8s-prod-tfstate"
    key            = "prod/terraform.tfstate"
    region         = "ap-southeast-2"
    dynamodb_table = "k8s-prod-tf-lock"
    encrypt        = true
  }

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.36.0"
    }
  }
}

provider "aws" {
  region = var.region
}
