from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from .models import Contact, Newsletter, FAQ, SiteConfig, Mission, Achievement


class RiseAppAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.faq = FAQ.objects.create(
            question="What is RiseTogether?",
            answer="A collaborative developer community platform.",
        )
        self.config = SiteConfig.objects.create(
            members_count=100,
            sessions_count=50,
            projects_count=20,
        )
        self.mission = Mission.objects.create(
            site_config=self.config,
            icon="fa fa-rocket",
            title="Empower Developers",
            description="Helping developers grow together.",
        )

    def test_contact_submission_success(self):
        data = {
            "name": "Jane Doe",
            "email": "jane@example.com",
            "message": "Hello, I would like to know more about the community.",
        }
        response = self.client.post(reverse("api_riseapp:contact"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Contact.objects.filter(email="jane@example.com").exists())

    def test_contact_submission_invalid(self):
        data = {
            "name": "",
            "email": "invalid-email",
            "message": "short",
        }
        response = self.client.post(reverse("api_riseapp:contact"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_newsletter_subscription_success(self):
        data = {"email": "subscriber@example.com"}
        response = self.client.post(reverse("api_riseapp:newsletter_subscribe"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(Newsletter.objects.filter(email="subscriber@example.com").exists())

    def test_newsletter_duplicate(self):
        Newsletter.objects.create(email="existing@example.com")
        data = {"email": "existing@example.com"}
        response = self.client.post(reverse("api_riseapp:newsletter_subscribe"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_site_content_endpoint(self):
        response = self.client.get(reverse("api_riseapp:site_content"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("stats", response.data)
        self.assertIn("faqs", response.data)
        self.assertIn("testimonials", response.data)
        self.assertEqual(len(response.data["faqs"]), 1)
