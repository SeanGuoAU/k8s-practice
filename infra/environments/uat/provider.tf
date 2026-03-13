terraform {
  required_version = ">= 1.15.0"

  backend "s3" {
    bucket         = "${var.vpc_name}-tfstate"
    key            = "uat/terraform.tfstate"
    region         = var.region
    dynamodb_table = "${var.vpc_name}-tf-lock"
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
