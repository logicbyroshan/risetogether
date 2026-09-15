from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from .models import Profile, ProfileLink, VisitorPreference
from community.models import Leaderboard

User = get_user_model()


class ProfileLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProfileLink
        fields = ["id", "title", "url"]


class VisitorPreferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisitorPreference
        fields = ["id", "notifications_enabled"]


class ProfileSerializer(serializers.ModelSerializer):
    links = ProfileLinkSerializer(many=True, read_only=True)
    blogs_count = serializers.IntegerField(read_only=True)
    projects_count = serializers.IntegerField(read_only=True)
    profile_pic = serializers.SerializerMethodField()

    class Meta:
        model = Profile
        fields = [
            "id",
            "profile_pic",
            "bio",
            "posts_shared_count",
            "activity_score",
            "blogs_count",
            "projects_count",
            "links",
        ]
        read_only_fields = ["activity_score", "posts_shared_count", "blogs_count", "projects_count"]

    def get_profile_pic(self, obj):
        if obj.profile_pic:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.profile_pic.url)
            return obj.profile_pic.url
        return None


class UserSummarySerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source="get_role_display", read_only=True)
    profile_pic = serializers.SerializerMethodField()
    activity_score = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "role",
            "role_display",
            "profile_pic",
            "activity_score",
            "date_joined",
        ]

    def get_profile_pic(self, obj):
        if hasattr(obj, "profile") and obj.profile.profile_pic:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.profile.profile_pic.url)
            return obj.profile.profile_pic.url
        return None

    def get_activity_score(self, obj):
        if hasattr(obj, "profile"):
            return obj.profile.activity_score
        return 0


class UserDetailSerializer(serializers.ModelSerializer):
    role_display = serializers.CharField(source="get_role_display", read_only=True)
    profile = ProfileSerializer(read_only=True)
    preferences = VisitorPreferenceSerializer(read_only=True)

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "email",
            "first_name",
            "last_name",
            "role",
            "role_display",
            "is_staff",
            "profile",
            "preferences",
            "date_joined",
        ]
        read_only_fields = ["id", "role_display", "is_staff", "date_joined"]


class UserRegistrationSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150, required=False, allow_blank=True)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, min_length=8)
    role = serializers.ChoiceField(choices=User.ROLE_CHOICES, default="visitor")

    def validate_email(self, value):
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value.lower()

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password2": "Passwords do not match."})
        validate_password(attrs["password"])
        return attrs

    def create(self, validated_data):
        email = validated_data["email"]
        password = validated_data["password"]
        role = validated_data.get("role", "visitor")
        username = validated_data.get("username")

        if not username:
            # Generate username from email prefix
            base_username = email.split("@")[0]
            username = base_username
            counter = 1
            while User.objects.filter(username=username).exists():
                username = f"{base_username}_{counter}"
                counter += 1

        user = User.objects.create_user(
            username=username,
            email=email,
            password=password,
            role=role,
        )
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)


class ProfileUpdateSerializer(serializers.Serializer):
    first_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    last_name = serializers.CharField(max_length=150, required=False, allow_blank=True)
    bio = serializers.CharField(required=False, allow_blank=True)
    profile_pic = serializers.ImageField(required=False, allow_null=True)
    links = serializers.ListField(
        child=serializers.DictField(),
        required=False,
        allow_empty=True,
    )


class PasswordResetRequestSerializer(serializers.Serializer):
    email = serializers.EmailField()


class PasswordResetConfirmSerializer(serializers.Serializer):
    uid = serializers.CharField()
    token = serializers.CharField()
    password = serializers.CharField(min_length=8, write_only=True)
    password2 = serializers.CharField(min_length=8, write_only=True)

    def validate(self, attrs):
        if attrs["password"] != attrs["password2"]:
            raise serializers.ValidationError({"password2": "Passwords do not match."})
        validate_password(attrs["password"])
        return attrs


class LeaderboardEntrySerializer(serializers.ModelSerializer):
    user = UserSummarySerializer(read_only=True)

    class Meta:
        model = Leaderboard
        fields = ["id", "user", "period", "points", "rank", "last_updated"]
