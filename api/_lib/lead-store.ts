import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./env";
import { ensureWaitlistSchema, getPostgresPool } from "./postgres";

export type LeadState = {
  email: string;
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
  paid?: boolean | null;
  priority_access?: boolean | null;
};

export function createLeadStore(): LeadStore {
  const config = getSupabaseConfig();
  const pool = getPostgresPool();

  return {
    async upsertLead(input) {
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
          [input.email, input.blocker?.trim() || null],
        );

        const row = result.rows[0];
        return {
          email: row.email,
          paid: Boolean(row.paid),
          priorityAccess: Boolean(row.priority_access),
        };
      }

      if (!config) {
        throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
      }

      const supabase = createClient(config.url, config.key);
      const now = new Date().toISOString();

      const { data: existing, error: selectError } = await supabase
        .from("waitlist")
        .select("email, paid, priority_access")
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

      return {
        email: input.email,
        paid: Boolean(existing?.paid),
        priorityAccess: Boolean(existing?.priority_access),
      };
    },
    async getLeadByEmail(email) {
      if (pool) {
        await ensureWaitlistSchema(pool);
        const result = await pool.query<{
          email: string;
          paid: boolean | null;
          priority_access: boolean | null;
        }>(
          `
            select email, paid, priority_access
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

        return {
          email: row.email,
          paid: Boolean(row.paid),
          priorityAccess: Boolean(row.priority_access),
        };
      }

      if (!config) {
        throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
      }

      const supabase = createClient(config.url, config.key);
      const { data, error } = await supabase
        .from("waitlist")
        .select("email, paid, priority_access")
        .eq("email", email)
        .maybeSingle<WaitlistRow>();

      if (error) {
        throw error;
      }

      if (!data?.email) {
        return null;
      }

      return {
        email: data.email,
        paid: Boolean(data.paid),
        priorityAccess: Boolean(data.priority_access),
      };
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
          paid: boolean | null;
          priority_access: boolean | null;
        }>(
          `
            select email, paid, priority_access
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
                paid: boolean | null;
                priority_access: boolean | null;
              }>(
                `
                  select email, paid, priority_access
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

        return {
          email: row.email,
          paid: Boolean(row.paid),
          priorityAccess: Boolean(row.priority_access),
        };
      }

      if (!config) {
        throw new Error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required");
      }

      const supabase = createClient(config.url, config.key);
      const { data: sessionMatch, error: sessionError } = await supabase
        .from("waitlist")
        .select("email, paid, priority_access")
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
              .select("email, paid, priority_access")
              .eq("email", input.email)
              .maybeSingle<WaitlistRow>()
          ).data;

      if (!row?.email) {
        return null;
      }

      return {
        email: row.email,
        paid: Boolean(row.paid),
        priorityAccess: Boolean(row.priority_access),
      };
    },
    async markLeadPaid(input) {
      if (pool) {
        await ensureWaitlistSchema(pool);
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
          [
            input.email,
            input.paidAt,
            input.prioritySource,
            input.checkoutStatus,
            input.checkoutSessionId,
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
