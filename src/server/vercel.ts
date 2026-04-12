export async function readRawBody(req: AsyncIterable<Buffer | string>) {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

export async function readJsonBody(req: AsyncIterable<Buffer | string>) {
  const rawBody = await readRawBody(req);
  if (!rawBody.length) {
    return {};
  }

  return JSON.parse(rawBody.toString("utf8"));
}

export function sendVercelResult(
  res: any,
  result: { status: number; json?: unknown; text?: string },
) {
  if ("text" in result && typeof result.text === "string") {
    return res.status(result.status).send(result.text);
  }

  return res.status(result.status).json(result.json);
}
