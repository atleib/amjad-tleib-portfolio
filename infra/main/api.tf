# ------------------------------------------------------------------
# Serverless API: API Gateway (HTTP) -> Lambda -> DynamoDB / SES
#   POST /contact  save message + email it to me
#   POST /visits   increment the visitor counter
# ------------------------------------------------------------------

# ---------------- DynamoDB ----------------

resource "aws_dynamodb_table" "messages" {
  name         = "${local.name}-messages"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

resource "aws_dynamodb_table" "stats" {
  name         = "${local.name}-stats"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "id"

  attribute {
    name = "id"
    type = "S"
  }
}

# ---------------- SES ----------------
# Creating an email identity makes SES send a verification link to that address.
# New AWS accounts are in the SES "sandbox", where you can only email verified
# addresses. That's fine here: the site only ever emails you.

resource "aws_sesv2_email_identity" "sender" {
  email_identity = local.sender_email
}

resource "aws_sesv2_email_identity" "notify" {
  count          = var.notification_email != local.sender_email ? 1 : 0
  email_identity = var.notification_email
}

# ---------------- Lambda ----------------
# CI runs `npm run build` in backend/ first, which writes dist/*.mjs.

locals {
  functions = {
    contact = {
      env = {
        MESSAGES_TABLE = aws_dynamodb_table.messages.name
        SENDER_EMAIL   = local.sender_email
        NOTIFY_EMAIL   = var.notification_email
      }
    }
    visits = {
      env = {
        STATS_TABLE = aws_dynamodb_table.stats.name
      }
    }
  }
}

data "archive_file" "fn" {
  for_each    = local.functions
  type        = "zip"
  source_file = "${path.module}/../../backend/dist/${each.key}.mjs"
  output_path = "${path.module}/build/${each.key}.zip"
}

data "aws_iam_policy_document" "lambda_assume" {
  statement {
    actions = ["sts:AssumeRole"]
    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }
  }
}

resource "aws_iam_role" "fn" {
  for_each           = local.functions
  name               = "${local.name}-${each.key}-lambda"
  assume_role_policy = data.aws_iam_policy_document.lambda_assume.json
}

resource "aws_iam_role_policy_attachment" "fn_logs" {
  for_each   = local.functions
  role       = aws_iam_role.fn[each.key].name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Least privilege: each function can only do the one thing it needs.
data "aws_iam_policy_document" "contact" {
  statement {
    actions   = ["dynamodb:PutItem"]
    resources = [aws_dynamodb_table.messages.arn]
  }
  statement {
    actions   = ["ses:SendEmail"]
    resources = ["arn:aws:ses:${var.aws_region}:${data.aws_caller_identity.current.account_id}:identity/*"]
  }
}

data "aws_iam_policy_document" "visits" {
  statement {
    actions   = ["dynamodb:UpdateItem"]
    resources = [aws_dynamodb_table.stats.arn]
  }
}

resource "aws_iam_role_policy" "contact" {
  name   = "contact"
  role   = aws_iam_role.fn["contact"].id
  policy = data.aws_iam_policy_document.contact.json
}

resource "aws_iam_role_policy" "visits" {
  name   = "visits"
  role   = aws_iam_role.fn["visits"].id
  policy = data.aws_iam_policy_document.visits.json
}

resource "aws_cloudwatch_log_group" "fn" {
  for_each          = local.functions
  name              = "/aws/lambda/${local.name}-${each.key}"
  retention_in_days = var.log_retention_days
}

resource "aws_lambda_function" "fn" {
  for_each         = local.functions
  function_name    = "${local.name}-${each.key}"
  role             = aws_iam_role.fn[each.key].arn
  runtime          = "nodejs22.x"
  architectures    = ["arm64"]
  handler          = "${each.key}.handler"
  filename         = data.archive_file.fn[each.key].output_path
  source_code_hash = data.archive_file.fn[each.key].output_base64sha256
  memory_size      = 256
  timeout          = 10

  environment {
    variables = each.value.env
  }

  depends_on = [aws_cloudwatch_log_group.fn, aws_iam_role_policy_attachment.fn_logs]
}

# ---------------- API Gateway (HTTP API) ----------------

locals {
  site_origins = compact([
    "https://${aws_cloudfront_distribution.site.domain_name}",
    local.use_domain ? "https://${var.domain_name}" : "",
  ])
}

resource "aws_apigatewayv2_api" "api" {
  name          = "${local.name}-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = concat(local.site_origins, ["http://localhost:3000"])
    allow_methods = ["POST", "OPTIONS"]
    allow_headers = ["content-type"]
    max_age       = 3600
  }
}

resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.api.id
  name        = "$default"
  auto_deploy = true

  # Basic abuse protection for a public endpoint.
  default_route_settings {
    throttling_burst_limit = 10
    throttling_rate_limit  = 5
  }
}

resource "aws_apigatewayv2_integration" "fn" {
  for_each               = local.functions
  api_id                 = aws_apigatewayv2_api.api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.fn[each.key].invoke_arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "fn" {
  for_each  = local.functions
  api_id    = aws_apigatewayv2_api.api.id
  route_key = "POST /${each.key}"
  target    = "integrations/${aws_apigatewayv2_integration.fn[each.key].id}"
}

resource "aws_lambda_permission" "api" {
  for_each      = local.functions
  statement_id  = "AllowApiGateway"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.fn[each.key].function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.api.execution_arn}/*/*"
}
