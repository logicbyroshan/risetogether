# backend/dsa/selectors.py

from django.db.models import QuerySet
from .models import Leaderboard, CodingProblemPost


def get_leaderboard_queryset(timeframe: str = "overall") -> QuerySet[Leaderboard]:
    """
    Returns an N+1 optimized Leaderboard queryset ordered by timeframe.
    """
    order_map = {
        "daily": ("-daily_points", "-total_points"),
        "weekly": ("-weekly_points", "-total_points"),
        "monthly": ("-monthly_points", "-total_points"),
        "overall": ("-total_points", "-daily_points"),
    }
    ordering = order_map.get(timeframe.lower(), ("-total_points", "-daily_points"))
    return (
        Leaderboard.objects.select_related("user", "user__profile")
        .order_by(*ordering)
    )


def get_coding_posts_for_user(user) -> QuerySet[CodingProblemPost]:
    """
    Returns an N+1 optimized coding posts queryset for a specific user.
    """
    return (
        CodingProblemPost.objects.filter(author=user)
        .select_related("author", "author__profile")
        .order_by("-created_at")
    )


def get_all_coding_posts() -> QuerySet[CodingProblemPost]:
    """
    Returns all coding problem posts optimized with author and profile.
    """
    return (
        CodingProblemPost.objects.select_related("author", "author__profile")
        .order_by("-created_at")
    )
