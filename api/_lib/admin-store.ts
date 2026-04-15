import { createClient } from "@supabase/supabase-js";
import { ensureWaitlistSchema, getPostgresPool } from "./postgres.js";
import { getSupabaseConfig } from "./env.js";

type Pool = NonNullable<ReturnType<typeof getPostgresPool>>;

const ANALYTICS_BOOTSTRAP_SQL = `
create table if not exists public.analytics_events (
  id bigserial primary key,
  session_id text not null,
  event_name text not null,
  email text,
  path text,
  referrer text,
  user_agent text,
  metadata jsonb,
  created_at timestamptz not null default now()
);

create index if not exists analytics_events_event_name_created_at_idx
  on public.analytics_events (event_name, created_at desc);

create index if not exists analytics_events_session_id_created_at_idx
  on public.analytics_events (session_id, created_at desc);
`;

type GlobalAnalyticsState = typeof globalThis & {
  __vibefelloAnalyticsSchemaPromise?: Promise<void>;
};

function getGlobalState(): GlobalAnalyticsState {
  return globalThis as GlobalAnalyticsState;
}

async function ensureAnalyticsSchema(pool: Pool) {
  const state = getGlobalState();

  if (!state.__vibefelloAnalyticsSchemaPromise) {
    state.__vibefelloAnalyticsSchemaPromise = pool
      .query(ANALYTICS_BOOTSTRAP_SQL)
      .then(() => undefined)
      .catch((error) => {
        state.__vibefelloAnalyticsSchemaPromise = undefined;
        throw error;
      });
  }

  await state.__vibefelloAnalyticsSchemaPromise;
}

function toNumber(value: unknown) {
  if (typeof value === "number") {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  return 0;
}

export function calculateConversionRate(numerator: number, denominator: number) {
  if (!denominator || denominator <= 0 || numerator <= 0) {
    return 0;
  }

  // Guard against tracking gaps (for example ad-blocked page_view events)
  // so dashboard conversion percentages stay within 0-100%.
  return Number(Math.min(1, numerator / denominator).toFixed(4));
}

function getSinceIso(rangeDays: number) {
  const now = Date.now();
  const durationMs = rangeDays * 24 * 60 * 60 * 1000;
  return new Date(now - durationMs).toISOString();
}

function isMissingRelationError(error: unknown) {
  if (!error || typeof error !== "object") {
    return false;
  }

  const code = "code" in error ? String((error as { code?: string }).code) : "";
  const message = "message" in error
    ? String((error as { message?: string }).message).toLowerCase()
    : "";

  return code === "42P01" || message.includes("does not exist");
}

export type AnalyticsEventName =
  | "page_view"
  | "waitlist_submit"
  | "checkout_start"
  | "payment_success";

export type AnalyticsEventInput = {
  sessionId: string;
  eventName: AnalyticsEventName;
  email?: string | null;
  path?: string | null;
  referrer?: string | null;
  userAgent?: string | null;
  metadata?: Record<string, unknown> | null;
};

export type AdminLead = {
  email: string;
  memberId: string | null;
  paid: boolean;
  priorityAccess: boolean;
  checkoutStatus: string | null;
  createdAt: string | null;
  checkoutStartedAt: string | null;
  paidAt: string | null;
};

export type AdminDashboard = {
  rangeDays: number;
  period: {
    visitors: number;
    waitlistLeads: number;
    checkoutStarted: number;
    paidMembers: number;
    waitlistConversionRate: number;
    leadToPaidConversionRate: number;
    visitorToPaidConversionRate: number;
  };
  lifetime: {
    visitors: number;
    waitlistLeads: number;
    checkoutStarted: number;
    paidMembers: number;
    latestMemberId: string | null;
  };
  updatedAt: string;
};

export type AdminStore = {
  recordAnalyticsEvent: (input: AnalyticsEventInput) => Promise<void>;
  getDashboard: (input: { rangeDays: number }) => Promise<AdminDashboard>;
  listLeads: (input: { limit: number }) => Promise<AdminLead[]>;
};

async function countDistinctVisitorsWithSupabase(
  supabase: any,
  sinceIso?: string,
) {
  const sessionIds = new Set<string>();
  const pageSize = 1000;

  for (let from = 0; from < 50000; from += pageSize) {
    let query = supabase
      .from("analytics_events")
      .select("session_id")
      .eq("event_name", "page_view")
      .range(from, from + pageSize - 1);

    if (sinceIso) {
      query = query.gte("created_at", sinceIso);
    }

    const { data, error } = await query;
    if (error) {
      if (isMissingRelationError(error)) {
        return 0;
      }
      throw error;
    }

    for (const row of data ?? []) {
      const sessionId = (row as { session_id?: unknown })?.session_id;
      if (typeof sessionId === "string" && sessionId.length > 0) {
        sessionIds.add(sessionId);
      }
    }

    if (!data || data.length < pageSize) {
      break;
    }
  }

  return sessionIds.size;
}

export function createAdminStore(): AdminStore {
  const config = getSupabaseConfig();
  const pool = getPostgresPool();

  return {
    async recordAnalyticsEvent(input) {
      if (pool) {
        await ensureWaitlistSchema(pool);
        await ensureAnalyticsSchema(pool);
        await pool.query(
          `
            insert into public.analytics_events (
              session_id,
              event_name,
              email,
              path,
              referrer,
              user_agent,
              metadata
            )
            values ($1, $2, $3, $4, $5, $6, $7::jsonb)
          `,
          [
            input.sessionId,
            input.eventName,
            input.email ?? null,
            input.path ?? null,
            input.referrer ?? null,
            input.userAgent ?? null,
            JSON.stringify(input.metadata ?? {}),
          ],
        );
        return;
      }

      if (!config) {
        return;
      }

      const supabase = createClient(config.url, config.key);
      const { error } = await supabase
        .from("analytics_events")
        .insert({
          session_id: input.sessionId,
          event_name: input.eventName,
          email: input.email ?? null,
          path: input.path ?? null,
          referrer: input.referrer ?? null,
          user_agent: input.userAgent ?? null,
          metadata: input.metadata ?? {},
        });

      if (error && !isMissingRelationError(error)) {
        throw error;
      }
    },
    async getDashboard({ rangeDays }) {
      const sinceIso = getSinceIso(rangeDays);

      if (pool) {
        await ensureWaitlistSchema(pool);
        await ensureAnalyticsSchema(pool);

        const periodResult = await pool.query<{
          visitors: number | string;
          waitlist_leads: number | string;
          checkout_started: number | string;
          paid_members: number | string;
        }>(
          `
            select
              (
                select count(distinct session_id)::int
                from public.analytics_events
                where event_name = 'page_view'
                  and created_at >= $1
              ) as visitors,
              (
                select count(*)::int
                from public.waitlist
                where created_at >= $1
              ) as waitlist_leads,
              (
                select count(*)::int
                from public.waitlist
                where checkout_session_id is not null
                  and coalesce(checkout_started_at, created_at) >= $1
              ) as checkout_started,
              (
                select count(*)::int
                from public.waitlist
                where paid = true
                  and coalesce(paid_at, updated_at, created_at) >= $1
              ) as paid_members
          `,
          [sinceIso],
        );

        const lifetimeResult = await pool.query<{
          visitors: number | string;
          waitlist_leads: number | string;
          checkout_started: number | string;
          paid_members: number | string;
          latest_member_id: string | null;
        }>(
          `
            select
              (
                select count(distinct session_id)::int
                from public.analytics_events
                where event_name = 'page_view'
              ) as visitors,
              (
                select count(*)::int
                from public.waitlist
              ) as waitlist_leads,
              (
                select count(*)::int
                from public.waitlist
                where checkout_session_id is not null
              ) as checkout_started,
              (
                select count(*)::int
                from public.waitlist
                where paid = true
              ) as paid_members,
              (
                select member_id
                from public.waitlist
                where member_id ~ '^[0-9]{3}$'
                order by member_id desc
                limit 1
              ) as latest_member_id
          `,
        );

        const period = periodResult.rows[0];
        const lifetime = lifetimeResult.rows[0];
        const periodVisitors = toNumber(period?.visitors);
        const periodLeads = toNumber(period?.waitlist_leads);
        const periodPaid = toNumber(period?.paid_members);

        return {
          rangeDays,
          period: {
            visitors: periodVisitors,
            waitlistLeads: periodLeads,
            checkoutStarted: toNumber(period?.checkout_started),
            paidMembers: periodPaid,
            waitlistConversionRate: calculateConversionRate(periodLeads, periodVisitors),
            leadToPaidConversionRate: calculateConversionRate(periodPaid, periodLeads),
            visitorToPaidConversionRate: calculateConversionRate(periodPaid, periodVisitors),
          },
          lifetime: {
            visitors: toNumber(lifetime?.visitors),
            waitlistLeads: toNumber(lifetime?.waitlist_leads),
            checkoutStarted: toNumber(lifetime?.checkout_started),
            paidMembers: toNumber(lifetime?.paid_members),
            latestMemberId: lifetime?.latest_member_id ?? null,
          },
          updatedAt: new Date().toISOString(),
        };
      }

      if (!config) {
        return {
          rangeDays,
          period: {
            visitors: 0,
            waitlistLeads: 0,
            checkoutStarted: 0,
            paidMembers: 0,
            waitlistConversionRate: 0,
            leadToPaidConversionRate: 0,
            visitorToPaidConversionRate: 0,
          },
          lifetime: {
            visitors: 0,
            waitlistLeads: 0,
            checkoutStarted: 0,
            paidMembers: 0,
            latestMemberId: null,
          },
          updatedAt: new Date().toISOString(),
        };
      }

      const supabase = createClient(config.url, config.key);
      const [
        periodLeadsResult,
        periodCheckoutResult,
        periodPaidResult,
        totalLeadsResult,
        totalCheckoutResult,
        totalPaidResult,
        latestMemberIdResult,
      ] = await Promise.all([
        supabase.from("waitlist").select("email", { count: "exact", head: true }).gte("created_at", sinceIso),
        supabase.from("waitlist").select("email", { count: "exact", head: true }).not("checkout_session_id", "is", null).gte("checkout_started_at", sinceIso),
        supabase.from("waitlist").select("email", { count: "exact", head: true }).eq("paid", true).gte("paid_at", sinceIso),
        supabase.from("waitlist").select("email", { count: "exact", head: true }),
        supabase.from("waitlist").select("email", { count: "exact", head: true }).not("checkout_session_id", "is", null),
        supabase.from("waitlist").select("email", { count: "exact", head: true }).eq("paid", true),
        supabase
          .from("waitlist")
          .select("member_id")
          .not("member_id", "is", null)
          .order("member_id", { ascending: false })
          .limit(1)
          .maybeSingle(),
      ]);

      const periodVisitors = await countDistinctVisitorsWithSupabase(supabase, sinceIso);
      const lifetimeVisitors = await countDistinctVisitorsWithSupabase(supabase);

      const periodLeads = periodLeadsResult.count ?? 0;
      const periodPaid = periodPaidResult.count ?? 0;

      return {
        rangeDays,
        period: {
          visitors: periodVisitors,
          waitlistLeads: periodLeads,
          checkoutStarted: periodCheckoutResult.count ?? 0,
          paidMembers: periodPaid,
          waitlistConversionRate: calculateConversionRate(periodLeads, periodVisitors),
          leadToPaidConversionRate: calculateConversionRate(periodPaid, periodLeads),
          visitorToPaidConversionRate: calculateConversionRate(periodPaid, periodVisitors),
        },
        lifetime: {
          visitors: lifetimeVisitors,
          waitlistLeads: totalLeadsResult.count ?? 0,
          checkoutStarted: totalCheckoutResult.count ?? 0,
          paidMembers: totalPaidResult.count ?? 0,
          latestMemberId: (latestMemberIdResult.data as { member_id?: string } | null)?.member_id ?? null,
        },
        updatedAt: new Date().toISOString(),
      };
    },
    async listLeads({ limit }) {
      if (pool) {
        await ensureWaitlistSchema(pool);
        const result = await pool.query<{
          email: string;
          member_id: string | null;
          paid: boolean | null;
          priority_access: boolean | null;
          checkout_status: string | null;
          created_at: string | null;
          checkout_started_at: string | null;
          paid_at: string | null;
        }>(
          `
            select
              email,
              member_id,
              paid,
              priority_access,
              checkout_status,
              created_at,
              checkout_started_at,
              paid_at
            from public.waitlist
            order by coalesce(paid_at, checkout_started_at, created_at) desc
            limit $1
          `,
          [limit],
        );

        return result.rows.map((row) => ({
          email: row.email,
          memberId: row.member_id ?? null,
          paid: Boolean(row.paid),
          priorityAccess: Boolean(row.priority_access),
          checkoutStatus: row.checkout_status ?? null,
          createdAt: row.created_at ?? null,
          checkoutStartedAt: row.checkout_started_at ?? null,
          paidAt: row.paid_at ?? null,
        }));
      }

      if (!config) {
        return [];
      }

      const supabase = createClient(config.url, config.key);
      const { data, error } = await supabase
        .from("waitlist")
        .select("email, member_id, paid, priority_access, checkout_status, created_at, checkout_started_at, paid_at")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) {
        throw error;
      }

      return (data ?? []).map((row: Record<string, unknown>) => ({
        email: String(row.email ?? ""),
        memberId: typeof row.member_id === "string" ? row.member_id : null,
        paid: Boolean(row.paid),
        priorityAccess: Boolean(row.priority_access),
        checkoutStatus: typeof row.checkout_status === "string" ? row.checkout_status : null,
        createdAt: typeof row.created_at === "string" ? row.created_at : null,
        checkoutStartedAt: typeof row.checkout_started_at === "string" ? row.checkout_started_at : null,
        paidAt: typeof row.paid_at === "string" ? row.paid_at : null,
      }));
    },
  };
}
