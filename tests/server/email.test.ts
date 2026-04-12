import { describe, expect, it } from "vitest";
import {
  buildPriorityAccessEmailHtml,
  buildWaitlistConfirmationEmailHtml,
} from "../../src/server/email";

describe("buildWaitlistConfirmationEmailHtml", () => {
  it("confirms the user joined the waitlist without using the payment confirmation copy", () => {
    const html = buildWaitlistConfirmationEmailHtml("founder@example.com");

    expect(html).toContain("founder@example.com");
    expect(html.toLowerCase()).toContain("waitlist");
    expect(html.toLowerCase()).not.toContain("priority access is confirmed");
  });
});

describe("buildPriorityAccessEmailHtml", () => {
  it("includes the official x follow instruction in the paid member email", () => {
    const html = buildPriorityAccessEmailHtml("founder@example.com");

    expect(html).toContain("https://x.com/vibefello");
    expect(html.toLowerCase()).toContain("follow");
    expect(html.toLowerCase()).toContain("founding");
  });
});
