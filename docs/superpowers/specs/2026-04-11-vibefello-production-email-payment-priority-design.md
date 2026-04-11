# VibeFello Production Email Capture and Priority Access Design

## Summary

This design upgrades the current VibeFello landing funnel from demo-grade email capture and payment collection into a production-ready MVP flow. The core business goal is narrow and explicit: collect a user's email into Supabase, guide them into Stripe Checkout, and mark that lead for later manual prioritization after payment succeeds.

For this phase, "priority access" is not an immediately unlocked product feature. It is a durable backend flag used by the VibeFello team for manual screening, outreach, and cohort prioritization. The post-payment success email must clearly tell users to follow the official X account at `https://x.com/vibefello` for the latest updates.

## Goals

- Persist every submitted email to Supabase before checkout is initiated.
- Treat Supabase as the production source of truth for waitlist and payment status.
- Use Stripe Checkout and webhook confirmation to mark a lead as having priority access.
- Keep the implementation close to the current code shape to reduce migration risk.
- Preserve a clear manual-ops workflow for the founding team.

## Non-Goals

- No authenticated member dashboard or self-serve entitlement portal in this phase.
- No complex order history, subscription lifecycle, or role-based permissions.
- No multi-table order domain split in this phase.
- No long-term reliance on local file storage as a production data source.

## Recommended Approach

Use a single production lead table in Supabase as the canonical record for both waitlist submission and post-payment priority status. The existing server remains the orchestration layer for form submission, checkout session creation, webhook handling, and transactional emails.

This is the recommended approach because it preserves the current mental model and API shape while removing the highest-risk demo patterns. It avoids introducing a second domain model before the business process needs it, but it still creates clean state transitions that can later be migrated into separate `orders` or `entitlements` tables if the product outgrows the MVP.

## Data Model

Use the existing `waitlist` table as the single source of truth, but normalize it around lead state rather than a loose demo record.

Required fields for the MVP:

- `email` `text` unique not null
- `blocker` `text` nullable
- `created_at` `timestamptz` not null default now()
- `updated_at` `timestamptz` not null default now()
- `checkout_started_at` `timestamptz` nullable
- `checkout_session_id` `text` nullable
- `checkout_status` `text` nullable
- `priority_access` `boolean` not null default false
- `paid` `boolean` not null default false
- `paid_at` `timestamptz` nullable
- `priority_source` `text` nullable
- `notes` `text` nullable

Recommended conventions:

- `email` is the canonical identity for this MVP.
- `priority_access=true` means this user should be manually prioritized by the team.
- `priority_source='stripe_checkout'` identifies how the flag was granted.
- `paid=true` and `paid_at` are retained because the current code already uses them, but `priority_access` becomes the clearer business flag.
- `checkout_session_id` stores the latest checkout attempt seen by the server. It improves webhook reconciliation, but it is not a separate business identity.

## System Design

### 1. Lead Capture

Frontend submits the waitlist form to `/api/waitlist` with `email` and optional `blocker`.

Server behavior:

- Validate email format and minimum blocker rules.
- Upsert the lead into Supabase by `email`.
- Preserve an existing `paid` or `priority_access` state when a known user resubmits.
- Overwrite `blocker` only when the new submission includes a non-empty valid value.
- Do not mutate `checkout_session_id`, `checkout_status`, `checkout_started_at`, or `paid_at` from this endpoint.
- Always refresh `updated_at`.
- Return the normalized lead status to the frontend.

Production rule:

- Supabase is the only system of record.
- Local `waitlist.json` is no longer part of the production path.

### 2. Checkout Initiation

Frontend calls `/api/create-checkout-session` only after a valid lead exists.

Server behavior:

- Require that the email already exists in Supabase from a successful `/api/waitlist` submission.
- If no lead exists, return a client error and instruct the frontend to submit the waitlist form first.
- Create a Stripe Checkout Session with metadata containing `email` and `source='landing_page'`.
- Update the matching Supabase lead with:
  - `checkout_started_at`
  - `checkout_session_id`
  - `checkout_status='created'`

Rule for repeated checkout attempts:

- If the lead is already `paid=true`, do not create a new Checkout Session.
- If the lead is unpaid, a new Checkout Session may be created and the latest `checkout_session_id` may overwrite the previous pending attempt.
- Because the table stores only the latest session id, webhook reconciliation must still allow email-based fallback for earlier successful attempts.

### 3. Payment Confirmation

Stripe webhook `checkout.session.completed` remains the payment source of truth.

Server behavior:

- Verify webhook signature.
- Extract `checkout_session_id` and customer email.
- Locate the lead primarily by `checkout_session_id`.
- If no row matches that session id, fall back to the unique `email` record.
- A successful email match is still valid even if the stored `checkout_session_id` was overwritten by a later unpaid retry.
- Mark the lead as:
  - `paid=true`
  - `paid_at=<timestamp>`
  - `priority_access=true`
  - `priority_source='stripe_checkout'`
  - `checkout_status='completed'`
- Keep the update idempotent so repeated webhook delivery does not create inconsistent state.

### 4. Email Communication

Two transactional emails remain in scope:

- Waitlist confirmation email after lead capture.
- Payment success email after confirmed checkout.

Updated requirement for payment success email:

- It must explicitly tell the user to follow the official X account at `https://x.com/vibefello` for the latest updates.
- It should avoid promising an immediate product unlock.
- It should explain that the user has been marked for priority access and the team will reach out with next steps.

## User Flow

1. User lands on the marketing page.
2. User submits email and blocker details.
3. Backend writes the lead into Supabase.
4. Frontend confirms submission and presents the paid priority path.
5. User starts Stripe Checkout.
6. Stripe webhook confirms payment.
7. Backend marks the lead as paid and priority-access eligible.
8. User receives a success email instructing them to watch their inbox and follow `x.com/vibefello`.

## API Adjustments

### `/api/waitlist`

Must become the authoritative lead capture endpoint.

Expected response shape:

- `success`
- `email`
- `paid`
- `priorityAccess`
- `message`

### `/api/create-checkout-session`

Must require an existing lead and persist checkout initiation fields before returning the Stripe URL or session id.

Expected metadata written to Stripe:

- `email`
- `source='landing_page'`

### `/api/webhook`

Must update the canonical lead row and remain safe under duplicate delivery.

Expected side effects:

- Update Supabase lead state
- Send payment success email
- Avoid local JSON mutation in the production path

## Error Handling

### Lead Capture Errors

- Invalid email returns `400`.
- Invalid blocker input returns `400`.
- Supabase write failure returns `500` with a generic user-facing error.
- Duplicate email is not an error; it updates the existing lead.
- Repeat submissions only update mutable lead fields and must not clear paid or priority state.

### Checkout Errors

- Missing Stripe configuration returns `500`.
- Failure to create a checkout session returns `500`.
- If checkout creation succeeds but Supabase update fails, the error must be logged clearly because manual reconciliation may be required.

### Webhook Errors

- Invalid signature returns `400`.
- Missing lead match should be logged with `checkout_session_id` and email for manual follow-up.
- Duplicate webhook delivery must not flip state backward or send conflicting state.
- A webhook matched by email after session-id mismatch is valid in this MVP and should still grant priority status if the lead is unpaid.

## Production Risks and Mitigations

### Risk: Local JSON split-brain

Current code writes to `waitlist.json` as a fallback. In a production deployment with multiple instances or immutable filesystems, this creates divergent state and false confidence.

Mitigation:

- Remove `waitlist.json` from the primary write path.
- If temporary dev fallback is retained, gate it behind explicit development-only logic and never use it for production truth.

### Risk: Email-only reconciliation

Matching payment success only by email is fragile if checkout sessions are retried or metadata drifts.

Mitigation:

- Persist Stripe `checkout_session_id` on session creation and use it as the first reconciliation key in the webhook.
- Keep email as the canonical identity and explicit fallback match when multiple pending sessions have existed for the same lead.

### Risk: Weak business semantics

`paid=true` alone does not fully explain why the user should be treated differently operationally.

Mitigation:

- Introduce `priority_access` and `priority_source` as first-class lead fields.

## Testing Strategy

### Automated

- API test: `/api/waitlist` upserts lead and preserves paid state for repeat submissions.
- API test: `/api/create-checkout-session` persists checkout initiation metadata.
- API test: webhook marks `paid=true` and `priority_access=true` idempotently.
- Email test: success email content contains `x.com/vibefello`.

### Manual

- Submit a new email and confirm a Supabase row is created.
- Start checkout and confirm `checkout_session_id` is stored.
- Complete a Stripe test payment and confirm webhook updates the same row.
- Confirm success email copy mentions following the official X account.

## Implementation Boundaries

Keep this phase intentionally narrow:

- Reuse the existing Express server.
- Reuse the existing landing page conversion flow.
- Avoid UI redesign unless a small wording change is required for accuracy.
- Focus changes on data correctness, payment-state durability, and operator clarity.

## Open Questions

Resolved for this phase:

- Chosen architecture: single-table approach.
- Meaning of priority access: backend marker for manual screening and later outreach.
- Post-payment messaging: direct users to follow `https://x.com/vibefello` for updates.
