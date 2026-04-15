import { createAdminDependencies, handleTrackEventRequest } from "./_lib/admin-handlers.js";

export default async function handler(req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const result = await handleTrackEventRequest(req.body, createAdminDependencies());
  if ("text" in result) {
    return res.status(result.status).send(result.text);
  }

  return res.status(result.status).json(result.json);
}
