# Environment Configuration

This document lists all environment variables, default settings, and operational configurations used across RiseTogether.

---

## 1. Backend Environment Variables (`backend/.env`)

| Variable | Type | Default (Dev) | Description |
|---|---|---|---|
| `DJANGO_SECRET_KEY` | String | (insecure dev key) | Django cryptographic signing secret key. |
| `DJANGO_DEBUG` | Boolean | `True` | Debug flag. Must be set to `False` in production. |
| `DJANGO_ALLOWED_HOSTS`| String | `localhost,127.0.0.1` | Comma-separated list of permitted host headers. |
| `DATABASE_URL` | String | `sqlite:///db.sqlite3` | Database connection string. |
| `CORS_ALLOWED_ORIGINS`| String | `http://localhost:5173`| Comma-separated list of allowed frontend origins. |
| `CSRF_TRUSTED_ORIGINS`| String | `http://localhost:5173`| Comma-separated list of trusted origins for CSRF. |
| `EMAIL_BACKEND` | String | `console.EmailBackend` | Email backend (`smtp.EmailBackend` in prod). |

---

## 2. Frontend Environment Variables (`frontend/.env`)

| Variable | Type | Default | Description |
|---|---|---|---|
| `VITE_API_BASE_URL` | String | `/api` | Base URL for REST API endpoints. |
| `VITE_APP_TITLE` | String | `RiseTogether` | Browser page title prefix. |
