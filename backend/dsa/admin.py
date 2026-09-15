# backend/dsa/admin.py

from django.contrib import admin
from .models import Leaderboard, CodingProblemPost


@admin.register(Leaderboard)
class LeaderboardAdmin(admin.ModelAdmin):
    list_display = (
        "user",
        "total_points",
        "daily_points",
        "weekly_points",
        "monthly_points",
        "consecutive_post_days",
        "last_post_date",
    )
    search_fields = ("user__username", "user__email")
    ordering = ("-total_points",)


@admin.register(CodingProblemPost)
class CodingProblemPostAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "author",
        "difficulty",
        "language",
        "time_complexity",
        "points_earned",
        "created_at",
    )
    list_filter = ("difficulty", "language", "time_complexity", "created_at")
    search_fields = ("title", "author__username", "code_snippet")
    ordering = ("-created_at",)
