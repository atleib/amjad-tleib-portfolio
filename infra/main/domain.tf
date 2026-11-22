# ------------------------------------------------------------------
# Optional custom domain. Only created when var.domain_name is set.
# Requires an existing Route 53 hosted zone for that domain.
# ------------------------------------------------------------------

data "aws_route53_zone" "site" {
  count = local.use_domain ? 1 : 0
  name  = var.domain_name
}

resource "aws_acm_certificate" "site" {
  count             = local.use_domain ? 1 : 0
  provider          = aws.us_east_1
  domain_name       = var.domain_name
  validation_method = "DNS"

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_route53_record" "cert_validation" {
  for_each = local.use_domain ? {
    for o in aws_acm_certificate.site[0].domain_validation_options : o.domain_name => o
  } : {}

  zone_id         = data.aws_route53_zone.site[0].zone_id
  name            = each.value.resource_record_name
  type            = each.value.resource_record_type
  records         = [each.value.resource_record_value]
  ttl             = 60
  allow_overwrite = true
}

resource "aws_acm_certificate_validation" "site" {
  count                   = local.use_domain ? 1 : 0
  provider                = aws.us_east_1
  certificate_arn         = aws_acm_certificate.site[0].arn
  validation_record_fqdns = [for r in aws_route53_record.cert_validation : r.fqdn]
}

resource "aws_route53_record" "site" {
  for_each = local.use_domain ? toset(["A", "AAAA"]) : toset([])

  zone_id = data.aws_route53_zone.site[0].zone_id
  name    = var.domain_name
  type    = each.value

  alias {
    name                   = aws_cloudfront_distribution.site.domain_name
    zone_id                = aws_cloudfront_distribution.site.hosted_zone_id
    evaluate_target_health = false
  }
}
