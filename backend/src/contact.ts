import { randomUUID } from "node:crypto";
import type { APIGatewayProxyEventV2, APIGatewayProxyResultV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import { SESv2Client, SendEmailCommand } from "@aws-sdk/client-sesv2";
import { json } from "./http.js";
import { validateContact } from "./validate.js";

// Created once per Lambda container and reused across invocations.
const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const ses = new SESv2Client({});

const { MESSAGES_TABLE, SENDER_EMAIL, NOTIFY_EMAIL } = process.env;

/** POST /contact: saves the message to DynamoDB and emails it to me through SES. */
export async function handler(event: APIGatewayProxyEventV2): Promise<APIGatewayProxyResultV2> {
  const body = event.isBase64Encoded && event.body ? Buffer.from(event.body, "base64").toString("utf8") : event.body;
  const result = validateContact(body);
  if (!result.ok) return json(400, { error: result.error });

  // Pretend success for bots so they don't retry, but don't store or send anything.
  if (result.isBot) return json(200, { ok: true });

  const { name, email, message } = result.value;
  const id = randomUUID();
  const createdAt = new Date().toISOString();

  try {
    await db.send(
      new PutCommand({
        TableName: MESSAGES_TABLE,
        Item: { id, createdAt, name, email, message, sourceIp: event.requestContext?.http?.sourceIp },
      }),
    );

    await ses.send(
      new SendEmailCommand({
        FromEmailAddress: SENDER_EMAIL,
        Destination: { ToAddresses: [NOTIFY_EMAIL!] },
        ReplyToAddresses: [email],
        Content: {
          Simple: {
            Subject: { Data: `Portfolio message from ${name}` },
            Body: { Text: { Data: `From: ${name} <${email}>\nReceived: ${createdAt}\n\n${message}` } },
          },
        },
      }),
    );
  } catch (err) {
    console.error("Failed to handle contact message", { id, err });
    return json(500, { error: "Could not send your message. Please try again later." });
  }

  return json(200, { ok: true });
}
