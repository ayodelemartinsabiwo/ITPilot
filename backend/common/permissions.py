"""
Custom permissions for ITPilot.
"""

from rest_framework import permissions


class IsOrganizationMember(permissions.BasePermission):
    """
    Permission to check if user belongs to the organization.
    """
    message = "You must be a member of this organization."

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        organization_id = request.headers.get('X-Organization-Id')
        if not organization_id:
            return False

        # Check if user belongs to organization
        return request.user.organizations.filter(id=organization_id).exists()


class IsOrganizationAdmin(permissions.BasePermission):
    """
    Permission to check if user is an admin of the organization.
    """
    message = "You must be an admin of this organization."

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        organization_id = request.headers.get('X-Organization-Id')
        if not organization_id:
            return False

        # Check if user is an admin
        return request.user.organization_memberships.filter(
            organization_id=organization_id,
            role__in=['ADMIN', 'OWNER']
        ).exists()


class IsTechnician(permissions.BasePermission):
    """
    Permission to check if user is a technician.
    """
    message = "You must be a technician to access this resource."

    def has_permission(self, request, view):
        return (
            request.user.is_authenticated and
            request.user.role in ['TECHNICIAN', 'ADMIN', 'SUPERADMIN']
        )


class IsDeviceOwner(permissions.BasePermission):
    """
    Permission to check if user owns the device.
    """
    message = "You must be the owner of this device."

    def has_object_permission(self, request, view, obj):
        return obj.user == request.user or request.user.is_staff


class IsTicketOwnerOrTechnician(permissions.BasePermission):
    """
    Permission to check if user is the ticket owner or assigned technician.
    """
    message = "You must be the ticket owner or assigned technician."

    def has_object_permission(self, request, view, obj):
        is_owner = obj.user == request.user
        is_technician = (
            obj.assigned_technician == request.user or
            request.user.role in ['TECHNICIAN', 'ADMIN', 'SUPERADMIN']
        )
        return is_owner or is_technician


class HasActiveSubscription(permissions.BasePermission):
    """
    Permission to check if user/organization has an active subscription.
    """
    message = "You must have an active subscription to access this resource."

    def has_permission(self, request, view):
        if not request.user.is_authenticated:
            return False

        organization_id = request.headers.get('X-Organization-Id')

        if organization_id:
            # Check organization subscription
            from organizations.models import Organization
            try:
                org = Organization.objects.get(id=organization_id)
                return org.has_active_subscription()
            except Organization.DoesNotExist:
                return False
        else:
            # Check user subscription
            return request.user.has_active_subscription()


class ReadOnly(permissions.BasePermission):
    """
    Permission for read-only access.
    """
    def has_permission(self, request, view):
        return request.method in permissions.SAFE_METHODS
