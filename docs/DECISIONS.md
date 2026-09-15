# Architecture Decision Records (ADRs)

This document records the significant architectural decisions made during the evolution of RiseTogether.

---

## ADR 001: Modular Django Monolith with React SPA
- **Status**: Accepted
- **Context**: The project was a monolithic Django 5.2 application with server-rendered templates. We needed rich social interactions, fluid UI transitions, and modular maintainability without unnecessary microservice complexity.
- **Decision**: Retain Django 5.2 as a modular backend exposing Django REST Framework APIs under `/api/`, paired with a dedicated React 19 + TypeScript + Vite Single Page Application.
- **Consequences**: Fast developer velocity, centralized database transactions, and zero microservice operational overhead.

---

## ADR 002: Session & CSRF-Based SPA Authentication
- **Status**: Accepted
- **Context**: Evaluating JWT versus Session cookies for SPA authentication.
- **Decision**: Use Django session cookies with `HttpOnly`, `SameSite=Lax`, and standard CSRF token validation via Axios interceptors.
- **Consequences**: Immune to client-side XSS token theft, seamless Django Admin integration, and safe session termination.

---

## ADR 003: Controlled Brand Orange Hierarchy
- **Status**: Accepted
- **Context**: Orange was inconsistently applied across all elements, leading to visual fatigue.
- **Decision**: Enforce the rule: **Orange = Brand + Action + Emphasis**. Surfaces and cards remain dark neutral glassmorphism (`#111827`, `#1f2937`), reserving orange for CTAs, active pills, and focus rings.
- **Consequences**: Clean, premium aesthetics with high contrast and WCAG AA accessibility compliance.

---

## ADR 004: Service and Selector Pattern in Django Apps
- **Status**: Accepted
- **Context**: View functions were accumulating business logic, calculations, and complex ORM queries.
- **Decision**: Separate business mutations into `services.py` and complex query filters into `selectors.py`.
- **Consequences**: Clean, testable domain layers and reusable querysets with `select_related` and `prefetch_related`.

---

## ADR 005: Reusable Headless & Styled UI Component Library
- **Status**: Accepted
- **Context**: Individual pages were creating duplicate buttons, inputs, modals, and badges.
- **Decision**: Centralize all UI primitives in `frontend/src/components/ui/` with semantic TypeScript props.
- **Consequences**: 100% visual consistency across all pages and reduced codebase maintenance.
