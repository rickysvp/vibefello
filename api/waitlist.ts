import {
  createRuntimeDependencies,
  handleWaitlistRequest,
} from "../src/server/route-handlers";
import { readJsonBody, sendVercelResult } from "../src/server/vercel";

export default async function handler(req: any, res: any) {
  const body = req.body ?? (await readJsonBody(req));
  const result = await handleWaitlistRequest(body, createRuntimeDependencies());
  return sendVercelResult(res, result);
}
