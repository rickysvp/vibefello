# VibeFello

VibeFello is a production-ready marketing and payment funnel for founders shipping AI-built products. The core flow is:

1. Capture a launch-interest email into Supabase
2. Route the user into Stripe Checkout
3. Confirm payment via webhook
4. Mark the lead with `priority_access=true`
5. Send a transactional follow-up email that points users to [x.com/vibefello](https://x.com/vibefello)

## Stack

- Frontend: Vite + React
- API: Vercel Functions in [`api/`](/Users/ricky/AICode/VibeFello/vibefello/api)
- Database: Supabase
- Payments: Stripe Checkout + webhook
- Email: Resend
- Analytics/Admin: first-party event tracking + token-protected dashboard (`/admin.html`)

## Local Development

1. Install dependencies

```bash
npm install
```

2. Copy environment variables from [.env.example](/Users/ricky/AICode/VibeFello/vibefello/.env.example)

3. Apply the Supabase migration in [20260411_add_waitlist_priority_fields.sql](/Users/ricky/AICode/VibeFello/vibefello/supabase/migrations/20260411_add_waitlist_priority_fields.sql)

4. Start the local server

```bash
npm run dev
```

## Verification

```bash
npm test
npm run lint
npm run build
```

## Version Management

Use semantic versioning on every update:

```bash
npm run release:patch
# or release:minor / release:major
```

Then update [CHANGELOG.md](/Users/ricky/AICode/VibeFello/vibefello/CHANGELOG.md) before deployment.

## Production Environment Variables

- `APP_URL`
- `VITE_SITE_URL`
- `STRIPE_SECRET_KEY`
- `VITE_STRIPE_PUBLISHABLE_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `ADMIN_USERNAME` (default: `vibecoder`)
- `ADMIN_PASSWORD` (default: `Qq652581!`)
- `ADMIN_TOKEN` (optional alternative auth for `/api/admin-stats`, `/api/admin-leads`, and `/admin.html`)

## Stripe Webhook

Create a production webhook endpoint at:

```text
https://<your-vercel-domain>/api/webhook
```

Listen for:

- `checkout.session.completed`

Then store the returned webhook signing secret as `STRIPE_WEBHOOK_SECRET`.

## Deployment on Vercel

This repo is configured for Vercel with:

- static Vite output from `dist`
- API functions in [`api/`](/Users/ricky/AICode/VibeFello/vibefello/api)
- SEO assets in [`public/`](/Users/ricky/AICode/VibeFello/vibefello/public)
- deployment config in [vercel.json](/Users/ricky/AICode/VibeFello/vibefello/vercel.json)

Before deploying:

1. Set all production environment variables in Vercel
2. Run the Supabase migration
3. Deploy
4. Update Stripe webhook to the deployed `/api/webhook` URL
5. Run a real end-to-end payment test in Stripe test mode first
