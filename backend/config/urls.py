from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("tinymce/", include("tinymce.urls")),

    # REST API routes
    path("api/", include("accounts.api_urls", namespace="api_accounts")),
    path("api/", include("community.api_urls", namespace="api_community")),
    path("api/", include("feed.api_urls", namespace="api_feed")),
    path("api/", include("riseapp.api_urls", namespace="api_riseapp")),
    path("api/dsa/", include("dsa.urls", namespace="dsa")),

    # Legacy server-rendered templates (preserved for fallback & admin)
    path("", include("riseapp.urls")),
    path("accounts/", include("accounts.urls", namespace="accounts")),
    path("community/", include("community.urls", namespace="community")),
    path("feed/", include("feed.urls", namespace="feed")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
