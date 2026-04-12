import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function readJsonBody(req: AsyncIterable<Buffer | string>) {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  if (!chunks.length) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

export default async function handler(req: any, res: any) {
  const body = req.body ?? (await readJsonBody(req));
  const email = typeof body?.email === "string" ? body.email.trim() : "";

  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "Please enter a valid email address." });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const appUrl = process.env.APP_URL || "https://vibefello.com";

  if (!supabaseUrl || !supabaseKey || !stripeKey) {
    return res.status(500).json({ error: "Server configuration is incomplete." });
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    const stripe = new Stripe(stripeKey);
    const { data: lead, error: leadError } = await supabase
      .from("waitlist")
      .select("email, paid")
      .eq("email", email)
      .maybeSingle<{ email: string; paid?: boolean | null }>();

    if (leadError) {
      throw leadError;
    }

    if (!lead?.email) {
      return res.status(400).json({ error: "Please submit your request before checkout." });
    }

    if (lead.paid) {
      return res.status(409).json({ error: "Priority access already granted for this email." });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: email,
      metadata: {
        email,
        source: "landing_page",
      },
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "VibeFello Priority Access",
              description: "Priority access request for manual VibeFello follow-up.",
            },
            unit_amount: 99900,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${appUrl}?payment=success`,
      cancel_url: `${appUrl}?payment=cancel`,
    });

    if (!session.url) {
      throw new Error("Stripe checkout session did not include a URL");
    }

    const checkoutStartedAt = new Date().toISOString();
    const { error: upsertError } = await supabase
      .from("waitlist")
      .upsert(
        {
          email,
          checkout_started_at: checkoutStartedAt,
          checkout_session_id: session.id,
          checkout_status: "created",
          updated_at: checkoutStartedAt,
        },
        { onConflict: "email" },
      );

    if (upsertError) {
      throw upsertError;
    }

    return res.status(200).json({ url: session.url });
  } catch (error) {
    console.error("Failed to create checkout session:", error);
    return res.status(500).json({ error: "Failed to create checkout session." });
  }
}
