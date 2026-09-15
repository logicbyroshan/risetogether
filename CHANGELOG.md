# Changelog

All notable changes to RiseTogether are documented in this file.

## [Pure Jet Black Theme, Sharp Minimal Radius & Layout Alignment] - 2026-09-15

### Added
- **Subtle Background Grid Patterns (`frontend/src/index.css`)**: Integrated `.bg-grid-pattern` with dark neutral character elements and radial gradient masks for visual texture without distraction.

### Changed
- **Pure Jet Black Theme (100% Black Background)**: Replaced dark bluish tones (`#111827`, `#0b0f19`) with pure `#000000` body and root background tokens, using neutral surfaces (`#0a0a0a`, `#121212`, `border-neutral-800`).
- **Sharp Minimal Border Radius (`rounded-[3px]`)**: Updated shared UI primitives (`Card`, `Button`, `Input`, `SearchBar`, `Dropdown`, `Badge`, `Modal`, `Tabs`, `Pagination`) and page components to use a sharp, minimal corner radius (`rounded-[3px]` / `rounded-sm`).
- **Standardized Control Heights**: Standardized all interactive elements (`Button`, `Input`, `SearchBar`, `Dropdown`) to uniform heights (`h-10` for standard 40px, `h-11` for primary CTA 44px, and `h-8` for compact 32px).
- **Unified Width Alignment (`max-w-7xl`)**: Aligned the container width of `Navbar`, `Footer`, and all 10 `HomePage` feature sections to `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.

---

## [DSA Gamification, Leaderboard Landing Page & Coder Social UI] - 2026-09-15

### Added
- **Grind 500 / Leaderboard Landing Page (`frontend/src/pages/HomePage.tsx`)**:
  - Replaced landing page with 1:1 reproduction of the Grind 500 Leaderboard from `E:\E\tEST\grind-500`.
  - Top 3 Players Showcase podium layout (Center #1 Main Player elevated with gold glow, #2 and #3 cards with top avatar badges, trophy rank badges, and diamond total points).
  - Dynamic timeframe tabs (`Overall`, `Daily`, `Weekly`, `Monthly`) connected to live backend rankings.
  - User ranking banner (`"You are ranked X out of Y users"`) and styled leaderboard table for rank 4+.
- **Coder Profile & Problem Solving Social UI (`frontend/src/pages/ProfilePage.tsx`)**:
  - Tablet-style container with dark IDE color palette (`#1a1b26`, `#24283b`, `#31354b`).
  - Profile header with custom cover photo, 275px avatar with border, user bio, rank stats (`M Rank`, `W Rank`, `D Rank`), and quick action buttons.
  - `Problems` tab with `CodingPostCard` items featuring 3-dot options dropdown, difficulty & time complexity badges, dark IDE code editor window (`Fira Code` monospace), star point indicators, and programming language badges.
  - `Leaderboard` tab with full rankings list and glowing self highlight `(You)`.
  - `CreateCodingPostModal` with real-time programming language auto-detection (Python, Java, C++, TypeScript, JavaScript) and daily 3-post limit validation.
- **DSA & Leaderboard Backend Domain (`backend/dsa/`)**:
  - `Leaderboard` and `CodingProblemPost` models.
  - Gamified point scoring engine (`services.py`: difficulty points + time complexity points + daily activity bonus + streak bonuses at 7/15/30/60/90 days).
  - Language detection, point recalculation on post update/deletion, and automatic daily/weekly/monthly rank resets.
  - DRF endpoints: `GET /api/dsa/leaderboard/?timeframe=...`, `GET /api/dsa/user-stats/`, and CRUD `/api/dsa/coding-posts/`.
  - Comprehensive unit test suite with 100% pass rate.

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
