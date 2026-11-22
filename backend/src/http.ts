import type { APIGatewayProxyResultV2 } from "aws-lambda";

/** JSON response helper. CORS headers are added by API Gateway (see infra/main/api.tf). */
export const json = (statusCode: number, body: unknown): APIGatewayProxyResultV2 => ({
  statusCode,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
