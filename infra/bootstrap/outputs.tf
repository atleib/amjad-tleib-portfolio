# Copy these into GitHub: repo Settings > Secrets and variables > Actions > Variables.

output "TF_STATE_BUCKET" {
  value = aws_s3_bucket.state.bucket
}

output "AWS_PLAN_ROLE_ARN" {
  value = aws_iam_role.plan.arn
}

output "AWS_DEPLOY_ROLE_ARN" {
  value = aws_iam_role.deploy.arn
}

output "AWS_REGION" {
  value = var.aws_region
}
