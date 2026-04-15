import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const poolMock = {
  query: vi.fn(),
};

vi.mock("../../api/_lib/postgres.js", () => ({
  getPostgresPool: () => poolMock,
}));

vi.mock("../../api/_lib/env.js", () => ({
  getSupabaseConfig: () => null,
}));

function createResponse() {
  return {
    headers: {} as Record<string, string>,
    statusCode: 200,
    body: undefined as unknown,
    setHeader(name: string, value: string) {
      this.headers[name] = value;
    },
    status(code: number) {
      this.statusCode = code;
      return this;
    },
    json(payload: unknown) {
      this.body = payload;
      return this;
    },
    end() {
      return this;
    },
  };
}

describe("waitlist-count handler", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns real total and 24h waitlist counts from the waitlist table", async () => {
    poolMock.query
      .mockResolvedValueOnce({
        rows: [
          {
            total_count: 8,
            recent_24h_count: 2,
          },
        ],
      });

    const { default: handler } = await import("../../api/waitlist-count");
    const res = createResponse();

    await handler({ method: "GET" }, res);

    expect(poolMock.query).toHaveBeenCalledTimes(1);
    expect(poolMock.query.mock.calls[0]?.[0]).toContain("from public.waitlist");
    expect(poolMock.query.mock.calls[0]?.[0]).toContain("recent_24h_count");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        count: 8,
        recent24h: 2,
        source: "real",
      }),
    );
  });

  it("accepts POST but only returns real counts (no synthetic increment)", async () => {
    poolMock.query
      .mockResolvedValueOnce({
        rows: [
          {
            total_count: 9,
            recent_24h_count: 1,
          },
        ],
      });

    const { default: handler } = await import("../../api/waitlist-count");
    const res = createResponse();

    await handler({ method: "POST" }, res);

    expect(poolMock.query).toHaveBeenCalledTimes(1);
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        count: 9,
        recent24h: 1,
        source: "real",
      }),
    );
  });
});
