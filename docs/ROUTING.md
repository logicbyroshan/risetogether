# Application Routing

This document defines the client-side routes in React Router and their corresponding backend Django REST Framework endpoints.

---

## 1. Frontend Client Routes

| Route | Component | Access | Description |
|---|---|---|---|
| `/` | `HomePage` | Public | Landing page with hero, stats, features, and contact form. |
| `/login` | `LoginPage` | Public / Guest | User authentication form with email and password. |
| `/join` | `JoinPage` | Public / Guest | New account registration form. |
| `/password-reset` | `PasswordResetPage` | Public | Password recovery request. |
| `/password-reset-confirm` | `PasswordResetConfirmPage` | Public | Set new password with token. |
| `/feed` | `FeedPage` | Public / Authenticated | Main timeline with filtering and post creation. |
| `/feed/:id` | `PostDetailPage` | Public / Authenticated | Detailed view of a single post and discussion thread. |
| `/feed/saved` | `SavedPostsPage` | Authenticated | List of posts saved/bookmarked by the current user. |
| `/community/blogs` | `BlogsPage` | Public | Directory of published community articles. |
| `/community/blogs/:slug` | `BlogDetailPage` | Public | Full article view with author metadata. |
| `/community/projects` | `ProjectsPage` | Public | Showcase gallery of community projects. |
| `/community/activities` | `ActivitiesPage` | Public | Calendar of community events and workshops. |
| `/community/resources` | `ResourcesPage` | Public | Curated developer tools and tutorials. |
| `/profile` | `ProfilePage` | Authenticated | Current user's profile view and stats. |
| `/profile/:username` | `ProfilePage` | Public | Public user profile view. |
| `/settings` | `SettingsPage` | Authenticated | Notification preferences and account security. |
| `*` | `NotFoundPage` | Public | 404 fallback page. |

---

## 2. Backend REST API Endpoints

| Category | Method | Path | Description |
|---|---|---|---|
| **Auth** | `GET` | `/api/auth/csrf/` | Retrieve CSRF cookie token. |
| | `POST` | `/api/auth/register/` | Register new account. |
| | `POST` | `/api/auth/login/` | Session login. |
| | `POST` | `/api/auth/logout/` | Session logout. |
| | `GET` | `/api/auth/me/` | Current user profile. |
| **Accounts** | `PUT` | `/api/accounts/profile/edit/` | Update profile bio, avatar, and links. |
| | `GET` | `/api/accounts/users/<username>/` | Retrieve user by username. |
| | `GET` | `/api/accounts/leaderboard/` | Retrieve leaderboard rankings. |
| **Community** | `GET` | `/api/community/blogs/` | List blogs with pagination and search. |
| | `GET` | `/api/community/blogs/<slug>/` | Retrieve blog details by slug. |
| | `GET` | `/api/community/projects/` | List projects with category filter. |
| | `GET` | `/api/community/activities/` | List community activities. |
| **Feed** | `GET` | `/api/feed/posts/` | List timeline posts. |
| | `POST` | `/api/feed/posts/` | Create new post. |
| | `GET` | `/api/feed/posts/<id>/` | Retrieve post details. |
| | `DELETE`| `/api/feed/posts/<id>/` | Delete post (author only). |
| | `POST` | `/api/feed/posts/<id>/like/` | Toggle like on post. |
| | `POST` | `/api/feed/posts/<id>/save/` | Toggle bookmark on post. |
| | `GET` | `/api/feed/posts/<id>/comments/` | List threaded comments. |
| | `POST` | `/api/feed/posts/<id>/comments/` | Post new comment. |
| | `GET` | `/api/feed/saved/` | List bookmarked posts. |
| **Public** | `POST` | `/api/contact/` | Submit contact message. |
| | `POST` | `/api/newsletter/subscribe/` | Subscribe email to newsletter. |
| | `GET` | `/api/site-content/` | Retrieve landing page content. |
