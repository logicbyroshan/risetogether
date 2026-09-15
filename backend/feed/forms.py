from django import forms
from .models import Post, Comment, FeedPost, PostMedia, ProjectLink, PostComment
from tinymce.widgets import TinyMCE


class PostForm(forms.ModelForm):
    """Form for creating and editing posts"""

    class Meta:
        model = Post
        fields = ["post_type", "content", "image", "video", "blog"]
        widgets = {
            "post_type": forms.Select(attrs={"class": "form-select", "id": "postType"}),
            "content": forms.Textarea(
                attrs={
                    "class": "form-control",
                    "rows": 4,
                    "placeholder": "What's on your mind?",
                    "id": "postContent",
                }
            ),
            "image": forms.FileInput(
                attrs={
                    "class": "form-control",
                    "accept": "image/*",
                    "id": "postImage",
                    "style": "display: block; width: 100%;",
                }
            ),
            "video": forms.FileInput(
                attrs={
                    "class": "form-control",
                    "accept": "video/*",
                    "id": "postVideo",
                    "style": "display: block; width: 100%;",
                }
            ),
            "blog": forms.Select(attrs={"class": "form-select", "id": "postBlog"}),
        }

    def __init__(self, *args, **kwargs):
        self.user = kwargs.pop("user", None)
        super().__init__(*args, **kwargs)

        # Make fields optional by default
        self.fields["image"].required = False
        self.fields["video"].required = False
        self.fields["blog"].required = False

        # Filter blogs to only show user's own blogs
        if self.user:
            from community.models import Blog

            self.fields["blog"].queryset = Blog.objects.filter(author=self.user)

    def clean(self):
        cleaned_data = super().clean()
        post_type = cleaned_data.get("post_type")
        content = cleaned_data.get("content")
        image = cleaned_data.get("image")
        video = cleaned_data.get("video")
        blog = cleaned_data.get("blog")

        # Validation: Ensure content or media is provided
        if post_type == "text" and not content:
            raise forms.ValidationError("Text posts must have content.")

        if post_type == "image" and not image:
            raise forms.ValidationError("Image posts must have an image.")

        if post_type == "video" and not video:
            raise forms.ValidationError("Video posts must have a video.")

        if post_type == "blog" and not blog:
            raise forms.ValidationError("Blog posts must be linked to a blog.")

        return cleaned_data


class CommentForm(forms.ModelForm):
    """Form for adding comments to posts"""

    class Meta:
        model = Comment
        fields = ["content"]
        widgets = {
            "content": forms.Textarea(
                attrs={
                    "class": "form-control comment-input",
                    "rows": 2,
                    "placeholder": "Write a comment...",
                    "id": "commentContent",
                }
            ),
        }

    def clean_content(self):
        content = self.cleaned_data.get("content")
        if not content or not content.strip():
            raise forms.ValidationError("Comment cannot be empty.")
        return content.strip()


class ReplyForm(forms.ModelForm):
    """Form for replying to comments"""

    class Meta:
        model = Comment
        fields = ["content"]
        widgets = {
            "content": forms.Textarea(
                attrs={
                    "class": "form-control reply-input",
                    "rows": 2,
                    "placeholder": "Write a reply...",
                }
            ),
        }

    def clean_content(self):
        content = self.cleaned_data.get("content")
        if not content or not content.strip():
            raise forms.ValidationError("Reply cannot be empty.")
        return content.strip()


# ============================================================================
# NEW POST CREATION FORMS - Blog, Project, and Normal Posts
# ============================================================================


class BlogPostForm(forms.ModelForm):
    """Form for creating blog posts"""

    class Meta:
        model = FeedPost
        fields = ["blog_title", "blog_thumbnail", "blog_content"]
        widgets = {
            "blog_title": forms.TextInput(
                attrs={
                    "class": "w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 text-white",
                    "placeholder": "Enter blog title...",
                    "id": "blogTitle",
                }
            ),
            "blog_thumbnail": forms.FileInput(
                attrs={
                    "class": "w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 text-white",
                    "accept": "image/*",
                    "id": "blogThumbnail",
                }
            ),
            "blog_content": TinyMCE(
                attrs={
                    "cols": 80,
                    "rows": 20,
                    "id": "blogContent",
                }
            ),
        }

    def clean_blog_title(self):
        title = self.cleaned_data.get("blog_title")
        if not title or not title.strip():
            raise forms.ValidationError("Blog title is required.")
        return title.strip()

    def clean_blog_content(self):
        content = self.cleaned_data.get("blog_content")
        if not content or not content.strip():
            raise forms.ValidationError("Blog content is required.")
        return content


class ProjectPostForm(forms.ModelForm):
    """Form for creating project posts"""

    # Additional fields for project links
    link_title_1 = forms.CharField(
        max_length=100,
        required=False,
        widget=forms.TextInput(
            attrs={
                "class": "w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 text-white",
                "placeholder": "Link title (e.g., GitHub, Live Demo)",
            }
        ),
    )
    link_url_1 = forms.URLField(
        required=False,
        widget=forms.URLInput(
            attrs={
                "class": "w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 text-white",
                "placeholder": "https://...",
            }
        ),
    )
    link_title_2 = forms.CharField(
        max_length=100,
        required=False,
        widget=forms.TextInput(
            attrs={
                "class": "w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 text-white",
                "placeholder": "Link title (optional)",
            }
        ),
    )
    link_url_2 = forms.URLField(
        required=False,
        widget=forms.URLInput(
            attrs={
                "class": "w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 text-white",
                "placeholder": "https://... (optional)",
            }
        ),
    )
    link_title_3 = forms.CharField(
        max_length=100,
        required=False,
        widget=forms.TextInput(
            attrs={
                "class": "w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 text-white",
                "placeholder": "Link title (optional)",
            }
        ),
    )
    link_url_3 = forms.URLField(
        required=False,
        widget=forms.URLInput(
            attrs={
                "class": "w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 text-white",
                "placeholder": "https://... (optional)",
            }
        ),
    )

    class Meta:
        model = FeedPost
        fields = ["project_title", "project_content"]
        widgets = {
            "project_title": forms.TextInput(
                attrs={
                    "class": "w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 text-white",
                    "placeholder": "Enter project name...",
                    "id": "projectTitle",
                }
            ),
            "project_content": TinyMCE(
                attrs={
                    "cols": 80,
                    "rows": 15,
                    "id": "projectContent",
                }
            ),
        }

    def clean_project_title(self):
        title = self.cleaned_data.get("project_title")
        if not title or not title.strip():
            raise forms.ValidationError("Project name is required.")
        return title.strip()

    def clean_project_content(self):
        content = self.cleaned_data.get("project_content")
        if not content or not content.strip():
            raise forms.ValidationError("Project description is required.")
        return content

    def clean(self):
        cleaned_data = super().clean()

        # Validate link pairs (if title provided, URL must be provided and vice versa)
        for i in range(1, 4):
            title_key = f"link_title_{i}"
            url_key = f"link_url_{i}"
            title = cleaned_data.get(title_key)
            url = cleaned_data.get(url_key)

            if title and not url:
                self.add_error(url_key, f"URL is required when title is provided.")
            if url and not title:
                self.add_error(title_key, f"Title is required when URL is provided.")

        return cleaned_data


class NormalPostForm(forms.ModelForm):
    """Form for creating normal posts"""

    class Meta:
        model = FeedPost
        fields = ["normal_content"]
        widgets = {
            "normal_content": forms.Textarea(
                attrs={
                    "class": "w-full px-4 py-3 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 text-white resize-none",
                    "rows": 4,
                    "placeholder": "What's on your mind?",
                    "id": "normalContent",
                }
            ),
        }

    def clean_normal_content(self):
        content = self.cleaned_data.get("normal_content")
        if not content or not content.strip():
            raise forms.ValidationError("Post content is required.")
        return content.strip()


class PostCommentForm(forms.ModelForm):
    """Form for adding comments to FeedPosts"""

    class Meta:
        model = PostComment
        fields = ["content"]
        widgets = {
            "content": forms.Textarea(
                attrs={
                    "class": "w-full px-4 py-2 bg-gray-800/50 border border-gray-700 rounded-lg focus:outline-none focus:border-orange-500 text-white resize-none",
                    "rows": 2,
                    "placeholder": "Write a comment...",
                }
            ),
        }

    def clean_content(self):
        content = self.cleaned_data.get("content")
        if not content or not content.strip():
            raise forms.ValidationError("Comment cannot be empty.")
        return content.strip()
