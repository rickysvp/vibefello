import { describe, expect, it } from "vitest";
import { calculateConversionRate } from "../../api/_lib/admin-store";

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
