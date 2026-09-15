# Security Architecture

RiseTogether follows defense-in-depth principles across transport, authentication, authorization, session management, and client input handling.

---

## 1. Core Security Controls

| Domain | Mechanism | Implementation Details |
|---|---|---|
| **Authentication** | Django Session Auth | Stored in secure database sessions; `sessionid` cookies marked `HttpOnly` and `SameSite=Lax`. |
| **CSRF Protection** | Django CSRF Middleware | Requires valid `X-CSRFToken` header matching the `csrftoken` cookie for all state-mutating requests. |
| **CORS Policy** | `django-cors-headers` | Explicitly whitelists authorized frontend origins (`localhost:5173`, `localhost:3000`). Wildcards (`*`) are strictly prohibited in production. |
| **Authorization** | Server-side DRF Permissions | Object-level checks (`IsOwnerOrReadOnly`) guarantee that users cannot alter or delete foreign resources. |
| **Secret Protection** | Zero Secret Exposure | Django `SECRET_KEY` and sensitive fields (`password`, internal tokens) are excluded from DRF serializers and frontend builds. |
| **Input Sanitization** | HTML Sanitation & ORM | Django ORM prevents SQL injection; TinyMCE content is sanitized to prevent cross-site scripting (XSS). |
| **File Uploads** | Restricted Media Directories | User uploads are stored in isolated `media/` directories with extension and MIME-type validation. |

---

## 2. Secure Production Recommendations

1. Set `DEBUG = False` in production.
2. Enable `CSRF_COOKIE_SECURE = True` and `SESSION_COOKIE_SECURE = True` over HTTPS.
3. Configure `SECURE_BROWSER_XSS_FILTER`, `SECURE_CONTENT_TYPE_NOSNIFF`, and `X_FRAME_OPTIONS = 'DENY'`.
