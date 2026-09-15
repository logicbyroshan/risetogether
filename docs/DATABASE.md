# Database Architecture & Migrations

This document outlines the database configuration, migration policies, indexing, and connection management for RiseTogether.

---

## 1. Database Configuration

- **Development Engine**: `django.db.backends.sqlite3` (`backend/db.sqlite3`).
- **Production Target**: PostgreSQL (`django.db.backends.postgresql`).
- **Custom User Model**: `AUTH_USER_MODEL = "accounts.User"`.

---

## 2. Table Indexing & Performance

Critical query paths in the social feed and community models feature explicit database indexes:

```python
# feed/models.py
class Meta:
    indexes = [
        models.Index(fields=["-created_at"]),
        models.Index(fields=["author", "-created_at"]),
        models.Index(fields=["post_type"]),
    ]
```

### Key Performance Strategies
1. **Timestamp Indexing**: Allows fast descending ordering on timeline and activity feeds without full table scans.
2. **Author Composite Indexes**: Accelerates user profile post and contribution queries.
3. **Foreign Key Lookups**: All relational lookups utilize `select_related` for OneToOne/ForeignKey fields and `prefetch_related` for ManyToMany/Reverse relations.

---

## 3. Migration Safety Rules

1. **Never Reset Migrations**: Never delete migration history or run destructive schema resets.
2. **Non-Null Field Additions**: Always provide defaults or allow `null=True` / `blank=True` when introducing new model fields.
3. **Safe Column Alterations**: All schema changes must be applied through generated Django migrations (`python backend/manage.py makemigrations`).
