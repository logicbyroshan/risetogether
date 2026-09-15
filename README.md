<div align="center">
  <img src="docs/screenshots/RiseThumb.png" alt="Rise Together Banner" width="100%" />
</div>

<h1 align="center">🚀 RiseTogether</h1>

<p align="center">
  <strong>Learn. Build. Share. Grow.</strong><br>
  A unified community and social engagement platform for developers, learners, and tech innovators.
</p>

<div align="center">

[![Django](https://img.shields.io/badge/Django-5.2-092E20?style=for-the-badge&logo=django&logoColor=white)](https://www.djangoproject.com/)
[![DRF](https://img.shields.io/badge/Django_REST-Framework-red?style=for-the-badge&logo=django&logoColor=white)](https://www.django-rest-framework.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8.3-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

</div>

---

## 🌟 About The Project

**RiseTogether** is a full-stack social and community ecosystem engineered to empower developers. It combines a **Django 5.2 + Django REST Framework** modular backend with a **React 19 + TypeScript + Vite** Single Page Application featuring 1:1 dark glassmorphic styling, responsive layout, interactive timelines, and gamified leaderboards.

---

## 🏗️ Architecture Overview

```
RiseTogether/
├── backend/             # Django 5.2 & Django REST Framework (DRF)
│   ├── config/          # Project settings, root URLs, custom exception normalization
│   ├── common/          # Object permissions & pagination utilities
│   ├── accounts/        # User identity, profile management, and auth API
│   ├── community/       # Blogs, projects, activities, categories, and skills
│   ├── feed/            # Social timeline, likes, bookmarks, and threaded comments
│   └── riseapp/         # Landing page content, FAQs, testimonials, and contact
│
├── frontend/            # React 19 + TypeScript + Vite SPA
│   ├── src/
│   │   ├── api/         # Centralized Axios client & domain endpoints
│   │   ├── components/  # Reusable UI primitives (components/ui/) & layouts
│   │   ├── context/     # AuthContext & ToastContext providers
│   │   ├── pages/       # Route pages (Home, Feed, Blogs, Projects, Profile...)
│   │   └── types/       # Strict TypeScript interfaces
│
├── docs/                # Comprehensive 24-document engineering guide
├── scripts/             # Cross-platform development, test, and build automation
├── AGENTS.md            # Development & architectural governance rules
└── CHANGELOG.md         # Full migration history & change record
```

---

## ✨ Key Features

- 🔐 **Session-Based Authentication**: Seamless registration, login, logout, and password reset with automated CSRF protection.
- 💬 **Interactive Social Feed**: Rich media posts (multi-image & video), project repository embeds, instant optimistic likes, bookmarks, and threaded comment replies.
- 🏆 **Gamified Developer Profiles**: Dynamic activity score calculation awarded for projects, articles, discussions, and DSA solutions.
- 📚 **Community Hub**: Published articles directory, open-source project showcases, live sprint calendars, and learning resources.
- 🎨 **Unified Design System**: Controlled Orange brand hierarchy (`Brand + Action + Emphasis`), dark glassmorphism surfaces (`#111827`, `#1f2937`), and accessible UI primitives.

---

## 🚀 Quick Start

### 1. Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

### 2. Start Full-Stack Dev Environment
Launch both the Django backend (`127.0.0.1:8000`) and the Vite dev server (`localhost:5173`) with a single command:

```powershell
# Windows PowerShell
powershell -ExecutionPolicy Bypass -File scripts/dev.ps1

# Linux / macOS Bash
./scripts/dev.sh
```

- **Frontend SPA**: `http://localhost:5173`
- **Backend REST API**: `http://127.0.0.1:8000/api/`
- **Django Admin**: `http://127.0.0.1:8000/admin/`

---

## 🧪 Automated Testing & Verification

Run the unified test runner to execute both the Django test suite and frontend type check/build:

```powershell
# Windows
powershell -ExecutionPolicy Bypass -File scripts/test.ps1

# Linux / macOS
./scripts/test.sh
```

- **Backend Test Suite**: `python backend/manage.py test accounts community feed riseapp` (28/28 tests passing)
- **Frontend Verification**: `cd frontend && npm run build` (0 TypeScript errors)

---

## 📖 Comprehensive Documentation

Explore the complete documentation in the [`docs/`](docs/README.md) directory:

| Document | Topic |
|---|---|
| [**System Architecture**](docs/ARCHITECTURE.md) | High-level system design & modular monolith principles |
| [**Frontend Architecture**](docs/FRONTEND_ARCHITECTURE.md) | React 19, TypeScript, routing, and state management |
| [**Backend Architecture**](docs/BACKEND_ARCHITECTURE.md) | Django 5.2, DRF, domain boundaries, and selectors |
| [**Design System**](docs/DESIGN_SYSTEM.md) | Color tokens, typography, spacing, and brand orange usage |
| [**Component Library**](docs/COMPONENT_LIBRARY.md) | Reusable UI primitives catalog and prop specifications |
| [**API Architecture**](docs/API_ARCHITECTURE.md) | REST standards, error normalization, and endpoint reference |
| [**Authentication**](docs/AUTHENTICATION.md) | Session auth, CSRF token exchange, and credentials |
| [**Data Model & ERD**](docs/DATA_MODEL.md) | Entity relationship diagrams and database schema |
| [**Social Platform**](docs/SOCIAL_PLATFORM.md) | Timeline ordering, interactions, and activity scoring |
| [**Architecture Decisions**](docs/DECISIONS.md) | Architecture Decision Records (ADRs 001–005) |

---

## 📜 Governance & Contribution

Please review [`AGENTS.md`](AGENTS.md) and [`docs/CONTRIBUTING.md`](docs/CONTRIBUTING.md) before opening Pull Requests.
