# Product Features Map

This document outlines the complete feature inventory implemented across the RiseTogether platform.

---

## 1. Feature Map

```
USER
│
├── Authentication
│   ├── User Registration (/join)
│   ├── User Login (/login)
│   ├── Password Reset Request (/password-reset)
│   ├── Password Reset Confirmation (/password-reset-confirm)
│   └── User Logout
│
├── Home & Discovery
│   ├── Hero Section with Dynamic Live Counters
│   ├── Mission Pillars & Value Proposition
│   ├── Featured Projects Showcase
│   ├── Latest Published Blogs
│   ├── Upcoming Community Activities
│   ├── Verified Testimonials Grid
│   ├── Accordion Frequently Asked Questions (FAQs)
│   └── Interactive Contact Form & Newsletter Subscription
│
├── Social Feed (/feed)
│   ├── Unified Post Timeline
│   ├── Latest vs Trending Tab Switcher
│   ├── Filter by Post Type (All, Normal, Blog, Project)
│   ├── Real-Time Keyword Search
│   ├── Create Post Modal (Drag-and-Drop Media, Link Inputs)
│   ├── Post Likes & Dynamic Count Increment
│   ├── Threaded Comments & Replies
│   ├── Bookmark / Save Post to Library
│   └── Saved Posts Collection View (/feed/saved)
│
├── Community Hub
│   ├── Published Blogs Directory (/community/blogs)
│   ├── Blog Detail View (/community/blogs/:slug)
│   ├── Project Showcase Showcase (/community/projects)
│   ├── Community Activities Calendar (/community/activities)
│   └── Learning Resources Catalog (/community/resources)
│
├── User Profile & Settings
│   ├── Public Profile Header with Avatar & Badges (/profile/:username)
│   ├── Gamified Activity Score Tracker
│   ├── User Activity Tabs (Feed Posts, Blogs, Projects)
│   ├── Edit Profile Modal (Avatar Upload, Bio, Social Portfolio Links)
│   ├── Notification Preferences (/settings)
│   └── Security & Password Change (/settings)
│
└── Administrative & Backend Control
    ├── Django Admin Dashboard (/admin/)
    └── REST API Reference (/api/)
```

---

## 2. Feature Details

### Social Feed
- Supports rich multi-media attachments (multiple images and videos).
- Embeds project live links and repository shortcuts directly in post cards.
- Provides instant optimistic UI updates on like and bookmark toggles.

### Gamification & Leaderboard
- Computes activity points for published code projects, articles, solutions, and community engagement.
- Ranks top contributors on the community leaderboard.

### Community Hub
- Public articles rendered safely with rich HTML formatting (`RichTextViewer`).
- Showcase projects with category filtering and team member recognition.
