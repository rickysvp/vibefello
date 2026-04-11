import { createClient } from "@supabase/supabase-js";
import { getSupabaseConfig } from "./env";

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

  return {
    async upsertLead(input) {
      if (!config) {
        throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY are required");
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
      if (!config) {
        throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY are required");
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
      if (!config) {
        throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY are required");
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
      if (!config) {
        throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY are required");
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
      if (!config) {
        throw new Error("SUPABASE_URL and SUPABASE_ANON_KEY are required");
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
