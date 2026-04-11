import { describe, expect, it } from "vitest";
import { buildPriorityAccessEmailHtml } from "../../src/server/email";

describe("buildPriorityAccessEmailHtml", () => {
  it("includes the official x follow instruction in the success email", () => {
    const html = buildPriorityAccessEmailHtml("founder@example.com");

    expect(html).toContain("https://x.com/vibefello");
    expect(html.toLowerCase()).toContain("follow");
  });
});
