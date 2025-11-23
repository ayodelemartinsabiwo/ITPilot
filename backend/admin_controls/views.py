"""
Admin Controls Views
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Count, Q
from django_filters.rest_framework import DjangoFilterBackend
from datetime import timedelta

from .models import (
    ActivityLog,
    AuditRecord,
    CustomRole,
    OrganizationPolicy
)
from .serializers import (
    ActivityLogSerializer,
    AuditRecordSerializer,
    CustomRoleSerializer,
    OrganizationPolicySerializer
)
from common.permissions import IsOrganizationMember


class ActivityLogViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing activity logs
    Read-only - logs are created automatically by the system
    """
    permission_classes = [IsAuthenticated, IsOrganizationMember]
    serializer_class = ActivityLogSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['user', 'action', 'resource_type']
    search_fields = ['resource_type', 'details', 'ip_address']
    ordering_fields = ['created_at', 'action']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter activity logs by organization"""
        user = self.request.user
        return ActivityLog.objects.filter(
            organization=user.organization
        ).select_related('user', 'organization')

    @action(detail=False, methods=['get'])
    def recent(self, request):
        """Get recent activity logs (last 24 hours)"""
        cutoff = timezone.now() - timedelta(hours=24)
        queryset = self.get_queryset().filter(created_at__gte=cutoff)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_user(self, request):
        """Get activity logs grouped by user"""
        queryset = self.get_queryset()
        stats = queryset.values('user__email').annotate(
            count=Count('id')
        ).order_by('-count')[:10]
        return Response(stats)

    @action(detail=False, methods=['get'])
    def by_action(self, request):
        """Get activity logs grouped by action type"""
        queryset = self.get_queryset()
        stats = queryset.values('action').annotate(
            count=Count('id')
        ).order_by('-count')
        return Response(stats)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get activity log statistics"""
        queryset = self.get_queryset()

        stats = {
            'total_activities': queryset.count(),
            'today': queryset.filter(created_at__date=timezone.now().date()).count(),
            'this_week': queryset.filter(created_at__gte=timezone.now() - timedelta(days=7)).count(),
            'by_action': queryset.values('action').annotate(count=Count('id')),
            'by_resource': queryset.values('resource_type').annotate(count=Count('id')),
            'unique_users': queryset.values('user').distinct().count(),
        }

        return Response(stats)

    @action(detail=False, methods=['post'])
    def export(self, request):
        """Export activity logs (PDF or CSV)"""
        # TODO: Implement export functionality
        return Response(
            {'message': 'Export functionality to be implemented'},
            status=status.HTTP_501_NOT_IMPLEMENTED
        )


class AuditRecordViewSet(viewsets.ReadOnlyModelViewSet):
    """
    ViewSet for viewing audit records
    Read-only - audit records are created automatically by the system
    """
    permission_classes = [IsAuthenticated, IsOrganizationMember]
    serializer_class = AuditRecordSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['event_type', 'actor', 'target_user', 'is_sensitive']
    search_fields = ['action']
    ordering_fields = ['created_at', 'event_type']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter audit records by organization"""
        user = self.request.user

        # Only admins and owners can view audit records
        if user.role not in ['OWNER', 'ADMIN']:
            return AuditRecord.objects.none()

        return AuditRecord.objects.filter(
            organization=user.organization
        ).select_related('organization', 'actor', 'target_user')

    @action(detail=False, methods=['get'])
    def sensitive(self, request):
        """Get sensitive audit records"""
        queryset = self.get_queryset().filter(is_sensitive=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def security_events(self, request):
        """Get security-related audit records"""
        queryset = self.get_queryset().filter(event_type='SECURITY_EVENT')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def user_changes(self, request):
        """Get user-related changes"""
        queryset = self.get_queryset().filter(
            event_type__in=[
                'USER_CREATED', 'USER_UPDATED', 'USER_DELETED',
                'USER_ACTIVATED', 'USER_DEACTIVATED'
            ]
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get audit record statistics"""
        queryset = self.get_queryset()

        stats = {
            'total_records': queryset.count(),
            'sensitive_records': queryset.filter(is_sensitive=True).count(),
            'by_event_type': queryset.values('event_type').annotate(count=Count('id')),
            'recent_30_days': queryset.filter(created_at__gte=timezone.now() - timedelta(days=30)).count(),
        }

        return Response(stats)

    @action(detail=False, methods=['post'])
    def export(self, request):
        """Export audit records for compliance (PDF or CSV)"""
        # TODO: Implement export functionality
        return Response(
            {'message': 'Export functionality to be implemented'},
            status=status.HTTP_501_NOT_IMPLEMENTED
        )


class CustomRoleViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing custom roles
    """
    permission_classes = [IsAuthenticated, IsOrganizationMember]
    serializer_class = CustomRoleSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['is_system_role']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'created_at']
    ordering = ['name']

    def get_queryset(self):
        """Filter custom roles by organization"""
        user = self.request.user
        return CustomRole.objects.filter(
            organization=user.organization
        ).select_related('organization', 'created_by')

    def perform_create(self, serializer):
        """Create a new custom role with organization context"""
        # Only admins and owners can create roles
        if self.request.user.role not in ['OWNER', 'ADMIN']:
            raise serializers.ValidationError("Only admins can create custom roles")

        serializer.save(
            organization=self.request.user.organization,
            created_by=self.request.user
        )

    def perform_update(self, serializer):
        """Prevent editing system roles"""
        if serializer.instance.is_system_role:
            raise serializers.ValidationError("Cannot edit system roles")
        serializer.save()

    def perform_destroy(self, instance):
        """Prevent deleting system roles"""
        if instance.is_system_role:
            raise serializers.ValidationError("Cannot delete system roles")
        instance.delete()

    @action(detail=False, methods=['get'])
    def system_roles(self, request):
        """Get all system-defined roles"""
        queryset = self.get_queryset().filter(is_system_role=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def custom_only(self, request):
        """Get only custom (non-system) roles"""
        queryset = self.get_queryset().filter(is_system_role=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class OrganizationPolicyViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing organization policies
    """
    permission_classes = [IsAuthenticated, IsOrganizationMember]
    serializer_class = OrganizationPolicySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['policy_type', 'enabled']
    search_fields = ['policy_config']
    ordering_fields = ['policy_type', 'created_at', 'enforced_at']
    ordering = ['policy_type']

    def get_queryset(self):
        """Filter policies by organization"""
        user = self.request.user
        return OrganizationPolicy.objects.filter(
            organization=user.organization
        ).select_related('organization', 'enforced_by')

    def perform_create(self, serializer):
        """Create a new policy with organization context"""
        # Only admins and owners can create policies
        if self.request.user.role not in ['OWNER', 'ADMIN']:
            raise serializers.ValidationError("Only admins can create policies")

        serializer.save(organization=self.request.user.organization)

    def perform_update(self, serializer):
        """Update policy and track enforcement"""
        # Only admins and owners can update policies
        if self.request.user.role not in ['OWNER', 'ADMIN']:
            raise serializers.ValidationError("Only admins can update policies")

        serializer.save()

    @action(detail=True, methods=['post'])
    def enable(self, request, pk=None):
        """Enable a policy"""
        policy = self.get_object()
        policy.enabled = True
        policy.enforced_at = timezone.now()
        policy.enforced_by = request.user
        policy.save()

        serializer = self.get_serializer(policy)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def disable(self, request, pk=None):
        """Disable a policy"""
        policy = self.get_object()
        policy.enabled = False
        policy.save()

        serializer = self.get_serializer(policy)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def enabled(self, request):
        """Get all enabled policies"""
        queryset = self.get_queryset().filter(enabled=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Get policies grouped by type"""
        queryset = self.get_queryset()
        stats = queryset.values('policy_type').annotate(count=Count('id'))
        return Response(stats)
