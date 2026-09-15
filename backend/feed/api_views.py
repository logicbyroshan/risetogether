from django.shortcuts import get_object_or_404
from django.db.models import Q, Count
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from rest_framework.pagination import PageNumberPagination

from .models import (
    FeedPost,
    PostComment,
    SavedPostNew,
)
from .serializers import (
    FeedPostSerializer,
    PostCommentSerializer,
)
from .services import (
    create_feed_post_service,
    toggle_post_like_service,
    toggle_post_save_service,
    toggle_comment_like_service,
)
from common.permissions import IsOwnerOrReadOnly


class FeedPostPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 30


class FeedPostListCreateAPIView(APIView):
    """
    List feed posts with filtering (all/trending/type/author/search) or create a new post.
    """
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get(self, request):
        queryset = FeedPost.objects.filter(is_active=True).select_related(
            "author", "author__profile"
        ).prefetch_related(
            "media_files", "project_links", "post_likes", "post_comments"
        )

        filter_mode = request.query_params.get("filter", "all")
        if filter_mode == "trending":
            # Order by engagement (likes + comments + views)
            queryset = queryset.annotate(
                engagement_score=Count("post_likes") + Count("post_comments")
            ).order_by("-engagement_score", "-created_at")
        else:
            queryset = queryset.order_by("-is_pinned", "-created_at")

        # Filter by post type (normal, blog, project)
        post_type = request.query_params.get("post_type")
        if post_type and post_type != "all":
            queryset = queryset.filter(post_type=post_type)

        # Filter by author
        author = request.query_params.get("author")
        if author:
            queryset = queryset.filter(author__username__iexact=author)

        # Filter by search
        search = request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(normal_content__icontains=search) |
                Q(blog_title__icontains=search) |
                Q(blog_content__icontains=search) |
                Q(project_title__icontains=search) |
                Q(project_content__icontains=search)
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
        post = get_object_or_404(FeedPost, pk=pk, is_active=True)
        comments = PostComment.objects.filter(
            post=post, parent__isnull=True
        ).select_related(
            "author", "author__profile"
        ).prefetch_related(
            "replies", "replies__author", "replies__author__profile", "comment_likes_new"
        ).order_by("created_at")

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
        saved_items = SavedPostNew.objects.filter(user=request.user).select_related(
            "post", "post__author", "post__author__profile"
        ).prefetch_related(
            "post__media_files", "post__project_links", "post__post_likes", "post__post_comments"
        ).order_by("-saved_at")

        posts = [item.post for item in saved_items if item.post.is_active]
        paginator = FeedPostPagination()
        page = paginator.paginate_queryset(posts, request)
        serializer = FeedPostSerializer(page, many=True, context={"request": request})
        return paginator.get_paginated_response(serializer.data)
