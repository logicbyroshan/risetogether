# State Management

This document defines how state is categorized, scoped, and synchronized across the RiseTogether frontend.

---

## 1. State Categories

```
State Architecture
│
├── 1. Server State (Remote Database Data)
│   └── Fetched via domain API clients (api/*.ts) inside route pages
│
├── 2. Global Application State (Shared Across App)
│   ├── AuthContext: User session, current profile, loading state
│   └── ToastContext: Transient alert and message banner queue
│
└── 3. Local UI State (Component-Scoped)
    ├── Form field inputs and client validation errors
    ├── Modal dialog open / close toggles
    ├── Dropdown menu active states
    └── Active tab selection (e.g. Latest vs Trending)
```

---

## 2. Global Context Providers

### `AuthContext` (`frontend/src/context/AuthContext.tsx`)
Exposes:
- `user: UserProfile | null` — Currently authenticated user details.
- `isLoading: boolean` — Initial session check in progress.
- `isAuthenticated: boolean` — Convenience boolean indicator.
- `login(credentials)` — Performs session login and updates user state.
- `register(data)` — Performs registration and immediate login.
- `logout()` — Destroys session and cleans up user state.
- `refreshUser()` — Re-fetches `/api/auth/me/` following profile edits.

### `ToastContext` (`frontend/src/context/ToastContext.tsx`)
Exposes:
- `toasts: ToastMessage[]` — Active toast queue.
- `showToast(message, type, duration?)` — Dispatches a message banner.
- `removeToast(id)` — Dismisses a toast manually or after timeout.
- Helper shortcuts: `success()`, `error()`, `warning()`, `info()`.
