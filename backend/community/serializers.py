from rest_framework import serializers
from .models import (
    Blog,
    Skill,
    Activity,
    ActivityImage,
    ProjectCategory,
    Project,
    ProjectImage,
    DSAActivity,
    Leaderboard,
)
from accounts.serializers import UserSummarySerializer


class SkillSerializer(serializers.ModelSerializer):
    icon_image = serializers.SerializerMethodField()

    class Meta:
        model = Skill
        fields = ["id", "name", "icon_type", "icon_class", "icon_image"]

    def get_icon_image(self, obj):
        if obj.icon_image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.icon_image.url)
            return obj.icon_image.url
        return None


class BlogListSerializer(serializers.ModelSerializer):
    author = UserSummarySerializer(read_only=True)
    thumbnail = serializers.SerializerMethodField()
    read_time = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = [
            "id",
            "title",
            "slug",
            "excerpt",
            "thumbnail",
            "status",
            "published_at",
            "created_at",
            "author",
            "read_time",
        ]

    def get_thumbnail(self, obj):
        if obj.thumbnail:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None

    def get_read_time(self, obj):
        # Estimate: ~200 words per minute
        word_count = len((obj.content or "").split())
        minutes = max(1, round(word_count / 200))
        return f"{minutes} min read"


class BlogDetailSerializer(serializers.ModelSerializer):
    author = UserSummarySerializer(read_only=True)
    thumbnail = serializers.SerializerMethodField()
    read_time = serializers.SerializerMethodField()

    class Meta:
        model = Blog
        fields = [
            "id",
            "title",
            "slug",
            "excerpt",
            "content",
            "thumbnail",
            "status",
            "published_at",
            "created_at",
            "updated_at",
            "author",
            "read_time",
        ]

    def get_thumbnail(self, obj):
        if obj.thumbnail:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None

    def get_read_time(self, obj):
        word_count = len((obj.content or "").split())
        minutes = max(1, round(word_count / 200))
        return f"{minutes} min read"


class ActivityImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ActivityImage
        fields = ["id", "image"]

    def get_image(self, obj):
        if obj.image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class ActivitySerializer(serializers.ModelSerializer):
    thumbnail = serializers.SerializerMethodField()
    images = ActivityImageSerializer(many=True, read_only=True)
    occurrence_display = serializers.CharField(source="get_occurrence_display", read_only=True)

    class Meta:
        model = Activity
        fields = [
            "id",
            "title",
            "thumbnail",
            "description",
            "detailed_description",
            "occurrence",
            "occurrence_display",
            "date",
            "created_at",
            "images",
        ]

    def get_thumbnail(self, obj):
        if obj.thumbnail:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None


class ProjectCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectCategory
        fields = ["id", "name"]


class ProjectImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()

    class Meta:
        model = ProjectImage
        fields = ["id", "image"]

    def get_image(self, obj):
        if obj.image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None


class ProjectSerializer(serializers.ModelSerializer):
    category = ProjectCategorySerializer(read_only=True)
    skills = SkillSerializer(many=True, read_only=True)
    leader = UserSummarySerializer(read_only=True)
    members = UserSummarySerializer(many=True, read_only=True)
    images = ProjectImageSerializer(many=True, read_only=True)
    thumbnail = serializers.SerializerMethodField()
    project_type_display = serializers.CharField(source="get_project_type_display", read_only=True)

    class Meta:
        model = Project
        fields = [
            "id",
            "title",
            "category",
            "thumbnail",
            "description",
            "details",
            "skills",
            "project_type",
            "project_type_display",
            "leader",
            "members",
            "special_highlight",
            "github_link",
            "live_link",
            "created_at",
            "images",
        ]

    def get_thumbnail(self, obj):
        if obj.thumbnail:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.thumbnail.url)
            return obj.thumbnail.url
        return None


class DSAActivitySerializer(serializers.ModelSerializer):
    user = UserSummarySerializer(read_only=True)
    difficulty_display = serializers.CharField(source="get_difficulty_display", read_only=True)

    class Meta:
        model = DSAActivity
        fields = [
            "id",
            "user",
            "problem_title",
            "difficulty",
            "difficulty_display",
            "complexity",
            "points_earned",
            "time_spent_minutes",
            "date_solved",
        ]
