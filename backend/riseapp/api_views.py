from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions
from django.contrib.auth import get_user_model

from .models import (
    Contact,
    Newsletter,
    FAQ,
    Testimonial,
    SiteConfig,
    Achievement,
    Mission,
)
from .serializers import (
    ContactSerializer,
    NewsletterSerializer,
    FAQSerializer,
    TestimonialSerializer,
    AchievementSerializer,
    MissionSerializer,
    SiteConfigSerializer,
)
from community.models import Blog, Project, Activity

User = get_user_model()


class ContactAPIView(APIView):
    """
    Handle public contact form submissions.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = ContactSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "status": "success",
                    "message": "Thank you for reaching out! We've received your message and will get back to you shortly.",
                    "contact": serializer.data,
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {
                "status": "error",
                "message": "Please fix the errors below and try again.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class NewsletterSubscribeAPIView(APIView):
    """
    Handle newsletter subscription.
    """
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = NewsletterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "status": "success",
                    "message": "You're all set! Thank you for subscribing to the Rise Together newsletter.",
                },
                status=status.HTTP_201_CREATED,
            )
        return Response(
            {
                "status": "error",
                "message": "Subscription failed.",
                "errors": serializer.errors,
            },
            status=status.HTTP_400_BAD_REQUEST,
        )


class SiteContentAPIView(APIView):
    """
    Aggregate public site content (FAQs, testimonials, achievements, missions, live platform counts).
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        site_config = SiteConfig.objects.prefetch_related("missions").first()
        site_config_data = SiteConfigSerializer(site_config).data if site_config else None

        faqs = FAQ.objects.all()
        testimonials = Testimonial.objects.select_related("user", "user__profile").all().order_by("-created_at")[:10]
        achievements = Achievement.objects.all().order_by("-date")

        # Live dynamic stats calculation
        members_count = User.objects.filter(is_active=True).count()
        projects_count = Project.objects.count()
        blogs_count = Blog.objects.filter(status="published").count()
        activities_count = Activity.objects.count()

        # Fallbacks for marketing counters if database is fresh
        display_members = max(members_count, 500)
        display_projects = max(projects_count, 50)
        display_sessions = 120

        return Response({
            "status": "success",
            "siteConfig": site_config_data,
            "stats": {
                "membersCount": display_members,
                "projectsCount": display_projects,
                "sessionsCount": display_sessions,
                "blogsCount": blogs_count,
                "activitiesCount": activities_count,
            },
            "faqs": FAQSerializer(faqs, many=True).data,
            "testimonials": TestimonialSerializer(testimonials, many=True, context={"request": request}).data,
            "achievements": AchievementSerializer(achievements, many=True, context={"request": request}).data,
        })
