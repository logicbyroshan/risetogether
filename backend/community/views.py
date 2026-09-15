from django.shortcuts import render, get_object_or_404
from django.core.paginator import Paginator
from .models import Blog, Project, Activity, DSAActivity

# Create your views here.


def blogs_list(request):
    """Display all published blogs"""
    blogs = Blog.objects.filter(status="published").order_by(
        "-published_at", "-created_at"
    )

    context = {"blogs": blogs, "TITLE": "Articles & Blogs"}
    return render(request, "Pages/blogs.html", context)


def blog_detail(request, slug):
    """Display individual blog detail"""
    blog = get_object_or_404(Blog, slug=slug, status="published")

    context = {"blog": blog, "TITLE": blog.title}
    return render(request, "Pages/blog-detail.html", context)


def projects_list(request):
    """Display all projects"""
    projects = Project.objects.all().order_by("-created_at")

    context = {"projects": projects, "TITLE": "Projects"}
    return render(request, "Pages/projects.html", context)


def activities_list(request):
    """Display all activities"""
    activities = Activity.objects.all().order_by("-date", "-created_at")

    context = {"activities": activities, "TITLE": "Activities"}
    return render(request, "Pages/activities.html", context)


def resources_list(request):
    """Display resources page"""
    context = {"TITLE": "Resources"}
    return render(request, "Pages/resources.html", context)
