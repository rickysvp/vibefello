import "dotenv/config";
import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import Stripe from "stripe";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

let stripeClient: Stripe | null = null;
let resendClient: Resend | null = null;
let supabaseClient: any = null;

function getStripe(): Stripe {
  if (!stripeClient) {
    const key = process.env.STRIPE_SECRET_KEY;
    console.log("Stripe Secret Key available on server:", !!key);
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY environment variable is required");
    }
    stripeClient = new Stripe(key);
  }
  return stripeClient;
}

function getResend(): Resend | null {
  if (!resendClient) {
    const key = process.env.RESEND_API_KEY;
    if (!key) {
      console.log("RESEND_API_KEY not configured, skipping email sending");
      return null;
    }
    resendClient = new Resend(key);
  }
  return resendClient;
}

function getSupabase() {
  if (!supabaseClient) {
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_ANON_KEY;
    if (url && key) {
      supabaseClient = createClient(url, key);
    }
  }
  return supabaseClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Enable CORS for all origins
  app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'stripe-signature']
  }));

// Email Helpers
async function sendWaitlistEmail(email: string) {
  try {
    const resend = getResend();
    if (!resend) {
      console.log(`Skipping waitlist email for ${email} - RESEND_API_KEY not configured`);
      return;
    }
    const result = await resend.emails.send({
      from: "VibeFello <feedback@vibefello.com>",
      to: email,
      subject: "You're on the VibeFello Waitlist!",
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 2px solid #000; padding: 40px; border-radius: 24px; background: #fff; color: #000;">
          <div style="margin-bottom: 30px; text-align: center;">
            <div style="display: inline-block; width: 50px; height: 50px; background: #000; border-radius: 12px; line-height: 50px; color: #fff; font-weight: 900; font-size: 24px;">VF</div>
            <h1 style="font-size: 24px; font-weight: 900; text-transform: uppercase; letter-spacing: -1px; margin: 10px 0 0 0;">VIBEFELLO</h1>
          </div>
          
          <h2 style="font-size: 32px; font-weight: 900; margin-bottom: 20px; line-height: 1.1; text-align: center;">You're in the queue.</h2>
          <p style="font-size: 16px; line-height: 1.5; color: #444; margin-bottom: 30px; text-align: center;">Thanks for applying to the Genesis Circle. We've received your application and our team is currently reviewing your profile.</p>
          
          <div style="background: #f9fafb; border: 1px solid #eee; padding: 24px; border-radius: 16px; margin-bottom: 30px;">
            <h3 style="font-size: 14px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; margin-top: 0; margin-bottom: 15px;">What happens next?</h3>
            <ul style="padding-left: 20px; margin: 0; font-size: 14px; line-height: 1.6; color: #666;">
              <li style="margin-bottom: 10px;"><strong>Review:</strong> We'll analyze your "blocker" to ensure VibeFello is the right fit for your current stage.</li>
              <li style="margin-bottom: 10px;"><strong>Invitation:</strong> If selected, you'll receive a private invitation link to join the Genesis Circle.</li>
              <li style="margin-bottom: 10px;"><strong>Updates:</strong> Follow us on X for the latest progress and cohort announcements.</li>
            </ul>
          </div>

          <div style="text-align: center; margin-bottom: 30px;">
            <a href="https://x.com/vibefello" style="display: inline-block; margin: 0 10px; color: #000; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase;">Follow on X</a>
            <span style="color: #eee;">|</span>
            <a href="https://www.vibefello.com" style="display: inline-block; margin: 0 10px; color: #000; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase;">Visit Website</a>
          </div>
          
          <p style="font-size: 14px; color: #999; margin-bottom: 0; text-align: center;">Stay tuned,<br/><strong>The VibeFello Team</strong></p>
          <div style="margin-top: 40px; border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
            <p style="font-size: 11px; color: #ccc; font-weight: 700; text-transform: uppercase;">© 2026 VIBEFELLO. ALL RIGHTS RESERVED.</p>
          </div>
        </div>
      `
    });
    console.log(`Waitlist email sent to ${email}. Result:`, result);
  } catch (err) {
    console.error("Error sending waitlist email:", err);
  }
}

async function getMemberCount() {
  try {
    const supabase = getSupabase();
    if (supabase) {
      const { count, error } = await supabase
        .from('waitlist')
        .select('*', { count: 'exact', head: true })
        .eq('paid', true);
      
      if (!error && count !== null) return count;
    }
  } catch (e) {
    console.error("Error getting Supabase count:", e);
  }

  // Fallback to local JSON
  try {
    if (fs.existsSync(WAITLIST_FILE)) {
      const waitlist = JSON.parse(fs.readFileSync(WAITLIST_FILE, "utf-8"));
      return waitlist.filter((entry: any) => entry.paid).length;
    }
  } catch (e) {
    console.error("Error getting local count:", e);
  }
  return 0;
}

async function sendSuccessEmail(email: string) {
  try {
    const resend = getResend();
    if (!resend) {
      console.log(`Skipping success email for ${email} - RESEND_API_KEY not configured`);
      return;
    }
    const memberCount = await getMemberCount();
    const memberId = `VF-2026-${String(memberCount).padStart(3, '0')}-GEN`;

    const result = await resend.emails.send({
      from: "VibeFello <feedback@vibefello.com>",
      to: email,
      subject: `Welcome to the Genesis Circle #${memberCount} - VibeFello`,
      html: `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 4px solid #000; padding: 40px; border-radius: 32px; background: #fff; color: #000;">
          <div style="margin-bottom: 40px; text-align: center;">
            <div style="display: inline-block; width: 60px; height: 60px; background: #000; border-radius: 16px; line-height: 60px; color: #fff; font-weight: 900; font-size: 28px; margin-bottom: 20px;">VF</div>
            <div style="display: inline-block; padding: 8px 20px; background: #FFD700; border: 2px solid #000; border-radius: 12px; font-weight: 900; font-size: 14px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; display: block; width: fit-content; margin: 0 auto 20px auto;">GENESIS MEMBER #${memberCount}</div>
            <h1 style="font-size: 48px; font-weight: 900; margin: 0; text-transform: uppercase; letter-spacing: -3px; line-height: 0.9;">WELCOME TO THE CIRCLE</h1>
          </div>

          <p style="font-size: 18px; font-weight: 700; color: #444; margin-bottom: 30px; text-align: center;">You've successfully secured your lifetime spot as one of the first 100 builders.</p>
          
          <div style="background: #000; color: #fff; padding: 30px; border-radius: 24px; margin-bottom: 30px; position: relative; overflow: hidden;">
            <h3 style="margin-top: 0; font-weight: 900; text-transform: uppercase; font-size: 12px; letter-spacing: 2px; color: #FFD700;">Membership Certificate</h3>
            <div style="font-size: 24px; font-weight: 900; margin: 15px 0;">GENESIS CIRCLE</div>
            <div style="font-family: monospace; font-size: 12px; color: #666; margin-bottom: 20px;">ID: ${memberId}</div>
            <div style="display: flex; justify-content: space-between; border-top: 1px solid #333; padding-top: 15px;">
              <div>
                <div style="font-size: 10px; text-transform: uppercase; color: #666;">Valid Until</div>
                <div style="font-size: 14px; font-weight: 900;">LIFETIME</div>
              </div>
              <div style="text-align: right;">
                <div style="font-size: 10px; text-transform: uppercase; color: #666;">Status</div>
                <div style="font-size: 14px; font-weight: 900; color: #FFD700;">ACTIVE</div>
              </div>
            </div>
          </div>

          <div style="margin-bottom: 40px;">
            <h3 style="font-weight: 900; text-transform: uppercase; font-size: 14px; letter-spacing: 1px; margin-bottom: 20px; border-bottom: 2px solid #eee; padding-bottom: 10px;">Your Genesis Benefits</h3>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px;">
              <div style="font-size: 14px; font-weight: 700; color: #444;">• Unlimited AI Debugging</div>
              <div style="font-size: 14px; font-weight: 700; color: #444;">• Priority Launch Support</div>
              <div style="font-size: 14px; font-weight: 700; color: #444;">• Genesis Resource Library</div>
              <div style="font-size: 14px; font-weight: 700; color: #444;">• Private Discord Access</div>
              <div style="font-size: 14px; font-weight: 700; color: #444;">• 1-on-1 Strategy Sessions</div>
              <div style="font-size: 14px; font-weight: 700; color: #444;">• Early Beta Access</div>
            </div>
          </div>

          <div style="background: #f9fafb; padding: 30px; border-radius: 24px; text-align: center; margin-bottom: 30px;">
            <h3 style="font-weight: 900; text-transform: uppercase; font-size: 14px; letter-spacing: 1px; margin-bottom: 20px;">Ready to build?</h3>
            <a href="${process.env.APP_URL}" style="display: inline-block; background: #000; color: #fff; text-decoration: none; padding: 16px 40px; border-radius: 100px; font-weight: 900; text-transform: uppercase; letter-spacing: 1px; font-size: 14px;">Access Member Dashboard</a>
          </div>

          <div style="text-align: center; margin-bottom: 30px;">
            <a href="https://x.com/vibefello" style="display: inline-block; margin: 0 10px; color: #000; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase;">Follow on X</a>
            <span style="color: #eee;">|</span>
            <a href="https://www.vibefello.com" style="display: inline-block; margin: 0 10px; color: #000; text-decoration: none; font-weight: 900; font-size: 14px; text-transform: uppercase;">Visit Website</a>
          </div>

          <p style="margin-top: 40px; font-size: 11px; color: #999; font-weight: 700; text-transform: uppercase; text-align: center; border-top: 1px solid #eee; padding-top: 20px;">© 2026 VIBEFELLO. BUILT FOR THE VIBE CODING ERA.</p>
        </div>
      `,
    });
    console.log(`Success email sent to ${email}. Result:`, result);
  } catch (err) {
    console.error("Error sending success email:", err);
  }
}

  // Stripe Webhook - MUST be before express.json() to get raw body
  app.post("/api/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    const sig = req.headers["stripe-signature"];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!sig || !webhookSecret) {
      return res.status(400).send("Webhook Error: Missing signature or secret");
    }

    let event;

    try {
      const stripe = getStripe();
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
      console.error("Webhook signature verification failed:", err);
      return res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : "Unknown error"}`);
    }

    // Handle the event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const customerEmail = session.customer_details?.email || session.metadata?.email;

      if (customerEmail) {
        // 1. Update Supabase
        const supabase = getSupabase();
        if (supabase) {
          try {
            await supabase
              .from('waitlist')
              .upsert({ 
                email: customerEmail, 
                paid: true, 
                paid_at: new Date().toISOString() 
              }, { onConflict: 'email' });
            console.log(`Supabase updated/upserted for ${customerEmail}`);
          } catch (e) {
            console.error("Error updating Supabase:", e);
          }
        }

        // 2. Mark as paid in waitlist.json
        const WAITLIST_FILE = path.join(process.cwd(), "waitlist.json");
        let waitlist = [];
        if (fs.existsSync(WAITLIST_FILE)) {
          try {
            waitlist = JSON.parse(fs.readFileSync(WAITLIST_FILE, "utf-8"));
          } catch (e) {
            waitlist = [];
          }
        }

        let found = false;
        const updatedWaitlist = waitlist.map((entry: any) => {
          if (entry.email === customerEmail) {
            found = true;
            return { ...entry, paid: true, paidAt: new Date().toISOString() };
          }
          return entry;
        });

        if (!found) {
          updatedWaitlist.push({
            email: customerEmail,
            paid: true,
            paidAt: new Date().toISOString(),
            timestamp: new Date().toISOString()
          });
        }

        fs.writeFileSync(WAITLIST_FILE, JSON.stringify(updatedWaitlist, null, 2));
        console.log(`User ${customerEmail} marked as paid in waitlist.json.`);

        await sendSuccessEmail(customerEmail);
      }
    }

    res.json({ received: true });
  });

  app.use(express.json());

  // Stripe Checkout Session
  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { email } = req.body;
      const stripe = getStripe();
      const appUrl = process.env.APP_URL || `http://localhost:${PORT}`;
      console.log("Creating checkout session with appUrl:", appUrl);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        customer_email: email, // Pre-fill email
        metadata: {
          email: email, // Store in metadata for webhook reliability
        },
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "VibeFello Genesis Member - Lifetime Access",
                description: "Unlimited companionship, multiple project launches, and lifetime priority access.",
              },
              unit_amount: 99900, // $999.00
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${appUrl}?payment=success`,
        cancel_url: `${appUrl}?payment=cancel`,
      });

      console.log("Stripe session created successfully. URL:", session.url);
      res.json({ url: session.url });
    } catch (error) {
      console.error("Stripe error during session creation:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Internal Server Error" });
    }
  });

  // Waitlist API
  const WAITLIST_FILE = path.join(process.cwd(), "waitlist.json");
  
  app.post("/api/waitlist", async (req, res) => {
    const { email, blocker } = req.body;
    if (!email) return res.status(400).json({ error: "Email is required" });

    let isMember = false;

    // 1. Check/Save to Supabase
    const supabase = getSupabase();
    if (supabase) {
      try {
        const { data } = await supabase
          .from('waitlist')
          .select('paid')
          .eq('email', email)
          .single();
        
        if (data?.paid) {
          isMember = true;
        }

        if (!isMember) {
          await supabase
            .from('waitlist')
            .upsert([{ email, blocker, created_at: new Date().toISOString() }], { onConflict: 'email' });
          console.log(`Supabase recorded waitlist entry for ${email}`);
        }
      } catch (e) {
        console.error("Error with Supabase waitlist:", e);
      }
    }

    // 2. Check/Save to local JSON
    let waitlist = [];
    if (fs.existsSync(WAITLIST_FILE)) {
      try {
        waitlist = JSON.parse(fs.readFileSync(WAITLIST_FILE, "utf-8"));
      } catch (e) {
        waitlist = [];
      }
    }

    const existingEntry = waitlist.find((entry: any) => entry.email === email);
    if (existingEntry?.paid) {
      isMember = true;
    }

    if (!existingEntry) {
      waitlist.push({ email, blocker, timestamp: new Date().toISOString() });
      fs.writeFileSync(WAITLIST_FILE, JSON.stringify(waitlist, null, 2));
      
      // Send waitlist confirmation email
      await sendWaitlistEmail(email);
    }

    console.log(`Waitlist check for ${email}: isMember=${isMember}`);
    res.json({ success: true, isMember });
  });

  // Test Email Endpoint
  app.post("/api/test-email", async (req, res) => {
    const { email, type } = req.body;
    console.log(`Received test-email request for ${email} type ${type}`);
    if (!email) return res.status(400).json({ error: "Email required" });

    try {
      if (type === 'success') {
        await sendSuccessEmail(email);
      } else {
        await sendWaitlistEmail(email);
      }
      res.json({ success: true, message: `Test ${type || 'waitlist'} email sent to ${email}` });
    } catch (error) {
      console.error("Test email endpoint error:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to send email" });
    }
  });

  app.get("/api/member-count", async (req, res) => {
    try {
      const count = await getMemberCount();
      res.json({ count });
    } catch (e) {
      res.status(500).json({ error: "Failed to get count" });
    }
  });

  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { 
        middlewareMode: true,
        allowedHosts: true,
        cors: true,
        host: "0.0.0.0",
      },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log("Stripe Secret Key configured:", !!process.env.STRIPE_SECRET_KEY);
    console.log("Stripe Webhook Secret configured:", !!process.env.STRIPE_WEBHOOK_SECRET);
    console.log("Resend API Key configured:", !!process.env.RESEND_API_KEY);
    console.log("Supabase configured:", !!process.env.SUPABASE_URL);
    console.log("APP_URL configured:", process.env.APP_URL);
  });
}

startServer();
