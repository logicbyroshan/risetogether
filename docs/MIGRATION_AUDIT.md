# RiseTogether Migration Audit

Date: 2026-09-15
Repository: `logicbyroshan/risetogether`
Baseline commit: `28739d3`
Audit scope: tracked repository files and application-owned runtime configuration. No application code was changed during this audit.

## 1. Current Architecture

RiseTogether is a Django 5.2.5 monolith using server-rendered Django templates, Django ORM, SQLite for the checked-out development database, Django session authentication, TinyMCE, Pillow, WhiteNoise-related production guidance, and TailwindCSS loaded from the CDN in templates. There is no Django REST Framework installation, no existing API namespace, no React/Vite project, and no frontend package manifest.

The current request flow is:

```text
Browser -> Django URLConf -> function-based Django view -> form/model operations -> Django template -> HTML/CSS/JavaScript
                                              \-> JsonResponse for selected legacy feed interactions
```

The desired migration flow is documented but not implemented:

```text
React/TypeScript/Vite -> DRF API -> Django permissions/services/serializers -> existing ORM/models -> existing database
Django Admin -> Django ORM/models -> existing database
```

## 2. Repository and Django Apps

- `config/`: settings, root URL configuration, ASGI, WSGI.
- `riseapp/`: public homepage, contact/newsletter actions, site-content models.
- `accounts/`: custom user, profile, visitor preferences, auth/profile views, forms, signals, score management command.
- `community/`: blogs, projects, activities, DSA activity, leaderboard, community content views.
- `feed/`: two generations of social feed models, forms, views, templates, and interaction endpoints.
- `templates/`: shared layout and all server-rendered pages.
- `static/`: CSS, JavaScript, and images.
- `docs/`, root Markdown files, `.github/`: project documentation and contribution/deployment guidance.

The local checkout also contains generated Python/runtime artifacts not treated as migration source. The tracked source inventory is the authority.

## 3. Configuration and Dependencies

`requirements.txt` pins Django, Pillow, django-tinymce, python-dotenv, psycopg2-binary, django-cors-headers, whitenoise, django-debug-toolbar, and coverage. `config/settings.py` currently installs Django auth/admin/session/static apps plus `tinymce`, `riseapp`, `accounts`, `community`, and `feed`.

Important current settings:

- `AUTH_USER_MODEL = accounts.User`.
- `LOGIN_URL = accounts:login`; successful login redirects to `accounts:profile`.
- SQLite database at `BASE_DIR / db.sqlite3`.
- `STATIC_URL = /static/`, `STATIC_ROOT = staticfiles`, `STATICFILES_DIRS = [static]`.
- `MEDIA_URL = /media/`, `MEDIA_ROOT = media`.
- Console email backend.
- `DEBUG = True`, empty `ALLOWED_HOSTS`, and a committed development secret key are not production-safe.

Deployment documentation describes PostgreSQL, WhiteNoise, SMTP, SSL/cookie settings, and multiple hosting options, but the runtime settings do not yet fully implement that deployment configuration. There is no Dockerfile, Procfile, package.json, Vite config, Tailwind config, or frontend build configuration in the repository.

## 4. Root URL Inventory

| Method/URL | Current handler | Template/response | Migration mapping |
|---|---|---|---|
| `GET /` | `riseapp.views.home` | `templates/home.html` -> `base.html` | React `/`; public content API only where needed |
| `POST /` | `riseapp.views.home` | Django messages, redirect to `/#contact` | `POST /api/contact/` |
| `POST /newsletter/subscribe/` | `riseapp.views.newsletter_subscribe` | Django message, referrer/home redirect | `POST /api/newsletter/subscribe/` |
| `/admin/` | Django admin | Server-rendered admin | Preserve unchanged |
| `/tinymce/` | TinyMCE URLs | Editor endpoints/assets | Preserve or replace only after rich-text verification |
| `/accounts/...` | `accounts.urls` | Account templates | React routes plus `/api/auth/` and `/api/accounts/` |
| `/community/...` | `community.urls` | Community templates | React routes plus `/api/community/` |
| `/feed/...` | `feed.urls` | Feed templates/JSON interactions | React routes plus `/api/feed/` |

Complete feature-level mappings are in `docs/FEATURE_INVENTORY.md`.

## 5. Models and Relationships

### `accounts`

- `User`: custom `AbstractUser`, unique email login, role choices (`community_lead`, `deputy_lead`, `co_lead`, `member`, `visitor`), groups and permissions with custom reverse names.
- `Profile`: one-to-one with `User`, profile image, bio, counters, activity score; calculates points from projects, published blogs, posts, likes, and comments.
- `ProfileLink`: links belonging to a profile.
- `VisitorPreference`: one-to-one user preferences, currently `notifications_enabled`.
- Signals create/save `Profile` and `VisitorPreference` when users change.

### `riseapp`

- `Contact`: public contact submissions.
- `Newsletter`: unique subscriber emails.
- `FAQ`, `Testimonial`, `SiteConfig`, `Mission`, `Achievement`: site content and uploaded achievement icons. `Mission` belongs to `SiteConfig`; `Testimonial` can reference a user.

### `community`

- `DSAActivity` and `Leaderboard`: user activity/points and period rankings.
- `Blog`: slugged rich-text content, author, publication status, thumbnail.
- `Skill`: icon or uploaded image.
- `Activity` and `ActivityImage`: event/activity content and gallery.
- `ProjectCategory`, `Project`, `ProjectImage`: projects with category, skills, leader, many-to-many members, links, details, and gallery.
- Legacy community `Post`, `Like`, and `Comment`: separate social models from the feed app.

### `feed`

- Legacy `Post`, `Comment`, `PostLike`, `CommentLike`, `SavedPost`, `HashTag`, `Mention`.
- Newer `FeedPost`, `PostMedia`, `ProjectLink`, `PostComment`, `PostLikeNew`, `CommentLikeNew`, `SavedPostNew`.
- The coexistence of old/new models is a major migration risk. API contracts must be based on verified active views and database records, not names alone.

## 6. Views, Forms, and Business Rules

### Views

- `riseapp.views`: homepage contact validation and newsletter uniqueness handling.
- `accounts.views`: registration, email/password login, logout, profile aggregation, settings rendering, profile edit with user/profile/link formset.
- `community.views`: published blog list/detail, project list, activity list, resources page.
- `feed.views`: legacy and new feed listing, post detail, post creation variants, comments/replies, likes, saves, deletion/editing, user posts, saved posts.

Most views are function-based. Authenticated feed/profile views use `login_required`; several mutating feed views use `require_POST`. The current code uses Django messages and redirects for form workflows, with selected legacy interaction actions returning JSON.

### Forms

- Account: `UserUpdateForm`, `ProfileUpdateForm`, `ProfileLinkFormSet`.
- Feed: `PostForm`, `CommentForm`, `ReplyForm`, `BlogPostForm`, `ProjectPostForm`, `NormalPostForm`, `PostCommentForm`.
- Important validation includes post-type-specific content/media requirements, nonempty comments/replies, blog title/content, user-owned blog selection, profile link URL validation, and multipart image/video fields.

### Business rules to preserve

- Registration rejects duplicate email and mismatched passwords, creates a generated username, logs the user in, and signals create related records.
- Login authenticates with email and Django session auth.
- Profile aggregation includes posts, blogs, projects, leaderboard users, and computed rank.
- Activity score awards points for projects, published blogs, post media type, likes, and comments.
- Feed hashtags and mentions are parsed from post content; likes/saves toggle; post/comment deletion has ownership behavior in views.
- Blog listing/detail expose published content only.

## 7. Templates, UI, JavaScript, and Static Assets

`templates/base.html` provides the shared navbar, mobile menu, Django messages, footer, Tailwind CDN, Font Awesome CDN, Google Fonts (Rajdhani and Inter), and `static/css/base.css`. Page templates extend it or provide account/feed-specific layouts. Template folders include public pages, account pages, feed pages, password reset pages, and old/new variants.

The UI direction is dark, orange-accented, glassmorphism-oriented, responsive, and uses Tailwind utility classes plus five tracked CSS files: `base.css`, `home.css`, `auth.css`, `profile.css`, and `edit_profile.css`. Static images include the logo and team/profile imagery.

`static/js/auth.js` contains password visibility toggles, focus effects, password-strength indicators, password-match feedback, and placeholder logging for Google/password-reset actions. Template inline behavior also includes mobile navigation, animated counters/scroll effects, and feed interaction behavior; every template script and inline event must be rechecked during migration.

There is a case-insensitive checkout collision between tracked `templates/Home.html` and `templates/home.html`; Windows currently has only `templates/home.html`. This must be resolved before reliable cross-platform migration/build work.

## 8. Authentication, Authorization, and Roles

- Django session authentication and CSRF middleware are active.
- Custom `User.USERNAME_FIELD` is email, while createsuperuser still requires username.
- Password reset uses Django auth class-based views and console email in development.
- `login_required` protects profiles, editing, and feed operations.
- Ownership checks and role data exist, but broad role-based permission enforcement is not consistently visible in the current function views.
- Django Admin permissions remain separate and must not be replaced by frontend checks.

The first API phase must verify session versus token requirements; the brief does not justify introducing JWT automatically.

## 9. CRUD, Search, Filtering, Pagination, Uploads

- CRUD-like behavior exists for profiles/links, feed posts/comments/reactions, and admin-managed content.
- Public community list views are read-only in the current UI.
- Legacy feed supports hashtag query filtering and saved/user post views.
- `Paginator` is imported in community views, but active list views do not currently paginate. No complete global search implementation was found.
- Uploads include profile pictures, blog thumbnails, activity/project images, post images/videos/files, skill icons, and achievement icons. Pillow is installed; server-side validation and media URLs must be preserved.
- TinyMCE-backed HTML fields require careful sanitization and serializer representation.

## 10. Emails, Notifications, Jobs, and Integrations

- Browser feedback uses Django messages.
- Password-reset email uses the console backend in development; deployment docs describe SMTP.
- No Celery, RQ, scheduler, webhook, or external API integration was found in the tracked application code.
- `update_activity_scores` is a manual Django management command.
- Templates depend on external CDNs for Tailwind, Font Awesome, Google Fonts, and Unsplash images. This is a frontend availability and CSP/deployment consideration.

## 11. Existing APIs

There is no DRF API. Existing API-like behavior consists of JSON responses from selected legacy feed POST actions such as toggling post/comment likes and saves. These endpoints still use Django session authentication and CSRF rather than a documented API contract.

## 12. Tests and Baseline

The four app test modules exist but contain no test cases. `manage.py check` passed and `manage.py test` ran zero tests successfully. Full details are in `docs/BASELINE_TEST_RESULTS.md`. Migration work must add real backend, frontend, and end-to-end coverage before removing legacy paths.

## 13. Target Architecture Mapping

| Current surface | Target React surface | Target backend surface | Notes |
|---|---|---|---|
| Django `base.html` and page templates | `AppLayout`, navbar, footer, route pages, shared message/toast components | Session/current-user API | Preserve visual structure and breakpoints |
| Function views and Django forms | Typed pages/forms and domain components | DRF serializers, API views, permissions, services | Django remains authoritative for validation |
| Django messages and redirects | Query/mutation state, toast/error/empty components, React Router navigation | Consistent JSON errors and status codes | Preserve user-visible outcomes |
| `request.FILES` and Image/FileFields | Multipart upload controls | DRF multipart serializers and media validation | Keep `MEDIA_URL` and storage semantics |
| TinyMCE HTML fields | React rich-text editor only after editor choice is verified | Explicit HTML serializer validation/sanitization | Do not weaken content safety |
| `/admin/` | No React replacement | Existing Django Admin | Must remain independent and working |

## 14. Migration Risks and Required Decisions

1. Resolve the `Home.html`/`home.html` collision without losing the intended template.
2. Reconcile duplicate legacy/new feed models before defining API resources.
3. Determine which homepage counters/content are database-driven versus hard-coded; current `home` view passes no context.
4. Preserve session/CSRF authentication unless an evidence-based requirement supports another mechanism.
5. Define permissions for user-owned profile/feed mutations from the existing view behavior.
6. Establish upload size/type/security rules currently implicit in model/forms/server configuration.
7. Decide how public SEO metadata and server-rendered public pages will be handled after SPA migration.
8. Replace CDN/runtime assumptions only when parity and deployment requirements are documented.
9. Add baseline behavior tests before any destructive cleanup.
10. Verify production settings separately from local SQLite settings.

## 15. Audit Completion

Audit phase complete on 2026-09-15. Required governance and baseline documents were created. No React, DRF, model, template, static asset, migration, or database changes were made. The next phase should be a reviewed implementation plan followed by DRF infrastructure, not a blind full rewrite.
