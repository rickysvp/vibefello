import { createAdminStore, type AdminStore, type AnalyticsEventName } from "./admin-store.js";
import { validateAdminToken } from "./admin-auth.js";
import { isValidEmail, type HandlerResult } from "./route-handlers.js";

const TRACKED_EVENT_NAMES = new Set<AnalyticsEventName>([
  "page_view",
  "waitlist_submit",
  "checkout_start",
  "payment_success",
]);

export type AdminRuntimeDependencies = {
  adminStore?: AdminStore;
};

export function createAdminDependencies(
  overrides: AdminRuntimeDependencies = {},
): Required<AdminRuntimeDependencies> {
  return {
    adminStore: overrides.adminStore ?? createAdminStore(),
  };
}

function toMetadata(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function parseRangeDays(query: unknown) {
  const rawValue = (query as { range_days?: unknown })?.range_days;
  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed)) {
    return 30;
  }

  return Math.min(90, Math.max(1, Math.floor(parsed)));
}

function parseLimit(query: unknown) {
  const rawValue = (query as { limit?: unknown })?.limit;
  const parsed = Number(rawValue);
  if (!Number.isFinite(parsed)) {
    return 100;
  }

  return Math.min(500, Math.max(1, Math.floor(parsed)));
}

export async function handleTrackEventRequest(
  body: unknown,
  dependencies: Required<AdminRuntimeDependencies>,
): Promise<HandlerResult> {
  const rawEventName = typeof (body as { event?: unknown })?.event === "string"
    ? ((body as { event: string }).event).trim()
    : "";
  const sessionId = typeof (body as { sessionId?: unknown })?.sessionId === "string"
    ? ((body as { sessionId: string }).sessionId).trim()
    : "";
  const email = typeof (body as { email?: unknown })?.email === "string"
    ? ((body as { email: string }).email).trim().toLowerCase()
    : null;
  const path = typeof (body as { path?: unknown })?.path === "string"
    ? (body as { path: string }).path.trim()
    : null;
  const referrer = typeof (body as { referrer?: unknown })?.referrer === "string"
    ? (body as { referrer: string }).referrer.trim()
    : null;
  const userAgent = typeof (body as { userAgent?: unknown })?.userAgent === "string"
    ? (body as { userAgent: string }).userAgent.trim()
    : null;
  const metadata = toMetadata((body as { metadata?: unknown })?.metadata);

  if (!TRACKED_EVENT_NAMES.has(rawEventName as AnalyticsEventName)) {
    return {
      status: 400,
      json: { error: "Unsupported event." },
    };
  }
  const eventName = rawEventName as AnalyticsEventName;

  if (!sessionId || sessionId.length > 128) {
    return {
      status: 400,
      json: { error: "Invalid session id." },
    };
  }

  if (email && !isValidEmail(email)) {
    return {
      status: 400,
      json: { error: "Invalid email." },
    };
  }

  try {
    await dependencies.adminStore.recordAnalyticsEvent({
      sessionId,
      eventName,
      email,
      path,
      referrer,
      userAgent,
      metadata,
    });

    return {
      status: 202,
      json: { success: true },
    };
  } catch (error) {
    console.error("Failed to record analytics event:", error);
    return {
      status: 500,
      json: { error: "Failed to record analytics event." },
    };
  }
}

export async function handleAdminStatsRequest(
  query: unknown,
  headers: Record<string, unknown> | undefined,
  dependencies: Required<AdminRuntimeDependencies>,
): Promise<HandlerResult> {
  const auth = validateAdminToken(headers);
  if (!auth.ok) {
    return {
      status: auth.status,
      json: { error: auth.message },
    };
  }

  const rangeDays = parseRangeDays(query);
  try {
    const stats = await dependencies.adminStore.getDashboard({ rangeDays });
    return {
      status: 200,
      json: stats,
    };
  } catch (error) {
    console.error("Failed to load admin stats:", error);
    return {
      status: 500,
      json: { error: "Failed to load admin stats." },
    };
  }
}

export async function handleAdminLeadsRequest(
  query: unknown,
  headers: Record<string, unknown> | undefined,
  dependencies: Required<AdminRuntimeDependencies>,
): Promise<HandlerResult> {
  const auth = validateAdminToken(headers);
  if (!auth.ok) {
    return {
      status: auth.status,
      json: { error: auth.message },
    };
  }

  const limit = parseLimit(query);

  try {
    const leads = await dependencies.adminStore.listLeads({ limit });
    return {
      status: 200,
      json: {
        count: leads.length,
        leads,
      },
    };
  } catch (error) {
    console.error("Failed to load admin leads:", error);
    return {
      status: 500,
      json: { error: "Failed to load admin leads." },
    };
  }
}
