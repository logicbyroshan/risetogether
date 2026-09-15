from django.contrib.auth import authenticate, login, logout, get_user_model
from django.views.decorators.csrf import ensure_csrf_cookie
from django.utils.decorators import method_decorator
from django.middleware.csrf import get_token
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions

from .serializers import (
    UserRegistrationSerializer,
    UserLoginSerializer,
    UserDetailSerializer,
    PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer,
)

User = get_user_model()


class CSRFTokenView(APIView):
    """
    Endpoint to get a valid CSRF token and set the csrftoken cookie for SPA requests.
    """
    permission_classes = [permissions.AllowAny]

    @method_decorator(ensure_csrf_cookie)
    def get(self, request):
        csrf_token = get_token(request)
        return Response({
            "status": "success",
            "csrfToken": csrf_token,
        })


class RegisterAPIView(APIView):
    """
    Register a new user account and immediately log them in via session.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            # Log the user in to create a session
            login(request, user)
            user_data = UserDetailSerializer(user, context={"request": request}).data
            return Response(
                {
                    "status": "success",
                    "message": "Registration successful! Welcome to Rise Together.",
                    "user": user_data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {
                "status": "error",
                "message": "Registration failed. Please check the form errors.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class LoginAPIView(APIView):
    """
    Authenticate user via email and password and establish a session.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"].lower()
            password = serializer.validated_data["password"]

            user = authenticate(request, username=email, password=password)
            if user is not None:
                if not user.is_active:
                    return Response(
                        {
                            "status": "error",
                            "message": "This account is inactive. Please contact support.",
                        },
                        status=status.HTTP_403_FORBIDDEN,
                    )
                login(request, user)
                user_data = UserDetailSerializer(user, context={"request": request}).data
                return Response({
                    "status": "success",
                    "message": f"Welcome back, {user.username}!",
                    "user": user_data,
                })
            else:
                return Response(
                    {
                        "status": "error",
                        "message": "Invalid email or password.",
                    },
                    status=status.HTTP_401_UNAUTHORIZED,
                )
        return Response(
            {
                "status": "error",
                "message": "Invalid login data.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class LogoutAPIView(APIView):
    """
    Log out the current user and flush session.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        logout(request)
        return Response({
            "status": "success",
            "message": "Successfully logged out.",
        })


class CurrentUserAPIView(APIView):
    """
    Get the currently authenticated user details.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        if request.user.is_authenticated:
            serializer = UserDetailSerializer(request.user, context={"request": request})
            return Response({
                "status": "success",
                "isAuthenticated": True,
                "user": serializer.data,
            })
        return Response({
            "status": "success",
            "isAuthenticated": False,
            "user": None,
        })


class PasswordResetRequestAPIView(APIView):
    """
    Request password reset email.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data["email"].lower()
            try:
                user = User.objects.get(email=email)
                token = default_token_generator.make_token(user)
                uid = urlsafe_base64_encode(force_bytes(user.pk))
                reset_url = f"{request.scheme}://{request.get_host()}/password-reset/confirm/{uid}/{token}/"
                
                # Send email (console in dev)
                send_mail(
                    subject="RiseTogether Password Reset Request",
                    message=f"Hello {user.username},\n\nYou requested a password reset. Follow this link to reset your password:\n{reset_url}\n\nIf you did not request this, please ignore this email.",
                    from_email=settings.DEFAULT_FROM_EMAIL if hasattr(settings, "DEFAULT_FROM_EMAIL") else "noreply@risetogether.local",
                    recipient_list=[email],
                    fail_silently=True,
                )
            except User.DoesNotExist:
                # Do not expose whether user exists
                pass

            return Response({
                "status": "success",
                "message": "If an account exists with this email, password reset instructions have been sent.",
            })
        return Response(
            {
                "status": "error",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class PasswordResetConfirmAPIView(APIView):
    """
    Confirm password reset with uid and token.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        if serializer.is_valid():
            uid = serializer.validated_data["uid"]
            token = serializer.validated_data["token"]
            password = serializer.validated_data["password"]

            try:
                user_id = force_str(urlsafe_base64_decode(uid))
                user = User.objects.get(pk=user_id)
            except (TypeError, ValueError, OverflowError, User.DoesNotExist):
                return Response(
                    {"status": "error", "message": "Invalid password reset link."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

            if default_token_generator.check_token(user, token):
                user.set_password(password)
                user.save()
                return Response({
                    "status": "success",
                    "message": "Password reset successful! You can now log in with your new password.",
                })
            else:
                return Response(
                    {"status": "error", "message": "Reset link has expired or is invalid."},
                    status=status.HTTP_400_BAD_REQUEST,
                )

        return Response(
            {"status": "error", "errors": serializer.errors},
            status=status.HTTP_400_BAD_REQUEST,
        )
