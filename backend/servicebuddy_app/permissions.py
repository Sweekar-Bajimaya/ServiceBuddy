from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        print("DEBUG: In IsAdmin, request.user =", request.user)
        # If request.user is a dict (from custom JWT auth), then use .get()
        if hasattr(request.user, "get"):
            return request.user.get("user_type") == "admin"
        # Otherwise, use attribute access (for Django User models)
        return getattr(request.user, "user_type", None) == "admin"

class IsUser(permissions.BasePermission):
    """
    Allows access only to regular users.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.get("user_type") == "user")

class IsProvider(permissions.BasePermission):
    """
    Allows access only to providers.
    """
    def has_permission(self, request, view):
        return bool(request.user and request.user.get("user_type") == "provider")