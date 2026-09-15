from django.urls import path
from .api_views import (
    ContactAPIView,
    NewsletterSubscribeAPIView,
    SiteContentAPIView,
)

app_name = "riseapp_api"

urlpatterns = [
    path("contact/", ContactAPIView.as_view(), name="contact"),
    path("newsletter/subscribe/", NewsletterSubscribeAPIView.as_view(), name="newsletter_subscribe"),
    path("site-content/", SiteContentAPIView.as_view(), name="site_content"),
]
