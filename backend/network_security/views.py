"""
Network Security Views
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q, Count, Avg
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    WiFiAnalysis,
    ThreatDetection,
    PatchStatus,
    AntivirusStatus,
    PasswordAudit
)
from .serializers import (
    WiFiAnalysisSerializer,
    ThreatDetectionSerializer,
    PatchStatusSerializer,
    AntivirusStatusSerializer,
    PasswordAuditSerializer
)
from common.permissions import IsOrganizationMember


class WiFiAnalysisViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing WiFi analysis records
    """
    permission_classes = [IsAuthenticated]
    serializer_class = WiFiAnalysisSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['device', 'ssid', 'interference_detected']
    search_fields = ['ssid', 'device__name']
    ordering_fields = ['created_at', 'signal_strength', 'download_speed', 'latency']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter WiFi analyses by user's devices"""
        user = self.request.user
        if hasattr(user, 'organization') and user.organization:
            # Organization users see all org devices
            return WiFiAnalysis.objects.filter(
                device__organization=user.organization
            ).select_related('device')
        else:
            # Individual users see only their devices
            return WiFiAnalysis.objects.filter(
                device__user=user
            ).select_related('device')

    @action(detail=False, methods=['get'])
    def latest(self, request):
        """Get latest WiFi analysis for each device"""
        queryset = self.get_queryset()

        # Get latest analysis for each unique device
        device_ids = queryset.values_list('device', flat=True).distinct()
        latest_analyses = []

        for device_id in device_ids:
            latest = queryset.filter(device_id=device_id).first()
            if latest:
                latest_analyses.append(latest)

        serializer = self.get_serializer(latest_analyses, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def poor_performance(self, request):
        """Get devices with poor WiFi performance"""
        queryset = self.get_queryset().filter(
            Q(signal_strength__lt=-70) |  # Poor signal
            Q(download_speed__lt=10) |    # Slow download
            Q(latency__gt=100) |          # High latency
            Q(interference_detected=True) # Interference
        )

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get WiFi analysis statistics"""
        queryset = self.get_queryset()

        stats = {
            'total_analyses': queryset.count(),
            'average_signal': queryset.aggregate(Avg('signal_strength'))['signal_strength__avg'],
            'average_download_speed': queryset.aggregate(Avg('download_speed'))['download_speed__avg'],
            'average_latency': queryset.aggregate(Avg('latency'))['latency__avg'],
            'interference_count': queryset.filter(interference_detected=True).count(),
            'unique_networks': queryset.values('ssid').distinct().count(),
        }

        return Response(stats)


class ThreatDetectionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing threat detections
    """
    permission_classes = [IsAuthenticated, IsOrganizationMember]
    serializer_class = ThreatDetectionSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['device', 'threat_type', 'severity', 'status']
    search_fields = ['details']
    ordering_fields = ['detected_at', 'severity']
    ordering = ['-detected_at', '-severity']

    def get_queryset(self):
        """Filter threats by organization"""
        user = self.request.user
        return ThreatDetection.objects.filter(
            organization=user.organization
        ).select_related('device', 'organization')

    def perform_create(self, serializer):
        """Create a new threat with organization context"""
        serializer.save(organization=self.request.user.organization)

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """Mark a threat as resolved"""
        threat = self.get_object()
        threat.status = 'RESOLVED'
        threat.save()

        serializer = self.get_serializer(threat)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def ignore(self, request, pk=None):
        """Ignore a threat"""
        threat = self.get_object()
        threat.status = 'IGNORED'
        threat.save()

        serializer = self.get_serializer(threat)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all active threats"""
        queryset = self.get_queryset().filter(status__in=['DETECTED', 'IN_PROGRESS'])
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def critical(self, request):
        """Get all critical threats"""
        queryset = self.get_queryset().filter(
            severity='CRITICAL',
            status__in=['DETECTED', 'IN_PROGRESS']
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get threat statistics"""
        queryset = self.get_queryset()

        stats = {
            'total_threats': queryset.count(),
            'active_threats': queryset.filter(status__in=['DETECTED', 'IN_PROGRESS']).count(),
            'resolved_threats': queryset.filter(status='RESOLVED').count(),
            'by_severity': {
                'critical': queryset.filter(severity='CRITICAL').count(),
                'high': queryset.filter(severity='HIGH').count(),
                'medium': queryset.filter(severity='MEDIUM').count(),
                'low': queryset.filter(severity='LOW').count(),
            },
            'by_type': queryset.values('threat_type').annotate(count=Count('id')),
            'by_status': queryset.values('status').annotate(count=Count('id')),
        }

        return Response(stats)


class PatchStatusViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing patch status
    """
    permission_classes = [IsAuthenticated]
    serializer_class = PatchStatusSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['device', 'patch_type', 'severity', 'installed']
    search_fields = ['patch_name', 'current_version', 'available_version']
    ordering_fields = ['release_date', 'severity']
    ordering = ['-release_date', '-severity']

    def get_queryset(self):
        """Filter patches by user's devices"""
        user = self.request.user
        if hasattr(user, 'organization') and user.organization:
            return PatchStatus.objects.filter(
                device__organization=user.organization
            ).select_related('device')
        else:
            return PatchStatus.objects.filter(
                device__user=user
            ).select_related('device')

    @action(detail=True, methods=['post'])
    def mark_installed(self, request, pk=None):
        """Mark a patch as installed"""
        patch = self.get_object()
        patch.installed = True
        patch.save()

        serializer = self.get_serializer(patch)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def pending(self, request):
        """Get all pending patches"""
        queryset = self.get_queryset().filter(installed=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def critical_pending(self, request):
        """Get all critical pending patches"""
        queryset = self.get_queryset().filter(
            installed=False,
            severity='CRITICAL'
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def overdue(self, request):
        """Get overdue patches (critical patches older than 7 days)"""
        from datetime import timedelta
        cutoff_date = timezone.now().date() - timedelta(days=7)

        queryset = self.get_queryset().filter(
            installed=False,
            severity='CRITICAL',
            release_date__lt=cutoff_date
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get patch statistics"""
        queryset = self.get_queryset()

        stats = {
            'total_patches': queryset.count(),
            'installed': queryset.filter(installed=True).count(),
            'pending': queryset.filter(installed=False).count(),
            'by_severity': {
                'critical': queryset.filter(severity='CRITICAL', installed=False).count(),
                'high': queryset.filter(severity='HIGH', installed=False).count(),
                'medium': queryset.filter(severity='MEDIUM', installed=False).count(),
                'low': queryset.filter(severity='LOW', installed=False).count(),
            },
            'by_type': queryset.values('patch_type').annotate(count=Count('id')),
        }

        return Response(stats)


class AntivirusStatusViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing antivirus status
    """
    permission_classes = [IsAuthenticated]
    serializer_class = AntivirusStatusSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['device', 'antivirus_name', 'enabled', 'scan_status']
    search_fields = ['antivirus_name', 'version']
    ordering_fields = ['created_at', 'last_update']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter antivirus statuses by user's devices"""
        user = self.request.user
        if hasattr(user, 'organization') and user.organization:
            return AntivirusStatus.objects.filter(
                device__organization=user.organization
            ).select_related('device')
        else:
            return AntivirusStatus.objects.filter(
                device__user=user
            ).select_related('device')

    @action(detail=False, methods=['get'])
    def latest(self, request):
        """Get latest antivirus status for each device"""
        queryset = self.get_queryset()

        # Get latest status for each unique device
        device_ids = queryset.values_list('device', flat=True).distinct()
        latest_statuses = []

        for device_id in device_ids:
            latest = queryset.filter(device_id=device_id).first()
            if latest:
                latest_statuses.append(latest)

        serializer = self.get_serializer(latest_statuses, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def disabled(self, request):
        """Get devices with disabled antivirus"""
        queryset = self.get_queryset().filter(enabled=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def outdated(self, request):
        """Get devices with outdated virus definitions"""
        from datetime import timedelta
        cutoff_date = timezone.now().date() - timedelta(days=7)

        queryset = self.get_queryset().filter(
            Q(definitions_date__lt=cutoff_date) |
            Q(definitions_date__isnull=True)
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def threats_found(self, request):
        """Get devices with threats found"""
        queryset = self.get_queryset().filter(scan_status='THREAT_FOUND')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get antivirus statistics"""
        queryset = self.get_queryset()

        stats = {
            'total_devices': queryset.values('device').distinct().count(),
            'enabled': queryset.filter(enabled=True).values('device').distinct().count(),
            'disabled': queryset.filter(enabled=False).values('device').distinct().count(),
            'threats_found': queryset.filter(scan_status='THREAT_FOUND').count(),
            'by_antivirus': queryset.values('antivirus_name').annotate(count=Count('id')),
            'by_scan_status': queryset.values('scan_status').annotate(count=Count('id')),
        }

        return Response(stats)


class PasswordAuditViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing password audits
    """
    permission_classes = [IsAuthenticated]
    serializer_class = PasswordAuditSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['user', 'service_name', 'is_reused', 'compliant']
    search_fields = ['service_name']
    ordering_fields = ['created_at', 'strength_score', 'days_since_change']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter password audits - users see only their own, admins see organization"""
        user = self.request.user

        # If user is admin in an organization, show all org users' audits
        if hasattr(user, 'organization') and user.organization:
            if user.role in ['OWNER', 'ADMIN']:
                return PasswordAudit.objects.filter(
                    user__organization=user.organization
                ).select_related('user')

        # Regular users see only their own audits
        return PasswordAudit.objects.filter(user=user).select_related('user')

    @action(detail=False, methods=['get'])
    def weak(self, request):
        """Get weak passwords (score < 50)"""
        queryset = self.get_queryset().filter(strength_score__lt=50)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def reused(self, request):
        """Get reused passwords"""
        queryset = self.get_queryset().filter(is_reused=True)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def non_compliant(self, request):
        """Get non-compliant passwords"""
        queryset = self.get_queryset().filter(compliant=False)
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def needs_change(self, request):
        """Get passwords that need to be changed"""
        queryset = self.get_queryset().filter(
            Q(compliant=False) |
            Q(is_reused=True) |
            Q(days_since_change__gt=90)
        )
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get password audit statistics"""
        queryset = self.get_queryset()

        stats = {
            'total_audits': queryset.count(),
            'weak_passwords': queryset.filter(strength_score__lt=50).count(),
            'reused_passwords': queryset.filter(is_reused=True).count(),
            'non_compliant': queryset.filter(compliant=False).count(),
            'needs_change': queryset.filter(
                Q(compliant=False) | Q(is_reused=True) | Q(days_since_change__gt=90)
            ).count(),
            'average_strength': queryset.aggregate(Avg('strength_score'))['strength_score__avg'],
            'by_strength': {
                'strong': queryset.filter(strength_score__gte=75).count(),
                'good': queryset.filter(strength_score__gte=50, strength_score__lt=75).count(),
                'fair': queryset.filter(strength_score__gte=25, strength_score__lt=50).count(),
                'weak': queryset.filter(strength_score__lt=25).count(),
            },
        }

        return Response(stats)
