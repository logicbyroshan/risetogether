# Changelog

All notable changes to RiseTogether are documented in this file.

## [Product Unification & Design System Release] - 2026-09-15

### Added
- **Comprehensive 24-Guide Documentation Suite (`docs/`)**:
  - `README.md` — Documentation index & navigation portal.
  - `ARCHITECTURE.md`, `FRONTEND_ARCHITECTURE.md`, `BACKEND_ARCHITECTURE.md` — Complete system architecture, React SPA, and Django modular monolith design.
  - `DESIGN_SYSTEM.md`, `COMPONENT_LIBRARY.md` — Design tokens, brand color hierarchy, typography, and UI primitive specifications.
  - `API_ARCHITECTURE.md`, `AUTHENTICATION.md`, `AUTHORIZATION.md`, `SECURITY.md`, `ERROR_HANDLING.md` — REST standards, session auth, CSRF exchange, object permissions, and error normalization.
  - `DATABASE.md`, `DATA_MODEL.md`, `SOCIAL_PLATFORM.md`, `FEATURES.md`, `ROUTING.md`, `STATE_MANAGEMENT.md` — Database configuration, ERDs, social graph mechanics, feature maps, route trees, and state scoping.
  - `TESTING.md`, `DEPLOYMENT.md`, `ENVIRONMENT.md`, `CONTRIBUTING.md`, `DEVELOPMENT_WORKFLOW.md`, `MIGRATION_STATUS.md`, `DECISIONS.md` — Automated test runners, production builds, env reference, developer guides, and ADRs 001–005.

- **Frontend Design System & UI Primitive Suite (`frontend/src/components/ui/`)**:
  - Built 22 strictly typed, accessible UI primitives: `Button`, `Input`, `SearchBar`, `Dropdown`, `Select`, `Checkbox`, `Radio`, `Textarea`, `Modal`, `Tabs`, `Badge`, `Avatar`, `Tooltip`, `Spinner`, `Skeleton`, `Divider`, `Pagination`, `LoadingState`, `EmptyState`, `ErrorState`, `FormField`, `Card`, `RichTextViewer`.
  - Formalized CSS design tokens in `frontend/src/index.css` enforcing the **Orange Rule: Brand + Action + Emphasis**, supported by dark neutral glassmorphism surfaces.

- **Backend Domain Query Optimization & Selectors (`backend/`)**:
  - Created domain selector modules in `backend/accounts/selectors.py`, `backend/community/selectors.py`, and `backend/feed/selectors.py`.
  - Implemented eager loading with `select_related('author', 'author__profile')` and `prefetch_related('media_files', 'project_links', 'post_likes', 'post_comments')`, eliminating N+1 database queries.

### Changed
- **Frontend Page & Component Refactoring**:
  - Refactored `Navbar`, `PostCard`, `CommentSection`, `FeedPage`, `BlogsPage`, `ProjectsPage`, `ActivitiesPage`, and `ProfilePage` to consume design system primitives.
- **Root Governance & Documentation**:
  - Updated root `README.md` with complete architecture overview, quickstart scripts, and documentation index.
  - Updated `AGENTS.md` with strict frontend design system, backend domain layering, and testing governance rules.

---

## [Initial Multi-Tier Migration] - 2026-09-15

### Added
- Reorganized monolithic Django project into clean `backend/` and `frontend/` directory structure.
- Configured Django REST Framework (DRF), session authentication, and CORS.
- Implemented React 19 + TypeScript + Vite Single Page Application with 1:1 visual parity.
- Added cross-platform developer automation scripts in `scripts/` (`dev.ps1`/`dev.sh`, `test.ps1`/`test.sh`, `build.ps1`/`build.sh`).
