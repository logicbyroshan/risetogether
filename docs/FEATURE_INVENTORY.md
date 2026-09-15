# Feature Inventory

Status vocabulary: `Audit complete` means the current behavior is documented; no target implementation has been started.

## Public Site

| Feature | Current route/view/template | Models/forms | Target boundary | Status |
|---|---|---|---|---|
| Homepage and public sections | `GET /` -> `riseapp.views.home` -> `templates/home.html` extending `templates/base.html` | `SiteConfig`, `Mission`, `Achievement`, `FAQ`, `Testimonial` are present in the domain but the current view supplies no context; static/content sections are template-defined | React route `/`; public site API only where editable database content is actually consumed | Audit complete |
| Contact submission | `POST /` -> `riseapp.views.home` -> homepage contact form | `Contact`; inline POST validation; Django messages; redirect to `/#contact` | `POST /api/contact/`; React contact form and success/error toast | Audit complete |
| Newsletter subscription | `POST /newsletter/subscribe/` -> `riseapp.views.newsletter_subscribe` | `Newsletter` with unique email; `IntegrityError` becomes already-subscribed message | `POST /api/newsletter/subscribe/`; React subscription form | Audit complete |

## Community

| Feature | Current route/view/template | Models/forms | Target boundary | Status |
|---|---|---|---|---|
| Published blog listing | `GET /community/blogs/` -> `community.views.blogs_list` -> `templates/Pages/blogs.html` | `Blog`, author, thumbnail, status, dates | `GET /api/community/blogs/`; React `/community/blogs` with loading/empty/error states | Audit complete |
| Blog detail | `GET /community/blogs/<slug>/` -> `blog_detail` -> `templates/Pages/blog-detail.html` | Published `Blog` selected by slug | `GET /api/community/blogs/{slug}/`; React `/community/blogs/:slug` | Audit complete |
| Projects listing | `GET /community/projects/` -> `projects_list` -> `templates/Pages/projects.html` | `Project`, `ProjectCategory`, `Skill`, images, leader/members | `GET /api/community/projects/`; React `/community/projects` | Audit complete |
| Activities listing | `GET /community/activities/` -> `activities_list` -> `templates/Pages/activities.html` | `Activity`, `ActivityImage`, dates and occurrence | `GET /api/community/activities/`; React `/community/activities` | Audit complete |
| Resources page | `GET /community/resources/` -> `resources_list` -> `templates/Pages/resources.html` | Current view supplies only title; no dedicated resource model found | React `/community/resources`; API only if later audit finds data behavior | Audit complete |
| Admin-managed community content | `/admin/` | Blog, project, activities, skills, categories, images, leaderboard, DSA models registered/inspected through app admin files | Preserve Django Admin independently from React | Audit complete |

## Accounts

| Feature | Current route/view/template | Models/forms | Target boundary | Status |
|---|---|---|---|---|
| Registration | `GET/POST /accounts/join/` -> `join_view` -> `templates/accounts/join.html` | Custom `User`; creates `Profile` and `VisitorPreference` through signals; inline password/email checks | `POST /api/auth/register/`; React `/join` | Audit complete |
| Login | `GET/POST /accounts/login/` -> `login_view` -> `templates/accounts/login.html` | Django session auth with email as `USERNAME_FIELD`; inline error message | `POST /api/auth/login/`; session-compatible React auth state; React `/login` | Audit complete |
| Logout | `GET /accounts/logout/` -> `logout_view` | Django session logout and message | `POST /api/auth/logout/` or documented session-safe equivalent; React auth state reset | Audit complete |
| Own/other profile | `GET /accounts/profile/` or `/accounts/profile/<username>/` -> `profile_view` -> `templates/accounts/profile.html` plus sidebar include | `User`, `Profile`, `ProfileLink`, feed posts, blogs, projects, leaderboard rank | `GET /api/accounts/me/`, `GET /api/accounts/users/{username}/`; React `/profile` and `/profile/:username` | Audit complete |
| Profile edit | `GET/POST /accounts/profile/edit/` -> `edit_profile_view` -> `templates/accounts/edit_profile.html` | `UserUpdateForm`, `ProfileUpdateForm`, `ProfileLinkFormSet`; profile image upload | `PATCH /api/accounts/me/`; multipart links/profile upload handling; React edit profile page | Audit complete |
| Settings | `GET /accounts/settings/` -> local `settings_view` -> `templates/accounts/settings.html` | `VisitorPreference` exists; current view only renders | `GET/PATCH /api/accounts/preferences/`; React `/settings` after confirming actual controls | Audit complete |
| Password reset | `/accounts/password-reset/`, `/done/`, `/confirm/<uidb64>/<token>/`, `/complete/` | Django auth views, console email backend, registration templates | REST password-reset request/confirm flow or compatibility page documented; preserve token security | Audit complete |

## Feed

There are two feed implementations. The `new` routes are default; `old` routes remain registered for backward compatibility.

| Feature | Current route/view/template | Models/forms | Target boundary | Status |
|---|---|---|---|---|
| Main feed | `GET /feed/` -> `feed_list_new` -> `templates/feed/feed_list_new.html` | `FeedPost`, `PostMedia`, new reactions/comments/saves, hashtags | `GET /api/feed/posts/`; React `/feed` | Audit complete |
| Legacy feed | `GET /feed/old/` -> `feed_list` -> `templates/feed/feed_list.html` | Legacy `Post`, `Comment`, `PostLike`, `SavedPost`, hashtag/mention models | Compatibility API/resource documented before removal | Audit complete |
| Create normal post | `/feed/create/normal/` -> `create_normal_post` -> `templates/feed/create_normal_post.html` | `NormalPostForm`, `FeedPost`, media | `POST /api/feed/posts/` with post type `normal` | Audit complete |
| Create blog post | `/feed/create/blog/` -> `create_blog_post` -> `templates/feed/create_blog_post.html` | `BlogPostForm`, TinyMCE HTML, thumbnail | `POST /api/feed/posts/` with blog fields and upload validation | Audit complete |
| Create project post | `/feed/create/project/` -> `create_project_post` -> `templates/feed/create_project_post.html` | `ProjectPostForm`, up to three `ProjectLink` records | `POST /api/feed/posts/` with nested/related links | Audit complete |
| Generic/legacy post create | `/feed/create/` and `/feed/old/post/create/` | `PostForm` and legacy model; content/media/blog type validation | Separate API serializer paths only after model behavior is reconciled | Audit complete |
| Post detail | `/feed/post/<id>/` and legacy detail view | New or legacy post models, comments/replies, view count, likes/saves | `GET /api/feed/posts/{id}/`; React `/feed/posts/:id` | Audit complete |
| Post interactions | Like, save, comment, comment-like, delete routes under `/feed/post/` and `/feed/comment/` | New and legacy reaction/comment models; login required; delete ownership rules in views | Resource/action endpoints with backend permissions and normalized responses | Audit complete |
| Legacy user posts/saved posts | `/feed/old/user/<username>/posts/`, `/feed/old/saved/` | Legacy post/saved models | Compatibility endpoints only if user-facing links still require them | Audit complete |

## Cross-Cutting Behavior

- Authentication: Django sessions, CSRF middleware, `login_required`; no DRF or token/JWT layer exists.
- Authorization: mostly view decorators and ownership checks; explicit role-based enforcement is not broadly present in the inspected views.
- Media: Django `MEDIA_ROOT`/`MEDIA_URL`; Pillow image fields; profile, blog, activity, project, post, and feed media uploads.
- Rich text: TinyMCE package and `tinymce/` URL; blog/content fields use `HTMLField`.
- Search/filter/pagination: hashtag filtering exists in the legacy feed; `Paginator` is imported in community views but current list views do not paginate. No complete site-wide search API was found.
- Notifications/email: Django messages for browser feedback; console email backend for password reset; no background worker or Celery configuration found.
- Scheduled jobs: `accounts/management/commands/update_activity_scores.py` recalculates activity scores; no external scheduler configuration found.
- Admin: separate Django Admin must remain server-rendered and operational.
