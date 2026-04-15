import { createClient } from "@supabase/supabase-js";
import { ensureWaitlistSchema, getPostgresPool } from "./postgres.js";
import { getSupabaseConfig } from "./env.js";

type Pool = NonNullable<ReturnType<typeof getPostgresPool>>;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export function addSessionIdsToSet(
  sessionIds: Set<string>,
  rows: Array<{ session_id?: unknown }>,
) {
  for (const row of rows) {
    const sessionId = row?.session_id;
    if (typeof sessionId !== "string") {
      continue;
    }

    const trimmedSessionId = sessionId.trim();
    if (!trimmedSessionId) {
      continue;
    }

    sessionIds.add(trimmedSessionId);
  }
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
    pageViews: number;
    visitors: number;
    waitlistLeads: number;
    checkoutStarted: number;
    paidMembers: number;
    waitlistConversionRate: number;
    leadToPaidConversionRate: number;
    visitorToPaidConversionRate: number;
  };
  lifetime: {
    pageViews: number;
    visitors: number;
    waitlistLeads: number;
    checkoutStarted: number;
    paidMembers: number;
    latestMemberId: string | null;
  };
  daily: Array<{
    date: string;
    pageViews: number;
    uniqueVisitors: number;
    waitlistLeads: number;
    paidMembers: number;
  }>;
  updatedAt: string;
};

export type AdminStore = {
  recordAnalyticsEvent: (input: AnalyticsEventInput) => Promise<void>;
  getDashboard: (input: { rangeDays: number }) => Promise<AdminDashboard>;
  listLeads: (input: { limit: number }) => Promise<AdminLead[]>;
};

function isRealEmail(value: unknown): value is string {
  return typeof value === "string" && EMAIL_PATTERN.test(value.trim());
}

function toDateKey(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString().slice(0, 10);
}

function toTimestamp(value: string | null | undefined) {
  if (!value) {
    return null;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.getTime();
}

function createDateRangeKeys(sinceIso: string) {
  const startDate = new Date(sinceIso);
  const endDate = new Date();
  const keys: string[] = [];

  startDate.setUTCHours(0, 0, 0, 0);
  endDate.setUTCHours(0, 0, 0, 0);

  while (startDate.getTime() <= endDate.getTime()) {
    keys.push(startDate.toISOString().slice(0, 10));
    startDate.setUTCDate(startDate.getUTCDate() + 1);
  }

  return keys;
}

type DailyMetricInput = {
  analyticsRows: Array<{
    session_id?: unknown;
    event_name?: unknown;
    created_at?: unknown;
  }>;
  waitlistRows: Array<{
    email?: unknown;
    created_at?: unknown;
    paid?: unknown;
    paid_at?: unknown;
    updated_at?: unknown;
  }>;
  sinceIso: string;
};

export function buildDailyMetrics({
  analyticsRows,
  waitlistRows,
  sinceIso,
}: DailyMetricInput) {
  const dayKeys = createDateRangeKeys(sinceIso);
  const uvSets = new Map<string, Set<string>>();
  const pageViews = new Map<string, number>();
  const waitlistCounts = new Map<string, number>();
  const paidCounts = new Map<string, number>();
  const sinceTs = toTimestamp(sinceIso) ?? 0;

  for (const row of analyticsRows) {
    const eventName = typeof row.event_name === "string" ? row.event_name : "";
    const createdAt = typeof row.created_at === "string" ? row.created_at : null;
    const dayKey = toDateKey(createdAt);
    const createdTs = toTimestamp(createdAt);
    if (!dayKey || !createdTs || createdTs < sinceTs) {
      continue;
    }

    if (eventName === "page_view") {
      pageViews.set(dayKey, (pageViews.get(dayKey) ?? 0) + 1);
    }

    const sessionId = typeof row.session_id === "string" ? row.session_id.trim() : "";
    if (!sessionId) {
      continue;
    }

    const existingSet = uvSets.get(dayKey) ?? new Set<string>();
    existingSet.add(sessionId);
    uvSets.set(dayKey, existingSet);
  }

  for (const row of waitlistRows) {
    if (!isRealEmail(row.email)) {
      continue;
    }

    const createdAt = typeof row.created_at === "string" ? row.created_at : null;
    const createdDay = toDateKey(createdAt);
    const createdTs = toTimestamp(createdAt);
    if (createdDay && createdTs && createdTs >= sinceTs) {
      waitlistCounts.set(createdDay, (waitlistCounts.get(createdDay) ?? 0) + 1);
    }

    const paid = Boolean(row.paid);
    if (!paid) {
      continue;
    }

    const paidAt = typeof row.paid_at === "string" ? row.paid_at : null;
    const updatedAt = typeof row.updated_at === "string" ? row.updated_at : null;
    const paidDateSource = paidAt ?? updatedAt ?? createdAt;
    const paidDay = toDateKey(paidDateSource);
    const paidTs = toTimestamp(paidDateSource);

    if (paidDay && paidTs && paidTs >= sinceTs) {
      paidCounts.set(paidDay, (paidCounts.get(paidDay) ?? 0) + 1);
    }
  }

  return dayKeys.map((date) => ({
    date,
    pageViews: pageViews.get(date) ?? 0,
    uniqueVisitors: uvSets.get(date)?.size ?? 0,
    waitlistLeads: waitlistCounts.get(date) ?? 0,
    paidMembers: paidCounts.get(date) ?? 0,
  }));
}

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

    addSessionIdsToSet(sessionIds, (data ?? []) as Array<{ session_id?: unknown }>);

    if (!data || data.length < pageSize) {
      break;
    }
  }

  return sessionIds.size;
}

async function fetchAnalyticsRowsWithSupabase(
  supabase: any,
  sinceIso?: string,
) {
  const pageSize = 1000;
  const rows: Array<{
    session_id?: unknown;
    event_name?: unknown;
    created_at?: unknown;
  }> = [];

  for (let from = 0; from < 50000; from += pageSize) {
    let query = supabase
      .from("analytics_events")
      .select("session_id,event_name,created_at")
      .order("created_at", { ascending: false })
      .range(from, from + pageSize - 1);

    if (sinceIso) {
      query = query.gte("created_at", sinceIso);
    }

    const { data, error } = await query;
    if (error) {
      if (isMissingRelationError(error)) {
        return [];
      }
      throw error;
    }

    rows.push(...(data ?? []));

    if (!data || data.length < pageSize) {
      break;
    }
  }

  return rows;
}

type SupabaseWaitlistRow = {
  email?: unknown;
  member_id?: unknown;
  created_at?: unknown;
  checkout_started_at?: unknown;
  checkout_session_id?: unknown;
  paid?: unknown;
  paid_at?: unknown;
  updated_at?: unknown;
};

async function fetchWaitlistRowsWithSupabase(supabase: any) {
  const pageSize = 1000;
  const rows: SupabaseWaitlistRow[] = [];

  for (let from = 0; from < 50000; from += pageSize) {
    const { data, error } = await supabase
      .from("waitlist")
      .select("email,member_id,created_at,checkout_started_at,checkout_session_id,paid,paid_at,updated_at")
      .order("created_at", { ascending: false })
      .range(from, from + pageSize - 1);

    if (error) {
      throw error;
    }

    rows.push(...((data ?? []) as SupabaseWaitlistRow[]));

    if (!data || data.length < pageSize) {
      break;
    }
  }

  return rows;
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
          page_views: number | string;
          visitors: number | string;
          waitlist_leads: number | string;
          checkout_started: number | string;
          paid_members: number | string;
        }>(
          `
            select
              (
                select count(*)::int
                from public.analytics_events
                where event_name = 'page_view'
                  and created_at >= $1
              ) as page_views,
              (
                select count(distinct session_id)::int
                from public.analytics_events
                where created_at >= $1
              ) as visitors,
              (
                select count(*)::int
                from public.waitlist
                where created_at >= $1
                  and trim(email) ~* '^[^@[:space:]]+@[^@[:space:]]+\\.[^@[:space:]]+$'
              ) as waitlist_leads,
              (
                select count(*)::int
                from public.waitlist
                where checkout_session_id is not null
                  and trim(email) ~* '^[^@[:space:]]+@[^@[:space:]]+\\.[^@[:space:]]+$'
                  and coalesce(checkout_started_at, created_at) >= $1
              ) as checkout_started,
              (
                select count(*)::int
                from public.waitlist
                where paid = true
                  and trim(email) ~* '^[^@[:space:]]+@[^@[:space:]]+\\.[^@[:space:]]+$'
                  and coalesce(paid_at, updated_at, created_at) >= $1
              ) as paid_members
          `,
          [sinceIso],
        );

        const lifetimeResult = await pool.query<{
          page_views: number | string;
          visitors: number | string;
          waitlist_leads: number | string;
          checkout_started: number | string;
          paid_members: number | string;
          latest_member_id: string | null;
        }>(
          `
            select
              (
                select count(*)::int
                from public.analytics_events
                where event_name = 'page_view'
              ) as page_views,
              (
                select count(distinct session_id)::int
                from public.analytics_events
              ) as visitors,
              (
                select count(*)::int
                from public.waitlist
                where trim(email) ~* '^[^@[:space:]]+@[^@[:space:]]+\\.[^@[:space:]]+$'
              ) as waitlist_leads,
              (
                select count(*)::int
                from public.waitlist
                where checkout_session_id is not null
                  and trim(email) ~* '^[^@[:space:]]+@[^@[:space:]]+\\.[^@[:space:]]+$'
              ) as checkout_started,
              (
                select count(*)::int
                from public.waitlist
                where paid = true
                  and trim(email) ~* '^[^@[:space:]]+@[^@[:space:]]+\\.[^@[:space:]]+$'
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

        const dailyResult = await pool.query<{
          date: string;
          page_views: number | string;
          unique_visitors: number | string;
          waitlist_leads: number | string;
          paid_members: number | string;
        }>(
          `
            with days as (
              select generate_series(
                date_trunc('day', $1::timestamptz)::date,
                date_trunc('day', now())::date,
                interval '1 day'
              )::date as day
            ),
            pv as (
              select
                date_trunc('day', created_at)::date as day,
                count(*)::int as count
              from public.analytics_events
              where event_name = 'page_view'
                and created_at >= $1
              group by 1
            ),
            uv as (
              select
                date_trunc('day', created_at)::date as day,
                count(distinct session_id)::int as count
              from public.analytics_events
              where created_at >= $1
              group by 1
            ),
            wl as (
              select
                date_trunc('day', created_at)::date as day,
                count(*)::int as count
              from public.waitlist
              where created_at >= $1
                and trim(email) ~* '^[^@[:space:]]+@[^@[:space:]]+\\.[^@[:space:]]+$'
              group by 1
            ),
            paid as (
              select
                date_trunc('day', coalesce(paid_at, updated_at, created_at))::date as day,
                count(*)::int as count
              from public.waitlist
              where paid = true
                and trim(email) ~* '^[^@[:space:]]+@[^@[:space:]]+\\.[^@[:space:]]+$'
                and coalesce(paid_at, updated_at, created_at) >= $1
              group by 1
            )
            select
              to_char(days.day, 'YYYY-MM-DD') as date,
              coalesce(pv.count, 0) as page_views,
              coalesce(uv.count, 0) as unique_visitors,
              coalesce(wl.count, 0) as waitlist_leads,
              coalesce(paid.count, 0) as paid_members
            from days
            left join pv on pv.day = days.day
            left join uv on uv.day = days.day
            left join wl on wl.day = days.day
            left join paid on paid.day = days.day
            order by days.day asc
          `,
          [sinceIso],
        );

        const period = periodResult.rows[0];
        const lifetime = lifetimeResult.rows[0];
        const periodVisitors = toNumber(period?.visitors);
        const periodLeads = toNumber(period?.waitlist_leads);
        const periodPaid = toNumber(period?.paid_members);

        return {
          rangeDays,
          period: {
            pageViews: toNumber(period?.page_views),
            visitors: periodVisitors,
            waitlistLeads: periodLeads,
            checkoutStarted: toNumber(period?.checkout_started),
            paidMembers: periodPaid,
            waitlistConversionRate: calculateConversionRate(periodLeads, periodVisitors),
            leadToPaidConversionRate: calculateConversionRate(periodPaid, periodLeads),
            visitorToPaidConversionRate: calculateConversionRate(periodPaid, periodVisitors),
          },
          lifetime: {
            pageViews: toNumber(lifetime?.page_views),
            visitors: toNumber(lifetime?.visitors),
            waitlistLeads: toNumber(lifetime?.waitlist_leads),
            checkoutStarted: toNumber(lifetime?.checkout_started),
            paidMembers: toNumber(lifetime?.paid_members),
            latestMemberId: lifetime?.latest_member_id ?? null,
          },
          daily: dailyResult.rows.map((row) => ({
            date: row.date,
            pageViews: toNumber(row.page_views),
            uniqueVisitors: toNumber(row.unique_visitors),
            waitlistLeads: toNumber(row.waitlist_leads),
            paidMembers: toNumber(row.paid_members),
          })),
          updatedAt: new Date().toISOString(),
        };
      }

      if (!config) {
        throw new Error("Admin analytics data source is not configured.");
      }

      const supabase = createClient(config.url, config.key);
      const [
        lifetimePageViewResult,
        periodAnalyticsRows,
        lifetimeVisitors,
        waitlistRows,
      ] = await Promise.all([
        supabase
          .from("analytics_events")
          .select("id", { count: "exact", head: true })
          .eq("event_name", "page_view"),
        fetchAnalyticsRowsWithSupabase(supabase, sinceIso),
        countDistinctVisitorsWithSupabase(supabase),
        fetchWaitlistRowsWithSupabase(supabase),
      ]);

      const periodSessions = new Set<string>();
      let periodPageViews = 0;
      for (const row of periodAnalyticsRows) {
        if (row.event_name === "page_view") {
          periodPageViews += 1;
        }
        const sessionId = typeof row.session_id === "string" ? row.session_id.trim() : "";
        if (sessionId) {
          periodSessions.add(sessionId);
        }
      }

      const sinceTs = toTimestamp(sinceIso) ?? 0;
      const realWaitlistRows = waitlistRows.filter((row) => isRealEmail(row.email));
      const periodWaitlistRows = realWaitlistRows.filter((row) => {
        const createdTs = toTimestamp(typeof row.created_at === "string" ? row.created_at : null);
        return Boolean(createdTs && createdTs >= sinceTs);
      });

      const periodCheckoutRows = realWaitlistRows.filter((row) => {
        const checkoutSessionId = typeof row.checkout_session_id === "string"
          ? row.checkout_session_id.trim()
          : "";
        if (!checkoutSessionId) {
          return false;
        }

        const checkoutTs = toTimestamp(
          typeof row.checkout_started_at === "string"
            ? row.checkout_started_at
            : typeof row.created_at === "string"
            ? row.created_at
            : null,
        );

        return Boolean(checkoutTs && checkoutTs >= sinceTs);
      });

      const lifetimePaidRows = realWaitlistRows.filter((row) => Boolean(row.paid));
      const periodPaidRows = lifetimePaidRows.filter((row) => {
        const paidSource = typeof row.paid_at === "string"
          ? row.paid_at
          : typeof row.updated_at === "string"
          ? row.updated_at
          : typeof row.created_at === "string"
          ? row.created_at
          : null;
        const paidTs = toTimestamp(paidSource);
        return Boolean(paidTs && paidTs >= sinceTs);
      });

      const latestMemberId = realWaitlistRows
        .map((row) => (typeof row.member_id === "string" ? row.member_id : null))
        .filter((memberId): memberId is string => Boolean(memberId && /^\d{3}$/.test(memberId)))
        .sort()
        .at(-1) ?? null;

      const daily = buildDailyMetrics({
        analyticsRows: periodAnalyticsRows,
        waitlistRows: realWaitlistRows,
        sinceIso,
      });

      return {
        rangeDays,
        period: {
          pageViews: periodPageViews,
          visitors: periodSessions.size,
          waitlistLeads: periodWaitlistRows.length,
          checkoutStarted: periodCheckoutRows.length,
          paidMembers: periodPaidRows.length,
          waitlistConversionRate: calculateConversionRate(periodWaitlistRows.length, periodSessions.size),
          leadToPaidConversionRate: calculateConversionRate(periodPaidRows.length, periodWaitlistRows.length),
          visitorToPaidConversionRate: calculateConversionRate(periodPaidRows.length, periodSessions.size),
        },
        lifetime: {
          pageViews: lifetimePageViewResult.count ?? 0,
          visitors: lifetimeVisitors,
          waitlistLeads: realWaitlistRows.length,
          checkoutStarted: realWaitlistRows.filter((row) => {
            const checkoutSessionId = typeof row.checkout_session_id === "string"
              ? row.checkout_session_id.trim()
              : "";
            return Boolean(checkoutSessionId);
          }).length,
          paidMembers: lifetimePaidRows.length,
          latestMemberId,
        },
        daily,
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
            where trim(email) ~* '^[^@[:space:]]+@[^@[:space:]]+\\.[^@[:space:]]+$'
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
        throw new Error("Admin leads data source is not configured.");
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

      return (data ?? [])
        .filter((row: Record<string, unknown>) => isRealEmail(row.email))
        .map((row: Record<string, unknown>) => ({
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
