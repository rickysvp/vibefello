# VibeFello User Order Flow Production Design

## Summary

This spec defines the first production subproject for VibeFello: turning the current demo into a launchable MVP for the user order flow.

The goal of this phase is to support a real user journey:

1. A visitor lands on the site
2. Signs up or signs in
3. Submits a technical rescue request
4. Sees that request in a real dashboard
5. Opens a real detail page to track status and expert activity

This phase also includes the minimum production foundations needed to operate the flow safely:

- real Supabase-backed data instead of demo-only local state
- route protection and ownership checks
- stable status modeling
- loading, error, and empty states
- controlled seed data for MVP launch and demos

This phase does not aim to fully ship expert workflows, payments, or the full operations stack. Those are future subprojects, but this design keeps their interfaces and data boundaries in mind so the MVP can grow without a rewrite.

## Goals

- Ship a real user-facing order intake flow on top of Supabase-backed data
- Remove demo-only business truth from `App.tsx`
- Ensure authenticated users can create and view only their own requests and orders
- Establish stable data boundaries for requests, bids, orders, auth, and profile data
- Support launch seeding so the product can show curated examples and internal demo states before traffic exists

## Non-Goals

- Full expert-side production workflow
- Payment processing, escrow, refunds, or invoicing
- Full admin tooling for every platform workflow
- Complex search/ranking/recommendation systems
- Large-scale architectural split into separate frontend/backend repos

## Product Scope

### In Scope

- Public landing page with real entry points into login and request submission
- User authentication and profile bootstrapping
- Request submission flow backed by database writes
- User dashboard backed by database reads
- Order/request detail page backed by database reads
- Basic status display for request progression
- Seeded showcase data for marketing/demo surfaces
- Seeded internal workflow data for QA, manual demos, and MVP ops

### Out of Scope for This Phase

- Expert claim/bid UI as a complete production workflow
- Production payment collection
- Full admin CRUD for all entities
- Messaging/chat as a polished end-user feature
- Membership monetization as a complete billing product

## Recommended Architecture

### Approach

Use a Supabase-first monolithic product architecture.

Keep the current Vite + React frontend and Supabase stack, but move the app from demo state management to real data ownership. This is the smallest, fastest, highest-confidence path from demo to launchable MVP.

### Why This Approach

- It aligns with the current repository structure
- It avoids delaying MVP behind a full backend redesign
- It allows auth, data, realtime, and seeded launch data to stay in one operational surface
- It minimizes migration cost from the current code

### Rejected Alternatives

#### Add a Node/Express BFF now

This would create cleaner long-term boundaries for payments and ops, but it would slow the first production release and introduce a second runtime before the first user loop is working.

#### Fully split frontend and backend now

This is too heavy for the current maturity level. It solves future scale problems before the MVP is validated.

## User Journey

### Primary Flow

1. User visits the landing page
2. User clicks the request CTA
3. If unauthenticated, user signs in or signs up
4. System ensures a `profiles` row exists for the authenticated user
5. User completes the request submission flow
6. System creates a real `requests` row
7. User lands in dashboard and sees the new request immediately
8. User opens the request/order detail page and sees status, structured metadata, and future expert activity

### Expected MVP Outcome

The product should feel like a real service, not a concept demo:

- no fake request lifecycle generated only in component state
- no hidden dependency on mock arrays for user-owned data
- no route that appears to work but is not reading from the database

## Data Model Direction

The existing Supabase types already provide a strong starting point. This phase should standardize around those database-backed entities rather than the looser demo-side types.

### Core Tables

#### `profiles`

Purpose:
- stores authenticated user metadata
- stores role and tier state
- acts as the canonical identity record after auth

Needs in this phase:
- reliable profile bootstrap on first login
- safe access from `AuthContext`

#### `requests`

Purpose:
- stores submitted rescue requests from users
- acts as the first-class object for MVP user flow

Needs in this phase:
- stable create and read paths
- ownership enforcement
- normalized fields that match the request submission UI

#### `bids`

Purpose:
- stores expert proposals

Needs in this phase:
- data shape support only
- readable from request detail when available
- not required to ship a complete expert creation experience yet

#### `orders`

Purpose:
- stores accepted expert engagements

Needs in this phase:
- readable detail shape
- relationship support for future payment/delivery flow

### Status Modeling

The current code mixes demo-facing statuses like `pending_quote`, `quoted`, and `in_service` with database statuses like `open`, `matching`, and `in_progress`.

This phase should introduce a single status mapping layer:

- database status codes remain the source of truth
- UI labels, colors, and CTA text are derived through a dedicated mapping module

This avoids each page inventing its own state interpretation.

## Frontend Structure

### Application Shell

#### `src/App.tsx`

Responsibility after this phase:
- app shell
- high-level route switching or router composition
- provider composition
- modal mounting only when truly global

Must stop being the place where real request and auth business state lives.

### Auth Layer

#### `src/contexts/AuthContext.tsx`

Responsibility:
- session state
- current user
- current profile
- auth loading state
- auth actions

Add route-level protection helpers:

- `src/components/auth/ProtectedRoute.tsx`
- `src/components/auth/GuestOnlyRoute.tsx`

The goal is to centralize access control rather than rechecking auth ad hoc in page event handlers.

### Data Access Layer

Split the current mixed helper file responsibilities into focused modules:

- `src/lib/supabase.ts`
  - Supabase client only
- `src/lib/auth.ts`
  - sign in
  - sign up
  - sign out
  - session/profile bootstrap helpers
- `src/lib/requests.ts`
  - create request
  - list current user requests
  - fetch single request detail
- `src/lib/bids.ts`
  - list bids for request
  - future bid actions
- `src/lib/orders.ts`
  - list orders
  - fetch order detail
- `src/lib/status.ts`
  - maps database statuses to UI label/color/CTA metadata
- `src/lib/env.ts`
  - reads and validates environment variables used by the app

### Hooks Layer

Use hooks as the page-facing contract for async business data:

- `src/hooks/useCurrentProfile.ts`
- `src/hooks/useRequests.ts`
- `src/hooks/useRequestDetail.ts`
- `src/hooks/useOrderDetail.ts`

Each hook should own:

- loading
- error
- refresh
- read model shaping for the page
- optional subscriptions where appropriate

### Page Layer

#### `src/pages/Home.tsx`

Responsibility:
- acquisition and conversion only
- can show curated public showcase data
- should not own application truth for user-specific data

#### `src/PostRequestFlow.tsx`

Responsibility:
- collect request form input
- invoke request creation
- present validation/loading/error states

Must stop creating fake in-memory orders as the primary product path.

#### `src/pages/Dashboard.tsx`

Responsibility:
- list real user requests/orders
- show empty state when no data exists
- reflect real statuses from Supabase

#### `src/pages/OrderDetail.tsx`

Responsibility:
- display a real request/order detail view
- show related bids when present
- show request metadata and current status cleanly

Must stop depending on hardcoded `MOCK_EXPERT_BIDS` as the main data source.

## Seed Data Strategy

Seed data is required for MVP launch. The product needs curated examples before enough organic usage exists.

This capability must be explicit and safe, not disguised as lingering mock constants.

### Seed Data Types

#### 1. Public Showcase Seed Data

Used for:
- landing page case studies
- public marketplace examples
- early marketing/demo surfaces

Characteristics:
- curated
- non-user-owned
- safe to show publicly

#### 2. Internal Workflow Seed Data

Used for:
- internal QA
- manual demos
- operator testing
- verifying dashboard and detail states

Characteristics:
- inserted into real tables
- marked as seed/internal
- not mixed with real user ownership views unless intentionally surfaced in admin

#### 3. Real Production Data

Used for:
- actual user journeys
- real dashboards
- real order/request lifecycle

Characteristics:
- must remain clearly distinguishable from seed data

### Seed Data Requirements

- Seed records must be identifiable
- Seed insertion must be repeatable
- Seed execution should be idempotent when possible
- Seed data must never accidentally trigger real payment or settlement side effects

### Recommended Marking Strategy

Use one or more of:

- `is_seed`
- `seed_batch`
- `seed_visibility`

Exact schema choice can be finalized during implementation, but the design intent is fixed: seed data must be trackable and filterable.

### Seed Entry Points

For this MVP, ship:

1. scriptable seed creation
2. optional lightweight admin trigger for convenience

Recommended first-phase delivery:

- SQL or scripted seed runner as the source of truth
- admin-facing button or trigger only as a convenience wrapper if low effort

Avoid building a full visual data factory in this phase.

### Seed Data Visibility Rules

- Home/marketing/public showcase surfaces may read curated public seed data
- User dashboard and user-owned detail pages must default to real user-owned records only
- Admin surfaces can filter by `all`, `real`, and `seed`

## Security and Access Rules

### Authentication

- Protected pages must require authenticated session
- Profile creation must happen reliably on first auth

### Ownership

- Users can only view their own requests and orders
- Request detail and order detail must validate ownership before rendering

### Admin Separation

- Admin-specific tools and seed controls must be gated by role
- Admin data visibility must not leak into user views

### Environment Safety

- environment variables must be centralized and validated
- missing critical config should fail clearly rather than degrade silently

## Error Handling and UX Guarantees

Every async user-facing screen in scope must support:

- loading state
- error state
- empty state

This includes:

- auth initialization
- request submission
- dashboard list fetch
- detail fetch

Recommended shared UI primitives:

- `AppLoadingState`
- `AppErrorState`
- `EmptyState`

## Testing Strategy

This phase needs focused production-facing coverage, not just smoke coverage.

### Required Test Coverage

#### Auth Initialization

Verify:
- existing session bootstraps correctly
- profile lookup/creation path behaves correctly
- protected UI waits for auth readiness

#### Request Creation

Verify:
- valid request form data writes successfully
- failed writes show user-facing error state
- successful creation appears in dashboard flow

#### Dashboard Data Rendering

Verify:
- dashboard renders real fetched data
- empty state appears for user with no requests
- status mapping is rendered correctly

#### Detail Data Rendering

Verify:
- detail view loads the correct record
- unauthorized access is blocked
- bid/order metadata is rendered from fetched data rather than mocks

### Verification Standard

At minimum, implementation should prove:

- tests pass
- typecheck passes
- production build passes

## Acceptance Criteria

This subproject is complete when all of the following are true:

1. A new authenticated user can submit a request and see it in their dashboard
2. Dashboard data comes from Supabase, not demo-only in-memory state
3. Detail pages render real request/order data
4. Auth and profile bootstrap are reliable
5. Protected routes block unauthenticated access
6. Public showcase data can be seeded intentionally without contaminating user-owned views
7. Seed data is distinguishable from real production data
8. Loading/error/empty states exist for the core user flow
9. Tests, typecheck, and build all pass

## Deferred Work

These are intentionally deferred to later subprojects:

- production expert bidding UX
- payment and escrow
- messaging/chat UX
- advanced admin operations
- subscription billing
- analytics and observability deepening

## Implementation Notes for Planning

The upcoming implementation plan should prioritize:

1. stabilizing data boundaries
2. replacing fake local-state request lifecycle
3. securing auth and ownership
4. adding seed capability in a controlled way
5. proving the flow with focused tests

## Open Questions Carried into Planning

These do not block the spec, but should be resolved during planning:

- whether seed metadata lives as explicit columns or in a dedicated showcase table for some surfaces
- whether the app should adopt a real router immediately or continue with controlled view switching for the first production pass
- whether internal seed generation should ship with a minimal admin trigger in phase 1 or land as script-only first
