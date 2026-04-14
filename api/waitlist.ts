import { createRuntimeDependencies, handleWaitlistRequest } from "./_lib/route-handlers";
import { readJsonBody, sendVercelResult } from "./_lib/vercel";

export default async function handler(req: any, res: any) {
  const body = req.body ?? (await readJsonBody(req));
  const result = await handleWaitlistRequest(body, createRuntimeDependencies());
  return sendVercelResult(res, result);
}
