# RiseTogether Development Rules

## Current Architecture

- The current product is a Django 5.2 monolith with server-rendered templates, SQLite development data, Django sessions, and Django Admin.
- The migration target is Django plus DRF APIs and a React/TypeScript/Vite frontend, but this repository is currently in the audit phase.
- Read `docs/MIGRATION_AUDIT.md`, `docs/FEATURE_INVENTORY.md`, and `docs/BASELINE_TEST_RESULTS.md` before changing application code.

## Migration Rules

- Preserve existing models, data, URLs, workflows, permissions, validation, media behavior, and visual styling unless a documented migration decision requires change.
- Do not delete templates, JavaScript, static assets, migrations, database files, or legacy feed paths until equivalent behavior is implemented and verified.
- Do not redesign the UI or invent features during migration.
- Keep Django Admin server-rendered and working at `/admin/`.
- Move business rules to Django services/API code, never to React.
- Use small phases: audit, API foundation, authentication, feature APIs, React foundation, feature migration, parity verification, cleanup.
- Update `CHANGELOG.md` and migration documents after each completed phase.

## Backend Rules

- Keep model changes to the minimum genuinely required. Never destroy existing data or reset migrations.
- Use DRF serializers with explicit fields, read-only fields, validation, and safe nested data.
- Use appropriate API views rather than automatically converting every endpoint into a `ModelViewSet`.
- Enforce authentication and authorization on the backend. Frontend route guards are UX only.
- Preserve CSRF/session security if sessions remain the chosen authentication mechanism.
- Validate all client input server-side, including uploads, URLs, rich text, and permissions.
- Centralize complex workflows in Django service functions where that prevents duplicate logic.

## Frontend Rules

- Use React, TypeScript, Vite, and React Router with strict typing.
- Do not use `any` unless an unavoidable, documented boundary requires it.
- Keep API calls in a centralized client/service layer; do not scatter `fetch` calls through components.
- Provide loading, error, empty, validation, and success states for API-driven views.
- Preserve the existing template visual language, responsive breakpoints, navigation, icons, animations, and interaction behavior.
- Keep reusable layout, feature components, hooks, services, and domain types separate without creating meaningless abstractions.

## API and Security Rules

- Design APIs around resources and correct HTTP methods.
- Normalize API errors consistently and handle 400, 401, 403, 404, 409, 429, 500, and network failures where applicable.
- Never expose passwords, secrets, tokens, or internal sensitive fields in serializers or frontend configuration.
- Never disable CSRF or use unrestricted production CORS to bypass integration problems.
- Keep Django secrets, database credentials, and service credentials out of frontend environment variables.

## Testing and Verification

- Record baseline failures before migration work and distinguish pre-existing failures from migration regressions.
- Add backend tests for authentication, permissions, serializers, validation, CRUD, uploads, filtering, pagination, and error cases.
- Add frontend tests for routing, auth state, forms, API states, mutations, and important workflows.
- Verify important end-to-end flows against the database and inspect browser console/network errors.
- Run Django checks, backend tests, frontend typecheck/build, and focused tests after each migration phase.

## Naming and Structure

- Follow existing Django naming and app boundaries until a documented migration step changes them.
- Use clear domain names for serializers, services, API modules, React pages, components, hooks, and types.
- Keep backend and frontend configuration separate; document commands and environment variables.

## Forbidden Actions

- Do not reset the repository, destroy the database, rewrite migrations without cause, or overwrite unrelated user changes.
- Do not silently remove features, replace working behavior with placeholders, or mark work complete because a build compiles.
- Do not delete old templates or JavaScript before reference and parity verification.
