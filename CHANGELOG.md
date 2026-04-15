# Changelog

All notable changes to this project are documented in this file.

The project follows semantic versioning.

## [1.5.4] - 2026-04-15

### Fixed
- Paid legacy members with non-numeric IDs (for example `VF-...`) are now backfilled to numeric `001-999` IDs even if `paid_at` or `checkout_session_id` is missing.
- Added a database migration to normalize existing paid legacy member IDs to numeric format in a deterministic order.

## [1.5.3] - 2026-04-15

### Changed
- Admin dashboard is now localized in Chinese, including credentials panel, metrics cards, daily table, and leads table labels.
- Added daily real-data breakdown in admin stats: `PV`, `UV`, waitlist leads, and paid members.
- Admin stats now expose both `pageViews` and `visitors` (UV) for period and lifetime windows.

### Fixed
- Waitlist and paid metrics now only count rows with valid email format to keep business statistics real and trustworthy.
- Frontend now records `page_view` on each page load (instead of session-level dedupe) to improve daily PV authenticity.

## [1.5.2] - 2026-04-15

### Fixed
- Visitor metrics in admin dashboard now count distinct tracked sessions across all analytics events, reducing undercount when `page_view` events are missing.
- Added a focused unit test for analytics session-id deduplication and normalization.

## [1.5.1] - 2026-04-15

### Fixed
- Admin dashboard conversion rates are now capped at `100%` (`1.0`) to prevent misleading values when visitor tracking undercounts.
- Added focused unit tests for conversion-rate calculations.

## [1.5.0] - 2026-04-15

### Added
- Admin account login support (Basic Auth) with default credentials:
  - username: `vibecoder`
  - password: `Qq652581!`
- Optional token-based admin auth remains supported.
- Release scripts for version management:
  - `npm run release:patch`
  - `npm run release:minor`
  - `npm run release:major`

### Changed
- SEO metadata upgraded for stronger English-market discoverability.
- Favicon and manifest icons now use `/ico.png`.
- Admin dashboard UI now supports account/password login flow.
