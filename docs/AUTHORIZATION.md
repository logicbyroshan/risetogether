# Authorization & Permissions

RiseTogether enforces strict, server-side authorization checks on all API endpoints.

---

## 1. Permission Architecture

```
                 Incoming Request
                        │
                        ▼
          [ Global Default Permission ]
          (IsAuthenticatedOrReadOnly)
                        │
         ┌──────────────┴──────────────┐
         ▼                             ▼
    [ Read Only ]                [ Write Action ]
  (GET, HEAD, OPTIONS)         (POST, PUT, DELETE)
         │                             │
    Allow Public                       ▼
                              [ Object Permissions ]
                           (IsOwnerOrReadOnly / Custom)
                                       │
                        ┌──────────────┴──────────────┐
                        ▼                             ▼
                 Request User == Owner           Different User
                        │                             │
                   Allow (200/204)             Deny (403 Forbidden)
```

---

## 2. Standard DRF Permission Classes

Defined in `backend/common/permissions.py`:

- **`IsOwnerOrReadOnly`**: Allows anonymous or general authenticated users to read records, but restricts write/delete actions strictly to the object's `author` or `user`.
- **`IsAdminOrReadOnly`**: Restricts write operations to Django staff and administrators (`is_staff=True`), used for community blogs, activities, FAQs, and site configuration.
- **`IsAuthenticated`**: Enforces that the request must be from a logged-in user with a valid active session.

---

## 3. Server-Side vs Frontend Route Guards

> [!IMPORTANT]
> **Frontend route guards are purely a UX enhancement.** They redirect unauthenticated users to `/login` for convenience, but the Django/DRF backend is the sole authoritative gatekeeper for security and data access.
