import { Pool } from "pg";
import { createClient } from "@supabase/supabase-js";
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

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
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

function getStripeFoundingMemberPriceId() {
  return process.env.STRIPE_FOUNDING_MEMBER_PRICE_ID || null;
}

function getStripeStatementDescriptorSuffix() {
  return process.env.STRIPE_STATEMENT_DESCRIPTOR_SUFFIX || "VIBEFELLO";
}

export default async function handler(req: any, res: any) {
  const body = req.body ?? (await readJsonBody(req));
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  const pool = getPostgresPool();
  const supabase = !pool ? getSupabaseServerConfig() : null;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const appUrl = process.env.APP_URL || "https://vibefello.com";

  if ((!pool && !supabase) || !stripeKey) {
    return res.status(500).json({ error: "Server configuration is incomplete." });
  }

  try {
    let lead: { email: string; paid?: boolean | null } | null = null;

    if (pool) {
      await ensureWaitlistSchema(pool);
      const result = await pool.query<{ email: string; paid: boolean | null }>(
        `
          select email, paid
          from public.waitlist
          where email = $1
          limit 1
        `,
        [email],
      );
      lead = result.rows[0] ?? null;
    } else {
      const client = createClient(supabase!.url, supabase!.key);
      const result = await client
        .from("waitlist")
        .select("email, paid")
        .eq("email", email)
        .maybeSingle<{ email: string; paid?: boolean | null }>();

      if (result.error) {
        throw result.error;
      }

      lead = result.data;
    }

    if (!lead?.email) {
      return res.status(400).json({ error: "Please submit your request before checkout." });
    }

    if (lead.paid) {
      return res.status(409).json({ error: "Priority access already granted for this email." });
    }

    const stripe = new Stripe(stripeKey);
    const foundingMemberPriceId = getStripeFoundingMemberPriceId();
    const statementDescriptorSuffix = getStripeStatementDescriptorSuffix();
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      metadata: {
        email,
        source: "landing_page",
      },
      payment_intent_data: {
        statement_descriptor_suffix: statementDescriptorSuffix,
      },
      line_items: foundingMemberPriceId
        ? [{ price: foundingMemberPriceId, quantity: 1 }]
        : [
            {
              price_data: {
                currency: "usd",
                product_data: {
                  name: "VibeFello Priority Access",
                  description: "Priority access request for manual VibeFello follow-up.",
                },
                unit_amount: 99900,
              },
              quantity: 1,
            },
          ],
      mode: "payment",
      success_url: `${appUrl}?payment=success`,
      cancel_url: `${appUrl}?payment=cancel`,
    });

    if (!session.url) {
      throw new Error("Stripe checkout session did not include a URL");
    }

    const checkoutStartedAt = new Date().toISOString();

    if (pool) {
      await pool.query(
        `
          insert into public.waitlist (
            email,
            checkout_started_at,
            checkout_session_id,
            checkout_status,
            updated_at
          )
          values ($1, $2, $3, $4, $2)
          on conflict (email) do update
            set checkout_started_at = excluded.checkout_started_at,
                checkout_session_id = excluded.checkout_session_id,
                checkout_status = excluded.checkout_status,
                updated_at = excluded.updated_at
        `,
        [email, checkoutStartedAt, session.id, "created"],
      );
    } else {
      const client = createClient(supabase!.url, supabase!.key);
      const { error: upsertError } = await client
        .from("waitlist")
        .upsert(
          {
            email,
            checkout_started_at: checkoutStartedAt,
            checkout_session_id: session.id,
            checkout_status: "created",
            updated_at: checkoutStartedAt,
          },
          { onConflict: "email" },
        );

      if (upsertError) {
        throw upsertError;
      }
    }

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Failed to create checkout session:", error);
    return res.status(500).json({ error: "Failed to create checkout session." });
  }
}
