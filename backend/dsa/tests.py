# backend/dsa/tests.py

from django.test import TestCase
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from datetime import date, timedelta
from .models import Leaderboard, CodingProblemPost
from .services import (
    calculate_points_for_post,
    handle_post_update,
    handle_post_delete,
    detect_language,
    get_user_ranks_and_leaderboard,
)

User = get_user_model()


class DSAServiceTests(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username="coder1", email="coder1@example.com", password="password123"
        )
        self.user2 = User.objects.create_user(
            username="coder2", email="coder2@example.com", password="password123"
        )

    def test_detect_language(self):
        self.assertEqual(detect_language("#include <iostream>\nint main() {}"), "CPP")
        self.assertEqual(detect_language("public class Solution { public static void main() {} }"), "JAVA")
        self.assertEqual(detect_language("interface ProblemProps { title: string; }"), "TYPESCRIPT")
        self.assertEqual(detect_language("const twoSum = function(nums) {};"), "JAVASCRIPT")
        self.assertEqual(detect_language("def solve(nums):\n    return []"), "PYTHON")

    def test_points_calculation_new_post(self):
        post = CodingProblemPost.objects.create(
            author=self.user1,
            title="Two Sum",
            code_snippet="def two_sum(): pass",
            language="PYTHON",
            difficulty="MEDIUM",
            time_complexity="O(n)",
        )
        points = calculate_points_for_post(self.user1, post, is_new_post=True)
        # Medium (5) + O(n) (5) + Daily activity bonus (2) = 12 points
        self.assertEqual(points, 12)
        self.assertEqual(post.points_earned, 12)

        lb = Leaderboard.objects.get(user=self.user1)
        self.assertEqual(lb.total_points, 12)
        self.assertEqual(lb.consecutive_post_days, 1)

    def test_points_update_and_delete(self):
        post = CodingProblemPost.objects.create(
            author=self.user1,
            title="Two Sum",
            code_snippet="def two_sum(): pass",
            language="PYTHON",
            difficulty="EASY",
            time_complexity="O(n^2)",
        )
        # Easy (2) + O(n^2) (7) + Daily (2) = 11 points
        calculate_points_for_post(self.user1, post, is_new_post=True)
        lb = Leaderboard.objects.get(user=self.user1)
        self.assertEqual(lb.total_points, 11)

        # Update difficulty to HARD and complexity to O(1)
        post.difficulty = "HARD"
        post.time_complexity = "O(1)"
        post.save()
        # Hard (10) + O(1) (10) = 20 points (diff = 20 - 11 = +9)
        handle_post_update(self.user1, post)
        lb.refresh_from_db()
        self.assertEqual(post.points_earned, 20)
        self.assertEqual(lb.total_points, 20)  # 11 + 9 = 20

        # Delete post
        handle_post_delete(self.user1, post)
        lb.refresh_from_db()
        self.assertEqual(lb.total_points, 0)  # 20 - 20 = 0


class DSAAPITests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="alex", email="alex@example.com", password="password123"
        )
        self.client.force_authenticate(user=self.user)

    def test_create_coding_post_and_rate_limit(self):
        url = reverse("dsa:coding-post-list")
        payload = {
            "title": "Reverse Linked List",
            "code_snippet": "def reverseList(head):\n    prev = None\n    return prev",
            "difficulty": "EASY",
            "time_complexity": "O(n)",
        }

        # 1st post
        res1 = self.client.post(url, payload)
        self.assertEqual(res1.status_code, status.HTTP_201_CREATED)
        self.assertEqual(res1.data["points_earned"], 9)  # Easy(2) + O(n)(5) + Daily(2)

        # 2nd post
        res2 = self.client.post(url, payload)
        self.assertEqual(res2.status_code, status.HTTP_201_CREATED)

        # 3rd post
        res3 = self.client.post(url, payload)
        self.assertEqual(res3.status_code, status.HTTP_201_CREATED)

        # 4th post should hit daily rate limit
        res4 = self.client.post(url, payload)
        self.assertEqual(res4.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("limit", res4.data["detail"])

    def test_leaderboard_endpoint(self):
        url = reverse("dsa:leaderboard")
        res = self.client.get(url, {"timeframe": "overall"})
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("top_users", res.data)
        self.assertIn("other_users", res.data)
        self.assertIn("current_user_rank", res.data)

    def test_user_stats_endpoint(self):
        url = reverse("dsa:user-stats")
        res = self.client.get(url)
        self.assertEqual(res.status_code, status.HTTP_200_OK)
        self.assertIn("daily_rank", res.data)
        self.assertIn("total_points", res.data)
        self.assertIn("daily_limit", res.data)
