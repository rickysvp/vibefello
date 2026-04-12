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
});
