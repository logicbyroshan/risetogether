from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


class AccountsAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="StrongPassword123!",
            role="member",
        )

    def test_csrf_token_endpoint(self):
        response = self.client.get(reverse("api_accounts:csrf"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("csrfToken", response.data)

    def test_user_registration_success(self):
        data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "SecurePassword123!",
            "password2": "SecurePassword123!",
            "role": "member",
        }
        response = self.client.post(reverse("api_accounts:register"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["status"], "success")
        self.assertTrue(User.objects.filter(email="newuser@example.com").exists())

    def test_user_registration_duplicate_email(self):
        data = {
            "username": "duplicateuser",
            "email": "test@example.com",
            "password": "SecurePassword123!",
            "password2": "SecurePassword123!",
            "role": "member",
        }
        response = self.client.post(reverse("api_accounts:register"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_user_login_success(self):
        data = {
            "email": "test@example.com",
            "password": "StrongPassword123!",
        }
        response = self.client.post(reverse("api_accounts:login"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["status"], "success")
        self.assertEqual(response.data["user"]["email"], "test@example.com")

    def test_user_login_invalid_credentials(self):
        data = {
            "email": "test@example.com",
            "password": "WrongPassword",
        }
        response = self.client.post(reverse("api_accounts:login"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_current_user_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse("api_accounts:current_user"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["isAuthenticated"])
        self.assertEqual(response.data["user"]["username"], "testuser")

    def test_current_user_unauthenticated(self):
        response = self.client.get(reverse("api_accounts:current_user"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["isAuthenticated"])

    def test_get_user_profile(self):
        response = self.client.get(reverse("api_accounts:user_profile", kwargs={"username": "testuser"}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["user"]["username"], "testuser")

    def test_update_profile(self):
        self.client.force_authenticate(user=self.user)
        data = {
            "bio": "Updated bio text for test user.",
            "first_name": "Test",
            "last_name": "User",
            "links": [{"title": "GitHub", "url": "https://github.com/testuser"}],
        }
        response = self.client.patch(reverse("api_accounts:edit_profile"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.user.refresh_from_db()
        self.assertEqual(self.user.profile.bio, "Updated bio text for test user.")
        self.assertEqual(self.user.first_name, "Test")
        self.assertEqual(self.user.profile.links.count(), 1)

    def test_leaderboard_endpoint(self):
        response = self.client.get(reverse("api_accounts:leaderboard"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("leaderboard", response.data)
