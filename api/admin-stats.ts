import { createAdminDependencies, handleAdminStatsRequest } from "./_lib/admin-handlers.js";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, x-admin-token");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const result = await handleAdminStatsRequest(
    req.query,
    req.headers as Record<string, unknown> | undefined,
    createAdminDependencies(),
  );

  if ("text" in result) {
    return res.status(result.status).send(result.text);
  }

  return res.status(result.status).json(result.json);
}
