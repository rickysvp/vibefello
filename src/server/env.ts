export function getAppUrl(port: number) {
  return process.env.APP_URL || `http://localhost:${port}`;
}

export function isProduction() {
  return process.env.NODE_ENV === "production";
}

export function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return null;
  }

  return { url, key };
}

export function getResendApiKey() {
  return process.env.RESEND_API_KEY || null;
}

export function getStripeWebhookSecret() {
  return process.env.STRIPE_WEBHOOK_SECRET || null;
}
