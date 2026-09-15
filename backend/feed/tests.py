from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APIClient
from rest_framework import status

from .models import FeedPost, PostComment, PostLikeNew, SavedPostNew

User = get_user_model()


class FeedAPITests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="feeduser",
            email="feeduser@example.com",
            password="StrongPassword123!",
        )
        self.other_user = User.objects.create_user(
            username="otheruser",
            email="otheruser@example.com",
            password="StrongPassword123!",
        )
        self.post = FeedPost.objects.create(
            author=self.user,
            post_type="normal",
            normal_content="Hello world from RiseTogether feed!",
        )

    def test_get_posts_list(self):
        response = self.client.get(reverse("api_feed:post_list_create"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["results"]), 1)
        self.assertEqual(response.data["results"][0]["normal_content"], "Hello world from RiseTogether feed!")

    def test_create_normal_post_authenticated(self):
        self.client.force_authenticate(user=self.user)
        data = {
            "post_type": "normal",
            "normal_content": "A brand new exciting post!",
        }
        response = self.client.post(reverse("api_feed:post_list_create"), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data["post"]["normal_content"], "A brand new exciting post!")

    def test_create_post_unauthenticated(self):
        data = {
            "post_type": "normal",
            "normal_content": "Unauthenticated post attempt",
        }
        response = self.client.post(reverse("api_feed:post_list_create"), data, format="json")
        self.assertIn(response.status_code, [status.HTTP_401_UNAUTHORIZED, status.HTTP_403_FORBIDDEN])

    def test_toggle_like_post(self):
        self.client.force_authenticate(user=self.other_user)
        # Like
        response = self.client.post(reverse("api_feed:post_like", kwargs={"pk": self.post.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["liked"])
        self.assertEqual(response.data["likesCount"], 1)

        # Unlike
        response = self.client.post(reverse("api_feed:post_like", kwargs={"pk": self.post.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["liked"])
        self.assertEqual(response.data["likesCount"], 0)

    def test_toggle_save_post(self):
        self.client.force_authenticate(user=self.user)
        # Save
        response = self.client.post(reverse("api_feed:post_save", kwargs={"pk": self.post.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertTrue(response.data["saved"])

        # Check saved list
        saved_resp = self.client.get(reverse("api_feed:saved_posts"))
        self.assertEqual(saved_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(saved_resp.data["results"]), 1)

        # Unsave
        response = self.client.post(reverse("api_feed:post_save", kwargs={"pk": self.post.pk}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertFalse(response.data["saved"])

    def test_comments_and_replies(self):
        self.client.force_authenticate(user=self.other_user)
        # Create comment
        data = {"content": "Great first post!"}
        response = self.client.post(reverse("api_feed:post_comments", kwargs={"pk": self.post.pk}), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        comment_id = response.data["comment"]["id"]

        # Create reply
        reply_data = {"content": "Thank you for the feedback!", "parent_id": comment_id}
        self.client.force_authenticate(user=self.user)
        reply_resp = self.client.post(reverse("api_feed:post_comments", kwargs={"pk": self.post.pk}), reply_data, format="json")
        self.assertEqual(reply_resp.status_code, status.HTTP_201_CREATED)

        # Fetch comments
        get_resp = self.client.get(reverse("api_feed:post_comments", kwargs={"pk": self.post.pk}))
        self.assertEqual(get_resp.status_code, status.HTTP_200_OK)
        self.assertEqual(len(get_resp.data["comments"]), 1)
        self.assertEqual(len(get_resp.data["comments"][0]["replies"]), 1)
