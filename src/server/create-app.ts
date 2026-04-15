import cors from "cors";
import express from "express";
import {
  createAdminDependencies,
  handleAdminLeadsRequest,
  handleAdminStatsRequest,
  handleTrackEventRequest,
} from "./admin-handlers.js";
import {
  createRuntimeDependencies,
  handleCreateCheckoutSessionRequest,
  handleHealthRequest,
  handleMemberStatusRequest,
  handleWaitlistRequest,
  handleWebhookRequest,
  type HandlerResult,
  type RuntimeDependencies,
} from "./route-handlers.js";

function sendHandlerResult(res: express.Response, result: HandlerResult) {
  if ("text" in result) {
    return res.status(result.status).send(result.text);
  }

  return res.status(result.status).json(result.json);
}

export function createApp(overrides: RuntimeDependencies = {}) {
  const app = express();
  const dependencies = createRuntimeDependencies(overrides);
  const adminDependencies = createAdminDependencies();

  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "stripe-signature", "x-admin-token"],
    }),
  );

  app.post("/api/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const result = await handleWebhookRequest(
      req.body as Buffer,
      typeof req.headers["stripe-signature"] === "string"
        ? req.headers["stripe-signature"]
        : undefined,
      dependencies,
    );

    return sendHandlerResult(res, result);
  });

  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    handleHealthRequest().then((result) => sendHandlerResult(res, result));
  });

  app.get("/api/member-status", async (req, res) => {
    const result = await handleMemberStatusRequest(req.query, dependencies);
    return sendHandlerResult(res, result);
  });

  app.post("/api/waitlist", async (req, res) => {
    const result = await handleWaitlistRequest(req.body, dependencies);
    return sendHandlerResult(res, result);
  });

  app.post("/api/create-checkout-session", async (req, res) => {
    const result = await handleCreateCheckoutSessionRequest(req.body, dependencies);
    return sendHandlerResult(res, result);
  });

  app.post("/api/track-event", async (req, res) => {
    const result = await handleTrackEventRequest(req.body, adminDependencies);
    return sendHandlerResult(res, result);
  });

  app.get("/api/admin-stats", async (req, res) => {
    const result = await handleAdminStatsRequest(
      req.query,
      req.headers as Record<string, unknown> | undefined,
      adminDependencies,
    );
    return sendHandlerResult(res, result);
  });

  app.get("/api/admin-leads", async (req, res) => {
    const result = await handleAdminLeadsRequest(
      req.query,
      req.headers as Record<string, unknown> | undefined,
      adminDependencies,
    );
    return sendHandlerResult(res, result);
  });

  return app;
}
