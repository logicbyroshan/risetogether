from typing import Optional
from django.db.models import QuerySet, Q, Count
from .models import FeedPost, PostComment, SavedPostNew


def get_feed_posts_queryset(
    filter_mode: str = "all",
    post_type: Optional[str] = None,
    author_username: Optional[str] = None,
    search: Optional[str] = None,
) -> QuerySet[FeedPost]:
    """
    Constructs an optimized FeedPost QuerySet with prefetching and eager loading to eliminate N+1 queries.
    """
    queryset = FeedPost.objects.filter(is_active=True).select_related(
        "author", "author__profile"
    ).prefetch_related(
        "media_files", "project_links", "post_likes", "post_comments"
    )

    if filter_mode == "trending":
        queryset = queryset.annotate(
            engagement_score=Count("post_likes") + Count("post_comments")
        ).order_by("-engagement_score", "-created_at")
    else:
        queryset = queryset.order_by("-is_pinned", "-created_at")

    if post_type and post_type != "all":
        queryset = queryset.filter(post_type=post_type)

    if author_username:
        queryset = queryset.filter(author__username__iexact=author_username)

    if search:
        queryset = queryset.filter(
            Q(normal_content__icontains=search) |
            Q(blog_title__icontains=search) |
            Q(blog_content__icontains=search) |
            Q(project_title__icontains=search) |
            Q(project_content__icontains=search)
        )

    return queryset


def get_post_comments_queryset(post_id: int) -> QuerySet[PostComment]:
    """
    Retrieve top-level comments with eager loaded authors and nested replies.
    """
    return PostComment.objects.filter(
        post_id=post_id, parent__isnull=True
    ).select_related(
        "author", "author__profile"
    ).prefetch_related(
        "replies", "replies__author", "replies__author__profile", "comment_likes_new"
    ).order_by("created_at")


def get_saved_posts_for_user(user) -> list:
    """
    Retrieve bookmarked active posts for a user.
    """
    saved_items = SavedPostNew.objects.filter(user=user).select_related(
        "post", "post__author", "post__author__profile"
    ).prefetch_related(
        "post__media_files", "post__project_links", "post__post_likes", "post__post_comments"
    ).order_by("-saved_at")

    return [item.post for item in saved_items if item.post.is_active]
