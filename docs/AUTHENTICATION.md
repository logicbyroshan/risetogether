# Authentication System

RiseTogether implements a secure **Session-Based Authentication** architecture with automated **CSRF Protection** designed specifically for Single Page Applications (SPAs).

---

## 1. Authentication Flow

```mermaid
sequenceDiagram
    participant React as React SPA
    participant DRF as Django REST Framework
    participant DB as Database Session Store

    Note over React,DRF: 1. App Startup & Session Verification
    React->>DRF: GET /api/auth/me/ (with session cookie)
    alt Session Valid
        DRF-->>React: 200 OK (User Profile JSON)
        React->>React: Set AuthContext { user, isAuthenticated: true }
    else Session Expired / Anonymous
        DRF-->>React: 401 Unauthorized
        React->>React: Set AuthContext { user: null, isAuthenticated: false }
    end

    Note over React,DRF: 2. Login Flow
    React->>DRF: GET /api/auth/csrf/ (ensure csrftoken cookie exists)
    DRF-->>React: 200 OK (Set-Cookie: csrftoken=...)
    React->>DRF: POST /api/auth/login/ { email, password } (X-CSRFToken header)
    DRF->>DB: Validate user & create session
    DRF-->>React: 200 OK (Set-Cookie: sessionid=...; HttpOnly; SameSite=Lax)
    React->>React: Update AuthContext & navigate to /feed
```

---

## 2. CSRF Token Synchronization

1. **CSRF Cookie**: The backend exposes `CSRF_COOKIE_HTTPONLY = False`, allowing Axios to read `csrftoken` from the browser document cookie.
2. **Axios Interceptor**: `frontend/src/api/client.ts` automatically extracts the `csrftoken` cookie and attaches it to all mutating HTTP requests (`POST`, `PUT`, `PATCH`, `DELETE`) as the `X-CSRFToken` header.
3. **CORS & Credentials**: `CORS_ALLOW_CREDENTIALS = True` ensures cookies are transmitted on all cross-origin requests between the Vite dev server (`http://localhost:5173`) and Django (`http://127.0.0.1:8000`).

---

## 3. Password Reset & Recovery

- **Request**: `POST /api/auth/password-reset/` with `{ email }` sends a secure, timed reset link to the user's email (logged to console in development).
- **Confirmation**: `POST /api/auth/password-reset/confirm/` validates the UID and token before safely hashing and saving the new password.
