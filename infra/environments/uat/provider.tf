terraform {
  required_version = ">= 1.14.7"

  backend "s3" {
    bucket         = "k8s-uat-tfstate"
    key            = "uat/terraform.tfstate"
    region         = "ap-southeast-2"
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
