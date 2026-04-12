import { handleHealthRequest } from "../src/server/route-handlers";
import { sendVercelResult } from "../src/server/vercel";

export default async function handler(_req: any, res: any) {
  const result = await handleHealthRequest();
  return sendVercelResult(res, result);
}
