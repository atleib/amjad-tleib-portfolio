import type { APIGatewayProxyResultV2 } from "aws-lambda";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { json } from "./http.js";

const db = DynamoDBDocumentClient.from(new DynamoDBClient({}));
const { STATS_TABLE } = process.env;

/** POST /visits: atomically increments the visit counter and returns the new total. */
export async function handler(): Promise<APIGatewayProxyResultV2> {
  try {
    const res = await db.send(
      new UpdateCommand({
        TableName: STATS_TABLE,
        Key: { id: "visits" },
        UpdateExpression: "ADD #count :one",
        ExpressionAttributeNames: { "#count": "count" },
        ExpressionAttributeValues: { ":one": 1 },
        ReturnValues: "UPDATED_NEW",
      }),
    );
    return json(200, { count: Number(res.Attributes?.count ?? 0) });
  } catch (err) {
    console.error("Failed to update visit count", err);
    return json(500, { error: "Could not update visit count." });
  }
}
