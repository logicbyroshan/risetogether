# accounts/views.py

from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .models import User, Profile, ProfileLink
import re  # Import regex
from .forms import UserUpdateForm, ProfileUpdateForm, ProfileLinkFormSet


def join_view(request):
    if request.user.is_authenticated:
        return redirect("accounts:profile")

    if request.method == "POST":
        full_name = request.POST.get("full_name")
        email = request.POST.get("email")
        password = request.POST.get("password1")
        password2 = request.POST.get("password2")

        if password != password2:
            messages.error(request, "Passwords do not match.")
            return redirect("accounts:join")

        if User.objects.filter(email=email).exists():
            messages.error(request, "An account with this email already exists.")
            return redirect("accounts:join")

        # Create a unique username from email
        username = email.split("@")[0] + str(User.objects.count())

        first_name, last_name = (full_name.split(" ", 1) + [""])[:2]

        try:
            user = User.objects.create_user(
                username=username,
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
            )
            login(request, user)
            messages.success(request, "Account created successfully! Welcome.")
            return redirect("accounts:profile")
        except Exception as e:
            messages.error(request, f"An error occurred: {e}")
            return redirect("accounts:join")

    return render(request, "accounts/join.html")


def login_view(request):
    if request.user.is_authenticated:
        return redirect("accounts:profile")

    if request.method == "POST":
        email = request.POST.get("email")
        password = request.POST.get("password")

        # Since we use email as the username field, we can authenticate directly
        user = authenticate(request, username=email, password=password)

        if user is not None:
            login(request, user)
            return redirect("accounts:profile")
        else:
            messages.error(request, "Invalid email or password.")
            # It's better to re-render the login page with an error
            return render(
                request, "accounts/login.html", {"error": "Invalid email or password."}
            )

    return render(request, "accounts/login.html")


def logout_view(request):
    logout(request)
    messages.info(request, "You have been logged out.")
    return redirect("accounts:login")


@login_required
def profile_view(request, username=None):
    """View a user's profile. If username is provided, show that user's profile, otherwise show the logged-in user's profile."""
    if username:
        # View another user's profile
        from django.contrib.auth import get_user_model

        User = get_user_model()
        profile_user = get_object_or_404(User, username=username)
    else:
        # View own profile
        profile_user = request.user

    # Get user's posts from feed app
    try:
        from feed.models import Post

        user_posts = Post.objects.filter(author=profile_user).order_by("-created_at")
    except:
        user_posts = []

    # Get user's blogs from community app
    try:
        from community.models import Blog

        user_blogs = Blog.objects.filter(author=profile_user).order_by("-created_at")
    except:
        user_blogs = []

    # Get user's projects from community app
    try:
        from community.models import Project

        user_projects = Project.objects.filter(author=profile_user).order_by(
            "-created_at"
        )
    except:
        user_projects = []

    context = {
        "user": profile_user,  # For template compatibility
        "profile_user": profile_user,
        "user_posts": user_posts,
        "user_blogs": user_blogs,
        "user_projects": user_projects,
        "posts_count": len(user_posts),
    }
    return render(request, "accounts/profile.html", context)


@login_required
def edit_profile_view(request):
    if request.method == "POST":
        # Instantiate forms with POST data and files
        user_form = UserUpdateForm(request.POST, instance=request.user)
        profile_form = ProfileUpdateForm(
            request.POST, request.FILES, instance=request.user.profile
        )
        link_formset = ProfileLinkFormSet(
            request.POST,
            queryset=ProfileLink.objects.filter(profile=request.user.profile),
        )

        if user_form.is_valid() and profile_form.is_valid() and link_formset.is_valid():
            user_form.save()
            profile_form.save()

            # Save the link formset
            links = link_formset.save(commit=False)
            for link in links:
                # Associate each new link with the current user's profile before saving
                link.profile = request.user.profile
                link.save()

            # Handle deletions
            link_formset.save()

            messages.success(request, "Your profile has been updated successfully!")
            return redirect("accounts:profile")
        else:
            messages.error(request, "Please correct the errors below.")

    else:
        # Instantiate forms with existing user data for GET request
        user_form = UserUpdateForm(instance=request.user)
        profile_form = ProfileUpdateForm(instance=request.user.profile)
        link_formset = ProfileLinkFormSet(
            queryset=ProfileLink.objects.filter(profile=request.user.profile)
        )

    context = {
        "user_form": user_form,
        "profile_form": profile_form,
        "link_formset": link_formset,
    }
    return render(request, "accounts/edit_profile.html", context)
