terraform {
  required_version = ">= 1.14.7"

  backend "s3" {
    bucket       = "sg-test1-tfstate"
    key          = "prod/terraform.tfstate"
    region       = "ap-southeast-2"
    use_lockfile = true
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
