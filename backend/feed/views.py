from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.http import JsonResponse
from django.views.decorators.http import require_POST
from django.db.models import Q, Count, Prefetch
from .models import (
    Post, Comment, PostLike, CommentLike, SavedPost, HashTag, Mention,
    FeedPost, PostMedia, ProjectLink, PostComment, PostLikeNew, CommentLikeNew, SavedPostNew
)
from .forms import (
    PostForm, CommentForm, ReplyForm,
    BlogPostForm, ProjectPostForm, NormalPostForm, PostCommentForm
)
from accounts.models import Profile
from django.contrib.auth import get_user_model

User = get_user_model()


@login_required
def feed_list(request):
    """Display the main feed with all posts"""

    # Get all active posts, ordered by creation date
    posts = (
        Post.objects.filter(is_active=True)
        .select_related("author", "author__profile")
        .prefetch_related("likes", "comments__author", "hashtag", "mentions__user")
        .annotate(
            total_likes=Count("likes", distinct=True),
            total_comments=Count("comments", distinct=True),
        )
        .order_by("-is_pinned", "-created_at")
    )

    # Filter by hashtag if provided
    hashtag = request.GET.get("hashtag")
    if hashtag:
        posts = posts.filter(hashtag__name=hashtag)

    # Get user's liked posts for UI state
    user_liked_posts = set(
        PostLike.objects.filter(user=request.user).values_list("post_id", flat=True)
    )

    # Get user's saved posts
    user_saved_posts = set(
        SavedPost.objects.filter(user=request.user).values_list("post_id", flat=True)
    )

    context = {
        "posts": posts,
        "user_liked_posts": user_liked_posts,
        "user_saved_posts": user_saved_posts,
        "post_form": PostForm(user=request.user),
        "comment_form": CommentForm(),
        "active_hashtag": hashtag,
    }

    return render(request, "feed/feed_list.html", context)


@login_required
def post_detail(request, pk):
    """Display a single post with all its comments"""

    post = get_object_or_404(
        Post.objects.select_related("author", "author__profile"), pk=pk, is_active=True
    )

    # Increment view count
    post.views_count += 1
    post.save(update_fields=["views_count"])

    # Get all comments (including replies)
    comments = (
        post.comments.select_related("author", "author__profile", "parent")
        .prefetch_related("comment_likes")
        .order_by("created_at")
    )

    # Organize comments into parent-child structure
    comment_dict = {}
    top_level_comments = []

    for comment in comments:
        comment_dict[comment.id] = comment
        comment.replies_list = []

        if comment.parent_id is None:
            top_level_comments.append(comment)

    for comment in comments:
        if comment.parent_id:
            parent = comment_dict.get(comment.parent_id)
            if parent:
                parent.replies_list.append(comment)

    # Check if user liked the post
    user_liked = PostLike.objects.filter(post=post, user=request.user).exists()

    # Check if user saved the post
    user_saved = SavedPost.objects.filter(post=post, user=request.user).exists()

    # Get user's liked comments
    user_liked_comments = set(
        CommentLike.objects.filter(user=request.user, comment__post=post).values_list(
            "comment_id", flat=True
        )
    )

    context = {
        "post": post,
        "comments": top_level_comments,
        "comment_form": CommentForm(),
        "reply_form": ReplyForm(),
        "user_liked": user_liked,
        "user_saved": user_saved,
        "user_liked_comments": user_liked_comments,
    }

    return render(request, "feed/post_detail.html", context)


@login_required
@require_POST
def create_post(request):
    """Create a new post"""

    form = PostForm(request.POST, request.FILES, user=request.user)

    if form.is_valid():
        post = form.save(commit=False)
        post.author = request.user
        post.save()

        # Process hashtags from content
        import re

        hashtags = re.findall(r"#(\w+)", post.content)
        for tag in hashtags:
            hashtag_obj, created = HashTag.objects.get_or_create(name=tag.lower())
            post.hashtag.add(hashtag_obj)

        # Process mentions from content
        mentions = re.findall(r"@(\w+)", post.content)
        for username in mentions:
            try:
                mentioned_user = User.objects.get(username=username)
                Mention.objects.create(post=post, user=mentioned_user)
            except User.DoesNotExist:
                pass

        messages.success(request, "Post created successfully!")
        return redirect("feed:feed_list")

    else:
        for error in form.errors.values():
            messages.error(request, error)
        return redirect("feed:feed_list")


@login_required
@require_POST
def add_comment(request, post_pk):
    """Add a comment to a post"""

    post = get_object_or_404(Post, pk=post_pk, is_active=True)
    form = CommentForm(request.POST)

    if form.is_valid():
        comment = form.save(commit=False)
        comment.post = post
        comment.author = request.user

        # Check if this is a reply to another comment
        parent_id = request.POST.get("parent_id")
        if parent_id:
            parent_comment = get_object_or_404(Comment, pk=parent_id)
            comment.parent = parent_comment

        comment.save()

        messages.success(request, "Comment added successfully!")

    else:
        messages.error(request, "Failed to add comment.")

    return redirect("feed:post_detail", pk=post_pk)


@login_required
@require_POST
def toggle_post_like(request, pk):
    """Toggle like on a post (AJAX endpoint)"""

    post = get_object_or_404(Post, pk=pk, is_active=True)

    like, created = PostLike.objects.get_or_create(post=post, user=request.user)

    if not created:
        # Unlike
        like.delete()
        liked = False
    else:
        # Like
        liked = True

    # Return JSON response
    return JsonResponse({"liked": liked, "likes_count": post.likes.count()})


@login_required
@require_POST
def toggle_comment_like(request, pk):
    """Toggle like on a comment (AJAX endpoint)"""

    comment = get_object_or_404(Comment, pk=pk)

    like, created = CommentLike.objects.get_or_create(
        comment=comment, user=request.user
    )

    if not created:
        # Unlike
        like.delete()
        liked = False
    else:
        # Like
        liked = True

    # Return JSON response
    return JsonResponse({"liked": liked, "likes_count": comment.comment_likes.count()})


@login_required
@require_POST
def toggle_save_post(request, pk):
    """Toggle save/bookmark a post (AJAX endpoint)"""

    post = get_object_or_404(Post, pk=pk, is_active=True)

    saved, created = SavedPost.objects.get_or_create(post=post, user=request.user)

    if not created:
        # Unsave
        saved.delete()
        is_saved = False
    else:
        # Save
        is_saved = True

    # Return JSON response
    return JsonResponse({"saved": is_saved})


@login_required
def delete_post(request, pk):
    """Delete a post (only by author)"""

    post = get_object_or_404(Post, pk=pk, author=request.user)
    post.delete()

    messages.success(request, "Post deleted successfully!")
    return redirect("feed:feed_list")


@login_required
def edit_post(request, pk):
    """Edit a post (only by author)"""

    post = get_object_or_404(Post, pk=pk, author=request.user)

    if request.method == "POST":
        form = PostForm(request.POST, request.FILES, instance=post, user=request.user)

        if form.is_valid():
            form.save()
            messages.success(request, "Post updated successfully!")
            return redirect("feed:post_detail", pk=pk)

    else:
        form = PostForm(instance=post, user=request.user)

    context = {
        "form": form,
        "post": post,
        "is_edit": True,
    }

    return render(request, "feed/edit_post.html", context)


@login_required
def delete_comment(request, pk):
    """Delete a comment (only by author)"""

    comment = get_object_or_404(Comment, pk=pk, author=request.user)
    post_pk = comment.post.pk
    comment.delete()

    messages.success(request, "Comment deleted successfully!")
    return redirect("feed:post_detail", pk=post_pk)


@login_required
def user_posts(request, username):
    """Display all posts by a specific user"""

    user = get_object_or_404(User, username=username)

    posts = (
        Post.objects.filter(author=user, is_active=True)
        .select_related("author", "author__profile")
        .prefetch_related("likes", "comments")
        .order_by("-created_at")
    )

    # Get user's liked posts
    user_liked_posts = set(
        PostLike.objects.filter(user=request.user).values_list("post_id", flat=True)
    )

    # Get user's saved posts
    user_saved_posts = set(
        SavedPost.objects.filter(user=request.user).values_list("post_id", flat=True)
    )

    context = {
        "profile_user": user,
        "posts": posts,
        "user_liked_posts": user_liked_posts,
        "user_saved_posts": user_saved_posts,
        "comment_form": CommentForm(),
    }

    return render(request, "feed/user_posts.html", context)


@login_required
def saved_posts(request):
    """Display all posts saved by the current user"""

    saved_post_ids = SavedPost.objects.filter(user=request.user).values_list(
        "post_id", flat=True
    )

    posts = (
        Post.objects.filter(id__in=saved_post_ids, is_active=True)
        .select_related("author", "author__profile")
        .prefetch_related("likes", "comments")
        .order_by("-created_at")
    )

    # Get user's liked posts
    user_liked_posts = set(
        PostLike.objects.filter(user=request.user).values_list("post_id", flat=True)
    )

    context = {
        "posts": posts,
        "user_liked_posts": user_liked_posts,
        "user_saved_posts": set(saved_post_ids),
        "comment_form": CommentForm(),
        "is_saved_view": True,
    }

    return render(request, "feed/saved_posts.html", context)


# ============================================================================
# NEW POST CREATION VIEWS - Blog, Project, and Normal Posts
# ============================================================================


@login_required
def create_post_view(request):
    """Main view to show post type selection"""
    return render(request, "feed/create_post.html")


@login_required
def create_blog_post(request):
    """View for creating blog posts"""
    if request.method == "POST":
        form = BlogPostForm(request.POST, request.FILES)
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.post_type = "blog"
            post.save()
            
            messages.success(request, "Blog post created successfully!")
            return redirect("feed:feed_list")
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = BlogPostForm()
    
    context = {
        "form": form,
        "post_type": "blog",
    }
    return render(request, "feed/create_blog_post.html", context)


@login_required
def create_project_post(request):
    """View for creating project posts"""
    if request.method == "POST":
        form = ProjectPostForm(request.POST)
        
        # Handle media files (images/videos)
        media_files = request.FILES.getlist("project_media")
        
        # Validate max 5 media files
        if len(media_files) > 5:
            messages.error(request, "Maximum 5 images/videos allowed.")
            return render(request, "feed/create_project_post.html", {"form": form, "post_type": "project"})
        
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.post_type = "project"
            post.save()
            
            # Save media files
            for index, media_file in enumerate(media_files):
                # Determine if it's an image or video
                content_type = media_file.content_type
                if content_type.startswith("image/"):
                    media_type = "image"
                elif content_type.startswith("video/"):
                    media_type = "video"
                else:
                    continue  # Skip unsupported file types
                
                PostMedia.objects.create(
                    post=post,
                    media_type=media_type,
                    file=media_file,
                    order=index
                )
            
            # Save project links
            for i in range(1, 4):
                link_title = form.cleaned_data.get(f"link_title_{i}")
                link_url = form.cleaned_data.get(f"link_url_{i}")
                
                if link_title and link_url:
                    ProjectLink.objects.create(
                        post=post,
                        title=link_title,
                        url=link_url,
                        order=i
                    )
            
            messages.success(request, "Project post created successfully!")
            return redirect("feed:feed_list")
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = ProjectPostForm()
    
    context = {
        "form": form,
        "post_type": "project",
    }
    return render(request, "feed/create_project_post.html", context)


@login_required
def create_normal_post(request):
    """View for creating normal posts"""
    if request.method == "POST":
        form = NormalPostForm(request.POST)
        
        # Handle media files (images/videos)
        media_files = request.FILES.getlist("normal_media")
        
        # Validate max 5 media files
        if len(media_files) > 5:
            messages.error(request, "Maximum 5 images/videos allowed.")
            return render(request, "feed/create_normal_post.html", {"form": form, "post_type": "normal"})
        
        if form.is_valid():
            post = form.save(commit=False)
            post.author = request.user
            post.post_type = "normal"
            post.save()
            
            # Save media files
            for index, media_file in enumerate(media_files):
                # Determine if it's an image or video
                content_type = media_file.content_type
                if content_type.startswith("image/"):
                    media_type = "image"
                elif content_type.startswith("video/"):
                    media_type = "video"
                else:
                    continue  # Skip unsupported file types
                
                PostMedia.objects.create(
                    post=post,
                    media_type=media_type,
                    file=media_file,
                    order=index
                )
            
            messages.success(request, "Post created successfully!")
            return redirect("feed:feed_list")
        else:
            messages.error(request, "Please correct the errors below.")
    else:
        form = NormalPostForm()
    
    context = {
        "form": form,
        "post_type": "normal",
    }
    return render(request, "feed/create_normal_post.html", context)


@login_required
def feed_list_new(request):
    """Display the main feed with all new posts"""
    
    # Get all active posts, ordered by creation date
    posts = (
        FeedPost.objects.filter(is_active=True)
        .select_related("author", "author__profile")
        .prefetch_related(
            "media_files",
            "project_links",
            "post_likes",
            "saved_by_new",
            "post_comments__author",
        )
        .order_by("-is_pinned", "-created_at")
    )
    
    # Add user-specific data for each post
    if request.user.is_authenticated:
        for post in posts:
            post.is_liked_by_user = post.post_likes.filter(user=request.user).exists()
            post.is_saved_by_user = post.saved_by_new.filter(user=request.user).exists()
    
    # Get user's liked posts for UI state
    liked_posts = set(
        PostLikeNew.objects.filter(user=request.user).values_list("post_id", flat=True)
    )
    
    # Get user's saved posts
    saved_posts = set(
        SavedPostNew.objects.filter(user=request.user).values_list("post_id", flat=True)
    )
    
    context = {
        "posts": posts,
        "liked_posts": liked_posts,
        "saved_posts": saved_posts,
        "comment_form": PostCommentForm(),
    }
    
    return render(request, "feed/feed_list_new.html", context)


@login_required
def post_detail_new(request, pk):
    """Display a single post with all its comments"""
    
    post = get_object_or_404(
        FeedPost.objects.select_related("author", "author__profile")
        .prefetch_related("media_files", "project_links"),
        pk=pk,
        is_active=True
    )
    
    # Increment view count
    post.views_count += 1
    post.save(update_fields=["views_count"])
    
    # Get all comments
    comments = (
        post.post_comments.select_related("author", "author__profile", "parent")
        .prefetch_related("comment_likes_new")
        .order_by("created_at")
    )
    
    # Check if user liked the post
    user_has_liked = PostLikeNew.objects.filter(post=post, user=request.user).exists()
    
    # Check if user saved the post
    user_has_saved = SavedPostNew.objects.filter(post=post, user=request.user).exists()
    
    context = {
        "post": post,
        "comments": comments,
        "user_has_liked": user_has_liked,
        "user_has_saved": user_has_saved,
        "comment_form": PostCommentForm(),
    }
    
    return render(request, "feed/post_detail_new.html", context)


@login_required
@require_POST
def toggle_like_new(request, pk):
    """Toggle like on a post"""
    post = get_object_or_404(FeedPost, pk=pk)
    
    like, created = PostLikeNew.objects.get_or_create(post=post, user=request.user)
    
    if not created:
        like.delete()
        liked = False
    else:
        liked = True
    
    return JsonResponse({
        "success": True,
        "liked": liked,
        "likes_count": post.likes_count,
    })


@login_required
@require_POST
def add_comment_new(request, pk):
    """Add a comment to a post"""
    post = get_object_or_404(FeedPost, pk=pk)
    form = PostCommentForm(request.POST)
    
    if form.is_valid():
        comment = form.save(commit=False)
        comment.post = post
        comment.author = request.user
        
        # Check if it's a reply
        parent_id = request.POST.get("parent_id")
        if parent_id:
            parent_comment = get_object_or_404(PostComment, pk=parent_id)
            comment.parent = parent_comment
        
        comment.save()
        messages.success(request, "Comment added successfully!")
    else:
        messages.error(request, "Failed to add comment.")
    
    return redirect("feed:post_detail", pk=pk)


@login_required
@require_POST
def delete_post_new(request, pk):
    """Delete a post"""
    post = get_object_or_404(FeedPost, pk=pk, author=request.user)
    post.delete()
    messages.success(request, "Post deleted successfully!")
    return redirect("feed:feed_list")


@login_required
@require_POST
def toggle_save_new(request, pk):
    """Toggle save on a post"""
    post = get_object_or_404(FeedPost, pk=pk)
    
    saved, created = SavedPostNew.objects.get_or_create(post=post, user=request.user)
    
    if not created:
        saved.delete()
        is_saved = False
    else:
        is_saved = True
    
    return JsonResponse({
        "success": True,
        "saved": is_saved,
    })


@login_required
@require_POST
def toggle_comment_like_new(request, pk):
    """Toggle like on a comment"""
    comment = get_object_or_404(PostComment, pk=pk)
    
    like, created = CommentLikeNew.objects.get_or_create(comment=comment, user=request.user)
    
    if not created:
        like.delete()
        liked = False
    else:
        liked = True
    
    return JsonResponse({
        "success": True,
        "liked": liked,
        "likes_count": comment.comment_likes_new.count(),
    })
