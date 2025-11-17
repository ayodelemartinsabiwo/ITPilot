"""
Views for Integrations app.
"""

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from organizations.models import OrganizationMember
from .models import Integration, OAuthToken, DomainHealth, IntegrationLog
from .serializers import (
    IntegrationSerializer,
    OAuthTokenSerializer,
    DomainHealthSerializer,
    IntegrationLogSerializer
)


class IntegrationViewSet(viewsets.ModelViewSet):
    """ViewSet for Integration CRUD operations."""
    serializer_class = IntegrationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get integrations for user's organizations."""
        user = self.request.user
        if user.is_superuser:
            return Integration.objects.all()

        user_orgs = OrganizationMember.objects.filter(
            user=user,
            role__in=['OWNER', 'ADMIN'],
            is_active=True
        ).values_list('organization_id', flat=True)

        return Integration.objects.filter(
            organization_id__in=user_orgs
        ).select_related('organization', 'created_by')

    def perform_create(self, serializer):
        """Create integration with current user and organization."""
        org_membership = OrganizationMember.objects.filter(
            user=self.request.user,
            role__in=['OWNER', 'ADMIN'],
            is_active=True
        ).first()

        if not org_membership:
            raise serializers.ValidationError({
                'organization': 'User must be an admin of an organization'
            })

        serializer.save(
            organization=org_membership.organization,
            created_by=self.request.user
        )

    @action(detail=True, methods=['post'])
    def sync(self, request, pk=None):
        """Trigger manual sync for integration."""
        integration = self.get_object()

        # TODO: Implement actual sync logic based on integration type
        # This is a placeholder

        from django.utils import timezone
        integration.last_sync_at = timezone.now()
        integration.total_sync_count += 1
        integration.save(update_fields=['last_sync_at', 'total_sync_count'])

        return Response({
            'message': 'Sync triggered successfully',
            'last_sync_at': integration.last_sync_at
        })

    @action(detail=True, methods=['post'])
    def test_connection(self, request, pk=None):
        """Test integration connection."""
        integration = self.get_object()

        # TODO: Implement actual connection testing
        # This is a placeholder

        return Response({
            'status': 'success',
            'message': 'Connection test successful'
        })

    @action(detail=True, methods=['get'])
    def logs(self, request, pk=None):
        """Get logs for integration."""
        integration = self.get_object()
        logs = integration.logs.all()[:100]
        serializer = IntegrationLogSerializer(logs, many=True)
        return Response(serializer.data)


class DomainHealthViewSet(viewsets.ModelViewSet):
    """ViewSet for DomainHealth CRUD operations."""
    serializer_class = DomainHealthSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get domain health checks for user's organizations."""
        user = self.request.user
        if user.is_superuser:
            return DomainHealth.objects.all()

        user_orgs = OrganizationMember.objects.filter(
            user=user,
            is_active=True
        ).values_list('organization_id', flat=True)

        return DomainHealth.objects.filter(
            organization_id__in=user_orgs
        ).select_related('organization')

    @action(detail=True, methods=['post'])
    def check_health(self, request, pk=None):
        """Run health check for domain."""
        domain_health = self.get_object()

        # TODO: Implement actual health check logic
        # This would check DNS records, SSL, blacklists, etc.

        domain_health.calculate_overall_status()

        return Response(
            DomainHealthSerializer(domain_health).data,
            status=status.HTTP_200_OK
        )


class IntegrationLogViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for IntegrationLog read operations."""
    serializer_class = IntegrationLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get integration logs for user's organizations."""
        user = self.request.user
        if user.is_superuser:
            return IntegrationLog.objects.all()

        user_orgs = OrganizationMember.objects.filter(
            user=user,
            role__in=['OWNER', 'ADMIN'],
            is_active=True
        ).values_list('organization_id', flat=True)

        return IntegrationLog.objects.filter(
            integration__organization_id__in=user_orgs
        ).select_related('integration')
