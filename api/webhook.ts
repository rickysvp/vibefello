import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import Stripe from "stripe";

export const config = {
  api: {
    bodyParser: false,
  },
};

async function readRawBody(req: AsyncIterable<Buffer | string>) {
  const chunks: Buffer[] = [];

  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  return Buffer.concat(chunks);
}

function buildPriorityAccessEmailHtml(email: string) {
  return `
    <div style="font-family: Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 32px; border: 1px solid #e5e7eb; border-radius: 24px; color: #111827;">
      <h1 style="font-size: 28px; margin: 0 0 16px;">You're marked for priority access.</h1>
      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Thanks for securing priority access with VibeFello. We've marked <strong>${email}</strong> for manual priority follow-up from our team.
      </p>
      <p style="font-size: 16px; line-height: 1.6; margin: 0 0 16px;">
        Please follow our official X account for the latest product updates and launch news:
        <a href="https://x.com/vibefello">https://x.com/vibefello</a>
      </p>
      <p style="font-size: 16px; line-height: 1.6; margin: 0;">
        We will contact you directly when there is a relevant next step.
      </p>
    </div>
  `;
}

export default async function handler(req: any, res: any) {
  const rawBody = await readRawBody(req);
  const signature =
    typeof req.headers["stripe-signature"] === "string"
      ? req.headers["stripe-signature"]
      : undefined;

  if (!signature) {
    return res.status(400).send("Webhook Error: Missing signature");
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!supabaseUrl || !supabaseKey || !stripeKey || !webhookSecret) {
    return res.status(500).json({ error: "Server configuration is incomplete." });
  }

  try {
    const stripe = new Stripe(stripeKey);
    const event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const email = session.customer_details?.email || session.metadata?.email;

      if (email && session.id) {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const { data: sessionMatch, error: sessionError } = await supabase
          .from("waitlist")
          .select("email, paid")
          .eq("checkout_session_id", session.id)
          .maybeSingle<{ email: string; paid?: boolean | null }>();

        if (sessionError) {
          throw sessionError;
        }

        const lead = sessionMatch?.email
          ? sessionMatch
          : (
              await supabase
                .from("waitlist")
                .select("email, paid")
                .eq("email", email)
                .maybeSingle<{ email: string; paid?: boolean | null }>()
            ).data;

        if (lead?.email && !lead.paid) {
          const paidAt = new Date().toISOString();
          const { error: upsertError } = await supabase
            .from("waitlist")
            .upsert(
              {
                email: lead.email,
                paid: true,
                paid_at: paidAt,
                priority_access: true,
                priority_source: "stripe_checkout",
                checkout_status: "completed",
                checkout_session_id: session.id,
                updated_at: paidAt,
              },
              { onConflict: "email" },
            );

          if (upsertError) {
            throw upsertError;
          }

          const resendKey = process.env.RESEND_API_KEY;
          if (resendKey) {
            const resend = new Resend(resendKey);
            await resend.emails.send({
              from: process.env.RESEND_FROM_EMAIL || "VibeFello <feedback@vibefello.com>",
              to: lead.email,
              subject: "Your VibeFello priority access is confirmed",
              html: buildPriorityAccessEmailHtml(lead.email),
            });
          }
        }
      }
    }

    return res.status(200).json({ received: true });
  } catch (error) {
    console.error("Webhook verification failed:", error);
    return res.status(400).send("Webhook Error");
  }
}
