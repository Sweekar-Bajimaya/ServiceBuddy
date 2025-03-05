from rest_framework import permissions

class IsAdmin(permissions.BasePermission):
    """
    Allows access only to admin users.
    """
    def has_permission(self, request, view):
        # Ensure there is a user and that their user_type is 'admin'
        return bool(request.user and request.user.get("user_type") == "admin")

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
