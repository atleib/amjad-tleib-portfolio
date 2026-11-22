variable "aws_region" {
  description = "Region for the bucket, API, Lambda and DynamoDB."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Prefix for resource names."
  type        = string
  default     = "amjad-portfolio"
}

variable "notification_email" {
  description = "Where contact-form messages are emailed. SES sends a verification email here on first apply."
  type        = string
}

variable "sender_email" {
  description = "Address the notification email is sent from. Defaults to notification_email."
  type        = string
  default     = ""
}

variable "domain_name" {
  description = "Optional custom domain (e.g. amjadtleib.com) with a Route 53 hosted zone. Leave empty to use the CloudFront URL."
  type        = string
  default     = ""
}

variable "log_retention_days" {
  description = "How long to keep Lambda logs."
  type        = number
  default     = 14
}

locals {
  use_domain   = var.domain_name != ""
  sender_email = var.sender_email != "" ? var.sender_email : var.notification_email
  name         = var.project_name
}
