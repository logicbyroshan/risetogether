# Deployment Guide

This document explains the production deployment procedure, static file handling, WSGI server configuration, and environment setup for RiseTogether.

---

## 1. Production Architecture Overview

```mermaid
graph LR
    User([User Browser]) -->|HTTPS (Port 443)| Nginx[Nginx Reverse Proxy]
    Nginx -->|Static Assets (/static/, /assets/)| StaticFiles[Collected Static Files]
    Nginx -->|Media Uploads (/media/)| MediaFiles[Media Storage]
    Nginx -->|API & Admin Requests (/api/, /admin/)| Gunicorn[Gunicorn / WSGI (Port 8000)]
    Nginx -->|SPA Frontend Routes (/)| ViteDist[frontend/dist/]
    Gunicorn --> DB[(PostgreSQL Database)]
```

---

## 2. Production Build Steps

Execute the automated multi-tier build script:

```powershell
# Windows
powershell -ExecutionPolicy Bypass -File scripts/build.ps1

# Linux / macOS
./scripts/build.sh
```

### Manual Step Breakdown
1. **Frontend Production Build**:
   ```bash
   cd frontend
   npm ci
   npm run build
   ```
   Outputs the optimized SPA bundle into `frontend/dist/`.

2. **Backend Static Collection**:
   ```bash
   cd backend
   python -m pip install -r requirements.txt
   python manage.py collectstatic --noinput
   python manage.py migrate
   ```

3. **Running the Application**:
   ```bash
   gunicorn config.wsgi:application --bind 0.0.0.0:8000 --workers 3
   ```
