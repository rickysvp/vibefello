import cors from "cors";
import express from "express";
import { createLeadStore } from "./lead-store";
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

  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "stripe-signature"],
    }),
  );

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

  return app;
}
