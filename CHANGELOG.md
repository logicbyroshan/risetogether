# Changelog

All notable changes to RiseTogether are documented in this file.

## [Community Visuals, 4 Projects Grid, Lenis Smooth Scroll & Active State Neutralization] - 2026-09-16

### Added
- **3D Isometric Community Hero (`frontend/public/assets/images/community_3d_hero.jpg`)**: Replaced text pulse box with an authentic 3D isometric community hub visual featuring status indicators, real-time activity chip, and college chapters metric.
- **Authentic Student Community Photograph (`frontend/public/assets/images/community_real_photo.jpg`)**: Replaced workstation code editor in `Who We Are` (`#about`) with an authentic collaborative student hackathon photo and community overlay card.
- **4 Projects Grid Display (`HomePage.tsx`)**: Sliced and rendered 4 community projects in a clean 2x2 grid using the shared `ProjectCard` UI primitive, complete with rich fallback projects.
- **Deep Lenis Smooth Scrolling (`SmoothScroll.tsx`, `index.css`)**: Added `useLenis()` hook, `window.lenis` attachment, global anchor `a[href^="#"]` smooth scroll delegation with navbar offset, and official Lenis CSS rules.
- **Modern README.md Redesign**: Comprehensive overhaul with modern GitHub shields, 3D community & real hackathon photo showcases, system architecture ASCII topology, and documentation matrix.

### Removed
- **Deprecated Server-Rendered HTML Templates**: Completely purged legacy `backend/templates/` (`Pages/`, `accounts/`, `feed/`, `home.html`, `base.html`, etc.) and `backend/accounts/views_backup.py`.
- **Obsolete Pre-Migration Documentation**: Removed dated logs (`BASELINE_TEST_RESULTS.md`, `MIGRATION_AUDIT.md`, `MIGRATION_STATUS.md`, `INDEX.md`).

### Fixed
- **FAQ Accordion Visibility**: Fixed bug where an empty API response (`faqs: []`) evaluated as truthy, preventing default FAQ cards from rendering.
- **Active Element Color Toning**: Strict enforcement of brand color rules across `Tabs.tsx`, `Pagination.tsx`, FAQ accordion, and `ProfilePage.tsx`—replacing heavy solid orange surfaces and borders with elegant dark neutral elevated surfaces (`bg-neutral-800`, `border-neutral-700`).
- **Git Hygiene**: Added `.venv/` and `.venv*/` to `.gitignore` to prevent local virtual environments from being committed.
- **Root API Status**: Configured backend `GET /` to return a clean JSON health response instead of looking for legacy `home.html`.

---

## [Homepage UI/UX Overhaul, Workstation IDE & Lenis Smooth Scroll] - 2026-09-15

### Added
- **Lenis Smooth Inertial Scrolling (`frontend/src/components/common/SmoothScroll.tsx`)**: Full project momentum-based inertial scrolling with custom damping curve and RAF loop.
- **Hero Command Center (100vh / 100vw)**: Full viewport hero layout with live DSA radar & activity log stream (`@aarav solved LRU Cache`, `@priya solved Two Sum`, real-time memory & latency HUD), high-contrast action CTAs, and anchored metric chips.
- **Realistic IDE Workstation Display (`Who We Are`)**: Equal-height narrative and hardware monitor display with interactive tabs (`manifest.ts`, `dsa_engine.py`), syntax-highlighted code editor pane, and live execution status console.
- **Interactive 3-Stage Mission Pipeline (`Our Mission`)**: Replaced generic 3 cards with an integrated 3-stage capability flywheel (`Stage 01: LEARN`, `Stage 02: BUILD`, `Stage 03: GROW`) with progress track accents and capability badges.
- **Quarterly 3-Month Community Roadmap (`Community Calendar`)**: 3-month quarter timeline (`Month 01: Foundation & Algorithmic Sprint`, `Month 02: Production Systems`, `Month 03: National Demo Day & Summit`) with month switcher tabs and event action buttons.
- **Verified Developer Student Stories**: Cleaned up testimonials by removing 5-star ratings and introducing verified cohort badges (`✓ Cohort of '24`, `Placed @ Microsoft`, `Top 1% Grind 500`).
- **Equal-Height Contact Hub**: Balanced left contact info hub and right message form cards with inquiry category selector (`General Inquiry`, `Workshop Collaboration`, `Campus Ambassador`, `Grind 500 Feedback`, `Partnership`).

### Changed
- **Crisp Logo Branding**: Removed orange glow drop shadows and harsh borders on `logo.png` across `Navbar`, `Footer`, `LoginPage`, `JoinPage`, `PasswordResetPage`, `PasswordResetConfirmPage`, and `NotFoundPage`.

---

## [Official RiseTogether 3D Embossed Logo Rebranding] - 2026-09-15

### Added
- **Official Brand Logo Assets**:
  - Moved official logo into `frontend/public/assets/images/logo.png`, `frontend/public/logo.png`, and `frontend/public/favicon.png`.
  - Removed raw unorganized `logo.png` from project root.

### Changed
- **Cross-Application Brand Integration**:
  - Updated browser favicon and Apple Touch icon in `frontend/index.html` to display the official high-resolution logo.
  - Replaced legacy text-only placeholders with the official embossed logo in top navigation (`Navbar.tsx`) and application footer (`Footer.tsx`).
  - Integrated official brand logo across all authentication & user onboarding flows: `LoginPage.tsx`, `JoinPage.tsx`, `PasswordResetPage.tsx`, `PasswordResetConfirmPage.tsx`, and `NotFoundPage.tsx`.

---

## [Elimination of Dark Blue Strips & Refined Active States] - 2026-09-15

### Fixed
- **Dark Blue Background Discolorations**:
  - Removed dark blue-gray hex color overrides (`#111827`, `#0b0f19`, `#172033`) in `tailwind.config.js` and replaced with neutral dark tokens (`#121212`, `#080808`, `#171717`).
  - Switched body and layout root backgrounds from `bg-gray-900` to pure `bg-black` in `index.html`, `AppLayout.tsx`, `LeaderboardPage.tsx`, and `ProfilePage.tsx`.
  - Removed fixed ambient colored background spots that produced blue/orange atmospheric bleed above and below page sections.

### Changed
- **Refined Active Element Styles**:
  - Navbar desktop and mobile navigation links now use a clean, sophisticated neutral highlight (`text-white bg-neutral-900 border border-neutral-800 font-semibold`) when active, completely eliminating harsh solid orange block backgrounds.
  - Active tabs (`Tabs.tsx`) and category filter pills (`HomePage.tsx`) now use a sleek dark neutral highlight (`bg-neutral-800 text-white border border-neutral-700 font-semibold shadow-sm`).

---

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
