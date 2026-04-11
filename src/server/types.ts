import type { LeadStore } from "./lead-store";
import type { EmailService } from "./email";
import type { StripeService } from "./stripe";

export type WaitlistResponse = {
  success: boolean;
  email?: string;
  paid?: boolean;
  priorityAccess?: boolean;
  message?: string;
  error?: string;
};

export type CreateAppDependencies = {
  leadStore?: LeadStore;
  stripeService?: StripeService;
  emailService?: EmailService;
  port?: number;
};
