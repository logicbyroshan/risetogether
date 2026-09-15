from django.urls import path
from . import views

app_name = "community"

urlpatterns = [
    path("blogs/", views.blogs_list, name="blogs_list"),
    path("blogs/<slug:slug>/", views.blog_detail, name="blog_detail"),
    path("projects/", views.projects_list, name="projects_list"),
    path("activities/", views.activities_list, name="activities_list"),
    path("resources/", views.resources_list, name="resources_list"),
]
