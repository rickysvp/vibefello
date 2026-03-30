# VibeFello User Order Flow Production Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship the first production MVP for VibeFello's user order flow so authenticated users can create real requests, view their own dashboard data, open a real detail page, and support seeded showcase/demo data safely.

**Architecture:** Keep the current Vite + React + Supabase stack, but move business truth out of `App.tsx` and into focused auth/data modules plus page-facing hooks. Use Supabase as the source of truth for auth, profiles, requests, bids, and orders, while adding a clear status mapping layer and a controlled seed-data workflow for MVP launch.

**Tech Stack:** React 19, TypeScript, Vite, Vitest, Testing Library, Supabase JS

---

## File Structure

### Existing files to modify

- `src/App.tsx`
- `src/contexts/AuthContext.tsx`
- `src/PostRequestFlow.tsx`
- `src/pages/Home.tsx`
- `src/pages/Dashboard.tsx`
- `src/pages/OrderDetail.tsx`
- `src/hooks/useRequests.ts`
- `src/lib/supabase.ts`
- `src/lib/database.types.ts`
- `src/test/AuthContext.test.tsx`
- `src/test/supabase.test.ts`
- `src/test/smoke.test.tsx`
- `src/components/admin/AdminPanel.tsx`

### New files to create

- `src/lib/env.ts`
- `src/lib/auth.ts`
- `src/lib/requests.ts`
- `src/lib/bids.ts`
- `src/lib/orders.ts`
- `src/lib/status.ts`
- `src/hooks/useCurrentProfile.ts`
- `src/hooks/useRequestDetail.ts`
- `src/hooks/useOrderDetail.ts`
- `src/components/auth/ProtectedRoute.tsx`
- `src/components/auth/GuestOnlyRoute.tsx`
- `src/components/common/AppLoadingState.tsx`
- `src/components/common/AppErrorState.tsx`
- `src/components/common/EmptyState.tsx`
- `src/test/requests.test.ts`
- `src/test/order-detail.test.tsx`
- `supabase/seed.sql` or `scripts/seed-mvp.ts`
- `src/lib/seed.ts` if the admin trigger is implemented via app code

### Responsibility map

- `src/lib/*`: database/API access and status/env helpers
- `src/hooks/*`: async state orchestration for pages
- `src/components/auth/*`: route protection
- `src/components/common/*`: shared loading/error/empty UI states
- `src/pages/*`: rendering only, driven by hooks
- `src/test/*`: focused regression tests for auth, requests, and detail rendering
- `supabase/seed.sql` or `scripts/seed-mvp.ts`: repeatable seed insertion for showcase/internal demo data

## Task 1: Stabilize Environment and Service Boundaries

**Files:**
- Create: `src/lib/env.ts`
- Create: `src/lib/auth.ts`
- Create: `src/lib/requests.ts`
- Create: `src/lib/bids.ts`
- Create: `src/lib/orders.ts`
- Create: `src/lib/status.ts`
- Modify: `src/lib/supabase.ts`
- Test: `src/test/supabase.test.ts`

- [ ] **Step 1: Write the failing tests for the new service boundaries**

Add focused tests in `src/test/supabase.test.ts` or split them into per-module imports so the test suite asserts:

```ts
it('maps database request status to dashboard label metadata', () => {
  expect(getRequestStatusMeta('open').label).toBeDefined();
});

it('throws or returns a clear failure when required env vars are missing', () => {
  expect(() => getSupabaseEnv({ VITE_SUPABASE_URL: '', VITE_SUPABASE_ANON_KEY: '' })).toThrow();
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/test/supabase.test.ts`
Expected: FAIL because the new modules and exports do not exist yet.

- [ ] **Step 3: Implement minimal environment and service modules**

Create:

- `src/lib/env.ts`
  - exports a helper that reads and validates `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
- `src/lib/auth.ts`
  - exports auth/profile helpers only
- `src/lib/requests.ts`
  - exports request read/write helpers only
- `src/lib/bids.ts`
  - exports bid read helpers used in this MVP
- `src/lib/orders.ts`
  - exports order read helpers used in this MVP
- `src/lib/status.ts`
  - exports UI metadata mapping for request/order statuses

Reduce `src/lib/supabase.ts` to:

```ts
import { createClient } from '@supabase/supabase-js';
import { getSupabaseEnv } from './env';

const { url, anonKey } = getSupabaseEnv(import.meta.env);

export const supabase = createClient(url, anonKey);
```

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/test/supabase.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/lib/env.ts src/lib/auth.ts src/lib/requests.ts src/lib/bids.ts src/lib/orders.ts src/lib/status.ts src/lib/supabase.ts src/test/supabase.test.ts
git commit -m "refactor: split supabase helpers into focused modules"
```

## Task 2: Make Auth and Profile Bootstrap Production-Safe

**Files:**
- Modify: `src/contexts/AuthContext.tsx`
- Create: `src/hooks/useCurrentProfile.ts`
- Create: `src/components/auth/ProtectedRoute.tsx`
- Create: `src/components/auth/GuestOnlyRoute.tsx`
- Create: `src/components/common/AppLoadingState.tsx`
- Create: `src/components/common/AppErrorState.tsx`
- Modify: `src/test/AuthContext.test.tsx`

- [ ] **Step 1: Write the failing auth bootstrap tests**

Add tests for:

```ts
it('loads existing session and profile before rendering protected content', async () => {
  // expect loading first, then authenticated content
});

it('creates or refreshes profile state after auth session becomes available', async () => {
  // expect profile bootstrap helper to run
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/test/AuthContext.test.tsx`
Expected: FAIL because current auth bootstrap does not model route-ready profile flow cleanly.

- [ ] **Step 3: Implement minimal auth bootstrap changes**

Refactor `src/contexts/AuthContext.tsx` so it:

- delegates auth/profile calls to `src/lib/auth.ts`
- centralizes session bootstrap
- exposes stable `isLoading`, `isAuthenticated`, `user`, `profile`, and `refreshProfile`

Add:

- `ProtectedRoute.tsx`: renders loading state while auth initializes, otherwise children or fallback
- `GuestOnlyRoute.tsx`: blocks authenticated users from guest-only entry points if needed
- `useCurrentProfile.ts`: optional helper for profile consumers that should not duplicate context logic

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/test/AuthContext.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/contexts/AuthContext.tsx src/hooks/useCurrentProfile.ts src/components/auth/ProtectedRoute.tsx src/components/auth/GuestOnlyRoute.tsx src/components/common/AppLoadingState.tsx src/components/common/AppErrorState.tsx src/test/AuthContext.test.tsx
git commit -m "feat: harden auth bootstrap and route protection"
```

## Task 3: Replace Demo Request Creation with Real Request Writes

**Files:**
- Modify: `src/PostRequestFlow.tsx`
- Modify: `src/hooks/useRequests.ts`
- Create: `src/test/requests.test.ts`
- Modify: `src/lib/database.types.ts` if request insert typing needs extension for MVP fields
- Modify: `src/lib/requests.ts`

- [ ] **Step 1: Write the failing request-creation tests**

Create `src/test/requests.test.ts` with focused coverage:

```ts
it('creates a request and returns the inserted row', async () => {
  // expect createRequestForCurrentUser(...) to call the requests table with normalized fields
});

it('surfaces a request creation failure to the caller', async () => {
  // expect error state to be returned when insert fails
});
```

Add a UI-level test if practical:

```ts
it('shows a submit error state when request creation fails', async () => {
  // render PostRequestFlow and simulate failed create
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/test/requests.test.ts`
Expected: FAIL because current flow still depends on parent in-memory completion behavior.

- [ ] **Step 3: Implement minimal real request creation path**

Update `src/lib/requests.ts` and `src/hooks/useRequests.ts` so request creation:

- accepts normalized form data
- associates the request with the authenticated user
- writes to Supabase
- returns loading/success/error consistently

Update `src/PostRequestFlow.tsx` so it:

- uses the real request creation hook/service
- handles loading
- handles write failures
- navigates to dashboard only after a successful insert
- stops using fake local request generation as the primary path

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/test/requests.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/PostRequestFlow.tsx src/hooks/useRequests.ts src/lib/requests.ts src/lib/database.types.ts src/test/requests.test.ts
git commit -m "feat: create real supabase-backed user requests"
```

## Task 4: Move Dashboard to Authenticated User-Owned Data

**Files:**
- Modify: `src/pages/Dashboard.tsx`
- Modify: `src/hooks/useRequests.ts`
- Create: `src/components/common/EmptyState.tsx`
- Modify: `src/test/smoke.test.tsx`
- Modify or extend: `src/test/requests.test.ts`

- [ ] **Step 1: Write the failing dashboard tests**

Add tests for:

```ts
it('renders request rows returned for the authenticated user', async () => {
  // expect dashboard to render fetched request titles/status
});

it('renders an empty state when the user has no requests', async () => {
  // expect empty state CTA instead of mock content
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/test/requests.test.ts src/test/smoke.test.tsx`
Expected: FAIL because the current dashboard still depends on top-level request props seeded from app state.

- [ ] **Step 3: Implement minimal dashboard data migration**

Update `src/pages/Dashboard.tsx` to:

- consume user-owned request data from `useRequests`
- use `src/lib/status.ts` for status display metadata
- render shared loading/error/empty states

Add `src/components/common/EmptyState.tsx` if no shared empty state exists yet.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/test/requests.test.ts src/test/smoke.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/pages/Dashboard.tsx src/hooks/useRequests.ts src/components/common/EmptyState.tsx src/test/requests.test.ts src/test/smoke.test.tsx
git commit -m "feat: power dashboard from authenticated request data"
```

## Task 5: Replace Mock Detail Pages with Real Request/Order Detail Reads

**Files:**
- Create: `src/hooks/useRequestDetail.ts`
- Create: `src/hooks/useOrderDetail.ts`
- Modify: `src/pages/OrderDetail.tsx`
- Modify: `src/lib/requests.ts`
- Modify: `src/lib/orders.ts`
- Modify: `src/lib/bids.ts`
- Create: `src/test/order-detail.test.tsx`

- [ ] **Step 1: Write the failing detail tests**

Create `src/test/order-detail.test.tsx`:

```tsx
it('renders fetched request detail content for an owned request', async () => {
  // expect title, description, and status to come from fetched data
});

it('does not depend on hardcoded expert bid mocks to render baseline detail data', async () => {
  // expect detail page to render without MOCK_EXPERT_BIDS
});
```

If ownership is enforced in the hook or service:

```ts
it('returns an error or not-found state for unauthorized detail access', async () => {
  // expect guarded behavior
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/test/order-detail.test.tsx`
Expected: FAIL because `OrderDetail.tsx` is still driven by hardcoded detail/bid behavior.

- [ ] **Step 3: Implement minimal detail read path**

Add hook/service helpers so the detail page:

- loads request or order data from Supabase
- reads related bids if present
- uses status mapping metadata
- shows loading/error states
- removes dependency on `MOCK_EXPERT_BIDS` for the base flow

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/test/order-detail.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/hooks/useRequestDetail.ts src/hooks/useOrderDetail.ts src/pages/OrderDetail.tsx src/lib/requests.ts src/lib/orders.ts src/lib/bids.ts src/test/order-detail.test.tsx
git commit -m "feat: load order detail from real request and bid data"
```

## Task 6: Shrink App Shell and Wire Protected Flow

**Files:**
- Modify: `src/App.tsx`
- Modify: `src/pages/Home.tsx`
- Modify: `src/PostRequestFlow.tsx`
- Modify: `src/pages/Dashboard.tsx`
- Modify: `src/pages/OrderDetail.tsx`
- Modify: `src/components/layout/Navbar.tsx` if entry-point auth gating is currently embedded there
- Test: `src/test/smoke.test.tsx`

- [ ] **Step 1: Write the failing app-shell tests**

Add or adjust smoke tests so they validate shell behavior instead of old local-state assumptions:

```ts
it('renders authenticated dashboard flow behind auth state', async () => {
  // expect protected screen path to wait for auth
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/test/smoke.test.tsx`
Expected: FAIL if the app shell still expects local in-memory request ownership.

- [ ] **Step 3: Implement minimal shell cleanup**

Refactor `src/App.tsx` so it:

- removes request lifecycle truth from local state
- delegates auth gating to route/protection helpers
- passes only navigation callbacks and non-authoritative UI state

Keep the scope narrow:

- do not introduce unrelated refactors
- only move state that blocks the production user flow

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/test/smoke.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add src/App.tsx src/pages/Home.tsx src/PostRequestFlow.tsx src/pages/Dashboard.tsx src/pages/OrderDetail.tsx src/components/layout/Navbar.tsx src/test/smoke.test.tsx
git commit -m "refactor: simplify app shell around protected user flow"
```

## Task 7: Add Controlled Seed Data for MVP Launch and Demo Operations

**Files:**
- Create: `supabase/seed.sql` or `scripts/seed-mvp.ts`
- Modify: `src/lib/database.types.ts` if seed metadata fields are added
- Create: `src/lib/seed.ts` if app-side admin trigger is used
- Modify: `src/components/admin/AdminPanel.tsx`
- Modify: `src/pages/Home.tsx`
- Modify: `src/pages/Marketplace.tsx`
- Test: `src/test/requests.test.ts` or a new seed-focused test file

- [ ] **Step 1: Write the failing seed-data tests**

Add tests for seed metadata shaping at the service layer:

```ts
it('marks showcase seed records distinctly from real production data', () => {
  expect(buildSeedRequest({ visibility: 'public' }).is_seed).toBe(true);
});

it('filters user-owned dashboard queries away from public seed showcase data', async () => {
  // expect user list query to exclude showcase seed rows
});
```

- [ ] **Step 2: Run tests to verify they fail**

Run: `npx vitest run src/test/requests.test.ts`
Expected: FAIL because no seed-data contract exists yet.

- [ ] **Step 3: Implement minimal seed workflow**

Choose one source of truth:

- `supabase/seed.sql` if SQL-first is simpler
- `scripts/seed-mvp.ts` if typed generation is easier for repeatability

Implement:

- showcase seed records for public surfaces
- internal workflow seed records for demos/QA
- explicit markers such as `is_seed`, `seed_batch`, or equivalent supported structure

If low-cost:

- add a minimal admin trigger button in `src/components/admin/AdminPanel.tsx` that calls the seeded insert path or instructs an operator clearly

Update public pages like `Home.tsx` and `Marketplace.tsx` so they can read curated showcase seed data without contaminating user-owned dashboard views.

- [ ] **Step 4: Run tests to verify they pass**

Run: `npx vitest run src/test/requests.test.ts`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add supabase/seed.sql scripts/seed-mvp.ts src/lib/seed.ts src/lib/database.types.ts src/components/admin/AdminPanel.tsx src/pages/Home.tsx src/pages/Marketplace.tsx src/test/requests.test.ts
git commit -m "feat: add controlled seed data workflow for mvp launch"
```

## Task 8: Full Verification Pass

**Files:**
- Verify only; no planned code changes

- [ ] **Step 1: Run focused tests**

Run:

```bash
npx vitest run src/test/AuthContext.test.tsx src/test/supabase.test.ts src/test/requests.test.ts src/test/order-detail.test.tsx src/test/smoke.test.tsx
```

Expected: PASS

- [ ] **Step 2: Run the full test suite**

Run: `npm test`
Expected: PASS

- [ ] **Step 3: Run typecheck**

Run: `npm run lint`
Expected: PASS

- [ ] **Step 4: Run production build**

Run: `npm run build`
Expected: PASS

- [ ] **Step 5: Commit verification-only follow-ups if needed**

```bash
git add .
git commit -m "test: finalize production user order flow verification"
```

## Notes for the Implementer

- Keep TDD discipline: every task starts with a failing test
- Keep file boundaries tight; do not re-centralize business logic in `App.tsx`
- Prefer adapting the current structure over introducing a large routing/framework rewrite midstream
- Do not ship seed data that can be mistaken for user-owned dashboard data
- If database schema changes are required for seed metadata, keep them minimal and traceable
- If the admin seed trigger becomes too large, stop at script-based seeding and leave the admin trigger for a follow-up plan
