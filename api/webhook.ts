import { createRuntimeDependencies, handleWebhookRequest } from "./_lib/route-handlers.js";
import { readRawBody, sendVercelResult } from "./_lib/vercel.js";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: any, res: any) {
  const rawBody = await readRawBody(req);
  const signature =
    typeof req.headers["stripe-signature"] === "string"
      ? req.headers["stripe-signature"]
      : undefined;

  const result = await handleWebhookRequest(
    rawBody,
    signature,
    createRuntimeDependencies(),
  );

  return sendVercelResult(res, result);
}
