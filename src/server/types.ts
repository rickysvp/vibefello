import type { LeadStore } from "./lead-store";

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
};
