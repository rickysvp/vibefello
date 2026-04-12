import { handleHealthRequest } from "./_lib/route-handlers";
import { sendVercelResult } from "./_lib/vercel";

export default async function handler(_req: any, res: any) {
  const result = await handleHealthRequest();
  return sendVercelResult(res, result);
}
