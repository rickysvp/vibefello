import { createRuntimeDependencies, handleMemberStatusRequest } from "./_lib/route-handlers.js";
import { sendVercelResult } from "./_lib/vercel.js";

export default async function handler(req: any, res: any) {
  const result = await handleMemberStatusRequest(req.query, createRuntimeDependencies());
  return sendVercelResult(res, result);
}
