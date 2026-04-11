export type LeadState = {
  email: string;
  paid: boolean;
  priorityAccess: boolean;
};

export type WaitlistResponse = {
  success: boolean;
  email?: string;
  paid?: boolean;
  priorityAccess?: boolean;
  message?: string;
  error?: string;
};
