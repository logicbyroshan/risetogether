# backend/dsa/services.py

from datetime import date, timedelta
from django.utils import timezone
from django.contrib.auth import get_user_model
from .models import Leaderboard, CodingProblemPost

User = get_user_model()


def detect_language(code: str) -> str:
    """
    Auto-detect programming language from code keywords.
    """
    if not code:
        return "PYTHON"
    
    cpp_keywords = ["#include", "std::", "cout", "cin", "int main", "vector<"]
    java_keywords = ["public class", "System.out.println", "import java.", "public static void main"]
    ts_keywords = ["interface ", "type ", ": string", ": number", ": boolean", "as const"]
    js_keywords = ["const ", "let ", "var ", "console.log", "function(", "=>"]
    python_keywords = ["def ", "import ", "print(", "elif ", "self.", "class "]

    if any(kw in code for kw in cpp_keywords):
        return "CPP"
    if any(kw in code for kw in java_keywords):
        return "JAVA"
    if any(kw in code for kw in ts_keywords):
        return "TYPESCRIPT"
    if any(kw in code for kw in js_keywords):
        return "JAVASCRIPT"
    if any(kw in code for kw in python_keywords):
        return "PYTHON"
    
    return "PYTHON"


def calculate_points_for_post(user, post: CodingProblemPost, is_new_post: bool = True) -> int:
    """
    Calculates points for a post's content and awards daily/streak bonuses on new posts.
    """
    points = 0

    # 1. Difficulty Base Points
    if post.difficulty == "EASY":
        points += 2
    elif post.difficulty == "MEDIUM":
        points += 5
    elif post.difficulty == "HARD":
        points += 10

    # 2. Time Complexity Bonus
    complexity_map = {
        "O(1)": 10,
        "O(log n)": 9,
        "O(n)": 5,
        "O(n log n)": 6,
        "O(n^2)": 7,
        "O(n^3)": 3,
        "O(2^n)": 2,
        "O(n!)": 1,
    }
    points += complexity_map.get(post.time_complexity, 5)

    leaderboard, _ = Leaderboard.objects.get_or_create(user=user)

    # 3. Daily Activity & Streak Bonuses (New Posts Only)
    if is_new_post:
        today = timezone.now().date()
        if leaderboard.last_post_date != today:
            points += 2  # Daily activity bonus

            if leaderboard.last_post_date == today - timedelta(days=1):
                leaderboard.consecutive_post_days += 1
            else:
                leaderboard.consecutive_post_days = 1

            leaderboard.last_post_date = today

            streak_bonuses = {7: 5, 15: 10, 30: 20, 60: 30, 90: 50}
            points += streak_bonuses.get(leaderboard.consecutive_post_days, 0)
            leaderboard.save(update_fields=["last_post_date", "consecutive_post_days"])

    # Save calculated points to the post
    post.points_earned = points
    post.save(update_fields=["points_earned"])

    # Update leaderboard totals for new posts
    if is_new_post:
        leaderboard.daily_points += points
        leaderboard.weekly_points += points
        leaderboard.monthly_points += points
        leaderboard.total_points += points
        leaderboard.save(
            update_fields=[
                "daily_points",
                "weekly_points",
                "monthly_points",
                "total_points",
            ]
        )

    return points


def handle_post_update(user, post: CodingProblemPost) -> int:
    """
    Handles point readjustment when a post's content/difficulty/complexity is updated.
    """
    old_points = post.points_earned
    calculate_points_for_post(user, post, is_new_post=False)
    new_points = post.points_earned
    point_difference = new_points - old_points

    leaderboard, _ = Leaderboard.objects.get_or_create(user=user)
    leaderboard.daily_points = max(0, leaderboard.daily_points + point_difference)
    leaderboard.weekly_points = max(0, leaderboard.weekly_points + point_difference)
    leaderboard.monthly_points = max(0, leaderboard.monthly_points + point_difference)
    leaderboard.total_points = max(0, leaderboard.total_points + point_difference)
    leaderboard.save(
        update_fields=[
            "daily_points",
            "weekly_points",
            "monthly_points",
            "total_points",
        ]
    )

    return point_difference


def handle_post_delete(user, post: CodingProblemPost) -> int:
    """
    Subtracts points when a coding problem post is deleted.
    """
    points_to_subtract = post.points_earned
    leaderboard, _ = Leaderboard.objects.get_or_create(user=user)

    leaderboard.daily_points = max(0, leaderboard.daily_points - points_to_subtract)
    leaderboard.weekly_points = max(0, leaderboard.weekly_points - points_to_subtract)
    leaderboard.monthly_points = max(0, leaderboard.monthly_points - points_to_subtract)
    leaderboard.total_points = max(0, leaderboard.total_points - points_to_subtract)
    leaderboard.save(
        update_fields=[
            "daily_points",
            "weekly_points",
            "monthly_points",
            "total_points",
        ]
    )

    return points_to_subtract


def sync_leaderboard_timeframes(leaderboard: Leaderboard) -> None:
    """
    Resets daily, weekly, and monthly points when boundaries cross.
    """
    now = timezone.now()
    updated_fields = []

    # Daily Reset
    if leaderboard.daily_updated_at.date() < now.date():
        leaderboard.daily_points = 0
        leaderboard.daily_updated_at = now
        updated_fields.extend(["daily_points", "daily_updated_at"])

    # Weekly Reset (Mondays)
    start_of_week = now.date() - timedelta(days=now.weekday())
    if leaderboard.weekly_updated_at.date() < start_of_week:
        leaderboard.weekly_points = 0
        leaderboard.weekly_updated_at = now
        updated_fields.extend(["weekly_points", "weekly_updated_at"])

    # Monthly Reset
    if (
        leaderboard.monthly_updated_at.month < now.month
        or leaderboard.monthly_updated_at.year < now.year
    ):
        leaderboard.monthly_points = 0
        leaderboard.monthly_updated_at = now
        updated_fields.extend(["monthly_points", "monthly_updated_at"])

    if updated_fields:
        leaderboard.save(update_fields=updated_fields)


def get_user_ranks_and_leaderboard(user, timeframe: str = "overall") -> dict:
    """
    Returns user ranks (daily, weekly, monthly, overall) and sorted leaderboard data.
    """
    if user and user.is_authenticated:
        leaderboard, _ = Leaderboard.objects.get_or_create(user=user)
        sync_leaderboard_timeframes(leaderboard)

    # Order field based on timeframe
    order_field_map = {
        "daily": "-daily_points",
        "weekly": "-weekly_points",
        "monthly": "-monthly_points",
        "overall": "-total_points",
    }
    primary_order = order_field_map.get(timeframe.lower(), "-total_points")

    qs = (
        Leaderboard.objects.select_related("user", "user__profile")
        .order_by(primary_order, "-total_points")
    )

    daily_list = list(
        Leaderboard.objects.order_by("-daily_points", "-total_points").values_list(
            "user_id", flat=True
        )
    )
    weekly_list = list(
        Leaderboard.objects.order_by("-weekly_points", "-total_points").values_list(
            "user_id", flat=True
        )
    )
    monthly_list = list(
        Leaderboard.objects.order_by("-monthly_points", "-total_points").values_list(
            "user_id", flat=True
        )
    )
    overall_list = list(
        Leaderboard.objects.order_by("-total_points").values_list("user_id", flat=True)
    )

    daily_rank = "-"
    weekly_rank = "-"
    monthly_rank = "-"
    overall_rank = "-"

    if user and user.is_authenticated:
        try:
            daily_rank = daily_list.index(user.id) + 1
        except ValueError:
            daily_rank = "-"
        try:
            weekly_rank = weekly_list.index(user.id) + 1
        except ValueError:
            weekly_rank = "-"
        try:
            monthly_rank = monthly_list.index(user.id) + 1
        except ValueError:
            monthly_rank = "-"
        try:
            overall_rank = overall_list.index(user.id) + 1
        except ValueError:
            overall_rank = "-"

    current_rank_map = {
        "daily": daily_rank,
        "weekly": weekly_rank,
        "monthly": monthly_rank,
        "overall": overall_rank,
    }

    return {
        "daily_rank": daily_rank,
        "weekly_rank": weekly_rank,
        "monthly_rank": monthly_rank,
        "overall_rank": overall_rank,
        "current_user_rank": current_rank_map.get(timeframe.lower(), overall_rank),
        "total_user_count": qs.count(),
        "leaderboard_data": qs,
    }
