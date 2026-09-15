# accounts/management/commands/update_activity_scores.py

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from accounts.models import Profile

User = get_user_model()


class Command(BaseCommand):
    help = "Recalculate activity scores for all users"

    def add_arguments(self, parser):
        parser.add_argument(
            "--username",
            type=str,
            help="Update score for a specific user only",
        )

    def handle(self, *args, **options):
        username = options.get("username")

        if username:
            # Update specific user
            try:
                user = User.objects.get(username=username)
                if hasattr(user, "profile"):
                    old_score = user.profile.activity_score
                    user.profile.update_activity_score()
                    new_score = user.profile.activity_score
                    self.stdout.write(
                        self.style.SUCCESS(
                            f"Updated {username}: {old_score} → {new_score} points"
                        )
                    )
                else:
                    self.stdout.write(
                        self.style.ERROR(f"User {username} has no profile")
                    )
            except User.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"User {username} not found"))
        else:
            # Update all users
            self.stdout.write("Updating activity scores for all users...")

            profiles = Profile.objects.select_related("user").all()
            total = profiles.count()
            updated = 0

            for profile in profiles:
                old_score = profile.activity_score
                profile.update_activity_score()
                new_score = profile.activity_score

                if old_score != new_score:
                    updated += 1
                    self.stdout.write(
                        f"  {profile.user.username}: {old_score} → {new_score} points"
                    )

            self.stdout.write(
                self.style.SUCCESS(f"\nCompleted! Updated {updated}/{total} profiles.")
            )
