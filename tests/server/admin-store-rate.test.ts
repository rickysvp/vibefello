import { describe, expect, it } from "vitest";
import {
  addSessionIdsToSet,
  buildDailyMetrics,
  calculateConversionRate,
} from "../../api/_lib/admin-store";

describe("calculateConversionRate", () => {
  it("returns 0 when denominator is missing", () => {
    expect(calculateConversionRate(10, 0)).toBe(0);
  });

  it("returns the rounded conversion rate for normal cases", () => {
    expect(calculateConversionRate(3, 8)).toBe(0.375);
  });

  it("caps conversion rate at 1 when numerator is larger than denominator", () => {
    expect(calculateConversionRate(14, 1)).toBe(1);
  });
});

describe("addSessionIdsToSet", () => {
  it("adds only non-empty, trimmed session ids and deduplicates values", () => {
    const sessionIds = new Set<string>();

    addSessionIdsToSet(sessionIds, [
      { session_id: "abc-123" },
      { session_id: " abc-123 " },
      { session_id: "xyz-789" },
      { session_id: "" },
      { session_id: "   " },
      { session_id: null },
      { session_id: 42 },
    ]);

    expect(Array.from(sessionIds)).toEqual(["abc-123", "xyz-789"]);
  });
});

describe("buildDailyMetrics", () => {
  it("aggregates daily PV/UV/waitlist/paid with real-email filtering", () => {
    const startOfToday = new Date();
    startOfToday.setUTCHours(0, 0, 0, 0);
    const sinceIso = startOfToday.toISOString();

    const metrics = buildDailyMetrics({
      sinceIso,
      analyticsRows: [
        { session_id: "s1", event_name: "page_view", created_at: sinceIso },
        { session_id: "s1", event_name: "checkout_start", created_at: sinceIso },
        { session_id: "s2", event_name: "page_view", created_at: sinceIso },
      ],
      waitlistRows: [
        { email: "founder@example.com", created_at: sinceIso, paid: true, paid_at: sinceIso },
        { email: "invalid-email", created_at: sinceIso, paid: true, paid_at: sinceIso },
      ],
    });

    expect(metrics).toHaveLength(1);
    expect(metrics[0]).toEqual({
      date: sinceIso.slice(0, 10),
      pageViews: 2,
      uniqueVisitors: 2,
      waitlistLeads: 1,
      paidMembers: 1,
    });
  });
});
