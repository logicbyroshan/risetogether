import json
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from django.db.models import Q

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics

from .models import Profile, ProfileLink, VisitorPreference
from .serializers import (
    UserDetailSerializer,
    UserSummarySerializer,
    ProfileSerializer,
    VisitorPreferenceSerializer,
    LeaderboardEntrySerializer,
)
from .services import update_user_profile_service, recalculate_user_score_service
from community.models import Leaderboard

User = get_user_model()


class UserProfileAPIView(APIView):
    """
    Get a user profile by username or the authenticated user's profile if username is omitted.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, username=None):
        if username:
            user = get_object_or_404(User, username__iexact=username)
        else:
            if not request.user.is_authenticated:
                return Response(
                    {"status": "error", "message": "Authentication credentials were not provided."},
                    status=status.HTTP_401_UNAUTHORIZED,
                )
            user = request.user

        # Ensure activity score is current
        recalculate_user_score_service(user)
        user_data = UserDetailSerializer(user, context={"request": request}).data

        return Response({
            "status": "success",
            "user": user_data,
        })


class UpdateProfileAPIView(APIView):
    """
    Update the authenticated user's profile (bio, name, profile pic, links).
    Accepts multipart/form-data or application/json.
    """
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request):
        user = request.user
        data = request.data.dict() if hasattr(request.data, "dict") else request.data.copy()
        
        # Handle parsed JSON links string if coming via multipart
        if "links" in data and isinstance(data["links"], str):
            try:
                data["links"] = json.loads(data["links"])
            except json.JSONDecodeError:
                data["links"] = []

        files = request.FILES

        updated_user = update_user_profile_service(user, data, files)
        serializer = UserDetailSerializer(updated_user, context={"request": request})

        return Response({
            "status": "success",
            "message": "Profile updated successfully.",
            "user": serializer.data,
        })

    def put(self, request):
        return self.patch(request)


class VisitorPreferenceAPIView(APIView):
    """
    Get or update user preferences (notifications).
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        prefs, _ = VisitorPreference.objects.get_or_create(user=request.user)
        serializer = VisitorPreferenceSerializer(prefs)
        return Response({
            "status": "success",
            "preferences": serializer.data,
        })

    def patch(self, request):
        prefs, _ = VisitorPreference.objects.get_or_create(user=request.user)
        serializer = VisitorPreferenceSerializer(prefs, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "status": "success",
                "message": "Preferences updated successfully.",
                "preferences": serializer.data,
            })
        return Response(
            {"status": "error", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )


class LeaderboardAPIView(APIView):
    """
    Get leaderboard rankings filtered by period (daily, weekly, monthly, all_time).
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        period = request.query_params.get("period", "monthly")
        valid_periods = ["daily", "weekly", "monthly", "all_time"]
        if period not in valid_periods:
            period = "monthly"

        # If Leaderboard table is empty, generate from profiles
        entries = Leaderboard.objects.filter(period=period).select_related("user", "user__profile").order_by("-points", "rank")[:50]
        
        if not entries.exists():
            # Fallback to users sorted by profile.activity_score
            users = User.objects.filter(is_active=True).select_related("profile").order_by("-profile__activity_score")[:20]
            leaderboard_data = []
            for rank, u in enumerate(users, start=1):
                leaderboard_data.append({
                    "id": u.id,
                    "rank": rank,
                    "period": period,
                    "points": u.profile.activity_score if hasattr(u, "profile") else 0,
                    "user": UserSummarySerializer(u, context={"request": request}).data,
                })
            return Response({
                "status": "success",
                "period": period,
                "leaderboard": leaderboard_data,
            })

        serializer = LeaderboardEntrySerializer(entries, many=True, context={"request": request})
        return Response({
            "status": "success",
            "period": period,
            "leaderboard": serializer.data,
        })
