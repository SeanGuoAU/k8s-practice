terraform {
  required_version = ">= 1.15.0"

  backend "s3" {
    bucket         = "k8s-uat-tfstate"
    key            = "uat/terraform.tfstate"
    region         = "ap-southeast-2"
    dynamodb_table = "k8s-uat-tf-lock"
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
