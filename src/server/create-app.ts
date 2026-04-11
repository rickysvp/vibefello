import cors from "cors";
import express from "express";
import { createEmailService } from "./email";
import { createLeadStore } from "./lead-store";
import { createStripeService } from "./stripe";
import type { CreateAppDependencies } from "./types";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isValidBlocker(blocker?: string) {
  return blocker === undefined || blocker.trim().length >= 10;
}

export function createApp(dependencies: CreateAppDependencies = {}) {
  const app = express();
  const leadStore = dependencies.leadStore ?? createLeadStore();
  const stripeService = dependencies.stripeService ?? createStripeService();
  const emailService = dependencies.emailService ?? createEmailService();
  const port = dependencies.port ?? 3000;

  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "stripe-signature"],
    }),
  );

  app.post("/api/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const signature = req.headers["stripe-signature"];

    if (typeof signature !== "string") {
      return res.status(400).send("Webhook Error: Missing signature");
    }

    try {
      const event = stripeService.constructWebhookEvent({
        body: req.body as Buffer,
        signature,
      });

      if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const email = session.customer_details?.email || session.metadata?.email;

        if (email) {
          const lead = await leadStore.findLeadForWebhook({
            checkoutSessionId: session.id,
            email,
          });

          if (!lead) {
            console.warn("No lead matched webhook event", {
              checkoutSessionId: session.id,
              email,
            });
            return res.json({ received: true });
          }

          if (!lead.paid) {
            const paidAt = new Date().toISOString();
            await leadStore.markLeadPaid({
              email: lead.email,
              paidAt,
              prioritySource: "stripe_checkout",
              checkoutStatus: "completed",
              checkoutSessionId: session.id,
            });
            await emailService.sendPriorityAccessEmail(lead.email);
          }
        }
      }

      return res.json({ received: true });
    } catch (error) {
      console.error("Webhook verification failed:", error);
      return res.status(400).send("Webhook Error");
    }
  });

  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok" });
  });

  app.post("/api/waitlist", async (req, res) => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";
    const blocker = typeof req.body?.blocker === "string" ? req.body.blocker : undefined;

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    if (!isValidBlocker(blocker)) {
      return res
        .status(400)
        .json({ error: "Please provide a bit more detail (min 10 characters)." });
    }

    try {
      const lead = await leadStore.upsertLead({ email, blocker });
      return res.json({
        success: true,
        email: lead.email,
        paid: lead.paid,
        priorityAccess: lead.priorityAccess,
        message: "Lead captured",
      });
    } catch (error) {
      console.error("Failed to upsert waitlist lead:", error);
      return res.status(500).json({ error: "Failed to save your request. Please try again." });
    }
  });

  app.post("/api/create-checkout-session", async (req, res) => {
    const email = typeof req.body?.email === "string" ? req.body.email.trim() : "";

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Please enter a valid email address." });
    }

    try {
      const lead = await leadStore.getLeadByEmail(email);

      if (!lead) {
        return res.status(400).json({ error: "Please submit your request before checkout." });
      }

      if (lead.paid) {
        return res.status(409).json({ error: "Priority access already granted for this email." });
      }

      const session = await stripeService.createCheckoutSession({ email, port });
      const checkoutStartedAt = new Date().toISOString();

      await leadStore.recordCheckoutSession({
        email,
        checkoutSessionId: session.id,
        checkoutStatus: "created",
        checkoutStartedAt,
      });

      return res.json({ url: session.url });
    } catch (error) {
      console.error("Failed to create checkout session:", error);
      return res.status(500).json({ error: "Failed to create checkout session." });
    }
  });

  return app;
}
