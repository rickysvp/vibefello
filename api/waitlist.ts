import { Pool } from "pg";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const WAITLIST_BOOTSTRAP_SQL = `
create table if not exists public.waitlist (
  email text primary key,
  blocker text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  checkout_started_at timestamptz,
  checkout_session_id text,
  checkout_status text,
  priority_access boolean not null default false,
  paid boolean not null default false,
  paid_at timestamptz,
  priority_source text,
  notes text
);

alter table public.waitlist
  add column if not exists blocker text,
  add column if not exists created_at timestamptz not null default now(),
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists checkout_started_at timestamptz,
  add column if not exists checkout_session_id text,
  add column if not exists checkout_status text,
  add column if not exists priority_access boolean not null default false,
  add column if not exists paid boolean not null default false,
  add column if not exists paid_at timestamptz,
  add column if not exists priority_source text,
  add column if not exists notes text;

create unique index if not exists waitlist_email_key on public.waitlist (email);
`;

type GlobalDatabaseState = typeof globalThis & {
  __vibefelloWaitlistPool?: Pool;
  __vibefelloWaitlistSchemaPromise?: Promise<void>;
};

function getGlobalState(): GlobalDatabaseState {
  return globalThis as GlobalDatabaseState;
}

function getDatabaseConnectionString() {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.DATABASE_URL_UNPOOLED,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.POSTGRES_URL_NO_SSL,
  ];

  for (const candidate of candidates) {
    if (candidate) {
      return candidate;
    }
  }

  return null;
}

function getPostgresPool() {
  const connectionString = getDatabaseConnectionString();

  if (!connectionString) {
    return null;
  }

  const state = getGlobalState();

  if (!state.__vibefelloWaitlistPool) {
    state.__vibefelloWaitlistPool = new Pool({
      connectionString,
      ssl: connectionString.includes("sslmode=disable")
        ? undefined
        : { rejectUnauthorized: false },
      max: 1,
    });
  }

  return state.__vibefelloWaitlistPool;
}

async function ensureWaitlistSchema(pool: Pool) {
  const state = getGlobalState();

  if (!state.__vibefelloWaitlistSchemaPromise) {
    state.__vibefelloWaitlistSchemaPromise = pool
      .query(WAITLIST_BOOTSTRAP_SQL)
      .then(() => undefined)
      .catch((error) => {
        state.__vibefelloWaitlistSchemaPromise = undefined;
        throw error;
      });
  }

  await state.__vibefelloWaitlistSchemaPromise;
}

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
      return {
        url: candidate.url.startsWith("http") ? candidate.url : `https://${candidate.url}`,
        key: candidate.key,
      };
    }
  }

  return null;
}

function buildWaitlistConfirmationEmailHtml(email: string) {
  return `
    <div style="font-family: Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 24px; color: #111827;">
      <h1 style="font-size: 28px; margin: 0 0 16px;">You're on the VibeFello waitlist.</h1>
      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        We saved <strong>${email}</strong> to the VibeFello waitlist.
      </p>
      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        We'll reach out as we open more access and share launch updates.
      </p>
      <p style="font-size: 16px; line-height: 1.6; margin: 0;">
        If you decide to join the founding member club later, you'll receive a separate payment confirmation email.
      </p>
    </div>
  `;
}

async function sendWaitlistConfirmationEmail(email: string) {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return;
  }

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: process.env.RESEND_FROM_EMAIL || "VibeFello <feedback@vibefello.com>",
    to: email,
    subject: "You're on the VibeFello waitlist",
    html: buildWaitlistConfirmationEmailHtml(email),
  });
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

  const pool = getPostgresPool();
  const supabase = !pool ? getSupabaseServerConfig() : null;

  if (!pool && !supabase) {
    return res.status(500).json({ error: "Server configuration is incomplete." });
  }

  try {
    if (pool) {
      await ensureWaitlistSchema(pool);
      const result = await pool.query<{
        email: string;
        paid: boolean | null;
        priority_access: boolean | null;
      }>(
        `
          insert into public.waitlist (email, blocker, created_at, updated_at)
          values ($1, $2, now(), now())
          on conflict (email) do update
            set blocker = coalesce(excluded.blocker, public.waitlist.blocker),
                updated_at = excluded.updated_at
          returning email, paid, priority_access
        `,
        [email, blocker?.trim() || null],
      );
      const row = result.rows[0];

      if (!row.paid && !row.priority_access) {
        await sendWaitlistConfirmationEmail(row.email);
      }

      return res.status(200).json({
        success: true,
        email: row.email,
        paid: Boolean(row.paid),
        priorityAccess: Boolean(row.priority_access),
        message: "Lead captured",
      });
    }

    const client = createClient(supabase!.url, supabase!.key);
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

    if (!existing?.paid && !existing?.priority_access) {
      await sendWaitlistConfirmationEmail(email);
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
