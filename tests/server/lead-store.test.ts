import { afterEach, describe, expect, it, vi } from "vitest";

const poolMock = {
  query: vi.fn(),
};

vi.mock("pg", () => ({
  Pool: vi.fn(() => poolMock),
}));

describe("lead store postgres fallback", () => {
  afterEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    delete process.env.DATABASE_URL;
    delete (globalThis as typeof globalThis & {
      __vibefelloWaitlistPool?: unknown;
      __vibefelloWaitlistSchemaPromise?: Promise<void>;
    }).__vibefelloWaitlistPool;
    delete (globalThis as typeof globalThis & {
      __vibefelloWaitlistPool?: unknown;
      __vibefelloWaitlistSchemaPromise?: Promise<void>;
    }).__vibefelloWaitlistSchemaPromise;
  });

  it("uses postgres and bootstraps waitlist schema when DATABASE_URL is set", async () => {
    process.env.DATABASE_URL = "postgres://launch:test@localhost:5432/vibefello";

    poolMock.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            email: "founder@example.com",
            paid: false,
            priority_access: false,
          },
        ],
      });

    const { createLeadStore } = await import("../../src/server/lead-store");
    const store = createLeadStore();
    const lead = await store.upsertLead({
      email: "founder@example.com",
      blocker: "Need production launch help",
    });

    expect(lead).toEqual({
      email: "founder@example.com",
      memberId: null,
      paid: false,
      priorityAccess: false,
    });
    expect(poolMock.query).toHaveBeenCalledTimes(2);
    expect(poolMock.query.mock.calls[0]?.[0]).toContain("create table if not exists public.waitlist");
    expect(poolMock.query.mock.calls[1]?.[0]).toContain("insert into public.waitlist");
    expect(poolMock.query.mock.calls[1]?.[1]).toEqual([
      "founder@example.com",
      "Need production launch help",
    ]);
  });

  it("stores a member id when marking a paid lead in postgres", async () => {
    process.env.DATABASE_URL = "postgres://launch:test@localhost:5432/vibefello";

    poolMock.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({ rows: [] });

    const { createLeadStore } = await import("../../src/server/lead-store");
    const store = createLeadStore();

    await store.markLeadPaid({
      email: "founder@example.com",
      paidAt: "2026-04-14T12:00:00.000Z",
      prioritySource: "stripe_checkout",
      checkoutStatus: "completed",
      checkoutSessionId: "cs_live_member_12345678",
    });

    expect(poolMock.query).toHaveBeenCalledTimes(2);
    expect(poolMock.query.mock.calls[1]?.[0]).toContain("member_id");
    expect(poolMock.query.mock.calls[1]?.[1]).toEqual([
      "founder@example.com",
      "2026-04-14T12:00:00.000Z",
      "stripe_checkout",
      "completed",
      "cs_live_member_12345678",
      "VF-2026-12345678",
    ]);
  });

  it("backfills a missing member id for an already-paid postgres lead", async () => {
    process.env.DATABASE_URL = "postgres://launch:test@localhost:5432/vibefello";

    poolMock.query
      .mockResolvedValueOnce({ rows: [] })
      .mockResolvedValueOnce({
        rows: [
          {
            email: "founder@example.com",
            member_id: null,
            paid: true,
            paid_at: "2026-04-14T12:00:00.000Z",
            priority_access: true,
            checkout_session_id: "cs_live_member_12345678",
          },
        ],
      })
      .mockResolvedValueOnce({ rows: [] });

    const { createLeadStore } = await import("../../src/server/lead-store");
    const store = createLeadStore();
    const lead = await store.getLeadByEmail("founder@example.com");

    expect(lead).toEqual({
      email: "founder@example.com",
      memberId: "VF-2026-12345678",
      paid: true,
      priorityAccess: true,
    });
    expect(poolMock.query).toHaveBeenCalledTimes(3);
    expect(poolMock.query.mock.calls[2]?.[0]).toContain("set member_id = $2");
    expect(poolMock.query.mock.calls[2]?.[1]).toEqual([
      "founder@example.com",
      "VF-2026-12345678",
    ]);
  });
});
