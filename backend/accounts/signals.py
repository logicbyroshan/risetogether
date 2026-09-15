# accounts/signals.py

from django.db.models.signals import post_save, post_delete, m2m_changed
from django.dispatch import receiver
from django.db.models import Q


@receiver(post_save, sender="feed.Post")
def update_score_on_post_save(sender, instance, created, **kwargs):
    """Update author's activity score when a post is created or updated"""
    if instance.author and hasattr(instance.author, "profile"):
        instance.author.profile.update_activity_score()


@receiver(post_delete, sender="feed.Post")
def update_score_on_post_delete(sender, instance, **kwargs):
    """Update author's activity score when a post is deleted"""
    if instance.author and hasattr(instance.author, "profile"):
        instance.author.profile.update_activity_score()


@receiver(post_save, sender="feed.PostLike")
def update_score_on_like_save(sender, instance, created, **kwargs):
    """Update post author's activity score when someone likes their post"""
    if created and instance.post.author and hasattr(instance.post.author, "profile"):
        instance.post.author.profile.update_activity_score()


@receiver(post_delete, sender="feed.PostLike")
def update_score_on_like_delete(sender, instance, **kwargs):
    """Update post author's activity score when a like is removed"""
    if instance.post.author and hasattr(instance.post.author, "profile"):
        instance.post.author.profile.update_activity_score()


@receiver(post_save, sender="feed.Comment")
def update_score_on_comment_save(sender, instance, created, **kwargs):
    """Update post author's activity score when someone comments on their post"""
    if created and instance.post.author and hasattr(instance.post.author, "profile"):
        instance.post.author.profile.update_activity_score()


@receiver(post_delete, sender="feed.Comment")
def update_score_on_comment_delete(sender, instance, **kwargs):
    """Update post author's activity score when a comment is deleted"""
    if instance.post.author and hasattr(instance.post.author, "profile"):
        instance.post.author.profile.update_activity_score()


@receiver(post_save, sender="community.Blog")
def update_score_on_blog_save(sender, instance, created, **kwargs):
    """Update author's activity score when a blog is created or updated"""
    if instance.author and hasattr(instance.author, "profile"):
        instance.author.profile.update_activity_score()


@receiver(post_delete, sender="community.Blog")
def update_score_on_blog_delete(sender, instance, **kwargs):
    """Update author's activity score when a blog is deleted"""
    if instance.author and hasattr(instance.author, "profile"):
        instance.author.profile.update_activity_score()


@receiver(post_save, sender="community.Project")
def update_score_on_project_save(sender, instance, created, **kwargs):
    """Update leader's and members' activity scores when a project is created or updated"""
    if instance.leader and hasattr(instance.leader, "profile"):
        instance.leader.profile.update_activity_score()


@receiver(post_delete, sender="community.Project")
def update_score_on_project_delete(sender, instance, **kwargs):
    """Update leader's and members' activity scores when a project is deleted"""
    if instance.leader and hasattr(instance.leader, "profile"):
        instance.leader.profile.update_activity_score()

    # Update all members' scores
    for member in instance.members.all():
        if hasattr(member, "profile"):
            member.profile.update_activity_score()


def update_project_members_scores(sender, instance, action, pk_set, **kwargs):
    """Update activity scores when project members are added or removed"""
    if action in ["post_add", "post_remove", "post_clear"]:
        # Update project leader's score
        if instance.leader and hasattr(instance.leader, "profile"):
            instance.leader.profile.update_activity_score()

        # Update all members' scores
        if pk_set:
            from django.contrib.auth import get_user_model

            User = get_user_model()
            for user_id in pk_set:
                try:
                    user = User.objects.get(id=user_id)
                    if hasattr(user, "profile"):
                        user.profile.update_activity_score()
                except User.DoesNotExist:
                    pass


# Connect m2m_changed signal dynamically to avoid import issues
from django.apps import apps
from django.db.models.signals import m2m_changed

try:
    # This will be executed when the app is ready
    Project = apps.get_model("community", "Project")
    m2m_changed.connect(update_project_members_scores, sender=Project.members.through)
except:
    # If models aren't ready yet, it will be connected when ready
    pass
