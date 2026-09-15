# Development Workflow

This document describes the day-to-day workflow for developing, testing, and verifying RiseTogether.

---

## 1. Quick Start

### Start Full-Stack Dev Environment
Run the concurrent startup script to launch both the Django backend (`127.0.0.1:8000`) and Vite dev server (`localhost:5173`):

```powershell
# Windows PowerShell
powershell -ExecutionPolicy Bypass -File scripts/dev.ps1

# Linux / macOS Bash
./scripts/dev.sh
```

- **Frontend Application**: `http://localhost:5173`
- **Backend API Root**: `http://127.0.0.1:8000/api/`
- **Django Admin**: `http://127.0.0.1:8000/admin/`

---

## 2. Test & Verification Workflow

Run the test suite before submitting any Pull Request:

```powershell
# Run full backend tests and frontend typecheck/build
powershell -ExecutionPolicy Bypass -File scripts/test.ps1
```

---

## 3. Database Management

```bash
cd backend

# Create new migrations after model changes
python manage.py makemigrations

# Apply migrations
python manage.py migrate

# Create superuser for Django Admin access
python manage.py createsuperuser
```
