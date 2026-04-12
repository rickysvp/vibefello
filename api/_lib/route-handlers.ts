import { createEmailService, type EmailService } from "./email";
import { createLeadStore, type LeadStore } from "./lead-store";
import { createStripeService, type StripeService } from "./stripe";

export type RuntimeDependencies = {
  leadStore?: LeadStore;
  stripeService?: StripeService;
  emailService?: EmailService;
  port?: number;
};

export type HandlerResult =
  | { status: number; json: unknown }
  | { status: number; text: string };

export function createRuntimeDependencies(
  overrides: RuntimeDependencies = {},
): Required<RuntimeDependencies> {
  return {
    leadStore: overrides.leadStore ?? createLeadStore(),
    stripeService: overrides.stripeService ?? createStripeService(),
    emailService: overrides.emailService ?? createEmailService(),
    port: overrides.port ?? 3000,
  };
}

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidBlocker(blocker?: string) {
  return blocker === undefined || blocker.trim().length >= 10;
}

export async function handleHealthRequest(): Promise<HandlerResult> {
  return {
    status: 200,
    json: { status: "ok" },
  };
}

export async function handleWaitlistRequest(
  body: unknown,
  dependencies: Required<RuntimeDependencies>,
): Promise<HandlerResult> {
  const email = typeof (body as { email?: unknown })?.email === "string"
    ? ((body as { email: string }).email).trim()
    : "";
  const blocker = typeof (body as { blocker?: unknown })?.blocker === "string"
    ? (body as { blocker: string }).blocker
    : undefined;

  if (!isValidEmail(email)) {
    return {
      status: 400,
      json: { error: "Please enter a valid email address." },
    };
  }

  if (!isValidBlocker(blocker)) {
    return {
      status: 400,
      json: { error: "Please provide a bit more detail (min 10 characters)." },
    };
  }

  try {
    const lead = await dependencies.leadStore.upsertLead({ email, blocker });

    if (!lead.paid && !lead.priorityAccess) {
      await dependencies.emailService.sendWaitlistConfirmationEmail(lead.email);
    }

    return {
      status: 200,
      json: {
        success: true,
        email: lead.email,
        paid: lead.paid,
        priorityAccess: lead.priorityAccess,
        message: "Lead captured",
      },
    };
  } catch (error) {
    console.error("Failed to upsert waitlist lead:", error);
    return {
      status: 500,
      json: { error: "Failed to save your request. Please try again." },
    };
  }
}

export async function handleCreateCheckoutSessionRequest(
  body: unknown,
  dependencies: Required<RuntimeDependencies>,
): Promise<HandlerResult> {
  const email = typeof (body as { email?: unknown })?.email === "string"
    ? ((body as { email: string }).email).trim()
    : "";

  if (!isValidEmail(email)) {
    return {
      status: 400,
      json: { error: "Please enter a valid email address." },
    };
  }

  try {
    const lead = await dependencies.leadStore.getLeadByEmail(email);

    if (!lead) {
      return {
        status: 400,
        json: { error: "Please submit your request before checkout." },
      };
    }

    if (lead.paid) {
      return {
        status: 409,
        json: { error: "Priority access already granted for this email." },
      };
    }

    const session = await dependencies.stripeService.createCheckoutSession({
      email,
      port: dependencies.port,
    });
    const checkoutStartedAt = new Date().toISOString();

    await dependencies.leadStore.recordCheckoutSession({
      email,
      checkoutSessionId: session.id,
      checkoutStatus: "created",
      checkoutStartedAt,
    });

    return {
      status: 200,
      json: { url: session.url },
    };
  } catch (error) {
    console.error("Failed to create checkout session:", error);
    return {
      status: 500,
      json: { error: "Failed to create checkout session." },
    };
  }
}

export async function handleWebhookRequest(
  rawBody: Buffer,
  signature: string | undefined,
  dependencies: Required<RuntimeDependencies>,
): Promise<HandlerResult> {
  if (typeof signature !== "string") {
    return {
      status: 400,
      text: "Webhook Error: Missing signature",
    };
  }

  try {
    const event = dependencies.stripeService.constructWebhookEvent({
      body: rawBody,
      signature,
    });

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const email = session.customer_details?.email || session.metadata?.email;

      if (email) {
        const lead = await dependencies.leadStore.findLeadForWebhook({
          checkoutSessionId: session.id,
          email,
        });

        if (!lead) {
          console.warn("No lead matched webhook event", {
            checkoutSessionId: session.id,
            email,
          });
          return {
            status: 200,
            json: { received: true },
          };
        }

        if (!lead.paid) {
          const paidAt = new Date().toISOString();
          await dependencies.leadStore.markLeadPaid({
            email: lead.email,
            paidAt,
            prioritySource: "stripe_checkout",
            checkoutStatus: "completed",
            checkoutSessionId: session.id,
          });
          await dependencies.emailService.sendPriorityAccessEmail(lead.email);
        }
      }
    }

    return {
      status: 200,
      json: { received: true },
    };
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return {
      status: 400,
      text: "Webhook Error",
    };
  }
}
