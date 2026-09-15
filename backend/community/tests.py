from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from .models import Blog, Project, ProjectCategory, Activity, Skill, DSAActivity

User = get_user_model()


class CommunityAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="author",
            email="author@example.com",
            password="StrongPassword123!",
        )
        self.category = ProjectCategory.objects.create(name="Web Development")
        self.skill = Skill.objects.create(name="Python", icon_type="icon", icon_class="fa-brands fa-python")

        self.published_blog = Blog.objects.create(
            title="Introduction to React",
            slug="introduction-to-react",
            excerpt="A great guide to React",
            content="<p>React is awesome</p>",
            status="published",
            author=self.user,
        )

        self.draft_blog = Blog.objects.create(
            title="Draft Blog",
            slug="draft-blog",
            content="<p>Draft content</p>",
            status="draft",
            author=self.user,
        )

        self.project = Project.objects.create(
            title="RiseTogether Web Platform",
            category=self.category,
            description="Open-source community platform",
            details="<p>Details about the platform</p>",
            leader=self.user,
            project_type="team",
            github_link="https://github.com/logicbyroshan/risetogether",
        )
        self.project.skills.add(self.skill)

        self.activity = Activity.objects.create(
            title="Weekly DSA Problem Solving",
            description="Join us every Saturday to solve LeetCode problems",
            occurrence="weekly",
        )

    def test_blog_list_returns_published_only(self):
        response = self.client.get(reverse("api_community:blog_list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Should contain published blog, not draft
        results = response.data["results"]
        slugs = [b["slug"] for b in results]
        self.assertIn("introduction-to-react", slugs)
        self.assertNotIn("draft-blog", slugs)

    def test_blog_detail_published(self):
        response = self.client.get(reverse("api_community:blog_detail", kwargs={"slug": "introduction-to-react"}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["blog"]["title"], "Introduction to React")

    def test_blog_detail_draft_hidden(self):
        response = self.client.get(reverse("api_community:blog_detail", kwargs={"slug": "draft-blog"}))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_project_list(self):
        response = self.client.get(reverse("api_community:project_list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["title"], "RiseTogether Web Platform")

    def test_project_detail(self):
        response = self.client.get(reverse("api_community:project_detail", kwargs={"pk": self.project.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["project"]["title"], "RiseTogether Web Platform")

    def test_activity_list(self):
        response = self.client.get(reverse("api_community:activity_list"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["title"], "Weekly DSA Problem Solving")

    def test_categories_and_skills_endpoints(self):
        cat_resp = self.client.get(reverse("api_community:category_list"))
        self.assertEqual(cat_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(cat_resp.data["categories"]), 1)

        skill_resp = self.client.get(reverse("api_community:skill_list"))
        self.assertEqual(skill_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(skill_resp.data["skills"]), 1)
