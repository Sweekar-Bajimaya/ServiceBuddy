# Required import for custom permissions
from rest_framework import permissions

class IsProvider(permissions.BasePermission):
    """
    Allows access only to provider-type users.
    """
    def has_permission(self, request, view):
        return request.user.get("user_type") == "provider"

class IsUser(permissions.BasePermission):
    """
    Allows access only to regular users.
    """
    def has_permission(self, request, view):
        return request.user.get("user_type") == "user"
