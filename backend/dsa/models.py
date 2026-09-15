# backend/dsa/models.py

from django.db import models
from django.conf import settings
from django.utils import timezone


class Leaderboard(models.Model):
    user = models.OneToOneField(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="leaderboard_entry",
        primary_key=True,
    )
    
    # Points tracking
    daily_points = models.IntegerField(default=0)
    weekly_points = models.IntegerField(default=0)
    monthly_points = models.IntegerField(default=0)
    total_points = models.IntegerField(default=0)
    
    # Streak and activity tracking
    last_post_date = models.DateField(null=True, blank=True)
    consecutive_post_days = models.IntegerField(default=0)
    
    # Timestamps for resetting points
    daily_updated_at = models.DateTimeField(default=timezone.now)
    weekly_updated_at = models.DateTimeField(default=timezone.now)
    monthly_updated_at = models.DateTimeField(default=timezone.now)

    class Meta:
        ordering = ["-total_points"]
        verbose_name = "Leaderboard Entry"
        verbose_name_plural = "Leaderboard Entries"

    def __str__(self):
        return f"{self.user.username} ({self.user.email}) - {self.total_points} points"


class CodingProblemPost(models.Model):
    DIFFICULTY_CHOICES = [
        ("EASY", "Easy"),
        ("MEDIUM", "Medium"),
        ("HARD", "Hard"),
    ]

    LANGUAGE_CHOICES = [
        ("PYTHON", "Python"),
        ("CPP", "C++"),
        ("JAVA", "Java"),
        ("JAVASCRIPT", "JavaScript"),
        ("TYPESCRIPT", "TypeScript"),
    ]

    TIME_COMPLEXITY_CHOICES = [
        ("O(1)", "O(1) - Constant"),
        ("O(log n)", "O(log n) - Logarithmic"),
        ("O(n)", "O(n) - Linear"),
        ("O(n log n)", "O(n log n) - Log-Linear"),
        ("O(n^2)", "O(n^2) - Quadratic"),
        ("O(n^3)", "O(n^3) - Cubic"),
        ("O(2^n)", "O(2^n) - Exponential"),
        ("O(n!)", "O(n!) - Factorial"),
    ]

    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="coding_posts",
    )
    title = models.CharField(max_length=200)
    code_snippet = models.TextField()
    language = models.CharField(
        max_length=20, choices=LANGUAGE_CHOICES, default="PYTHON"
    )
    time_complexity = models.CharField(
        max_length=20, choices=TIME_COMPLEXITY_CHOICES, default="O(n)"
    )
    difficulty = models.CharField(
        max_length=10, choices=DIFFICULTY_CHOICES, default="MEDIUM"
    )
    points_earned = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True, editable=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-created_at"]
        verbose_name = "Coding Problem Post"
        verbose_name_plural = "Coding Problem Posts"
        indexes = [
            models.Index(fields=["-created_at"]),
            models.Index(fields=["author", "-created_at"]),
        ]

    def __str__(self):
        return f'"{self.title}" by {self.author.username}'
