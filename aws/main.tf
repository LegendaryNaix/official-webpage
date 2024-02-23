terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "5.37.0"
    }
  }

  backend "s3" {
    bucket         = "royals-tfstate-storage"
    key            = "terraform/terraform.tfstate"
    region         = "ap-northeast-2"
    encrypt        = true
    dynamodb_table = "royals-tfstate-lock"
  }
}

module "royals" {
  source = "./royals"

  region            = var.region
  vercel_origin_dns = var.vercel_origin_dns
  postgres_password = var.postgres_password
  postgres_username = var.postgres_username
  jwt_secret        = var.jwt_secret
}
