variable "aws_region" {
  description = "Region for the state bucket and the main infrastructure."
  type        = string
  default     = "us-east-1"
}

variable "project_name" {
  description = "Prefix for resource names."
  type        = string
  default     = "amjad-portfolio"
}

variable "github_repo" {
  description = "GitHub repository allowed to assume the roles, as owner/name."
  type        = string
  default     = "atleib/amjad-tleib-portfolio"
}
