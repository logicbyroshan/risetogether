from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit or delete it.
    Assumes the model instance has an `author` or `user` attribute.
    """

    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request (GET, HEAD, OPTIONS)
        if request.method in permissions.SAFE_METHODS:
            return True

        # Write permissions are only allowed to the owner
        owner = getattr(obj, "author", None) or getattr(obj, "user", None)
        return owner == request.user


class IsSelfOrReadOnly(permissions.BasePermission):
    """
    Permission to only allow a user to edit their own profile/account.
    """

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj == request.user or getattr(obj, "user", None) == request.user


class IsAdminOrReadOnly(permissions.BasePermission):
    """
    Permission to allow read access to all, but write access only to staff/admin users.
    """

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff
