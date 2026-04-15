export function getAppUrl(port: number) {
  return process.env.APP_URL || `http://localhost:${port}`;
}

export function isProduction() {
  return process.env.NODE_ENV === "production";
}

export function getSupabaseConfig() {
  const candidates = [
    {
      url: process.env.SUPABASE_URL,
      key: process.env.SUPABASE_SERVICE_ROLE_KEY,
    },
    {
      url: process.env.VITE_SUPABASE_URL,
      key: process.env.VITE_SUPABASE_ANON_KEY,
    },
    {
      url: process.env.VIBEFELLO_VITE_PUBLIC_SUPABASE_URL,
      key: process.env.VIBEFELLO_VITE_PUBLIC_SUPABASE_ANON_KEY,
    },
    {
      url: process.env.VIBEFELLO_SUPABASE_URL,
      key: process.env.VIBEFELLO_SUPABASE_SERVICE_ROLE_KEY,
    },
  ];

  for (const candidate of candidates) {
    if (candidate.url && candidate.key) {
      return candidate;
    }
  }

  return null;
}

export function getResendApiKey() {
  return process.env.RESEND_API_KEY || null;
}

export function getResendFromEmail() {
  return process.env.RESEND_FROM_EMAIL || "VibeFello <feedback@vibefello.com>";
}

export function getStripeWebhookSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET || null;
}

export function getStripeFoundingMemberPriceId() {
  const launchPriceId = "price_1TLPTq9cc7XZtkzuTL1NNJP6";
  if (process.env.VERCEL_ENV === "production") {
    return launchPriceId;
  }
  return process.env.STRIPE_FOUNDING_MEMBER_PRICE_ID || launchPriceId;
}

export function getStripeStatementDescriptorSuffix() {
  return process.env.STRIPE_STATEMENT_DESCRIPTOR_SUFFIX || "VIBEFELLO";
}

export function getAdminToken() {
  return process.env.ADMIN_TOKEN || process.env.VIBEFELLO_ADMIN_TOKEN || null;
}
