from typing import Optional
from django.db.models import QuerySet, Q
from .models import Blog, Project, Activity, DSAActivity, ProjectCategory, Skill


def get_published_blogs_queryset(search: Optional[str] = None, author_username: Optional[str] = None) -> QuerySet[Blog]:
    """
    Query published blogs with author data and optional search.
    """
    queryset = Blog.objects.filter(status="published").select_related("author", "author__profile").order_by("-published_at", "-created_at")
    
    if search:
        queryset = queryset.filter(
            Q(title__icontains=search) |
            Q(excerpt__icontains=search) |
            Q(content__icontains=search)
        )

    if author_username:
        queryset = queryset.filter(author__username__iexact=author_username)

    return queryset


def get_projects_queryset(category: Optional[str] = None, search: Optional[str] = None, member_username: Optional[str] = None) -> QuerySet[Project]:
    """
    Query projects with eager loaded skills, members, images, and leader profile.
    """
    queryset = Project.objects.select_related("category", "leader", "leader__profile").prefetch_related("skills", "members", "images").order_by("-created_at")
    
    if category and category != "all":
        queryset = queryset.filter(category__name__iexact=category)

    if search:
        queryset = queryset.filter(
            Q(title__icontains=search) |
            Q(description__icontains=search)
        )

    if member_username:
        queryset = queryset.filter(
            Q(leader__username__iexact=member_username) |
            Q(members__username__iexact=member_username)
        ).distinct()

    return queryset


def get_activities_queryset(occurrence: Optional[str] = None) -> QuerySet[Activity]:
    """
    Query community activities with images.
    """
    queryset = Activity.objects.prefetch_related("images").order_by("-date", "-created_at")
    if occurrence and occurrence != "all":
        queryset = queryset.filter(occurrence=occurrence)
    return queryset
