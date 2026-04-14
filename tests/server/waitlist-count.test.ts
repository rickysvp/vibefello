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

  it("bootstraps the counter table on GET before reading the count", async () => {
    poolMock.query
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({})
      .mockResolvedValueOnce({ rows: [{ count: 8 }] });

    const { default: handler } = await import("../../api/waitlist-count");
    const res = createResponse();

    await handler({ method: "GET" }, res);

    expect(poolMock.query).toHaveBeenCalledTimes(3);
    expect(poolMock.query.mock.calls[0]?.[0]).toContain("CREATE TABLE IF NOT EXISTS public.waitlist_counter");
    expect(poolMock.query.mock.calls[1]?.[0]).toContain("INSERT INTO public.waitlist_counter");
    expect(poolMock.query.mock.calls[2]?.[0]).toContain("SELECT count FROM public.waitlist_counter");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ count: 8 });
  });
});
