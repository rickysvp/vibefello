import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./env";
import { ensureWaitlistSchema, getPostgresPool } from "./postgres";

export type LeadState = {
  email: string;
  memberId: string | null;
  paid: boolean;
  priorityAccess: boolean;
};

export type LeadStore = {
  upsertLead: (input: { email: string; blocker?: string }) => Promise<LeadState>;
  getLeadByEmail: (email: string) => Promise<StoredLead | null>;
  recordCheckoutSession: (input: {
    email: string;
    checkoutSessionId: string;
    checkoutStatus: string;
    checkoutStartedAt: string;
  }) => Promise<void>;
  getLeadByCheckoutSession: (checkoutSessionId: string) => Promise<StoredLead | null>;
  findLeadForWebhook: (input: {
    checkoutSessionId: string;
    email: string;
  }) => Promise<StoredLead | null>;
  markLeadPaid: (input: {
    email: string;
    paidAt: string;
    prioritySource: string;
    checkoutStatus: string;
    checkoutSessionId: string;
  }) => Promise<void>;
};

export type StoredLead = LeadState;

type WaitlistRow = {
  email: string;
  blocker?: string | null;
  member_id?: string | null;
  paid?: boolean | null;
  paid_at?: string | null;
  priority_access?: boolean | null;
  checkout_session_id?: string | null;
};

export function buildMemberId(input: {
  paidAt: string;
  checkoutSessionId: string;
}) {
  const year = new Date(input.paidAt).getUTCFullYear();
  const rawSuffix = input.checkoutSessionId
    .replace(/^cs_(live|test)_/i, "")
    .replace(/[^a-z0-9]/gi, "")
    .toUpperCase();
  const suffix = rawSuffix.slice(-8).padStart(8, "0");

  return `VF-${year}-${suffix}`;
}

function normalizeLead(row: WaitlistRow): StoredLead {
  return {
    email: row.email,
    memberId: row.member_id ?? null,
    paid: Boolean(row.paid),
    priorityAccess: Boolean(row.priority_access),
  };
}

async function maybeBackfillMemberId(
  row: WaitlistRow,
  options: {
    pool?: ReturnType<typeof getPostgresPool>;
    supabase?: any;
  },
) {
  if (
    !row.email ||
    row.member_id ||
    !row.paid ||
    !row.paid_at ||
    !row.checkout_session_id
  ) {
    return row.member_id ?? null;
  }

  const memberId = buildMemberId({
    paidAt: row.paid_at,
    checkoutSessionId: row.checkout_session_id,
  });

  if (options.pool) {
    await options.pool.query(
      `
        update public.waitlist
        set member_id = $2,
            updated_at = now()
        where email = $1
          and member_id is null
      `,
      [row.email, memberId],
    );
    return memberId;
  }

  if (options.supabase) {
    const { error } = await options.supabase
      .from("waitlist")
      .update({
        member_id: memberId,
        updated_at: new Date().toISOString(),
      } as never)
      .eq("email", row.email)
      .is("member_id", null);

    if (error) {
      throw error;
    }
  }

  return memberId;
}

async function normalizeStoredLead(
  row: WaitlistRow,
  options: {
    pool?: ReturnType<typeof getPostgresPool>;
    supabase?: any;
  },
): Promise<StoredLead> {
  const memberId = await maybeBackfillMemberId(row, options);
  return normalizeLead({
    ...row,
    member_id: memberId,
  });
}

export function createLeadStore(): LeadStore {
  const config = getSupabaseConfig();
  const pool = getPostgresPool();

  return {
    async upsertLead(input) {
      if (pool) {
        await ensureWaitlistSchema(pool);
        const result = await pool.query<{
          email: string;
          member_id: string | null;
          paid: boolean | null;
          paid_at: string | null;
          priority_access: boolean | null;
          checkout_session_id: string | null;
        }>(
          `
            insert into public.waitlist (email, blocker, created_at, updated_at)
            values ($1, $2, now(), now())
            on conflict (email) do update
              set blocker = coalesce(excluded.blocker, public.waitlist.blocker),
                  updated_at = excluded.updated_at
            returning email, member_id, paid, paid_at, priority_access, checkout_session_id
          `,
          [input.email, input.blocker?.trim() || null],
        );

        return normalizeStoredLead(result.rows[0], { pool });
      }

      if (!config) {
        throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
      }

      const supabase = createClient(config.url, config.key);
      const now = new Date().toISOString();

      const { data: existing, error: selectError } = await supabase
        .from("waitlist")
        .select("email, member_id, paid, paid_at, priority_access, checkout_session_id")
        .eq("email", input.email)
        .maybeSingle<WaitlistRow>();

      if (selectError) {
        throw selectError;
      }

      const payload: Record<string, unknown> = {
        email: input.email,
        updated_at: now,
      };

      if (!existing) {
        payload.created_at = now;
      }

      if (input.blocker?.trim()) {
        payload.blocker = input.blocker.trim();
      }

      const { error: upsertError } = await supabase
        .from("waitlist")
        .upsert(payload, { onConflict: "email" });

      if (upsertError) {
        throw upsertError;
      }

      return normalizeStoredLead({
        email: input.email,
        member_id: existing?.member_id,
        paid: existing?.paid,
        paid_at: existing?.paid_at,
        priority_access: existing?.priority_access,
        checkout_session_id: existing?.checkout_session_id,
      }, { supabase });
    },
    async getLeadByEmail(email) {
      if (pool) {
        await ensureWaitlistSchema(pool);
        const result = await pool.query<{
          email: string;
          member_id: string | null;
          paid: boolean | null;
          paid_at: string | null;
          priority_access: boolean | null;
          checkout_session_id: string | null;
        }>(
          `
            select email, member_id, paid, paid_at, priority_access, checkout_session_id
            from public.waitlist
            where email = $1
            limit 1
          `,
          [email],
        );

        const row = result.rows[0];
        if (!row?.email) {
          return null;
        }

        return normalizeStoredLead(row, { pool });
      }

      if (!config) {
        throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
      }

      const supabase = createClient(config.url, config.key);
      const { data, error } = await supabase
        .from("waitlist")
        .select("email, member_id, paid, paid_at, priority_access, checkout_session_id")
        .eq("email", email)
        .maybeSingle<WaitlistRow>();

      if (error) {
        throw error;
      }

      if (!data?.email) {
        return null;
      }

      return normalizeStoredLead(data, { supabase });
    },
    async recordCheckoutSession(input) {
      if (pool) {
        await ensureWaitlistSchema(pool);
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
          [
            input.email,
            input.checkoutStartedAt,
            input.checkoutSessionId,
            input.checkoutStatus,
          ],
        );
        return;
      }

      if (!config) {
        throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
      }

      const supabase = createClient(config.url, config.key);
      const { error } = await supabase
        .from("waitlist")
        .upsert(
          {
            email: input.email,
            checkout_started_at: input.checkoutStartedAt,
            checkout_session_id: input.checkoutSessionId,
            checkout_status: input.checkoutStatus,
            updated_at: input.checkoutStartedAt,
          },
          { onConflict: "email" },
        );

      if (error) {
        throw error;
      }
    },
    async findLeadForWebhook(input) {
      if (pool) {
        await ensureWaitlistSchema(pool);
        const sessionMatch = await pool.query<{
          email: string;
          member_id: string | null;
          paid: boolean | null;
          paid_at: string | null;
          priority_access: boolean | null;
          checkout_session_id: string | null;
        }>(
          `
            select email, member_id, paid, paid_at, priority_access, checkout_session_id
            from public.waitlist
            where checkout_session_id = $1
            limit 1
          `,
          [input.checkoutSessionId],
        );

        const row = sessionMatch.rows[0]?.email
          ? sessionMatch.rows[0]
          : (
              await pool.query<{
                email: string;
                member_id: string | null;
                paid: boolean | null;
                paid_at: string | null;
                priority_access: boolean | null;
                checkout_session_id: string | null;
              }>(
                `
                  select email, member_id, paid, paid_at, priority_access, checkout_session_id
                  from public.waitlist
                  where email = $1
                  limit 1
                `,
                [input.email],
              )
            ).rows[0];

        if (!row?.email) {
          return null;
        }

        return normalizeStoredLead(row, { pool });
      }

      if (!config) {
        throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
      }

      const supabase = createClient(config.url, config.key);
      const { data: sessionMatch, error: sessionError } = await supabase
        .from("waitlist")
        .select("email, member_id, paid, paid_at, priority_access, checkout_session_id")
        .eq("checkout_session_id", input.checkoutSessionId)
        .maybeSingle<WaitlistRow>();

      if (sessionError) {
        throw sessionError;
      }

      const row = sessionMatch?.email
        ? sessionMatch
        : (
              await supabase
                .from("waitlist")
                .select("email, member_id, paid, paid_at, priority_access, checkout_session_id")
                .eq("email", input.email)
                .maybeSingle<WaitlistRow>()
          ).data;

      if (!row?.email) {
        return null;
      }

      return normalizeStoredLead(row, { supabase });
    },
    async getLeadByCheckoutSession(checkoutSessionId) {
      if (pool) {
        await ensureWaitlistSchema(pool);
        const result = await pool.query<{
          email: string;
          member_id: string | null;
          paid: boolean | null;
          paid_at: string | null;
          priority_access: boolean | null;
          checkout_session_id: string | null;
        }>(
          `
            select email, member_id, paid, paid_at, priority_access, checkout_session_id
            from public.waitlist
            where checkout_session_id = $1
            limit 1
          `,
          [checkoutSessionId],
        );

        const row = result.rows[0];
        return row?.email ? normalizeStoredLead(row, { pool }) : null;
      }

      if (!config) {
        throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
      }

      const supabase = createClient(config.url, config.key);
      const { data, error } = await supabase
        .from("waitlist")
        .select("email, member_id, paid, paid_at, priority_access, checkout_session_id")
        .eq("checkout_session_id", checkoutSessionId)
        .maybeSingle<WaitlistRow>();

      if (error) {
        throw error;
      }

      return data?.email ? normalizeStoredLead(data, { supabase }) : null;
    },
    async markLeadPaid(input) {
      const memberId = buildMemberId({
        paidAt: input.paidAt,
        checkoutSessionId: input.checkoutSessionId,
      });

      if (pool) {
        await ensureWaitlistSchema(pool);
        await pool.query(
          `
            insert into public.waitlist (
              email,
              member_id,
              paid,
              paid_at,
              priority_access,
              priority_source,
              checkout_status,
              checkout_session_id,
              updated_at
            )
            values ($1, $6, true, $2, true, $3, $4, $5, $2)
            on conflict (email) do update
              set paid = true,
                  member_id = coalesce(public.waitlist.member_id, excluded.member_id),
                  paid_at = excluded.paid_at,
                  priority_access = true,
                  priority_source = excluded.priority_source,
                  checkout_status = excluded.checkout_status,
                  checkout_session_id = excluded.checkout_session_id,
                  updated_at = excluded.updated_at
          `,
          [
            input.email,
            input.paidAt,
            input.prioritySource,
            input.checkoutStatus,
            input.checkoutSessionId,
            memberId,
          ],
        );
        return;
      }

      if (!config) {
        throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
      }

      const supabase = createClient(config.url, config.key);
      const { error } = await supabase
        .from("waitlist")
        .upsert(
          {
            email: input.email,
            member_id: memberId,
            paid: true,
            paid_at: input.paidAt,
            priority_access: true,
            priority_source: input.prioritySource,
            checkout_status: input.checkoutStatus,
            checkout_session_id: input.checkoutSessionId,
            updated_at: input.paidAt,
          },
          { onConflict: "email" },
        );

      if (error) {
        throw error;
      }
    },
  };
}
