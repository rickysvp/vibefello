# VibeFello Production Email and Priority Flow Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make VibeFello production-ready for the MVP flow where a user submits an email, the lead is stored in Supabase, Stripe Checkout is initiated from that saved lead, and successful payment marks the lead for manual priority follow-up.

**Architecture:** Keep the current Vite + Express app, but split the server into small testable units so the payment funnel can be verified with automated tests. Supabase becomes the only production source of truth; the checkout webhook updates the same lead record with durable payment and `priority_access` state, while frontend copy and state handling align to the new backend contract.

**Tech Stack:** React 19, Vite 6, Express 4, TypeScript, Stripe Checkout, Supabase, Resend, Vitest, Supertest, Testing Library, jsdom

---

## File Map

### Existing files to modify

- `package.json`
  - Add test dependencies and scripts for `vitest`.
- `server.ts`
  - Reduce to bootstrapping only, importing a testable Express app factory.
- `src/App.tsx`
  - Align frontend waitlist and payment flow to the tightened API contract and revised messaging.

### New schema file to create

- `supabase/migrations/20260411_add_waitlist_priority_fields.sql`
  - Add the required `waitlist` columns and safe defaults for the production email/payment flow.

### New server files to create

- `src/server/create-app.ts`
  - Build and return the Express app with all routes and middleware.
- `src/server/types.ts`
  - Shared server-side request/response and lead-state types.
- `src/server/env.ts`
  - Centralized environment accessors for Stripe, Supabase, Resend, and app URL.
- `src/server/lead-store.ts`
  - Supabase read/write helpers for lead capture, checkout session persistence, member count, and webhook reconciliation.
- `src/server/email.ts`
  - Waitlist and payment success email builders and send helpers.
- `src/server/stripe.ts`
  - Stripe client creation plus checkout session and webhook helpers.

### New test files to create

- `vitest.config.ts`
  - Vitest config for Node server tests and jsdom client tests.
- `tests/setup/client.ts`
  - Testing Library and DOM test setup.
- `tests/server/create-app.test.ts`
  - API-level tests for `/api/waitlist`, `/api/create-checkout-session`, `/api/webhook`, and `/api/member-count`.
- `tests/server/email.test.ts`
  - Focused tests for success-email copy, especially the X follow-up instruction.
- `tests/client/app-flow.test.tsx`
  - Focused UI test for submission → conversion-state behavior using mocked fetch.

## Task 1: Add Test Infrastructure

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `tests/setup/client.ts`
- Create: `tests/server/create-app.test.ts`

- [ ] **Step 1: Add failing server test scaffold**

```ts
import { describe, it, expect } from 'vitest';

describe('createApp', () => {
  it('exposes a health endpoint', async () => {
    expect(typeof true).toBe('boolean');
  });
});
```

- [ ] **Step 2: Run test command to confirm the repo has no working test setup yet**

Run: `npm test`

Expected: command missing or test runner failure because `vitest` is not installed and no test script exists.

- [ ] **Step 3: Add minimal test dependencies and scripts**

Update `package.json` with:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.3",
    "@testing-library/react": "^16.3.0",
    "jsdom": "^26.1.0",
    "supertest": "^7.1.1",
    "vitest": "^3.2.4"
  }
}
```

- [ ] **Step 4: Add Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environmentMatchGlobs: [
      ['tests/client/**/*.test.tsx', 'jsdom'],
      ['tests/server/**/*.test.ts', 'node'],
    ],
    setupFiles: ['tests/setup/client.ts'],
  },
});
```

- [ ] **Step 5: Run test command to verify the harness starts**

Run: `npm test`

Expected: test runner starts and the placeholder test passes.

- [ ] **Step 6: Commit**

```bash
git add package.json vitest.config.ts tests/setup/client.ts tests/server/create-app.test.ts
git commit -m "test: add vitest harness for server and client flows"
```

## Task 2: Add Supabase Schema for Production Lead State

**Files:**
- Create: `supabase/migrations/20260411_add_waitlist_priority_fields.sql`

- [ ] **Step 1: Write the migration file with all required columns**

Create:

```sql
alter table public.waitlist
  add column if not exists updated_at timestamptz not null default now(),
  add column if not exists checkout_started_at timestamptz,
  add column if not exists checkout_session_id text,
  add column if not exists checkout_status text,
  add column if not exists priority_access boolean not null default false,
  add column if not exists paid boolean not null default false,
  add column if not exists paid_at timestamptz,
  add column if not exists priority_source text,
  add column if not exists notes text;

create unique index if not exists waitlist_email_key on public.waitlist (email);
```

- [ ] **Step 2: Review the migration against the spec**

Check that the migration includes:

- `checkout_started_at`
- `checkout_session_id`
- `checkout_status`
- `priority_access`
- `paid`
- `paid_at`
- `priority_source`
- `updated_at`

- [ ] **Step 3: Document the execution prerequisite in the plan notes during implementation**

Run during implementation: apply this SQL in Supabase before testing real writes.

Expected: the `waitlist` table can store the full MVP state model from the spec.

- [ ] **Step 4: Commit**

```bash
git add supabase/migrations/20260411_add_waitlist_priority_fields.sql
git commit -m "db: add waitlist priority access schema"
```

## Task 3: Refactor Server Into Testable Units

**Files:**
- Modify: `server.ts`
- Create: `src/server/create-app.ts`
- Create: `src/server/types.ts`
- Create: `src/server/env.ts`
- Create: `src/server/stripe.ts`
- Create: `tests/server/create-app.test.ts`

- [ ] **Step 1: Write the failing app-factory test**

Add to `tests/server/create-app.test.ts`:

```ts
import request from 'supertest';
import { createApp } from '../../src/server/create-app';

it('returns ok from /api/health', async () => {
  const app = createApp();
  const response = await request(app).get('/api/health');
  expect(response.status).toBe(200);
  expect(response.body).toEqual({ status: 'ok' });
});
```

- [ ] **Step 2: Run the targeted test and confirm it fails**

Run: `npm test -- tests/server/create-app.test.ts`

Expected: FAIL because `createApp` does not exist yet.

- [ ] **Step 3: Extract the app factory with no behavior change**

Create `src/server/create-app.ts` with the minimal shape:

```ts
import express from 'express';

export function createApp() {
  const app = express();
  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
  });
  return app;
}
```

Then update `server.ts` so it imports `createApp()` and only handles boot/startup and Vite static behavior.

- [ ] **Step 4: Run the targeted test again**

Run: `npm test -- tests/server/create-app.test.ts`

Expected: PASS for the health endpoint.

- [ ] **Step 5: Commit**

```bash
git add server.ts src/server/create-app.ts src/server/types.ts src/server/env.ts src/server/stripe.ts tests/server/create-app.test.ts
git commit -m "refactor: extract testable express app factory"
```

## Task 4: Make `/api/waitlist` Supabase-First and Remove Production JSON Writes

**Files:**
- Create: `src/server/lead-store.ts`
- Modify: `src/server/create-app.ts`
- Modify: `src/server/types.ts`
- Modify: `tests/server/create-app.test.ts`

- [ ] **Step 1: Write the failing waitlist contract tests**

Add tests covering:

```ts
it('upserts a lead and returns normalized status', async () => {
  // mock lead store with unpaid lead
  expect(response.body).toEqual({
    success: true,
    email: 'founder@example.com',
    paid: false,
    priorityAccess: false,
    message: 'Lead captured',
  });
});

it('preserves paid and priority flags on repeat submission', async () => {
  expect(updatePayload).not.toHaveProperty('paid', false);
});

it('returns 400 for invalid email', async () => {
  expect(response.status).toBe(400);
});

it('returns 400 for invalid blocker payload', async () => {
  expect(response.status).toBe(400);
});

it('returns 500 when the lead store write fails', async () => {
  expect(response.status).toBe(500);
});
```

- [ ] **Step 2: Run the targeted test and confirm the current endpoint shape fails**

Run: `npm test -- tests/server/create-app.test.ts`

Expected: FAIL because the current route returns only `{ success, isMember }` and still mixes file persistence.

- [ ] **Step 3: Implement the minimal Supabase-first lead store**

Create `src/server/lead-store.ts` with functions shaped like:

```ts
export async function upsertLead(input: {
  email: string;
  blocker?: string;
}) {
  return {
    email: input.email,
    paid: false,
    priorityAccess: false,
  };
}
```

Then wire `/api/waitlist` so it:

- validates `email`
- optionally validates `blocker`
- upserts only mutable fields
- returns `{ success, email, paid, priorityAccess, message }`
- stops writing to `waitlist.json` in the production path
- returns `400` for invalid email or blocker input
- returns `500` for lead-store persistence failures with a generic response body

- [ ] **Step 4: Run the targeted test again**

Run: `npm test -- tests/server/create-app.test.ts`

Expected: PASS for waitlist endpoint tests.

- [ ] **Step 5: Run lint**

Run: `npm run lint`

Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add src/server/lead-store.ts src/server/create-app.ts src/server/types.ts tests/server/create-app.test.ts
git commit -m "feat: persist waitlist leads in supabase-first flow"
```

## Task 5: Enforce Checkout Preconditions and Persist Checkout Attempts

**Files:**
- Modify: `src/server/create-app.ts`
- Modify: `src/server/lead-store.ts`
- Modify: `src/server/stripe.ts`
- Modify: `tests/server/create-app.test.ts`

- [ ] **Step 1: Write the failing checkout tests**

Add tests for:

```ts
it('rejects checkout when no lead exists', async () => {
  expect(response.status).toBe(400);
});

it('creates checkout for an existing unpaid lead and stores the session id', async () => {
  expect(savedCheckout.checkout_status).toBe('created');
  expect(savedCheckout.checkout_session_id).toBe('cs_test_123');
});

it('does not create a new session for a paid lead', async () => {
  expect(response.status).toBe(409);
});

it('returns 500 when stripe session creation fails', async () => {
  expect(response.status).toBe(500);
});
```

- [ ] **Step 2: Run the targeted test and confirm checkout behavior is still too loose**

Run: `npm test -- tests/server/create-app.test.ts`

Expected: FAIL because checkout currently accepts any email and does not persist checkout attempt state.

- [ ] **Step 3: Implement minimal checkout persistence**

Update the route and helpers so that:

- checkout requires a preexisting lead
- unpaid leads can receive a new session
- paid leads return a conflict response
- missing lead returns `400`
- Stripe failures return `500` with a generic error response
- Stripe metadata includes:

```ts
metadata: {
  email,
  source: 'landing_page',
}
```

- lead store persists:

```ts
{
  checkout_started_at: new Date().toISOString(),
  checkout_session_id: session.id,
  checkout_status: 'created',
}
```

- [ ] **Step 4: Run the targeted test again**

Run: `npm test -- tests/server/create-app.test.ts`

Expected: PASS for checkout tests.

- [ ] **Step 5: Commit**

```bash
git add src/server/create-app.ts src/server/lead-store.ts src/server/stripe.ts tests/server/create-app.test.ts
git commit -m "feat: persist checkout attempts for existing leads"
```

## Task 6: Make Webhook Updates Idempotent and Align Success Email Copy

**Files:**
- Modify: `src/server/create-app.ts`
- Modify: `src/server/lead-store.ts`
- Modify: `src/server/email.ts`
- Create: `tests/server/email.test.ts`
- Modify: `tests/server/create-app.test.ts`

- [ ] **Step 1: Write the failing webhook and email tests**

Add API tests for:

```ts
it('marks a matching lead as paid and priority_access true', async () => {
  expect(savedLead.priority_access).toBe(true);
  expect(savedLead.priority_source).toBe('stripe_checkout');
});

it('falls back to email match when session id was overwritten', async () => {
  expect(response.status).toBe(200);
});

it('returns 400 for invalid webhook signatures', async () => {
  expect(response.status).toBe(400);
});

it('logs unmatched webhook events without mutating state', async () => {
  expect(logSpy).toHaveBeenCalled();
});
```

Add email-copy test in `tests/server/email.test.ts`:

```ts
it('includes the official x follow instruction in the success email', () => {
  expect(html).toContain('https://x.com/vibefello');
  expect(html).toContain('follow');
});
```

- [ ] **Step 2: Run the targeted tests and confirm they fail**

Run: `npm test -- tests/server/create-app.test.ts tests/server/email.test.ts`

Expected: FAIL because webhook only sets `paid`, still mutates JSON, and success email still promises dashboard-like access.

- [ ] **Step 3: Implement the minimal webhook and email changes**

Update webhook handling so the lead update is:

```ts
{
  paid: true,
  paid_at: nowIso,
  priority_access: true,
  priority_source: 'stripe_checkout',
  checkout_status: 'completed',
}
```

Then update success email copy so it says the user has been marked for priority access and should follow `https://x.com/vibefello` for updates, without promising immediate dashboard access.

Also make sure unmatched webhook reconciliation is logged clearly with `checkout_session_id` and `email`, while returning a safe success response once the event has been acknowledged.

- [ ] **Step 4: Run the targeted tests again**

Run: `npm test -- tests/server/create-app.test.ts tests/server/email.test.ts`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/server/create-app.ts src/server/lead-store.ts src/server/email.ts tests/server/create-app.test.ts tests/server/email.test.ts
git commit -m "feat: grant priority access on successful checkout webhook"
```

## Task 7: Align Frontend Conversion Flow to the New Backend Contract

**Files:**
- Modify: `src/App.tsx`
- Create: `tests/client/app-flow.test.tsx`

- [ ] **Step 1: Write the failing UI flow tests**

Add client tests covering:

```tsx
it('shows the paid conversion state after a successful lead submission', async () => {
  expect(await screen.findByText(/Waitlist Confirmed!/i)).toBeInTheDocument();
});

it('stores the submitted email and respects priority state returned by the api', async () => {
  expect(localStorage.getItem('vibefello_email')).toBe('founder@example.com');
});
```

- [ ] **Step 2: Run the targeted client test and confirm it fails**

Run: `npm test -- tests/client/app-flow.test.tsx`

Expected: FAIL because the UI still expects `isMember` and payment copy implies immediate member/dashboard access.

- [ ] **Step 3: Implement the minimal frontend alignment**

Update `src/App.tsx` so it:

- consumes `{ paid, priorityAccess }` instead of only `isMember`
- keeps `localStorage` as UX-only convenience, not source of truth
- updates conversion copy to describe paid priority follow-up rather than immediate dashboard access
- keeps the existing visual structure unless wording must change for accuracy

- [ ] **Step 4: Run the targeted client test**

Run: `npm test -- tests/client/app-flow.test.tsx`

Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx tests/client/app-flow.test.tsx
git commit -m "feat: align landing flow with priority access contract"
```

## Task 8: End-to-End Verification and Cleanup

**Files:**
- Modify: `server.ts`
- Modify: `src/server/create-app.ts`
- Modify: `package.json`
- Modify: any touched test files only if verification exposes gaps

- [ ] **Step 1: Run the full automated suite**

Run: `npm test`

Expected: PASS for all server and client tests.

- [ ] **Step 2: Run typecheck**

Run: `npm run lint`

Expected: PASS.

- [ ] **Step 3: Run production build**

Run: `npm run build`

Expected: PASS and emit `dist/` artifacts without TypeScript or bundling failures.

- [ ] **Step 4: Do a manual smoke test**

Run: `npm run dev`

Verify:

- submit email successfully
- see conversion state
- checkout request fails cleanly if lead does not exist
- success email template includes the X instruction

- [ ] **Step 5: Commit**

```bash
git add server.ts src/server package.json tests src/App.tsx
git commit -m "chore: verify production email and payment priority flow"
```

## Notes for Execution

- Do not revert user-owned changes already present in `src/App.tsx` or `waitlist.json`.
- Treat `waitlist.json` as development residue only; do not rely on it as production truth.
- Keep backend changes minimal and local to the email → checkout → webhook flow.
- If a real Supabase migration file already exists elsewhere in the repo later, update the plan during execution instead of inventing a second schema source.
