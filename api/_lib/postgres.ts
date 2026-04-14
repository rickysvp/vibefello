import { Pool } from "pg";

const WAITLIST_BOOTSTRAP_SQL = `
create table if not exists public.waitlist (
  email text primary key,
  blocker text,
  member_id text,
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
  add column if not exists member_id text,
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
create unique index if not exists waitlist_member_id_key on public.waitlist (member_id) where member_id is not null;
`;

type GlobalPostgresState = typeof globalThis & {
  __vibefelloWaitlistPool?: Pool;
  __vibefelloWaitlistSchemaPromise?: Promise<void>;
};

function getGlobalState(): GlobalPostgresState {
  return globalThis as GlobalPostgresState;
}

export function getDatabaseConnectionString() {
  const candidates = [
    process.env.DATABASE_URL,
    process.env.POSTGRES_URL,
    process.env.DATABASE_URL_UNPOOLED,
    process.env.POSTGRES_URL_NON_POOLING,
    process.env.POSTGRES_URL_NO_SSL,
    process.env.VIBEFELLO_POSTGRES_URL,
    process.env.VIBEFELLO_POSTGRES_URL_NON_POOLING,
  ];

  for (const candidate of candidates) {
    if (candidate) {
      return candidate;
    }
  }

  return null;
}

export function getPostgresPool() {
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

export async function ensureWaitlistSchema(pool: Pool) {
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
