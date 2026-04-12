# VibeFello Production Launch Checklist

## Infrastructure

- [ ] Vercel project created and linked
- [ ] Production domain attached
- [ ] `APP_URL` points to the production domain
- [ ] `VITE_SITE_URL` points to the production domain

## Database

- [ ] Run [20260411_add_waitlist_priority_fields.sql](/Users/ricky/AICode/VibeFello/vibefello/supabase/migrations/20260411_add_waitlist_priority_fields.sql) in Supabase
- [ ] Confirm `waitlist.email` is unique
- [ ] Confirm `priority_access`, `checkout_session_id`, `paid_at`, and `priority_source` columns exist

## Payments

- [ ] `STRIPE_SECRET_KEY` set in Vercel
- [ ] `VITE_STRIPE_PUBLISHABLE_KEY` set in Vercel
- [ ] Stripe product pricing confirmed
- [ ] Production webhook endpoint configured at `/api/webhook`
- [ ] `checkout.session.completed` event subscribed
- [ ] `STRIPE_WEBHOOK_SECRET` set in Vercel

## Email

- [ ] `RESEND_API_KEY` set in Vercel
- [ ] `RESEND_FROM_EMAIL` uses a verified sending domain
- [ ] Payment success email tested

## Security and API

- [ ] `SUPABASE_URL` set in Vercel
- [ ] `SUPABASE_SERVICE_ROLE_KEY` set in Vercel
- [ ] Test `/api/health`
- [ ] Test `/api/waitlist`
- [ ] Test `/api/create-checkout-session`
- [ ] Test `/api/webhook`

## SEO

- [ ] `robots.txt` reachable
- [ ] `sitemap.xml` reachable
- [ ] canonical tag points to the production domain
- [ ] Open Graph image loads
- [ ] Organization and Service structured data validate

## Commercial Readiness

- [ ] Payment amount and offer copy are final
- [ ] Terms/privacy links added if legally required
- [ ] Priority access messaging matches operations process
- [ ] Follow-up process exists for paid leads

## Final Verification

- [ ] Submit a fresh email
- [ ] Confirm Supabase row creation
- [ ] Complete a Stripe test payment
- [ ] Confirm `paid=true` and `priority_access=true`
- [ ] Confirm success email arrives
- [ ] Confirm user is directed to follow `x.com/vibefello`
