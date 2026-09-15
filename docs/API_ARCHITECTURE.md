# API Architecture

This document specifies the RESTful conventions, status codes, error normalization, and routing architecture for the RiseTogether API.

---

## 1. REST Conventions

- **Base URL**: `/api/`
- **Format**: All payloads and responses are encoded in standard UTF-8 JSON.
- **HTTP Methods**:
  - `GET`: Safe retrieval of records or collections.
  - `POST`: Creation of resources or state transitions (e.g. login, like toggle).
  - `PUT`: Complete update of an existing resource.
  - `PATCH`: Partial update of specific fields on a resource.
  - `DELETE`: Removal of a resource.

---

## 2. Standardized Pagination

All list endpoints implement `PageNumberPagination` returning a structured payload:

```json
{
  "count": 48,
  "next": "http://127.0.0.1:8000/api/feed/posts/?page=2",
  "previous": null,
  "results": [
    {
      "id": 1,
      "post_type": "normal",
      "author": { ... },
      "created_at": "2026-09-15T06:00:00Z"
    }
  ]
}
```

---

## 3. Error Handling & Normalization

All DRF API exceptions are caught and normalized by `config.exceptions.custom_exception_handler` into a unified schema:

```json
{
  "status_code": 400,
  "error": "Validation Error",
  "message": "Invalid credentials provided.",
  "errors": {
    "email": ["Enter a valid email address."],
    "password": ["This field may not be blank."]
  }
}
```

### Standard HTTP Status Codes

| Code | Meaning | When Used |
|---|---|---|
| `200 OK` | Success | Successful GET, PUT, PATCH, or non-creation POST. |
| `201 Created` | Resource Created | Successful POST creation (new post, comment, user). |
| `204 No Content` | Deleted | Successful DELETE operation. |
| `400 Bad Request` | Validation Failure | Invalid request payload or missing required fields. |
| `401 Unauthorized` | Unauthenticated | Anonymous request on a protected endpoint. |
| `403 Forbidden` | Permission Denied | Authenticated user lacks permission for the object. |
| `404 Not Found` | Resource Missing | Object or endpoint does not exist. |
| `500 Server Error` | Unhandled Error | Unexpected backend server error. |

---

## 4. API Domain Routing Index

```
/api/
├── auth/
│   ├── csrf/                  GET     Retrieve CSRF cookie token
│   ├── register/              POST    Register new user account
│   ├── login/                 POST    Authenticate user session
│   ├── logout/                POST    Terminate user session
│   ├── me/                    GET     Get current user profile & auth state
│   └── password-reset/        POST    Initiate password reset email
│
├── accounts/
│   ├── profile/edit/          PUT     Update bio, avatar, and social links
│   ├── users/<username>/      GET     Retrieve public profile and stats
│   ├── preferences/           PUT     Update notification preferences
│   └── leaderboard/           GET     Get activity score rankings
│
├── community/
│   ├── blogs/                 GET     List published blogs with category filter
│   ├── blogs/<slug>/          GET     Retrieve blog details
│   ├── projects/              GET     List showcase projects
│   ├── activities/            GET     List community events and activities
│   ├── categories/            GET     List project & blog categories
│   └── skills/                GET     List technical skill tags
│
├── feed/
│   ├── posts/                 GET/POST List timeline posts / create post
│   ├── posts/<id>/            GET/DEL Retrieve post / delete post
│   ├── posts/<id>/like/       POST    Toggle like on post
│   ├── posts/<id>/save/       POST    Toggle bookmark on post
│   ├── posts/<id>/comments/   GET/POST List threaded comments / add comment
│   ├── comments/<id>/         DELETE  Delete comment
│   ├── comments/<id>/like/    POST    Toggle like on comment
│   └── saved/                 GET     List bookmarked posts for current user
│
├── dsa/
│   ├── leaderboard/           GET     Get top-3 podium and overall/daily/weekly/monthly rankings
│   ├── user-stats/            GET     Get authenticated user's daily/weekly/monthly ranks and streaks
│   └── coding-posts/          GET/POST List coding problem solutions / submit problem (max 3/day)
│       └── <id>/              GET/PUT/DEL Retrieve, update, or delete coding problem post
│
└── (public)/
    ├── contact/               POST    Submit contact inquiry
    ├── newsletter/subscribe/  POST    Subscribe email to newsletter
    └── site-content/          GET     Retrieve landing page stats, FAQs, testimonials
```
