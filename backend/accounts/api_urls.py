from django.urls import path
from .api_auth_views import (
    CSRFTokenView,
    RegisterAPIView,
    LoginAPIView,
    LogoutAPIView,
    CurrentUserAPIView,
    PasswordResetRequestAPIView,
    PasswordResetConfirmAPIView,
)
from .api_views import (
    UserProfileAPIView,
    UpdateProfileAPIView,
    VisitorPreferenceAPIView,
    LeaderboardAPIView,
)

app_name = "accounts_api"

urlpatterns = [
    # Auth endpoints
    path("auth/csrf/", CSRFTokenView.as_view(), name="csrf"),
    path("auth/register/", RegisterAPIView.as_view(), name="register"),
    path("auth/login/", LoginAPIView.as_view(), name="login"),
    path("auth/logout/", LogoutAPIView.as_view(), name="logout"),
    path("auth/me/", CurrentUserAPIView.as_view(), name="current_user"),
    path("auth/password-reset/", PasswordResetRequestAPIView.as_view(), name="password_reset_request"),
    path("auth/password-reset/confirm/", PasswordResetConfirmAPIView.as_view(), name="password_reset_confirm"),

    # Account and Profile endpoints
    path("accounts/me/", UserProfileAPIView.as_view(), name="my_profile"),
    path("accounts/profile/edit/", UpdateProfileAPIView.as_view(), name="edit_profile"),
    path("accounts/users/<str:username>/", UserProfileAPIView.as_view(), name="user_profile"),
    path("accounts/preferences/", VisitorPreferenceAPIView.as_view(), name="preferences"),
    path("accounts/leaderboard/", LeaderboardAPIView.as_view(), name="leaderboard"),
]
