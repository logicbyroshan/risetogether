# Backend Architecture

The RiseTogether backend is engineered as a **Domain-Driven Modular Monolith** powered by **Django 5.2 and Django REST Framework (DRF)**.

---

## 1. Modular Monolith Architecture

The backend separates responsibilities into four primary business domains, supported by global configuration and common utilities:

```
backend/
├── config/                  # Django project root configuration
│   ├── settings.py          # App settings, CORS, CSRF, DRF config
│   ├── urls.py              # Root URL routing connecting /api/ & /admin/
│   ├── wsgi.py              # WSGI entrypoint
│   └── exceptions.py        # Centralized DRF exception normalization
│
├── common/                  # Shared framework infrastructure
│   └── permissions.py       # Reusable DRF permissions (IsOwnerOrReadOnly, IsAdminOrReadOnly)
│
├── accounts/                # User Identity, Profiles, and Authentication Domain
│   ├── models.py            # User, Profile, ProfileLink, VisitorPreference
│   ├── serializers.py       # User, Profile, Auth, Leaderboard serializers
│   ├── services.py          # Activity scoring, profile synchronization
│   ├── selectors.py         # User and profile query selectors
│   ├── api_views.py         # DRF Auth & Account API views
│   ├── api_urls.py          # /api/auth/ and /api/accounts/ routes
│   └── tests/               # Auth & profile test suite
│
├── community/               # Community Content & Engagement Domain
│   ├── models.py            # Blog, Project, Activity, Category, Skill, DSAActivity
│   ├── serializers.py       # Blog, Project, Activity serializers
│   ├── services.py          # Blog & project management services
│   ├── selectors.py         # Search, category, and skill query selectors
│   ├── api_views.py         # Community API views
│   ├── api_urls.py          # /api/community/ routes
│   └── tests/               # Community test suite
│
├── feed/                    # Social Graph & Interactive Timeline Domain
│   ├── models.py            # FeedPost, PostMedia, ProjectLink, PostComment, PostLike, SavedPost
│   ├── serializers.py       # Feed, comment, reaction, and media serializers
│   ├── services.py          # Post creation, reaction toggles, bookmarking
│   ├── selectors.py         # Feed filtering and N+1 optimized querysets
│   ├── api_views.py         # Social feed and comment API views
│   ├── api_urls.py          # /api/feed/ routes
│   └── tests/               # Social feed test suite
│
└── riseapp/                 # Public Landing Page & Growth Domain
    ├── models.py            # Contact, Newsletter, FAQ, Testimonial, SiteConfig
    ├── serializers.py       # Public site serializers
    ├── services.py          # Contact dispatch & subscription services
    ├── api_views.py         # Landing page and contact API views
    ├── api_urls.py          # /api/ routes for public content
    └── tests/               # Public site test suite
```

---

## 2. Layering & Dependency Flow

To maintain loose coupling and testability, each domain adheres to a strict internal dependency flow:

```
   [ HTTP Request ]
          │
          ▼
     [ API Views ] ─── Validates permissions and HTTP parameters
          │
          ├────────────────────────┐
          ▼                        ▼
    [ Serializers ]          [ Services / Selectors ]
   (Data Transformation    (Business Rules, Scoring,
     & Input Validation)      Optimized Querysets)
          │                        │
          └────────────────────────┤
                                   ▼
                              [ Models ]
                           (Database Records)
```

### Dependency Rules
- **Views** call **Services** for state mutations and **Selectors** for data retrieval.
- **Serializers** handle serialization/deserialization and validation.
- **Models** define data schema and core field validations, avoiding direct imports of views or serializers.
- **Cross-Domain Calls** pass through public service or selector interfaces rather than directly mutating foreign domain models.

---

## 3. Query Optimization & Performance

To prevent N+1 queries across the social graph and community content:
- **`select_related`** is applied to mandatory foreign keys (e.g. `author`, `author__profile`, `category`, `leader`).
- **`prefetch_related`** is applied to multi-value relations (e.g. `media_files`, `post_comments`, `post_likes`, `skills`, `members`).
- Standardized pagination (`PageNumberPagination`, default 12 items/page) bounds payload sizes across all list endpoints.
