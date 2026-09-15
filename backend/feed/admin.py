from django.contrib import admin
from .models import Post, Comment, PostLike, CommentLike, SavedPost, HashTag, Mention


@admin.register(Post)
class PostAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "author",
        "post_type",
        "get_excerpt",
        "likes_count",
        "comments_count",
        "created_at",
        "is_active",
    )
    list_filter = ("post_type", "is_active", "is_pinned", "created_at")
    search_fields = ("content", "author__username", "author__email")
    readonly_fields = ("created_at", "updated_at", "views_count")
    list_per_page = 20
    date_hierarchy = "created_at"

    fieldsets = (
        ("Author & Type", {"fields": ("author", "post_type")}),
        ("Content", {"fields": ("content",)}),
        ("Media", {"fields": ("image", "video", "blog"), "classes": ("collapse",)}),
        ("Settings", {"fields": ("is_pinned", "is_active")}),
        (
            "Metadata",
            {
                "fields": ("views_count", "created_at", "updated_at"),
                "classes": ("collapse",),
            },
        ),
    )


@admin.register(Comment)
class CommentAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "author",
        "post",
        "parent",
        "content_preview",
        "likes_count",
        "created_at",
        "is_edited",
    )
    list_filter = ("is_edited", "created_at")
    search_fields = ("content", "author__username", "post__content")
    readonly_fields = ("created_at", "updated_at")
    list_per_page = 50

    def content_preview(self, obj):
        return obj.content[:50] + "..." if len(obj.content) > 50 else obj.content

    content_preview.short_description = "Content"


@admin.register(PostLike)
class PostLikeAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "post", "created_at")
    list_filter = ("created_at",)
    search_fields = ("user__username", "post__content")
    readonly_fields = ("created_at",)
    list_per_page = 50


@admin.register(CommentLike)
class CommentLikeAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "comment", "created_at")
    list_filter = ("created_at",)
    search_fields = ("user__username", "comment__content")
    readonly_fields = ("created_at",)
    list_per_page = 50


@admin.register(SavedPost)
class SavedPostAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "post", "saved_at")
    list_filter = ("saved_at",)
    search_fields = ("user__username", "post__content")
    readonly_fields = ("saved_at",)
    list_per_page = 50


@admin.register(HashTag)
class HashTagAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "posts_count", "created_at")
    search_fields = ("name",)
    readonly_fields = ("created_at",)
    list_per_page = 50


@admin.register(Mention)
class MentionAdmin(admin.ModelAdmin):
    list_display = ("id", "user", "post", "created_at")
    list_filter = ("created_at",)
    search_fields = ("user__username", "post__content")
    readonly_fields = ("created_at",)
    list_per_page = 50
