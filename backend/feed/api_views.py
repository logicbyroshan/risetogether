from django.shortcuts import get_object_or_404
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from rest_framework.pagination import PageNumberPagination

from .models import FeedPost, PostComment
from .serializers import FeedPostSerializer, PostCommentSerializer
from .services import (
    create_feed_post_service,
    toggle_post_like_service,
    toggle_post_save_service,
    toggle_comment_like_service,
)
from .selectors import (
    get_feed_posts_queryset,
    get_post_comments_queryset,
    get_saved_posts_for_user,
)
from common.permissions import IsOwnerOrReadOnly


class FeedPostPagination(PageNumberPagination):
    page_size = 12
    page_size_query_param = "page_size"
    max_page_size = 50


class FeedPostListCreateAPIView(APIView):
    """
    List feed posts with filtering (all/trending/type/author/search) or create a new post.
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        filter_mode = request.query_params.get("filter", "all")
        post_type = request.query_params.get("post_type")
        author = request.query_params.get("author")
        search = request.query_params.get("search")

        queryset = get_feed_posts_queryset(
            filter_mode=filter_mode,
            post_type=post_type,
            author_username=author,
            search=search,
        )

        paginator = FeedPostPagination()
        page = paginator.paginate_queryset(queryset, request)
        serializer = FeedPostSerializer(page, many=True, context={"request": request})
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        data = request.data.dict() if hasattr(request.data, "dict") else request.data.copy()
        post = create_feed_post_service(
            author=request.user,
            data=data,
            files=request.FILES,
        )
        serializer = FeedPostSerializer(post, context={"request": request})
        return Response(
            {
                "status": "success",
                "message": "Post created successfully!",
                "post": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class FeedPostDetailAPIView(APIView):
    """
    Retrieve, update, or delete a feed post.
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly, IsOwnerOrReadOnly]

    def get_object(self, pk):
        return get_object_or_404(
            FeedPost.objects.select_related("author", "author__profile").prefetch_related(
                "media_files", "project_links", "post_likes", "post_comments"
            ),
            pk=pk,
            is_active=True,
        )

    def get(self, request, pk):
        post = self.get_object(pk)
        # Increment views
        FeedPost.objects.filter(pk=pk).update(views_count=post.views_count + 1)
        post.refresh_from_db(fields=["views_count"])

        serializer = FeedPostSerializer(post, context={"request": request})
        return Response({
            "status": "success",
            "post": serializer.data,
        })

    def patch(self, request, pk):
        post = self.get_object(pk)
        self.check_object_permissions(request, post)

        data = request.data
        if post.post_type == "normal" and "normal_content" in data:
            post.normal_content = data["normal_content"]
        elif post.post_type == "blog":
            if "blog_title" in data:
                post.blog_title = data["blog_title"]
            if "blog_content" in data:
                post.blog_content = data["blog_content"]
        elif post.post_type == "project":
            if "project_title" in data:
                post.project_title = data["project_title"]
            if "project_content" in data:
                post.project_content = data["project_content"]

        post.save()
        serializer = FeedPostSerializer(post, context={"request": request})
        return Response({
            "status": "success",
            "message": "Post updated successfully.",
            "post": serializer.data,
        })

    def delete(self, request, pk):
        post = self.get_object(pk)
        self.check_object_permissions(request, post)
        post.delete()
        return Response({
            "status": "success",
            "message": "Post deleted successfully.",
        })


class FeedPostLikeAPIView(APIView):
    """
    Toggle like on a post.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        post = get_object_or_404(FeedPost, pk=pk, is_active=True)
        liked, total_likes = toggle_post_like_service(post, request.user)
        return Response({
            "status": "success",
            "liked": liked,
            "likesCount": total_likes,
        })


class FeedPostSaveAPIView(APIView):
    """
    Toggle save/bookmark on a post.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        post = get_object_or_404(FeedPost, pk=pk, is_active=True)
        saved = toggle_post_save_service(post, request.user)
        return Response({
            "status": "success",
            "saved": saved,
            "message": "Post saved to bookmarks." if saved else "Post removed from bookmarks.",
        })


class PostCommentListCreateAPIView(APIView):
    """
    List top-level comments for a post or post a new comment/reply.
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request, pk):
        get_object_or_404(FeedPost, pk=pk, is_active=True)
        comments = get_post_comments_queryset(post_id=pk)

        serializer = PostCommentSerializer(comments, many=True, context={"request": request})
        return Response({
            "status": "success",
            "comments": serializer.data,
        })

    def post(self, request, pk):
        post = get_object_or_404(FeedPost, pk=pk, is_active=True)
        content = request.data.get("content", "").strip()
        if not content:
            return Response(
                {"status": "error", "message": "Comment content cannot be empty."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        parent_id = request.data.get("parent_id")
        parent = None
        if parent_id:
            parent = get_object_or_404(PostComment, pk=parent_id, post=post)

        comment = PostComment.objects.create(
            post=post,
            author=request.user,
            content=content,
            parent=parent,
        )

        # Update activity score
        if hasattr(post.author, "profile"):
            post.author.profile.update_activity_score()

        serializer = PostCommentSerializer(comment, context={"request": request})
        return Response(
            {
                "status": "success",
                "message": "Comment posted.",
                "comment": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )


class PostCommentLikeAPIView(APIView):
    """
    Toggle like on a comment.
    """
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, pk):
        comment = get_object_or_404(PostComment, pk=pk)
        liked, total_likes = toggle_comment_like_service(comment, request.user)
        return Response({
            "status": "success",
            "liked": liked,
            "likesCount": total_likes,
        })


class PostCommentDeleteAPIView(APIView):
    """
    Delete a comment (by comment author or post owner).
    """
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, pk):
        comment = get_object_or_404(PostComment, pk=pk)
        if comment.author != request.user and comment.post.author != request.user:
            return Response(
                {"status": "error", "message": "You do not have permission to delete this comment."},
                status=status.HTTP_403_FORBIDDEN,
            )
        comment.delete()
        return Response({
            "status": "success",
            "message": "Comment deleted.",
        })


class SavedPostsListAPIView(APIView):
    """
    List all bookmarked/saved posts for the authenticated user.
    """
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        posts = get_saved_posts_for_user(request.user)
        paginator = FeedPostPagination()
        page = paginator.paginate_queryset(posts, request)
        serializer = FeedPostSerializer(page, many=True, context={"request": request})
        return paginator.get_paginated_response(serializer.data)
