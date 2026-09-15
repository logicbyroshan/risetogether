import json
from django.db import transaction
from .models import (
    FeedPost,
    PostMedia,
    ProjectLink,
    PostComment,
    PostLikeNew,
    CommentLikeNew,
    SavedPostNew,
)
from accounts.models import Profile


def create_feed_post_service(author, data, files=None):
    """
    Creates a new FeedPost supporting normal, blog, and project types,
    handling associated media files and project links within an atomic transaction.
    """
    post_type = data.get("post_type", "normal")

    with transaction.atomic():
        post = FeedPost.objects.create(
            author=author,
            post_type=post_type,
            normal_content=data.get("normal_content", "") if post_type == "normal" else "",
            blog_title=data.get("blog_title", "") if post_type == "blog" else "",
            blog_content=data.get("blog_content", "") if post_type == "blog" else "",
            project_title=data.get("project_title", "") if post_type == "project" else "",
            project_content=data.get("project_content", "") if post_type == "project" else "",
        )

        # Handle blog thumbnail if provided
        if post_type == "blog" and files and "blog_thumbnail" in files:
            post.blog_thumbnail = files["blog_thumbnail"]
            post.save(update_fields=["blog_thumbnail"])

        # Handle uploaded media (images or videos)
        if files:
            # Check for multiple media files (media_files, media, images)
            media_list = files.getlist("media_files") if "media_files" in files else (
                files.getlist("media") if "media" in files else (
                    files.getlist("image") if "image" in files else []
                )
            )
            for idx, media_file in enumerate(media_list):
                content_type = getattr(media_file, "content_type", "")
                media_type = "video" if content_type.startswith("video") else "image"
                PostMedia.objects.create(
                    post=post,
                    media_type=media_type,
                    file=media_file,
                    order=idx,
                )

        # Handle project links
        project_links_raw = data.get("project_links") or data.get("links")
        if project_links_raw:
            if isinstance(project_links_raw, str):
                try:
                    project_links_raw = json.loads(project_links_raw)
                except json.JSONDecodeError:
                    project_links_raw = []

            if isinstance(project_links_raw, list):
                for idx, link in enumerate(project_links_raw):
                    title = link.get("title", "").strip()
                    url = link.get("url", "").strip()
                    if title and url:
                        ProjectLink.objects.create(
                            post=post,
                            title=title,
                            url=url,
                            order=idx,
                        )

        # Update user activity score and posts count
        if hasattr(author, "profile"):
            author.profile.posts_shared_count += 1
            author.profile.save(update_fields=["posts_shared_count"])
            author.profile.update_activity_score()

        return post


def toggle_post_like_service(post, user):
    """
    Toggles like status on a post for the specified user.
    Returns (liked: bool, total_likes: int)
    """
    like_obj = PostLikeNew.objects.filter(post=post, user=user).first()
    if like_obj:
        like_obj.delete()
        liked = False
    else:
        PostLikeNew.objects.create(post=post, user=user)
        liked = True

    # Update author's activity score
    if hasattr(post.author, "profile"):
        post.author.profile.update_activity_score()

    return liked, post.likes_count


def toggle_post_save_service(post, user):
    """
    Toggles bookmark/save status on a post for the specified user.
    Returns (saved: bool)
    """
    save_obj = SavedPostNew.objects.filter(post=post, user=user).first()
    if save_obj:
        save_obj.delete()
        return False
    else:
        SavedPostNew.objects.create(post=post, user=user)
        return True


def toggle_comment_like_service(comment, user):
    """
    Toggles like status on a comment for the specified user.
    Returns (liked: bool, total_likes: int)
    """
    like_obj = CommentLikeNew.objects.filter(comment=comment, user=user).first()
    if like_obj:
        like_obj.delete()
        liked = False
    else:
        CommentLikeNew.objects.create(comment=comment, user=user)
        liked = True

    return liked, comment.likes_count
