import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../../src/server/create-app";
import type { LeadStore } from "../../src/server/lead-store";

function createLeadStoreMock(): LeadStore {
  return {
    upsertLead: vi.fn(),
  };
}

describe("createApp", () => {
  let leadStore: LeadStore;

  beforeEach(() => {
    leadStore = createLeadStoreMock();
  });

  it("returns ok from /api/health", async () => {
    const app = createApp();
    const response = await request(app).get("/api/health");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  it("upserts a lead and returns normalized status", async () => {
    vi.mocked(leadStore.upsertLead).mockResolvedValue({
      email: "founder@example.com",
      paid: false,
      priorityAccess: false,
    });

    const app = createApp({ leadStore });
    const response = await request(app)
      .post("/api/waitlist")
      .send({ email: "founder@example.com", blocker: "Stripe checkout keeps failing" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      success: true,
      email: "founder@example.com",
      paid: false,
      priorityAccess: false,
      message: "Lead captured",
    });
  });

  it("preserves paid and priority flags on repeat submission", async () => {
    vi.mocked(leadStore.upsertLead).mockResolvedValue({
      email: "founder@example.com",
      paid: true,
      priorityAccess: true,
    });

    const app = createApp({ leadStore });
    const response = await request(app)
      .post("/api/waitlist")
      .send({ email: "founder@example.com", blocker: "Need better launch support" });

    expect(response.status).toBe(200);
    expect(response.body.paid).toBe(true);
    expect(response.body.priorityAccess).toBe(true);
    expect(leadStore.upsertLead).toHaveBeenCalledWith({
      email: "founder@example.com",
      blocker: "Need better launch support",
    });
  });

  it("returns 400 for invalid email", async () => {
    const app = createApp({ leadStore });
    const response = await request(app)
      .post("/api/waitlist")
      .send({ email: "not-an-email", blocker: "Stripe webhook issue" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Please enter a valid email address." });
  });

  it("returns 400 for invalid blocker payload", async () => {
    const app = createApp({ leadStore });
    const response = await request(app)
      .post("/api/waitlist")
      .send({ email: "founder@example.com", blocker: "short" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Please provide a bit more detail (min 10 characters)." });
  });

  it("returns 500 when the lead store write fails", async () => {
    vi.mocked(leadStore.upsertLead).mockRejectedValue(new Error("supabase offline"));

    const app = createApp({ leadStore });
    const response = await request(app)
      .post("/api/waitlist")
      .send({ email: "founder@example.com", blocker: "Stripe checkout keeps failing" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Failed to save your request. Please try again." });
  });
});
