from rest_framework import permissions

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and request.user.role == 'admin'

class IsOwnerOrAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        # Allow if user is admin
        if request.user.role == 'admin':
            return True
        
        # Allow if user is the owner
        if hasattr(obj, 'user'):
            return obj.user == request.user
        return obj == request.user

