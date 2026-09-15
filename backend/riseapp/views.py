from django.http import JsonResponse
from django.shortcuts import redirect
from django.contrib import messages
from .models import Contact, Newsletter
from django.db import IntegrityError


def home(request):
    if request.method == "POST":
        # Handle contact form submission
        name = request.POST.get("name")
        email = request.POST.get("email")
        message = request.POST.get("message")

        # Basic validation
        if name and email and message:
            try:
                Contact.objects.create(name=name, email=email, message=message)
                return JsonResponse(
                    {"status": "success", "message": "Thank you for your message!"},
                    status=201
                )
            except Exception as e:
                return JsonResponse(
                    {"status": "error", "message": "Sorry, something went wrong."},
                    status=500
                )
        else:
            return JsonResponse(
                {"status": "error", "message": "Please fill in all fields."},
                status=400
            )

    return JsonResponse(
        {
            "status": "online",
            "service": "RiseTogether Modular Monolith API",
            "version": "1.0.0",
            "endpoints": {
                "api": "/api/",
                "admin": "/admin/",
                "dsa": "/api/dsa/",
                "site_content": "/api/site-content/",
            },
        }
    )


def newsletter_subscribe(request):
    """Handle newsletter subscription"""
    if request.method == "POST":
        email = request.POST.get("newsletter_email")

        if email:
            try:
                Newsletter.objects.create(email=email)
                messages.success(
                    request, "Thank you for subscribing to our newsletter!"
                )
            except IntegrityError:
                messages.info(request, "You're already subscribed to our newsletter!")
            except Exception as e:
                messages.error(
                    request, "Sorry, something went wrong. Please try again later."
                )
        else:
            messages.error(request, "Please enter a valid email address.")

    # Redirect back to the referring page or home
    return redirect(request.META.get("HTTP_REFERER", "home"))
