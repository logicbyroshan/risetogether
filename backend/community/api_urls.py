from django.urls import path
from .api_views import (
    BlogListAPIView,
    BlogDetailAPIView,
    ProjectListAPIView,
    ProjectDetailAPIView,
    ActivityListAPIView,
    ActivityDetailAPIView,
    ProjectCategoryListAPIView,
    SkillListAPIView,
    DSAActivityListAPIView,
)

app_name = "community_api"

urlpatterns = [
    path("community/blogs/", BlogListAPIView.as_view(), name="blog_list"),
    path("community/blogs/<slug:slug>/", BlogDetailAPIView.as_view(), name="blog_detail"),
    path("community/projects/", ProjectListAPIView.as_view(), name="project_list"),
    path("community/projects/<int:pk>/", ProjectDetailAPIView.as_view(), name="project_detail"),
    path("community/categories/", ProjectCategoryListAPIView.as_view(), name="category_list"),
    path("community/skills/", SkillListAPIView.as_view(), name="skill_list"),
    path("community/activities/", ActivityListAPIView.as_view(), name="activity_list"),
    path("community/activities/<int:pk>/", ActivityDetailAPIView.as_view(), name="activity_detail"),
    path("community/dsa/", DSAActivityListAPIView.as_view(), name="dsa_list"),
]
