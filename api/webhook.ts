import { Pool } from "pg";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import Stripe from "stripe";

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

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readRawBody(req: AsyncIterable<Buffer | string>) {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

function buildPriorityAccessEmailHtml(email: string) {
  return `
    <div style="font-family: Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 24px; color: #111827;">
      <h1 style="font-size: 28px; margin: 0 0 16px;">Your founding member access is confirmed.</h1>
      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Thanks for joining the VibeFello founding member club. We've marked <strong>${email}</strong> for manual priority follow-up from our team.
      </p>
      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Please follow our official X account for the latest product updates and launch news:
        <a href="https://x.com/vibefello">https://x.com/vibefello</a>
      </p>
      <p style="font-size: 16px; line-height: 1.6; margin: 0;">
        We will contact you directly when there is a relevant next step.
      </p>
    </div>
  `;
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

export default async function handler(req: any, res: any) {
  const rawBody = await readRawBody(req);
  const signature =
    typeof req.headers["stripe-signature"] === "string"
      ? req.headers["stripe-signature"]
      : undefined;

  if (!signature) {
    return res.status(400).send("Webhook Error: Missing signature");
  }

  const pool = getPostgresPool();
  const supabase = !pool ? getSupabaseServerConfig() : null;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if ((!pool && !supabase) || !stripeKey || !webhookSecret) {
    return res.status(500).json({ error: "Server configuration is incomplete." });
  }

  try {
    const stripe = new Stripe(stripeKey);
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_details?.email || session.metadata?.email;

      if (email && session.id) {
        let lead: { email: string; paid?: boolean | null } | null = null;

        if (pool) {
          await ensureWaitlistSchema(pool);
          const sessionMatch = await pool.query<{ email: string; paid: boolean | null }>(
            `
              select email, paid
              from public.waitlist
              where checkout_session_id = $1
              limit 1
            `,
            [session.id],
          );

          lead = sessionMatch.rows[0]?.email
            ? sessionMatch.rows[0]
            : (
                await pool.query<{ email: string; paid: boolean | null }>(
                  `
                    select email, paid
                    from public.waitlist
                    where email = $1
                    limit 1
                  `,
                  [email],
                )
              ).rows[0] ?? null;
        } else {
          const client = createClient(supabase!.url, supabase!.key);
          const sessionMatch = await client
            .from("waitlist")
            .select("email, paid")
            .eq("checkout_session_id", session.id)
            .maybeSingle<{ email: string; paid?: boolean | null }>();

          if (sessionMatch.error) {
            throw sessionMatch.error;
          }

          lead = sessionMatch.data?.email
            ? sessionMatch.data
            : (
                await client
                  .from("waitlist")
                  .select("email, paid")
                  .eq("email", email)
                  .maybeSingle<{ email: string; paid?: boolean | null }>()
              ).data;
        }

        if (lead?.email && !lead.paid) {
          const paidAt = new Date().toISOString();

          if (pool) {
            await pool.query(
              `
                insert into public.waitlist (
                  email,
                  paid,
                  paid_at,
                  priority_access,
                  priority_source,
                  checkout_status,
                  checkout_session_id,
                  updated_at
                )
                values ($1, true, $2, true, $3, $4, $5, $2)
                on conflict (email) do update
                  set paid = true,
                      paid_at = excluded.paid_at,
                      priority_access = true,
                      priority_source = excluded.priority_source,
                      checkout_status = excluded.checkout_status,
                      checkout_session_id = excluded.checkout_session_id,
                      updated_at = excluded.updated_at
              `,
              [lead.email, paidAt, "stripe_checkout", "completed", session.id],
            );
          } else {
            const client = createClient(supabase!.url, supabase!.key);
            const { error: upsertError } = await client
              .from("waitlist")
              .upsert(
                {
                  email: lead.email,
                  paid: true,
                  paid_at: paidAt,
                  priority_access: true,
                  priority_source: "stripe_checkout",
                  checkout_status: "completed",
                  checkout_session_id: session.id,
                  updated_at: paidAt,
                },
                { onConflict: "email" },
              );

            if (upsertError) {
              throw upsertError;
            }
          }

          const resendKey = process.env.RESEND_API_KEY;
          if (resendKey) {
            const resend = new Resend(resendKey);
            await resend.emails.send({
              from: process.env.RESEND_FROM_EMAIL || "VibeFello <feedback@vibefello.com>",
              to: lead.email,
              subject: "Your VibeFello founding member access is confirmed",
              html: buildPriorityAccessEmailHtml(lead.email),
            });
          }
        }
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return res.status(400).send("Webhook Error");
  }
}
