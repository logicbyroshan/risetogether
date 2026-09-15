from django.contrib.auth import get_user_model
from django.db.models import QuerySet
from typing import Optional

User = get_user_model()


def get_user_by_username(username: str) -> Optional[User]:
    """
    Retrieve user with related profile and links.
    """
    return (
        User.objects.filter(username__iexact=username)
        .select_related("profile", "preferences")
        .prefetch_related("profile__links")
        .first()
    )


def get_user_by_email(email: str) -> Optional[User]:
    """
    Retrieve user by email address.
    """
    return (
        User.objects.filter(email__iexact=email)
        .select_related("profile", "preferences")
        .first()
    )


def get_leaderboard_users(limit: int = 10) -> QuerySet:
    """
    Retrieve top users ordered by activity score.
    """
    return (
        User.objects.filter(is_active=True)
        .select_related("profile")
        .order_by("-profile__activity_score")[:limit]
    )
