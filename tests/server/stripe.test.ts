import { beforeEach, describe, expect, it, vi } from "vitest";

const createCheckoutSession = vi.fn();

vi.mock("stripe", () => {
  return {
    default: vi.fn().mockImplementation(() => ({
      checkout: {
        sessions: {
          create: createCheckoutSession,
        },
      },
      webhooks: {
        constructEvent: vi.fn(),
      },
    })),
  };
});

describe("createStripeService", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = "sk_test_example";
    process.env.APP_URL = "https://www.vibefello.com";
    delete process.env.STRIPE_FOUNDING_MEMBER_PRICE_ID;
    delete process.env.STRIPE_STATEMENT_DESCRIPTOR_SUFFIX;
  });

  it("uses the configured Stripe price id for founding member checkout", async () => {
    process.env.STRIPE_FOUNDING_MEMBER_PRICE_ID = "price_live_hkd_1";
    createCheckoutSession.mockResolvedValue({
      id: "cs_test_price_id",
      url: "https://checkout.stripe.com/c/pay/cs_test_price_id",
    });

    const { createStripeService } = await import("../../src/server/stripe");
    const stripeService = createStripeService();

    await stripeService.createCheckoutSession({
      email: "founder@example.com",
      port: 3000,
    });

    expect(createCheckoutSession).toHaveBeenCalledWith(
      expect.objectContaining({
        customer_email: "founder@example.com",
        mode: "payment",
        success_url: "https://www.vibefello.com?payment=success&session_id={CHECKOUT_SESSION_ID}",
        cancel_url: "https://www.vibefello.com?payment=cancel",
        payment_intent_data: {
          statement_descriptor_suffix: "VIBEFELLO",
        },
        line_items: [{ price: "price_live_hkd_1", quantity: 1 }],
      }),
    );
  });

  it("uses the default production price id when no env override is configured", async () => {
    createCheckoutSession.mockResolvedValue({
      id: "cs_test_inline_price",
      url: "https://checkout.stripe.com/c/pay/cs_test_inline_price",
    });

    const { createStripeService } = await import("../../src/server/stripe");
    const stripeService = createStripeService();

    await stripeService.createCheckoutSession({
      email: "founder@example.com",
      port: 3000,
    });

    expect(createCheckoutSession).toHaveBeenCalledWith(
      expect.objectContaining({
        line_items: [{ price: "price_1TLPTq9cc7XZtkzuTL1NNJP6", quantity: 1 }],
      }),
    );
  });
});
