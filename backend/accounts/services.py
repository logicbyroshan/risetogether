from django.contrib.auth import get_user_model
from django.db import transaction
from .models import Profile, ProfileLink, VisitorPreference

User = get_user_model()


def update_user_profile_service(user, data, files=None):
    """
    Updates user and profile information, including links and avatar.
    """
    with transaction.atomic():
        # Update User first/last name
        if "first_name" in data:
            user.first_name = data["first_name"]
        if "last_name" in data:
            user.last_name = data["last_name"]
        user.save()

        # Update Profile
        profile = user.profile
        if "bio" in data:
            profile.bio = data["bio"]

        if files and "profile_pic" in files:
            profile.profile_pic = files["profile_pic"]

        profile.save()

        # Update links if provided
        if "links" in data and isinstance(data["links"], list):
            # Replace existing links or update them
            profile.links.all().delete()
            for link_data in data["links"]:
                title = link_data.get("title", "").strip()
                url = link_data.get("url", "").strip()
                if title and url:
                    ProfileLink.objects.create(profile=profile, title=title, url=url)

        return user


def recalculate_user_score_service(user):
    """
    Calculates and saves user activity score.
    """
    if hasattr(user, "profile"):
        user.profile.update_activity_score()
        return user.profile.activity_score
    return 0
