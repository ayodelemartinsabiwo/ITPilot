"""
Views for Devices app.
"""

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from organizations.models import OrganizationMember
from .models import Device, DeviceHealth, DeviceMetrics
from .serializers import (
    DeviceSerializer,
    DeviceHealthSerializer,
    DeviceMetricsSerializer,
    DeviceRegistrationSerializer,
    DeviceHealthCheckSerializer
)
import secrets
import hashlib


class DeviceViewSet(viewsets.ModelViewSet):
    """ViewSet for Device CRUD operations."""
    serializer_class = DeviceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get devices for user's organizations."""
        user = self.request.user
        if user.is_superuser:
            return Device.objects.all()

        # Get organizations where user is a member
        user_orgs = OrganizationMember.objects.filter(
            user=user,
            is_active=True
        ).values_list('organization_id', flat=True)

        # Return devices from user's organizations or assigned to user
        return Device.objects.filter(
            Q(organization_id__in=user_orgs) | Q(user=user)
        ).distinct()

    @action(detail=False, methods=['post'])
    def register(self, request):
        """Register a new device."""
        serializer = DeviceRegistrationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        device_id = serializer.validated_data['device_id']

        # Get organization from request user
        org_membership = OrganizationMember.objects.filter(
            user=request.user,
            is_active=True
        ).first()

        if not org_membership:
            return Response(
                {'error': 'User is not a member of any organization'},
                status=status.HTTP_400_BAD_REQUEST
            )

        organization = org_membership.organization

        # Check if organization can add more devices
        if not organization.can_add_device():
            return Response(
                {'error': f'Organization has reached maximum device limit of {organization.max_devices}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if device already exists
        device = Device.objects.filter(device_id=device_id).first()

        if device:
            # Update existing device
            for key, value in serializer.validated_data.items():
                if key != 'device_id' and value is not None:
                    setattr(device, key, value)
            device.last_seen_at = timezone.now()
            device.save()

            return Response(
                DeviceSerializer(device).data,
                status=status.HTTP_200_OK
            )

        # Create new device
        api_key = secrets.token_urlsafe(32)
        api_key_hash = hashlib.sha256(api_key.encode()).hexdigest()

        device = Device.objects.create(
            organization=organization,
            user=request.user,
            device_id=device_id,
            name=serializer.validated_data['name'],
            hostname=serializer.validated_data.get('hostname', ''),
            os_type=serializer.validated_data['os_type'],
            os_version=serializer.validated_data.get('os_version', ''),
            os_build=serializer.validated_data.get('os_build', ''),
            cpu_model=serializer.validated_data.get('cpu_model', ''),
            cpu_cores=serializer.validated_data.get('cpu_cores'),
            ram_total_gb=serializer.validated_data.get('ram_total_gb'),
            disk_total_gb=serializer.validated_data.get('disk_total_gb'),
            manufacturer=serializer.validated_data.get('manufacturer', ''),
            model=serializer.validated_data.get('model', ''),
            device_type=serializer.validated_data.get('device_type', 'DESKTOP'),
            serial_number=serializer.validated_data.get('serial_number', ''),
            mac_address=serializer.validated_data.get('mac_address', ''),
            agent_version=serializer.validated_data.get('agent_version', ''),
            agent_installed_at=timezone.now(),
            last_seen_at=timezone.now(),
            api_key_hash=api_key_hash,
        )

        response_data = DeviceSerializer(device).data
        response_data['api_key'] = api_key  # Only returned once during registration

        return Response(response_data, status=status.HTTP_201_CREATED)

    @action(detail=True, methods=['post'])
    def heartbeat(self, request, pk=None):
        """Update device heartbeat (last seen)."""
        device = self.get_object()
        device.last_seen_at = timezone.now()
        device.save(update_fields=['last_seen_at'])

        return Response({'message': 'Heartbeat recorded'})

    @action(detail=True, methods=['post'])
    def health_check(self, request, pk=None):
        """Submit device health check data."""
        device = self.get_object()
        serializer = DeviceHealthCheckSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Create health record
        health = DeviceHealth.objects.create(
            device=device,
            **serializer.validated_data
        )
        health.check_thresholds()

        # Update device last_seen
        device.last_seen_at = timezone.now()
        device.save(update_fields=['last_seen_at'])

        return Response(
            DeviceHealthSerializer(health).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['get'])
    def health_history(self, request, pk=None):
        """Get device health history."""
        device = self.get_object()
        limit = int(request.query_params.get('limit', 100))

        health_records = DeviceHealth.objects.filter(
            device=device
        ).order_by('-created_at')[:limit]

        serializer = DeviceHealthSerializer(health_records, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def metrics(self, request, pk=None):
        """Get device metrics."""
        device = self.get_object()
        metric_type = request.query_params.get('type', 'DAILY')

        metrics = DeviceMetrics.objects.filter(
            device=device,
            metric_type=metric_type
        ).order_by('-period_start')[:30]

        serializer = DeviceMetricsSerializer(metrics, many=True)
        return Response(serializer.data)


class DeviceHealthViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for DeviceHealth read operations."""
    serializer_class = DeviceHealthSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get health records for user's devices."""
        user = self.request.user
        if user.is_superuser:
            return DeviceHealth.objects.all()

        user_orgs = OrganizationMember.objects.filter(
            user=user,
            is_active=True
        ).values_list('organization_id', flat=True)

        return DeviceHealth.objects.filter(
            Q(device__organization_id__in=user_orgs) | Q(device__user=user)
        ).select_related('device').distinct()


class DeviceMetricsViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for DeviceMetrics read operations."""
    serializer_class = DeviceMetricsSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get metrics for user's devices."""
        user = self.request.user
        if user.is_superuser:
            return DeviceMetrics.objects.all()

        user_orgs = OrganizationMember.objects.filter(
            user=user,
            is_active=True
        ).values_list('organization_id', flat=True)

        return DeviceMetrics.objects.filter(
            Q(device__organization_id__in=user_orgs) | Q(device__user=user)
        ).select_related('device').distinct()
