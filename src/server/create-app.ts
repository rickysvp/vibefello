import cors from "cors";
import express from "express";
import {
  createRuntimeDependencies,
  handleCreateCheckoutSessionRequest,
  handleHealthRequest,
  handleMemberStatusRequest,
  handleWaitlistRequest,
  handleWebhookRequest,
  type HandlerResult,
  type RuntimeDependencies,
} from "./route-handlers";

function sendHandlerResult(res: express.Response, result: HandlerResult) {
  if ("text" in result) {
    return res.status(result.status).send(result.text);
  }

  return res.status(result.status).json(result.json);
}

export function createApp(overrides: RuntimeDependencies = {}) {
  const app = express();
  const dependencies = createRuntimeDependencies(overrides);

  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization", "stripe-signature"],
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

  return app;
}
