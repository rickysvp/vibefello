import request from "supertest";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createApp } from "../../src/server/create-app";
import type { LeadStore, StoredLead } from "../../src/server/lead-store";
import type { StripeService } from "../../src/server/stripe";

function createLeadStoreMock(): LeadStore {
  return {
    upsertLead: vi.fn(),
    getLeadByEmail: vi.fn(),
    recordCheckoutSession: vi.fn(),
  };
}

function createStripeServiceMock(): StripeService {
  return {
    createCheckoutSession: vi.fn(),
  };
}

describe("createApp", () => {
  let leadStore: LeadStore;
  let stripeService: StripeService;

  beforeEach(() => {
    leadStore = createLeadStoreMock();
    stripeService = createStripeServiceMock();
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

    const app = createApp({ leadStore, stripeService });
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

    const app = createApp({ leadStore, stripeService });
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
    const app = createApp({ leadStore, stripeService });
    const response = await request(app)
      .post("/api/waitlist")
      .send({ email: "not-an-email", blocker: "Stripe webhook issue" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Please enter a valid email address." });
  });

  it("returns 400 for invalid blocker payload", async () => {
    const app = createApp({ leadStore, stripeService });
    const response = await request(app)
      .post("/api/waitlist")
      .send({ email: "founder@example.com", blocker: "short" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Please provide a bit more detail (min 10 characters)." });
  });

  it("returns 500 when the lead store write fails", async () => {
    vi.mocked(leadStore.upsertLead).mockRejectedValue(new Error("supabase offline"));

    const app = createApp({ leadStore, stripeService });
    const response = await request(app)
      .post("/api/waitlist")
      .send({ email: "founder@example.com", blocker: "Stripe checkout keeps failing" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Failed to save your request. Please try again." });
  });

  it("rejects checkout when no lead exists", async () => {
    vi.mocked(leadStore.getLeadByEmail).mockResolvedValue(null);

    const app = createApp({ leadStore, stripeService });
    const response = await request(app)
      .post("/api/create-checkout-session")
      .send({ email: "founder@example.com" });

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Please submit your request before checkout." });
  });

  it("creates checkout for an existing unpaid lead and stores the session id", async () => {
    vi.mocked(leadStore.getLeadByEmail).mockResolvedValue({
      email: "founder@example.com",
      paid: false,
      priorityAccess: false,
    } satisfies StoredLead);
    vi.mocked(stripeService.createCheckoutSession).mockResolvedValue({
      id: "cs_test_123",
      url: "https://checkout.stripe.test/session/cs_test_123",
    });

    const app = createApp({ leadStore, stripeService });
    const response = await request(app)
      .post("/api/create-checkout-session")
      .send({ email: "founder@example.com" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      url: "https://checkout.stripe.test/session/cs_test_123",
    });
    expect(leadStore.recordCheckoutSession).toHaveBeenCalledWith({
      email: "founder@example.com",
      checkoutSessionId: "cs_test_123",
      checkoutStatus: "created",
      checkoutStartedAt: expect.any(String),
    });
  });

  it("does not create a new session for a paid lead", async () => {
    vi.mocked(leadStore.getLeadByEmail).mockResolvedValue({
      email: "founder@example.com",
      paid: true,
      priorityAccess: true,
    } satisfies StoredLead);

    const app = createApp({ leadStore, stripeService });
    const response = await request(app)
      .post("/api/create-checkout-session")
      .send({ email: "founder@example.com" });

    expect(response.status).toBe(409);
    expect(response.body).toEqual({ error: "Priority access already granted for this email." });
  });

  it("returns 500 when stripe session creation fails", async () => {
    vi.mocked(leadStore.getLeadByEmail).mockResolvedValue({
      email: "founder@example.com",
      paid: false,
      priorityAccess: false,
    } satisfies StoredLead);
    vi.mocked(stripeService.createCheckoutSession).mockRejectedValue(new Error("stripe offline"));

    const app = createApp({ leadStore, stripeService });
    const response = await request(app)
      .post("/api/create-checkout-session")
      .send({ email: "founder@example.com" });

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Failed to create checkout session." });
  });
});
