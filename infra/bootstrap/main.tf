# ------------------------------------------------------------------
# One-time setup, run locally with your own AWS credentials:
#   - S3 bucket for Terraform state (used by infra/main)
#   - GitHub OIDC provider
#   - IAM roles that GitHub Actions assumes (no AWS keys in GitHub)
# ------------------------------------------------------------------

terraform {
  required_version = ">= 1.10"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = { Project = var.project_name, ManagedBy = "terraform-bootstrap" }
  }
}

data "aws_caller_identity" "current" {}

locals {
  state_bucket = "${var.project_name}-tfstate-${data.aws_caller_identity.current.account_id}"
}

# ---------------- Terraform state bucket ----------------

resource "aws_s3_bucket" "state" {
  bucket = local.state_bucket
  lifecycle {
    prevent_destroy = true
  }
}

resource "aws_s3_bucket_versioning" "state" {
  bucket = aws_s3_bucket.state.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "state" {
  bucket = aws_s3_bucket.state.id
  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "state" {
  bucket                  = aws_s3_bucket.state.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# ---------------- GitHub OIDC ----------------

resource "aws_iam_openid_connect_provider" "github" {
  url            = "https://token.actions.githubusercontent.com"
  client_id_list = ["sts.amazonaws.com"]
}

# Who may assume a role: only this repo, and only from the given GitHub "subject".
data "aws_iam_policy_document" "github_trust" {
  for_each = {
    plan   = "repo:${var.github_repo}:pull_request"
    deploy = "repo:${var.github_repo}:ref:refs/heads/main"
  }

  statement {
    actions = ["sts:AssumeRoleWithWebIdentity"]
    principals {
      type        = "Federated"
      identifiers = [aws_iam_openid_connect_provider.github.arn]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:aud"
      values   = ["sts.amazonaws.com"]
    }
    condition {
      test     = "StringEquals"
      variable = "token.actions.githubusercontent.com:sub"
      values   = [each.value]
    }
  }
}

# Read/write access to the state bucket (plan needs to write the lock file).
data "aws_iam_policy_document" "state_access" {
  statement {
    actions   = ["s3:ListBucket"]
    resources = [aws_s3_bucket.state.arn]
  }
  statement {
    actions   = ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"]
    resources = ["${aws_s3_bucket.state.arn}/*"]
  }
}

# --- Plan role: pull requests. Read-only, so a PR can never change anything. ---

resource "aws_iam_role" "plan" {
  name               = "${var.project_name}-github-plan"
  assume_role_policy = data.aws_iam_policy_document.github_trust["plan"].json
}

resource "aws_iam_role_policy_attachment" "plan_readonly" {
  role       = aws_iam_role.plan.name
  policy_arn = "arn:aws:iam::aws:policy/ReadOnlyAccess"
}

resource "aws_iam_role_policy" "plan_state" {
  name   = "terraform-state"
  role   = aws_iam_role.plan.id
  policy = data.aws_iam_policy_document.state_access.json
}

# --- Deploy role: pushes to main. Runs terraform apply and uploads the site. ---
# Terraform has to create IAM roles, Lambda, CloudFront, etc., so this role is broad.
# It can only be assumed from the main branch of this repo. Tighten it later if you like.

resource "aws_iam_role" "deploy" {
  name               = "${var.project_name}-github-deploy"
  assume_role_policy = data.aws_iam_policy_document.github_trust["deploy"].json
}

resource "aws_iam_role_policy_attachment" "deploy_admin" {
  role       = aws_iam_role.deploy.name
  policy_arn = "arn:aws:iam::aws:policy/AdministratorAccess"
}
