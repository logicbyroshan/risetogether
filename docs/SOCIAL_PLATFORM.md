# Social Platform Architecture

This document describes the social graph, feed mechanics, reaction pipelines, threaded discussions, and discovery features of RiseTogether.

---

## 1. Feed Pipeline & Content Selection

The social feed aggregates updates across multiple post formats into a unified timeline:

```mermaid
graph TD
    A[Incoming Feed Request] --> B{Tab Filter}
    B -->|Latest| C[Order by -created_at]
    B -->|Trending| D[Order by likes_count + comments_count + views_count]
    
    C --> E{Type Filter}
    D --> E
    
    E -->|All| F[Return All Active Posts]
    E -->|Normal / Blog / Project| G[Filter by post_type]
    
    F --> H[Paginate Results (12 items)]
    G --> H
    H --> I[JSON Payload with Author & Media Data]
```

### Feed Selection Rules
1. **Server-Side Authoritative**: The backend determines which posts appear in the feed. The frontend never computes rankings or authoritative sorting independently.
2. **N+1 Prevention**: Feed queries eagerly load authors, profiles, media attachments, and comments in single batch queries using Django's `select_related` and `prefetch_related`.

---

## 2. Interaction & Reaction System

- **Post Likes (`/api/feed/posts/<id>/like/`)**: Atomic toggle endpoint. If the user has already liked the post, the record is removed (`liked: false`); otherwise, a new `PostLikeNew` record is created (`liked: true`).
- **Comment Likes (`/api/feed/comments/<id>/like/`)**: Atomic toggle endpoint for comment-level appreciation.
- **Bookmarks & Saved Posts (`/api/feed/posts/<id>/save/`)**: Toggles saving posts to the user's private bookmark list accessible at `/feed/saved`.

---

## 3. Threaded Discussion Architecture

- Posts support unlimited comment depth via recursive self-referential relations (`parent = ForeignKey('self')`).
- Top-level comments display direct replies indented beneath the parent comment.
- Comment deletion is protected by `IsOwnerOrReadOnly`—only the comment author or an administrator can remove a comment.

---

## 4. Activity Scoring & Gamification

User activity scores in `accounts.Profile` are recalculated dynamically on key community contributions:
- **Project Led or Joined**: +10 points
- **Published Blog Article**: +10 points
- **Media Post (Image/Video)**: +5 points
- **Text Post**: +2 points
- **Each Like Received**: +1 point
- **Each Comment Received**: +2 points
- **DSA Problem Solved**: Points based on problem difficulty
