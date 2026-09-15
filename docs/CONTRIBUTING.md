# Contributing Guidelines

Thank you for contributing to RiseTogether! To maintain architectural integrity and high code quality, please adhere to the following development standards.

---

## 1. Branch Naming & Pull Request Lifecycle

- **Branch Naming**:
  - `feat/<scope>-<description>` — New features (e.g. `feat/feed-bookmark-filter`)
  - `fix/<scope>-<description>` — Bug fixes (e.g. `fix/auth-csrf-expiry`)
  - `refactor/<scope>-<description>` — Code refactoring without behavior change
  - `docs/<scope>-<description>` — Documentation improvements
  - `chore/<scope>-<description>` — Dependency and tooling updates

- **Pull Request Rules**:
  1. Create a feature branch from the latest `main`.
  2. Make small, focused, atomic commits using Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`, `test:`, `chore:`).
  3. Ensure all tests pass: `powershell -ExecutionPolicy Bypass -File scripts/test.ps1`.
  4. Push the branch and open a Pull Request via GitHub CLI: `gh pr create`.
  5. Merge via `gh pr merge <pr_number> --merge --delete-branch`.

---

## 2. Code Quality Rules

### Frontend (React/TypeScript)
- Use **strict TypeScript** with no `any` types.
- Always use **reusable UI primitives** from `components/ui/` (`Button`, `Input`, `Modal`, etc.) instead of writing ad-hoc styles.
- Follow the **Brand Orange Rule**: Orange is strictly for action and brand emphasis, never as an overwhelming surface color.

### Backend (Django/DRF)
- Keep business logic in **`services.py`** and complex query filters in **`selectors.py`**.
- Validate all client input server-side in **serializers**.
- Apply `select_related` and `prefetch_related` to avoid N+1 database queries.
- Enforce permissions strictly server-side.
