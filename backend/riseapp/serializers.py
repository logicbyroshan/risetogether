from rest_framework import serializers
from .models import (
    Contact,
    Newsletter,
    FAQ,
    Testimonial,
    SiteConfig,
    Mission,
    Achievement,
)
from accounts.serializers import UserSummarySerializer


class ContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = ["id", "name", "email", "message", "created_at"]
        read_only_fields = ["id", "created_at"]

    def validate_name(self, value):
        if not value or len(value.strip()) < 2:
            raise serializers.ValidationError("Please provide your name (at least 2 characters).")
        return value.strip()

    def validate_message(self, value):
        if not value or len(value.strip()) < 10:
            raise serializers.ValidationError("Please provide a message of at least 10 characters.")
        return value.strip()


class NewsletterSerializer(serializers.ModelSerializer):
    class Meta:
        model = Newsletter
        fields = ["id", "email", "subscribed_at"]
        read_only_fields = ["id", "subscribed_at"]

    def validate_email(self, value):
        email = value.strip().lower()
        if Newsletter.objects.filter(email__iexact=email).exists():
            raise serializers.ValidationError("This email is already subscribed to our newsletter.")
        return email


class FAQSerializer(serializers.ModelSerializer):
    class Meta:
        model = FAQ
        fields = ["id", "question", "answer"]


class TestimonialSerializer(serializers.ModelSerializer):
    user = UserSummarySerializer(read_only=True)

    class Meta:
        model = Testimonial
        fields = ["id", "user", "name", "stars", "message", "created_at"]


class MissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mission
        fields = ["id", "icon", "title", "description"]


class AchievementSerializer(serializers.ModelSerializer):
    icon_image = serializers.SerializerMethodField()

    class Meta:
        model = Achievement
        fields = [
            "id",
            "title",
            "awarded_by",
            "description",
            "date",
            "key_highlight",
            "icon_type",
            "icon_class",
            "icon_image",
        ]

    def get_icon_image(self, obj):
        if obj.icon_image:
            request = self.context.get("request")
            if request:
                return request.build_absolute_uri(obj.icon_image.url)
            return obj.icon_image.url
        return None


class SiteConfigSerializer(serializers.ModelSerializer):
    missions = MissionSerializer(many=True, read_only=True)

    class Meta:
        model = SiteConfig
        fields = ["id", "about_us", "members_count", "sessions_count", "projects_count", "missions"]
