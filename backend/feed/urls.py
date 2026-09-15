from django.urls import path
from . import views

app_name = "feed"

urlpatterns = [
    # Main feed - NEW SYSTEM (default)
    path("", views.feed_list_new, name="feed_list"),
    
    # Post creation - NEW SYSTEM
    path("create/", views.create_post_view, name="create_post"),
    path("create/blog/", views.create_blog_post, name="create_blog_post"),
    path("create/project/", views.create_project_post, name="create_project_post"),
    path("create/normal/", views.create_normal_post, name="create_normal_post"),
    
    # Post detail and actions - NEW SYSTEM
    path("post/<int:pk>/", views.post_detail_new, name="post_detail"),
    path("post/<int:pk>/like/", views.toggle_like_new, name="toggle_post_like"),
    path("post/<int:pk>/save/", views.toggle_save_new, name="toggle_save_post"),
    path("post/<int:pk>/comment/", views.add_comment_new, name="add_comment"),
    path("comment/<int:pk>/like/", views.toggle_comment_like_new, name="toggle_comment_like"),
    path("post/<int:pk>/delete/", views.delete_post_new, name="delete_post"),
    
    # OLD SYSTEM - kept for backward compatibility
    path("old/", views.feed_list, name="feed_list_old"),
    path("old/post/create/", views.create_post, name="create_post_old"),
    path("old/post/<int:pk>/edit/", views.edit_post, name="edit_post"),
    path("old/comment/<int:pk>/delete/", views.delete_comment, name="delete_comment"),
    path("old/comment/<int:pk>/like/", views.toggle_comment_like, name="toggle_comment_like"),
    path("old/user/<str:username>/posts/", views.user_posts, name="user_posts"),
    path("old/saved/", views.saved_posts, name="saved_posts"),
]
