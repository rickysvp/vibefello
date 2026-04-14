import { beforeEach, describe, expect, it, vi } from "vitest";
import type { EmailService } from "../../src/server/email";
import type { LeadStore, StoredLead } from "../../src/server/lead-store";
import {
  createRuntimeDependencies,
  handleCreateCheckoutSessionRequest,
  handleHealthRequest,
  handleMemberStatusRequest,
  handleWaitlistRequest,
  handleWebhookRequest,
} from "../../src/server/route-handlers";
import type { StripeEvent, StripeService } from "../../src/server/stripe";

function createLeadStoreMock(): LeadStore {
  return {
    upsertLead: vi.fn(),
    getLeadByEmail: vi.fn(),
    getLeadByCheckoutSession: vi.fn(),
    recordCheckoutSession: vi.fn(),
    findLeadForWebhook: vi.fn(),
    markLeadPaid: vi.fn(),
  };
}

function createStripeServiceMock(): StripeService {
  return {
    createCheckoutSession: vi.fn(),
    constructWebhookEvent: vi.fn(),
    retrieveCheckoutSession: vi.fn(),
  };
}

function createEmailServiceMock(): EmailService {
  return {
    sendWaitlistConfirmationEmail: vi.fn(),
    sendPriorityAccessEmail: vi.fn(),
  };
}

describe("server handlers", () => {
  let leadStore: LeadStore;
  let stripeService: StripeService;
  let emailService: EmailService;

  beforeEach(() => {
    leadStore = createLeadStoreMock();
    stripeService = createStripeServiceMock();
    emailService = createEmailServiceMock();
  });

  function createDeps() {
    return createRuntimeDependencies({
      leadStore,
      stripeService,
      emailService,
      port: 3000,
    });
  }

  it("returns ok from /api/health", async () => {
    const response = await handleHealthRequest();
    expect(response).toEqual({
      status: 200,
      json: { status: "ok" },
    });
  });

  it("upserts a lead and returns normalized status", async () => {
    vi.mocked(leadStore.upsertLead).mockResolvedValue({
      email: "founder@example.com",
      memberId: null,
      paid: false,
      priorityAccess: false,
    });

    const response = await handleWaitlistRequest(
      { email: "founder@example.com", blocker: "Stripe checkout keeps failing" },
      createDeps(),
    );

    expect(response).toEqual({
      status: 200,
      json: {
        success: true,
        email: "founder@example.com",
        memberId: null,
        paid: false,
        priorityAccess: false,
        message: "Lead captured",
      },
    });
    expect(emailService.sendWaitlistConfirmationEmail).toHaveBeenCalledWith("founder@example.com");
  });

  it("preserves paid and priority flags on repeat submission", async () => {
    vi.mocked(leadStore.upsertLead).mockResolvedValue({
      email: "founder@example.com",
      memberId: "VF-2026-AB12CD34",
      paid: true,
      priorityAccess: true,
    });

    const response = await handleWaitlistRequest(
      { email: "founder@example.com", blocker: "Need better launch support" },
      createDeps(),
    );

    expect(response).toEqual({
      status: 200,
      json: {
        success: true,
        email: "founder@example.com",
        memberId: "VF-2026-AB12CD34",
        paid: true,
        priorityAccess: true,
        message: "Lead captured",
      },
    });
    expect(leadStore.upsertLead).toHaveBeenCalledWith({
      email: "founder@example.com",
      blocker: "Need better launch support",
    });
    expect(emailService.sendWaitlistConfirmationEmail).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid email", async () => {
    const response = await handleWaitlistRequest(
      { email: "not-an-email", blocker: "Stripe webhook issue" },
      createDeps(),
    );

    expect(response).toEqual({
      status: 400,
      json: { error: "Please enter a valid email address." },
    });
  });

  it("returns 400 for invalid blocker payload", async () => {
    const response = await handleWaitlistRequest(
      { email: "founder@example.com", blocker: "short" },
      createDeps(),
    );

    expect(response).toEqual({
      status: 400,
      json: { error: "Please provide a bit more detail (min 10 characters)." },
    });
  });

  it("returns 500 when the lead store write fails", async () => {
    vi.mocked(leadStore.upsertLead).mockRejectedValue(new Error("supabase offline"));

    const response = await handleWaitlistRequest(
      { email: "founder@example.com", blocker: "Stripe checkout keeps failing" },
      createDeps(),
    );

    expect(response).toEqual({
      status: 500,
      json: { error: "Failed to save your request. Please try again." },
    });
  });

  it("rejects checkout when no lead exists", async () => {
    vi.mocked(leadStore.getLeadByEmail).mockResolvedValue(null);

    const response = await handleCreateCheckoutSessionRequest(
      { email: "founder@example.com" },
      createDeps(),
    );

    expect(response).toEqual({
      status: 400,
      json: { error: "Please submit your request before checkout." },
    });
  });

  it("creates checkout for an existing unpaid lead and stores the session id", async () => {
    vi.mocked(leadStore.getLeadByEmail).mockResolvedValue({
      email: "founder@example.com",
      memberId: null,
      paid: false,
      priorityAccess: false,
    } satisfies StoredLead);
    vi.mocked(stripeService.createCheckoutSession).mockResolvedValue({
      id: "cs_test_123",
      url: "https://checkout.stripe.test/session/cs_test_123",
    });

    const response = await handleCreateCheckoutSessionRequest(
      { email: "founder@example.com" },
      createDeps(),
    );

    expect(response).toEqual({
      status: 200,
      json: {
        url: "https://checkout.stripe.test/session/cs_test_123",
      },
    });
    expect(leadStore.recordCheckoutSession).toHaveBeenCalledWith({
      email: "founder@example.com",
      checkoutSessionId: "cs_test_123",
      checkoutStatus: "created",
      checkoutStartedAt: expect.any(String),
    });
  });

  it("returns persisted member status for a completed checkout session", async () => {
    vi.mocked(leadStore.getLeadByCheckoutSession).mockResolvedValue({
      email: "founder@example.com",
      memberId: "VF-2026-AB12CD34",
      paid: true,
      priorityAccess: true,
    } satisfies StoredLead);

    const response = await handleMemberStatusRequest(
      { session_id: "cs_live_member_123" },
      createDeps(),
    );

    expect(response).toEqual({
      status: 200,
      json: {
        email: "founder@example.com",
        memberId: "VF-2026-AB12CD34",
        paid: true,
        priorityAccess: true,
      },
    });
    expect(leadStore.getLeadByCheckoutSession).toHaveBeenCalledWith("cs_live_member_123");
  });

  it("backfills member status from Stripe when the checkout is paid but webhook has not updated the lead yet", async () => {
    vi.mocked(leadStore.getLeadByCheckoutSession)
      .mockResolvedValueOnce({
        email: "founder@example.com",
        memberId: null,
        paid: false,
        priorityAccess: false,
      } satisfies StoredLead)
      .mockResolvedValueOnce({
        email: "founder@example.com",
        memberId: "VF-2026-AB12CD34",
        paid: true,
        priorityAccess: true,
      } satisfies StoredLead);
    vi.mocked(stripeService.retrieveCheckoutSession).mockResolvedValue({
      id: "cs_live_member_123",
      paymentStatus: "paid",
      status: "complete",
      customerEmail: "founder@example.com",
    });

    const response = await handleMemberStatusRequest(
      { session_id: "cs_live_member_123" },
      createDeps(),
    );

    expect(stripeService.retrieveCheckoutSession).toHaveBeenCalledWith("cs_live_member_123");
    expect(leadStore.markLeadPaid).toHaveBeenCalledWith({
      email: "founder@example.com",
      paidAt: expect.any(String),
      prioritySource: "stripe_checkout",
      checkoutStatus: "completed",
      checkoutSessionId: "cs_live_member_123",
    });
    expect(emailService.sendPriorityAccessEmail).toHaveBeenCalledWith("founder@example.com");
    expect(response).toEqual({
      status: 200,
      json: {
        email: "founder@example.com",
        memberId: "VF-2026-AB12CD34",
        paid: true,
        priorityAccess: true,
      },
    });
  });

  it("does not create a new session for a paid lead", async () => {
    vi.mocked(leadStore.getLeadByEmail).mockResolvedValue({
      email: "founder@example.com",
      memberId: null,
      paid: true,
      priorityAccess: true,
    } satisfies StoredLead);

    const response = await handleCreateCheckoutSessionRequest(
      { email: "founder@example.com" },
      createDeps(),
    );

    expect(response).toEqual({
      status: 409,
      json: { error: "Priority access already granted for this email." },
    });
  });

  it("returns 500 when stripe session creation fails", async () => {
    vi.mocked(leadStore.getLeadByEmail).mockResolvedValue({
      email: "founder@example.com",
      memberId: null,
      paid: false,
      priorityAccess: false,
    } satisfies StoredLead);
    vi.mocked(stripeService.createCheckoutSession).mockRejectedValue(new Error("stripe offline"));

    const response = await handleCreateCheckoutSessionRequest(
      { email: "founder@example.com" },
      createDeps(),
    );

    expect(response).toEqual({
      status: 500,
      json: { error: "Failed to create checkout session." },
    });
  });

  it("marks a matching lead as paid and priority_access true", async () => {
    vi.mocked(stripeService.constructWebhookEvent).mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_123",
          customer_details: { email: "founder@example.com" },
          metadata: { email: "founder@example.com" },
        },
      },
    } satisfies StripeEvent);
    vi.mocked(leadStore.findLeadForWebhook).mockResolvedValue({
      email: "founder@example.com",
      memberId: null,
      paid: false,
      priorityAccess: false,
    });

    const response = await handleWebhookRequest(
      Buffer.from("{}"),
      "sig_test",
      createDeps(),
    );

    expect(response).toEqual({
      status: 200,
      json: { received: true },
    });
    expect(leadStore.markLeadPaid).toHaveBeenCalledWith({
      email: "founder@example.com",
      paidAt: expect.any(String),
      prioritySource: "stripe_checkout",
      checkoutStatus: "completed",
      checkoutSessionId: "cs_test_123",
    });
    expect(emailService.sendPriorityAccessEmail).toHaveBeenCalledWith("founder@example.com");
  });

  it("falls back to email match when session id was overwritten", async () => {
    vi.mocked(stripeService.constructWebhookEvent).mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_old",
          customer_details: { email: "founder@example.com" },
          metadata: { email: "founder@example.com" },
        },
      },
    } satisfies StripeEvent);
    vi.mocked(leadStore.findLeadForWebhook).mockResolvedValue({
      email: "founder@example.com",
      memberId: null,
      paid: false,
      priorityAccess: false,
    });

    const response = await handleWebhookRequest(
      Buffer.from("{}"),
      "sig_test",
      createDeps(),
    );

    expect(response).toEqual({
      status: 200,
      json: { received: true },
    });
    expect(leadStore.markLeadPaid).toHaveBeenCalledTimes(1);
  });

  it("returns 400 for invalid webhook signatures", async () => {
    vi.mocked(stripeService.constructWebhookEvent).mockImplementation(() => {
      throw new Error("invalid signature");
    });

    const response = await handleWebhookRequest(
      Buffer.from("{}"),
      "bad_sig",
      createDeps(),
    );

    expect(response).toEqual({
      status: 400,
      text: "Webhook Error",
    });
  });

  it("logs unmatched webhook events without mutating state", async () => {
    const logSpy = vi.spyOn(console, "warn").mockImplementation(() => undefined);
    vi.mocked(stripeService.constructWebhookEvent).mockReturnValue({
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_123",
          customer_details: { email: "founder@example.com" },
          metadata: { email: "founder@example.com" },
        },
      },
    } satisfies StripeEvent);
    vi.mocked(leadStore.findLeadForWebhook).mockResolvedValue(null);

    const response = await handleWebhookRequest(
      Buffer.from("{}"),
      "sig_test",
      createDeps(),
    );

    expect(response).toEqual({
      status: 200,
      json: { received: true },
    });
    expect(leadStore.markLeadPaid).not.toHaveBeenCalled();
    expect(logSpy).toHaveBeenCalled();
    logSpy.mockRestore();
  });
});
