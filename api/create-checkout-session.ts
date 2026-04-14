import {
  createRuntimeDependencies,
  handleCreateCheckoutSessionRequest,
} from "./_lib/route-handlers.js";
import { readJsonBody, sendVercelResult } from "./_lib/vercel.js";

export default async function handler(req: any, res: any) {
  const body = req.body ?? (await readJsonBody(req));
  const result = await handleCreateCheckoutSessionRequest(body, createRuntimeDependencies());
  return sendVercelResult(res, result);
}
