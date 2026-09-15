# RiseTogether Documentation

Welcome to the official technical documentation for **RiseTogether**, a modern community and social platform for developers, creators, and learners.

---

## Documentation Index

### 1. Architecture & System Overview
- [ARCHITECTURE.md](ARCHITECTURE.md) — High-level architecture, multi-tier modular monolith design, and system components.
- [FRONTEND_ARCHITECTURE.md](FRONTEND_ARCHITECTURE.md) — React 19, TypeScript, Vite, client-side routing, layout shells, and state management.
- [BACKEND_ARCHITECTURE.md](BACKEND_ARCHITECTURE.md) — Django 5.2, Django REST Framework (DRF), domain layering, services, selectors, and API routing.
- [API_ARCHITECTURE.md](API_ARCHITECTURE.md) — RESTful conventions, error normalization, pagination, and response standards.
- [DECISIONS.md](DECISIONS.md) — Architecture Decision Records (ADRs) detailing core technical choices.

### 2. Product & Features
- [FEATURES.md](FEATURES.md) — Complete feature map and inventory across authentication, social feed, community, and user profiles.
- [SOCIAL_PLATFORM.md](SOCIAL_PLATFORM.md) — Social graph mechanics, feed ordering, interactions, nested comments, and content discovery.
- [ROUTING.md](ROUTING.md) — Route trees for frontend client URLs and backend `/api/` endpoints.

### 3. Frontend & Design System
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) — Visual identity, brand color hierarchy (controlled Orange usage), typography, spacing, and glassmorphic surfaces.
- [COMPONENT_LIBRARY.md](COMPONENT_LIBRARY.md) — Reusable UI primitives (`Button`, `Input`, `Modal`, `Avatar`, `Dropdown`, `Card`, etc.) with TypeScript props and usage examples.
- [STATE_MANAGEMENT.md](STATE_MANAGEMENT.md) — Global React contexts (`AuthContext`, `ToastContext`), local component state, and server state.

### 4. Backend, Data & Security
- [DATABASE.md](DATABASE.md) — Database configuration, migrations, indexing, and connection management.
- [DATA_MODEL.md](DATA_MODEL.md) — Entity Relationship Diagram (ERD), models, relations, and business constraints.
- [AUTHENTICATION.md](AUTHENTICATION.md) — Session-based authentication, CSRF cookie handling, login, registration, and password recovery.
- [AUTHORIZATION.md](AUTHORIZATION.md) — Server-side permissions, object-level rules, role-based access control (RBAC).
- [SECURITY.md](SECURITY.md) — CSRF/CORS policies, sensitive field protection, and client upload validation.
- [ERROR_HANDLING.md](ERROR_HANDLING.md) — Standardized DRF error handler, status codes, and frontend error states.

### 5. Engineering, Operations & Governance
- [DEVELOPMENT_WORKFLOW.md](DEVELOPMENT_WORKFLOW.md) — Local development setup, concurrent dev server scripts, and PR workflows.
- [TESTING.md](TESTING.md) — Automated Django test suite, React type checking/build verification, and test execution scripts.
- [DEPLOYMENT.md](DEPLOYMENT.md) — Production build generation, static asset collection, and deployment architecture.
- [ENVIRONMENT.md](ENVIRONMENT.md) — Configuration settings and environment variables reference.
- [CONTRIBUTING.md](CONTRIBUTING.md) — Code style guidelines, branch naming, and pull request checklist.
