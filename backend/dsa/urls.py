# backend/dsa/urls.py

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .api_views import LeaderboardView, CodingPostViewSet, UserStatsView

app_name = "dsa"

router = DefaultRouter()
router.register(r"coding-posts", CodingPostViewSet, basename="coding-post")

urlpatterns = [
    path("leaderboard/", LeaderboardView.as_view(), name="leaderboard"),
    path("user-stats/", UserStatsView.as_view(), name="user-stats"),
    path("", include(router.urls)),
]
