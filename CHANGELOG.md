# Changelog

## [Architecture Migration Complete] - 2026-09-15

### Added
- **Backend Architecture (`backend/`)**:
  - Reorganized Django 5.2 core and apps into clean `backend/` directory while preserving all existing database records, models, media, and migrations.
  - Installed and configured Django REST Framework (DRF) with CORS headers, CSRF session authentication, pagination, and unified error handling (`backend/config/exceptions.py`).
  - Added full serializer, view, service, and permission layers for `accounts`, `community`, `feed`, and `riseapp` under `/api/`.
  - Added 28 automated backend unit & API tests with 100% pass rate.
  - Preserved server-rendered Django Admin at `/admin/`.

- **Frontend Architecture (`frontend/`)**:
  - Initialized modern React 19 + TypeScript + Vite single page application with strict typing and no placeholder logic.
  - Implemented exact 1:1 visual parity with existing glassmorphism dark palette (`#111827`, `#1f2937`), orange/amber glow highlights (`#f97316`), and typography (`Rajdhani` and `Inter`).
  - Implemented centralized Axios API client with automatic CSRF token management and error normalization.
  - Implemented global `AuthContext` (session status, login, register, profile update) and `ToastContext` (notifications matching Django message colors).
  - Recreated all pages and components with interactive parity:
    - Homepage (`/`) with Hero, Mission, Live Stats, Project Showcase, Blog Articles, Activities, Testimonials, FAQ accordion, AJAX Contact Form, and Newsletter Subscription.
    - Community: Blogs List (`/community/blogs`), Blog Detail (`/community/blogs/:slug`), Projects Showcase (`/community/projects`), Activities Calendar (`/community/activities`), and Resources Library (`/community/resources`).
    - Social Feed: Main Feed (`/feed`) with Latest/Trending tabs, Type filters, "Create Post" modal (Normal, Blog, Project), Interactive Likes, Nested Comments & Replies, Saved Bookmarks (`/feed/saved`), and Post Detail (`/feed/posts/:id`).
    - User Profile: Profile view (`/profile`, `/profile/:username`), Edit Profile modal with image upload and link formset, and Settings (`/settings`).
    - Authentication: Login (`/login`), Join (`/join`), Password Reset flows (`/password-reset`, `/password-reset/confirm/:uid/:token`).

- **Scripts & Documentation (`scripts/`, `docs/`)**:
  - Added development and testing scripts: `dev.ps1`/`dev.sh`, `test.ps1`/`test.sh`, `build.ps1`/`build.sh`.
  - Added complete REST API Reference in `docs/API_REFERENCE.md`.
