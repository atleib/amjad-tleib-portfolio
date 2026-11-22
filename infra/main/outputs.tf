output "site_url" {
  description = "Public URL of the site."
  value       = local.use_domain ? "https://${var.domain_name}" : "https://${aws_cloudfront_distribution.site.domain_name}"
}

output "site_bucket" {
  description = "S3 bucket the built site is uploaded to."
  value       = aws_s3_bucket.site.bucket
}

output "distribution_id" {
  description = "CloudFront distribution ID (for cache invalidation)."
  value       = aws_cloudfront_distribution.site.id
}

output "api_url" {
  description = "Base URL of the API. Used as NEXT_PUBLIC_API_URL."
  value       = aws_apigatewayv2_api.api.api_endpoint
}
