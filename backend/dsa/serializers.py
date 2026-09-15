# backend/dsa/serializers.py

from rest_framework import serializers
from django.contrib.auth import get_user_model
from .models import Leaderboard, CodingProblemPost
from accounts.serializers import UserSummarySerializer

User = get_user_model()


class LeaderboardEntrySerializer(serializers.ModelSerializer):
    username = serializers.CharField(source="user.username", read_only=True)
    full_name = serializers.SerializerMethodField()
    email = serializers.EmailField(source="user.email", read_only=True)
    profile_pic = serializers.SerializerMethodField()
    rank = serializers.IntegerField(default=0, read_only=True)

    class Meta:
        model = Leaderboard
        fields = [
            "user_id",
            "username",
            "full_name",
            "email",
            "profile_pic",
            "daily_points",
            "weekly_points",
            "monthly_points",
            "total_points",
            "consecutive_post_days",
            "rank",
        ]

    def get_full_name(self, obj):
        name = obj.user.get_full_name()
        return name if name else obj.user.username

    def get_profile_pic(self, obj):
        if hasattr(obj.user, "profile") and obj.user.profile.profile_pic:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.user.profile.profile_pic.url)
            return obj.user.profile.profile_pic.url
        return None


class CodingProblemPostSerializer(serializers.ModelSerializer):
    author = UserSummarySerializer(read_only=True)
    difficulty_display = serializers.CharField(
        source="get_difficulty_display", read_only=True
    )
    time_complexity_display = serializers.CharField(
        source="get_time_complexity_display", read_only=True
    )
    language_display = serializers.CharField(
        source="get_language_display", read_only=True
    )

    class Meta:
        model = CodingProblemPost
        fields = [
            "id",
            "author",
            "title",
            "code_snippet",
            "language",
            "language_display",
            "time_complexity",
            "time_complexity_display",
            "difficulty",
            "difficulty_display",
            "points_earned",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "author", "points_earned", "created_at", "updated_at"]

    def validate_title(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Title must be at least 3 characters.")
        return value.strip()

    def validate_code_snippet(self, value):
        if len(value.strip()) < 5:
            raise serializers.ValidationError("Code snippet must be provided.")
        return value.strip()


class UserStatsSerializer(serializers.Serializer):
    daily_rank = serializers.CharField()
    weekly_rank = serializers.CharField()
    monthly_rank = serializers.CharField()
    overall_rank = serializers.CharField()
    daily_points = serializers.IntegerField()
    weekly_points = serializers.IntegerField()
    monthly_points = serializers.IntegerField()
    total_points = serializers.IntegerField()
    consecutive_post_days = serializers.IntegerField()
    posts_today_count = serializers.IntegerField()
    daily_limit = serializers.IntegerField(default=3)
