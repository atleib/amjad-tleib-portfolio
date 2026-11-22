terraform {
  required_version = ">= 1.10"

  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.7"
    }
  }

  # Settings are passed at init time (see README and the GitHub workflow):
  #   terraform init -backend-config="bucket=<TF_STATE_BUCKET>" \
  #                  -backend-config="key=portfolio/main.tfstate" \
  #                  -backend-config="region=us-east-1" \
  #                  -backend-config="use_lockfile=true"
  backend "s3" {}
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = { Project = var.project_name, ManagedBy = "terraform" }
  }
}

# CloudFront only accepts ACM certificates from us-east-1.
provider "aws" {
  alias  = "us_east_1"
  region = "us-east-1"
  default_tags {
    tags = { Project = var.project_name, ManagedBy = "terraform" }
  }
}

data "aws_caller_identity" "current" {}
