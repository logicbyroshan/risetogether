from django.urls import path
from .api_views import (
    FeedPostListCreateAPIView,
    FeedPostDetailAPIView,
    FeedPostLikeAPIView,
    FeedPostSaveAPIView,
    PostCommentListCreateAPIView,
    PostCommentLikeAPIView,
    PostCommentDeleteAPIView,
    SavedPostsListAPIView,
)

app_name = "feed_api"

urlpatterns = [
    path("feed/posts/", FeedPostListCreateAPIView.as_view(), name="post_list_create"),
    path("feed/posts/<int:pk>/", FeedPostDetailAPIView.as_view(), name="post_detail"),
    path("feed/posts/<int:pk>/like/", FeedPostLikeAPIView.as_view(), name="post_like"),
    path("feed/posts/<int:pk>/save/", FeedPostSaveAPIView.as_view(), name="post_save"),
    path("feed/posts/<int:pk>/comments/", PostCommentListCreateAPIView.as_view(), name="post_comments"),
    path("feed/comments/<int:pk>/like/", PostCommentLikeAPIView.as_view(), name="comment_like"),
    path("feed/comments/<int:pk>/", PostCommentDeleteAPIView.as_view(), name="comment_delete"),
    path("feed/saved/", SavedPostsListAPIView.as_view(), name="saved_posts"),
]
