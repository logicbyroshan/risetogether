# Testing Guide

This document outlines the testing strategy, test structure, and automated execution commands for RiseTogether.

---

## 1. Automated Test Architecture

```
Testing Pipeline
├── Backend Tests (Django Test Runner)
│   ├── accounts/tests/  # User registration, login, profile updates, leaderboard
│   ├── community/tests/ # Blog list/detail, project filters, activity querysets
│   ├── feed/tests/      # Post creation, likes, comments, nested replies, saves
│   └── riseapp/tests/   # Contact submission, newsletter subscribe, site content
│
└── Frontend Verification (TypeScript & Vite)
    ├── TypeScript Check: tsc -b
    └── Production Bundle: vite build
```

---

## 2. Test Execution Commands

### Unified Automation Script
Run the cross-platform test script to execute both backend and frontend suites:

```powershell
# Windows PowerShell
powershell -ExecutionPolicy Bypass -File scripts/test.ps1

# Linux / macOS Bash
./scripts/test.sh
```

### Backend Test Suite
```bash
# Run all backend tests
python backend/manage.py test accounts community feed riseapp

# Run specific app tests
python backend/manage.py test feed
```

### Frontend Build & Type Check
```bash
cd frontend
npm run build
```

---

## 3. Test Coverage Standards

1. **Authentication Tests**: Verify registration with valid/invalid emails, duplicate username prevention, login credentials, and session destruction on logout.
2. **Permission Tests**: Verify that unauthenticated requests to protected endpoints return `401 Unauthorized` and unauthorized mutations return `403 Forbidden`.
3. **Data Integrity Tests**: Verify that like and bookmark toggles increment/decrement correctly without creating duplicate records.
