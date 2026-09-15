import json
from rest_framework import serializers
from .models import (
    FeedPost,
    PostMedia,
    ProjectLink,
    PostComment,
    PostLikeNew,
    CommentLikeNew,
    SavedPostNew,
)
from accounts.serializers import UserSummarySerializer


class PostMediaSerializer(serializers.ModelSerializer):
    file = serializers.SerializerMethodField()

    class Meta:
        model = PostMedia
        fields = ["id", "media_type", "file", "order", "uploaded_at"]

    def get_file(self, obj):
        if obj.file:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None


class ProjectLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectLink
        fields = ["id", "title", "url", "order"]


class CommentReplySerializer(serializers.ModelSerializer):
    author = UserSummarySerializer(read_only=True)
    is_liked = serializers.SerializerMethodField()
    likes_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = PostComment
        fields = [
            "id",
            "post_id",
            "author",
            "content",
            "parent_id",
            "created_at",
            "updated_at",
            "is_edited",
            "likes_count",
            "is_liked",
        ]

    def get_is_liked(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return CommentLikeNew.objects.filter(comment=obj, user=request.user).exists()
        return False


class PostCommentSerializer(serializers.ModelSerializer):
    author = UserSummarySerializer(read_only=True)
    replies = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()
    likes_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = PostComment
        fields = [
            "id",
            "post_id",
            "author",
            "content",
            "parent_id",
            "created_at",
            "updated_at",
            "is_edited",
            "likes_count",
            "is_liked",
            "replies",
        ]

    def get_replies(self, obj):
        replies = obj.replies.select_related("author", "author__profile").order_by("created_at")
        return CommentReplySerializer(replies, many=True, context=self.context).data

    def get_is_liked(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return CommentLikeNew.objects.filter(comment=obj, user=request.user).exists()
        return False


class FeedPostSerializer(serializers.ModelSerializer):
    author = UserSummarySerializer(read_only=True)
    media_files = PostMediaSerializer(many=True, read_only=True)
    project_links = ProjectLinkSerializer(many=True, read_only=True)
    blog_thumbnail = serializers.SerializerMethodField()
    likes_count = serializers.IntegerField(read_only=True)
    comments_count = serializers.IntegerField(read_only=True)
    is_liked = serializers.SerializerMethodField()
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = FeedPost
        fields = [
            "id",
            "author",
            "post_type",
            "title",
            "content",
            "blog_title",
            "blog_thumbnail",
            "blog_content",
            "project_title",
            "project_content",
            "normal_content",
            "media_files",
            "project_links",
            "is_pinned",
            "views_count",
            "likes_count",
            "comments_count",
            "is_liked",
            "is_saved",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "author", "views_count", "created_at", "updated_at"]

    def get_blog_thumbnail(self, obj):
        if obj.blog_thumbnail:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.blog_thumbnail.url)
            return obj.blog_thumbnail.url
        return None

    def get_is_liked(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return PostLikeNew.objects.filter(post=obj, user=request.user).exists()
        return False

    def get_is_saved(self, obj):
        request = self.context.get("request")
        if request and request.user.is_authenticated:
            return SavedPostNew.objects.filter(post=obj, user=request.user).exists()
        return False
