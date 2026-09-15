# backend/dsa/api_views.py

from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.utils import timezone
from common.permissions import IsOwnerOrReadOnly
from .models import Leaderboard, CodingProblemPost
from .serializers import (
    LeaderboardEntrySerializer,
    CodingProblemPostSerializer,
    UserStatsSerializer,
)
from .services import (
    calculate_points_for_post,
    handle_post_update,
    handle_post_delete,
    get_user_ranks_and_leaderboard,
    detect_language,
    sync_leaderboard_timeframes,
)
from .selectors import (
    get_leaderboard_queryset,
    get_coding_posts_for_user,
    get_all_coding_posts,
)


class LeaderboardView(APIView):
    """
    GET /api/dsa/leaderboard/?timeframe=overall|daily|weekly|monthly
    Returns top 3 podium users, remaining other users, user rank, and total count.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        timeframe = request.query_params.get("timeframe", "overall").lower()
        if timeframe not in ["overall", "daily", "weekly", "monthly"]:
            timeframe = "overall"

        rank_data = get_user_ranks_and_leaderboard(request.user, timeframe=timeframe)
        all_entries = list(rank_data["leaderboard_data"])

        # Attach 1-based rank numbers
        for idx, entry in enumerate(all_entries, start=1):
            entry.rank = idx

        top_users = all_entries[:3]
        other_users = all_entries[3:]

        context = {"request": request}
        top_serializer = LeaderboardEntrySerializer(top_users, many=True, context=context)
        other_serializer = LeaderboardEntrySerializer(other_users, many=True, context=context)

        return Response(
            {
                "timeframe": timeframe,
                "current_user_rank": rank_data["current_user_rank"],
                "total_user_count": rank_data["total_user_count"],
                "top_users": top_serializer.data,
                "other_users": other_serializer.data,
                "daily_rank": rank_data["daily_rank"],
                "weekly_rank": rank_data["weekly_rank"],
                "monthly_rank": rank_data["monthly_rank"],
                "overall_rank": rank_data["overall_rank"],
            }
        )


class CodingPostViewSet(viewsets.ModelViewSet):
    """
    ViewSet for Coding Problem Posts.
    Enforces daily 3-post limit, auto-detects language, and calculates points.
    """
    serializer_class = CodingProblemPostSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_queryset(self):
        user_param = self.request.query_params.get("author")
        if user_param:
            return CodingProblemPost.objects.filter(
                author__username=user_param
            ).select_related("author", "author__profile").order_by("-created_at")
        
        # If 'me' filter is requested
        if self.request.query_params.get("mine") == "true" and self.request.user.is_authenticated:
            return get_coding_posts_for_user(self.request.user)

        return get_all_coding_posts()

    def create(self, request, *args, **kwargs):
        today = timezone.now().date()
        today_post_count = CodingProblemPost.objects.filter(
            author=request.user, created_at__date=today
        ).count()

        if today_post_count >= 3:
            return Response(
                {"detail": "You have reached your daily post limit of 3 posts."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        code_snippet = serializer.validated_data.get("code_snippet", "")
        language = serializer.validated_data.get("language")
        if not language or language == "PYTHON":
            detected = detect_language(code_snippet)
            if detected:
                language = detected

        post = serializer.save(author=request.user, language=language)
        points = calculate_points_for_post(request.user, post, is_new_post=True)

        # Refresh from db
        post.refresh_from_db()
        output_serializer = self.get_serializer(post)
        headers = self.get_success_headers(output_serializer.data)
        return Response(
            output_serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def perform_update(self, serializer):
        post = serializer.save()
        handle_post_update(self.request.user, post)

    def perform_destroy(self, instance):
        handle_post_delete(self.request.user, instance)
        instance.delete()


class UserStatsView(APIView):
    """
    GET /api/dsa/user-stats/
    Returns authenticated user's ranks, streaks, points, and daily post count.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        user = request.user
        leaderboard, _ = Leaderboard.objects.get_or_create(user=user)
        sync_leaderboard_timeframes(leaderboard)

        rank_data = get_user_ranks_and_leaderboard(user)
        today = timezone.now().date()
        posts_today = CodingProblemPost.objects.filter(
            author=user, created_at__date=today
        ).count()

        data = {
            "daily_rank": str(rank_data["daily_rank"]),
            "weekly_rank": str(rank_data["weekly_rank"]),
            "monthly_rank": str(rank_data["monthly_rank"]),
            "overall_rank": str(rank_data["overall_rank"]),
            "daily_points": leaderboard.daily_points,
            "weekly_points": leaderboard.weekly_points,
            "monthly_points": leaderboard.monthly_points,
            "total_points": leaderboard.total_points,
            "consecutive_post_days": leaderboard.consecutive_post_days,
            "posts_today_count": posts_today,
            "daily_limit": 3,
        }

        serializer = UserStatsSerializer(data)
        return Response(serializer.data)
