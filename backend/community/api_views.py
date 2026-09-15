from django.shortcuts import get_object_or_404
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, permissions, generics
from rest_framework.pagination import PageNumberPagination

from .models import (
    Blog,
    Skill,
    Activity,
    ProjectCategory,
    Project,
    DSAActivity,
)
from .serializers import (
    BlogListSerializer,
    BlogDetailSerializer,
    ProjectSerializer,
    ProjectCategorySerializer,
    SkillSerializer,
    ActivitySerializer,
    DSAActivitySerializer,
)


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 9
    page_size_query_param = "page_size"
    max_page_size = 50


class BlogListAPIView(generics.ListAPIView):
    """
    List published blogs with optional search and author filtering.
    """
    serializer_class = BlogListSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Blog.objects.filter(status="published").select_related("author", "author__profile").order_by("-published_at", "-created_at")
        
        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(excerpt__icontains=search) |
                Q(content__icontains=search)
            )

        author_username = self.request.query_params.get("author")
        if author_username:
            queryset = queryset.filter(author__username__iexact=author_username)

        return queryset


class BlogDetailAPIView(APIView):
    """
    Retrieve single blog post by slug.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, slug):
        if request.user.is_authenticated and request.user.is_staff:
            blog = get_object_or_404(Blog.objects.select_related("author", "author__profile"), slug=slug)
        else:
            blog = get_object_or_404(
                Blog.objects.select_related("author", "author__profile"),
                slug=slug,
                status="published",
            )
        serializer = BlogDetailSerializer(blog, context={"request": request})
        return Response({
            "status": "success",
            "blog": serializer.data,
        })


class ProjectListAPIView(generics.ListAPIView):
    """
    List community projects with optional category and search filtering.
    """
    serializer_class = ProjectSerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Project.objects.select_related("category", "leader", "leader__profile").prefetch_related("skills", "members", "images").order_by("-created_at")
        
        category = self.request.query_params.get("category")
        if category and category != "all":
            queryset = queryset.filter(category__name__iexact=category)

        search = self.request.query_params.get("search")
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search)
            )

        member_username = self.request.query_params.get("member")
        if member_username:
            queryset = queryset.filter(
                Q(leader__username__iexact=member_username) |
                Q(members__username__iexact=member_username)
            ).distinct()

        return queryset


class ProjectDetailAPIView(APIView):
    """
    Retrieve a specific project by id.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        project = get_object_or_404(
            Project.objects.select_related("category", "leader", "leader__profile").prefetch_related("skills", "members", "images"),
            pk=pk,
        )
        serializer = ProjectSerializer(project, context={"request": request})
        return Response({
            "status": "success",
            "project": serializer.data,
        })


class ActivityListAPIView(generics.ListAPIView):
    """
    List community activities/events.
    """
    serializer_class = ActivitySerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = Activity.objects.prefetch_related("images").order_by("-date", "-created_at")
        occurrence = self.request.query_params.get("occurrence")
        if occurrence and occurrence != "all":
            queryset = queryset.filter(occurrence=occurrence)
        return queryset


class ActivityDetailAPIView(APIView):
    """
    Retrieve a specific activity by id.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request, pk):
        activity = get_object_or_404(Activity.objects.prefetch_related("images"), pk=pk)
        serializer = ActivitySerializer(activity, context={"request": request})
        return Response({
            "status": "success",
            "activity": serializer.data,
        })


class ProjectCategoryListAPIView(APIView):
    """
    List all project categories.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        categories = ProjectCategory.objects.all().order_by("name")
        serializer = ProjectCategorySerializer(categories, many=True)
        return Response({
            "status": "success",
            "categories": serializer.data,
        })


class SkillListAPIView(APIView):
    """
    List all skills.
    """
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        skills = Skill.objects.all().order_by("name")
        serializer = SkillSerializer(skills, many=True, context={"request": request})
        return Response({
            "status": "success",
            "skills": serializer.data,
        })


class DSAActivityListAPIView(generics.ListAPIView):
    """
    List DSA activities.
    """
    serializer_class = DSAActivitySerializer
    pagination_class = StandardResultsSetPagination
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        queryset = DSAActivity.objects.select_related("user", "user__profile").order_by("-date_solved")
        username = self.request.query_params.get("user")
        if username:
            queryset = queryset.filter(user__username__iexact=username)
        difficulty = self.request.query_params.get("difficulty")
        if difficulty:
            queryset = queryset.filter(difficulty=difficulty)
        return queryset
