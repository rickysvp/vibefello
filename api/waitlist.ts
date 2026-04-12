import { createClient } from "@supabase/supabase-js";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidBlocker(blocker?: string) {
  return blocker === undefined || blocker.trim().length >= 10;
}

async function readJsonBody(req: AsyncIterable<Buffer | string>) {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  if (!chunks.length) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function getSupabaseServerConfig() {
  const candidates = [
    {
      url: process.env.SUPABASE_URL,
      key: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    {
      url: process.env.VITE_SUPABASE_URL,
      key: process.env.VITE_SUPABASE_ANON_KEY,
    },
    {
      url: process.env.VIBEFELLO_VITE_PUBLIC_SUPABASE_URL,
      key: process.env.VIBEFELLO_VITE_PUBLIC_SUPABASE_ANON_KEY,
    },
    {
      url: process.env.VIBEFELLO_SUPABASE_URL,
      key: process.env.VIBEFELLO_SUPABASE_SERVICE_ROLE_KEY,
    },
  ];

  for (const candidate of candidates) {
    if (candidate.url && candidate.key) {
      return candidate;
    }
  }

  return null;
}

export default async function handler(req: any, res: any) {
  const body = req.body ?? (await readJsonBody(req));
  const email = typeof body?.email === "string" ? body.email.trim() : "";
  const blocker = typeof body?.blocker === "string" ? body.blocker : undefined;

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  if (!isValidBlocker(blocker)) {
    return res.status(400).json({ error: "Please provide a bit more detail (min 10 characters)." });
  }

  const supabase = getSupabaseServerConfig();

  if (!supabase) {
    return res.status(500).json({ error: "Server configuration is incomplete." });
  }

  try {
    const client = createClient(supabase.url, supabase.key);
    const now = new Date().toISOString();

    const { data: existing, error: selectError } = await client
      .from("waitlist")
      .select("email, paid, priority_access")
      .eq("email", email)
      .maybeSingle<{ email: string; paid?: boolean | null; priority_access?: boolean | null }>();

    if (selectError) {
      throw selectError;
    }

    const payload: Record<string, unknown> = {
      email,
      updated_at: now,
    };

    if (!existing) {
      payload.created_at = now;
    }

    if (blocker?.trim()) {
      payload.blocker = blocker.trim();
    }

    const { error: upsertError } = await client
      .from("waitlist")
      .upsert(payload, { onConflict: "email" });

    if (upsertError) {
      throw upsertError;
    }

    return res.status(200).json({
      success: true,
      email,
      paid: Boolean(existing?.paid),
      priorityAccess: Boolean(existing?.priority_access),
      message: "Lead captured",
    });
  } catch (error) {
    console.error("Failed to upsert waitlist lead:", error);
    return res.status(500).json({ error: "Failed to save your request. Please try again." });
  }
}
