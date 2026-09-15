# RiseTogether REST API Reference

All REST API endpoints are hosted under the `/api/` namespace.

---

## 1. Authentication & Session (`/api/auth/`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/auth/csrf/` | Retrieve and set CSRF cookie for SPA requests | No |
| `GET` | `/api/auth/me/` | Get current authenticated user session | No |
| `POST` | `/api/auth/login/` | Log in user with email & password | No |
| `POST` | `/api/auth/register/` | Register new user account & establish session | No |
| `POST` | `/api/auth/logout/` | Log out current user & destroy session | No |
| `POST` | `/api/auth/password-reset/` | Request password reset email | No |
| `POST` | `/api/auth/password-reset/confirm/` | Confirm password reset with `uid` and `token` | No |

---

## 2. Accounts & Profiles (`/api/accounts/`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/accounts/me/` | Get authenticated user's profile and stats | Yes |
| `GET` | `/api/accounts/users/{username}/` | Get public profile by username | No |
| `PATCH` | `/api/accounts/profile/edit/` | Update bio, names, profile picture, social links | Yes |
| `GET` | `/api/accounts/preferences/` | Get user visitor/notification preferences | Yes |
| `PATCH` | `/api/accounts/preferences/` | Update user notification preferences | Yes |
| `GET` | `/api/accounts/leaderboard/` | Get ranked users by period (`daily`, `weekly`, `monthly`, `all_time`) | No |

---

## 3. Community Features (`/api/community/`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/community/blogs/` | List published blogs with search & author filter | No |
| `GET` | `/api/community/blogs/{slug}/` | Get blog post details | No |
| `GET` | `/api/community/projects/` | List showcase projects with category/member filtering | No |
| `GET` | `/api/community/projects/{id}/` | Get project detail | No |
| `GET` | `/api/community/categories/` | List project categories | No |
| `GET` | `/api/community/skills/` | List skill tags | No |
| `GET` | `/api/community/activities/` | List community events & sprints | No |
| `GET` | `/api/community/activities/{id}/` | Get activity detail | No |
| `GET` | `/api/community/dsa/` | List DSA problem solving activities | No |

---

## 4. Social Feed (`/api/feed/`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `GET` | `/api/feed/posts/` | List feed posts (filters: `all`, `trending`, `post_type`, `author`, `search`) | No |
| `POST` | `/api/feed/posts/` | Create new post (`normal`, `blog`, `project` with media & links) | Yes |
| `GET` | `/api/feed/posts/{id}/` | Get post detail & increment view counter | No |
| `PATCH` | `/api/feed/posts/{id}/` | Update post content (owner only) | Yes (Owner) |
| `DELETE` | `/api/feed/posts/{id}/` | Delete post (owner only) | Yes (Owner) |
| `POST` | `/api/feed/posts/{id}/like/` | Toggle like on post | Yes |
| `POST` | `/api/feed/posts/{id}/save/` | Toggle save/bookmark on post | Yes |
| `GET` | `/api/feed/posts/{id}/comments/` | List post comments and nested replies | No |
| `POST` | `/api/feed/posts/{id}/comments/` | Post a comment or reply (`parent_id`) | Yes |
| `POST` | `/api/feed/comments/{id}/like/` | Toggle like on comment | Yes |
| `DELETE` | `/api/feed/comments/{id}/` | Delete comment (author or post owner) | Yes |
| `GET` | `/api/feed/saved/` | List saved/bookmarked posts for current user | Yes |

---

## 5. Public Site Content (`/api/`)

| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/contact/` | Submit contact message | No |
| `POST` | `/api/newsletter/subscribe/` | Subscribe email to newsletter | No |
| `GET` | `/api/site-content/` | Aggregated site config, FAQs, testimonials, live metrics | No |

---

## 6. Django Admin

- Accessible server-rendered at `/admin/`.
