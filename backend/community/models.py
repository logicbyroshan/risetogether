from django.db import models
from tinymce.models import HTMLField
from django.utils import timezone
from django.conf import settings  # use settings.AUTH_USER_MODEL

# ------------------ DSA ACTIVITY ------------------
class DSAActivity(models.Model):
    DIFFICULTY_CHOICES = (
        ('easy', 'Easy'),
        ('medium', 'Medium'),
        ('hard', 'Hard'),
    )

    COMPLEXITY_CHOICES = (
        ('O(1)', 'Constant'),
        ('O(log n)', 'Logarithmic'),
        ('O(n)', 'Linear'),
        ('O(n log n)', 'Linearithmic'),
        ('O(n^2)', 'Quadratic'),
        ('O(n^3)', 'Cubic'),
        ('O(2^n)', 'Exponential'),
        ('O(n!)', 'Factorial'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="dsa_activities", on_delete=models.CASCADE)
    problem_title = models.CharField(max_length=255)
    difficulty = models.CharField(max_length=10, choices=DIFFICULTY_CHOICES)
    complexity = models.CharField(max_length=20, choices=COMPLEXITY_CHOICES, blank=True, null=True)
    points_earned = models.PositiveIntegerField(default=0)
    time_spent_minutes = models.PositiveIntegerField(default=0, help_text="Time spent solving problem")
    date_solved = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.problem_title} - {self.user.username}"


# ------------------ LEADERBOARD ------------------
class Leaderboard(models.Model):
    PERIOD_CHOICES = (
        ('daily', 'Daily'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
        ('all_time', 'All Time'),
    )

    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="leaderboard_entries", on_delete=models.CASCADE)
    period = models.CharField(max_length=20, choices=PERIOD_CHOICES, default='monthly')
    points = models.PositiveIntegerField(default=0)
    rank = models.PositiveIntegerField(default=0)
    last_updated = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'period')
        ordering = ['-points', 'rank']

    def __str__(self):
        return f"{self.user.username} - {self.period} - {self.points} pts"


# ------------------ BLOG ------------------
class Blog(models.Model):
    STATUS_CHOICES = (
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('archived', 'Archived'),
        ('scheduled', 'Scheduled'),
    )

    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True, max_length=255)
    excerpt = models.TextField(blank=True, null=True)
    content = HTMLField()
    thumbnail = models.ImageField(upload_to="blog_thumbnails/", blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='draft')
    published_at = models.DateTimeField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name="blogs")

    def __str__(self):
        return self.title


# ------------------ SKILLS ------------------
class Skill(models.Model):
    ICON_TYPE = (
        ('icon', 'Icon (CSS Class)'),
        ('image', 'Image (Upload)'),
    )

    name = models.CharField(max_length=100, unique=True)
    icon_type = models.CharField(max_length=10, choices=ICON_TYPE, default='icon')
    icon_class = models.CharField(max_length=100, blank=True, null=True, help_text="CSS class e.g. fa-brands fa-html5")
    icon_image = models.ImageField(upload_to="skill_icons/", blank=True, null=True, help_text="Upload PNG/SVG if not using an icon class")

    def __str__(self):
        return self.name


# ------------------ ACTIVITY ------------------
class Activity(models.Model):
    OCCURRENCE_TYPE = (
        ('once', 'One-time'),
        ('weekly', 'Weekly'),
        ('monthly', 'Monthly'),
    )

    title = models.CharField(max_length=255)
    thumbnail = models.ImageField(upload_to="activity_thumbnails/")
    description = models.TextField()
    detailed_description = HTMLField(blank=True, null=True)
    occurrence = models.CharField(max_length=20, choices=OCCURRENCE_TYPE, default='once')
    date = models.DateField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class ActivityImage(models.Model):
    activity = models.ForeignKey(Activity, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="activity_images/")

    def __str__(self):
        return f"Image for {self.activity.title}"


# ------------------ PROJECTS ------------------
class ProjectCategory(models.Model):
    name = models.CharField(max_length=100, unique=True)

    def __str__(self):
        return self.name


class Project(models.Model):
    PROJECT_TYPE = (
        ('individual', 'Individual'),
        ('team', 'Team'),
    )

    title = models.CharField(max_length=255)
    category = models.ForeignKey(ProjectCategory, on_delete=models.SET_NULL, null=True, blank=True)
    thumbnail = models.ImageField(upload_to="project_thumbnails/")
    description = models.TextField()
    details = HTMLField()
    skills = models.ManyToManyField(Skill, blank=True)
    project_type = models.CharField(max_length=20, choices=PROJECT_TYPE, default='individual')
    leader = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="led_projects", on_delete=models.SET_NULL, null=True, blank=True)
    members = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="projects", blank=True)
    special_highlight = models.CharField(max_length=255, blank=True, null=True, help_text="e.g. Featured at XYZ, Award Winner")
    github_link = models.URLField(blank=True, null=True)
    live_link = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class ProjectImage(models.Model):
    project = models.ForeignKey(Project, related_name="images", on_delete=models.CASCADE)
    image = models.ImageField(upload_to="project_images/")

    def __str__(self):
        return f"Image for {self.project.title}"


# ------------------ POSTS ------------------
class Post(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="posts", on_delete=models.CASCADE)
    caption = models.TextField(blank=True, null=True)
    hashtags = models.CharField(max_length=255, blank=True, null=True, help_text="Comma-separated hashtags e.g. #dsa,#coding,#python")
    image = models.ImageField(upload_to="post_images/", blank=True, null=True)
    video = models.FileField(upload_to="post_videos/", blank=True, null=True)
    file = models.FileField(upload_to="post_files/", blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Post by {self.user.username} ({self.created_at.date()})"

    @property
    def like_count(self):
        return self.likes.count()

    @property
    def comment_count(self):
        return self.comments.count()


class Like(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="likes", on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name="likes", on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)

    class Meta:
        unique_together = ("user", "post")

    def __str__(self):
        return f"{self.user.username} liked {self.post.id}"


class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="comments", on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name="comments", on_delete=models.CASCADE)
    content = models.TextField()
    parent = models.ForeignKey("self", related_name="replies", on_delete=models.CASCADE, blank=True, null=True)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"Comment by {self.user.username} on Post {self.post.id}"
