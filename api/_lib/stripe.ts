import Stripe from "stripe";
import {
  getAppUrl,
  getStripeFoundingMemberPriceId,
  getStripeWebhookSecret,
} from "./env";

let stripeClient: Stripe | null = null;

export type CheckoutSession = {
  id: string;
  url: string;
};

export type StripeService = {
  createCheckoutSession: (input: { email: string; port: number }) => Promise<CheckoutSession>;
  constructWebhookEvent: (input: { body: Buffer; signature: string }) => StripeEvent;
};

export type StripeEvent = {
  type: string;
  data: {
    object: {
      id: string;
      customer_details?: {
        email?: string | null;
      } | null;
      metadata?: Record<string, string | undefined> | null;
    };
  };
};

export function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY environment variable is required");
    }
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

export function createStripeService(): StripeService {
  return {
    async createCheckoutSession({ email, port }) {
      const stripe = getStripe();
      const appUrl = getAppUrl(port);
      const foundingMemberPriceId = getStripeFoundingMemberPriceId();
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: email,
        metadata: {
          email,
          source: "landing_page",
        },
        line_items: foundingMemberPriceId
          ? [{ price: foundingMemberPriceId, quantity: 1 }]
          : [
              {
                price_data: {
                  currency: "usd",
                  product_data: {
                    name: "VibeFello Priority Access",
                    description: "Priority access request for manual VibeFello follow-up.",
                  },
                  unit_amount: 99900,
                },
                quantity: 1,
              },
            ],
        mode: "payment",
        success_url: `${appUrl}?payment=success`,
        cancel_url: `${appUrl}?payment=cancel`,
      });

      if (!session.url) {
        throw new Error("Stripe checkout session did not include a URL");
      }

      return {
        id: session.id,
        url: session.url,
      };
    },
    constructWebhookEvent({ body, signature }) {
      const stripe = getStripe();
      const webhookSecret = getStripeWebhookSecret();

      if (!webhookSecret) {
        throw new Error("STRIPE_WEBHOOK_SECRET environment variable is required");
      }

      return stripe.webhooks.constructEvent(body, signature, webhookSecret) as unknown as StripeEvent;
    },
  };
}
