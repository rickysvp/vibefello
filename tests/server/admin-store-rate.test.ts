import { describe, expect, it } from "vitest";
import { addSessionIdsToSet, calculateConversionRate } from "../../api/_lib/admin-store";

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
