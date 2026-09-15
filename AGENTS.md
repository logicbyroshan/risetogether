# RiseTogether Development & Architecture Rules

## Architecture Overview

- **Backend**: Django 5.2 + Django REST Framework (DRF) organized as a Domain-Driven Modular Monolith in `backend/` (`accounts`, `community`, `feed`, `riseapp`).
- **Frontend**: React 19 + TypeScript 5.8 + Vite Single Page Application in `frontend/`.
- **Documentation**: Authoritative 24-guide engineering suite in `docs/`.
- **Admin**: Django Admin remains server-rendered and operational at `/admin/`.

---

## Frontend & Design System Rules

- **Design System First**: Always use shared UI primitives in `frontend/src/components/ui/` (`Button`, `Input`, `SearchBar`, `Dropdown`, `Modal`, `Tabs`, `Badge`, `Avatar`, `Pagination`, `LoadingState`, `EmptyState`, `ErrorState`, `FormField`). Never invent ad-hoc button, input, or modal markup.
- **Brand Color Hierarchy**: **Orange (`#f97316`) is strictly for Brand, Action, and Focus/Emphasis.** Never turn entire surfaces, cards, or page backgrounds orange. Surfaces must remain dark neutral glassmorphic containers (`#111827`, `#1f2937`).
- **Strict Typing**: All React components, hooks, and API responses must have strict TypeScript types. Never use `any` unless an unavoidable third-party boundary requires it.
- **Centralized API Layer**: All HTTP calls must pass through `frontend/src/api/` modules with the centralized Axios client and automatic CSRF handling.
- **Async State Handling**: Every data-driven view must provide `LoadingState`, `ErrorState` with retry, and `EmptyState` fallbacks.
- **Visual Parity**: Maintain 1:1 visual fidelity with the dark futuristic glassmorphic aesthetic, font pairing (`Rajdhani` headings + `Inter` body), and responsive breakpoints.

---

## Backend Domain Rules

- **Domain-Driven Modular Monolith**: Structure apps around distinct business domains (`accounts`, `community`, `feed`, `riseapp`).
- **Layering Pattern**:
  - `models.py`: Database schema and constraints.
  - `serializers.py`: DRF serialization, deserialization, and validation.
  - `services.py`: Business logic and state mutations.
  - `selectors.py`: Complex queries and filtering with `select_related` and `prefetch_related` to eliminate N+1 queries.
  - `api_views.py`: Request dispatching and response formatting.
- **Backend Authoritative Security**: All authorization, validation, permissions (`IsOwnerOrReadOnly`), and activity scoring must be enforced server-side. Frontend route guards are UX only.
- **Session & CSRF Security**: Maintain Django session authentication with `HttpOnly` and `SameSite=Lax` cookies, with CSRF token exchange on state-mutating requests.
- **Database Safety**: Never destroy existing database records or reset migrations without explicit instruction.

---

## Documentation & Governance Rules

- **Documentation Updates**: Whenever an architecture, domain, API, or design system change is made, update the corresponding file in `docs/` and log entries in `CHANGELOG.md`.
- **Architecture Decisions**: Record significant technical choices as Architecture Decision Records (ADRs) in `docs/DECISIONS.md`.
- **Granular PR Workflow**: Commit changes in small, atomic, well-documented commits across dedicated feature/refactor/docs branches, and merge through Pull Requests via GitHub CLI (`gh`).

---

## Verification & Testing Requirements

- **Backend Test Suite**: `python backend/manage.py test accounts community feed riseapp` must pass with 0 errors before merging.
- **Frontend Verification**: `npm run build` in `frontend/` must compile with 0 TypeScript or lint errors.
- **Automation Runner**: Validate both tiers via `powershell -ExecutionPolicy Bypass -File scripts/test.ps1`.
