"""
AI Diagnostics Views
"""
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from django.db.models import Q, Count
from django_filters.rest_framework import DjangoFilterBackend

from .models import (
    DiagnosticScan,
    DetectedIssue,
    Recommendation,
    SystemAlert,
    AutoFixAction
)
from .serializers import (
    DiagnosticScanSerializer,
    DiagnosticScanDetailSerializer,
    DetectedIssueSerializer,
    DetectedIssueDetailSerializer,
    RecommendationSerializer,
    SystemAlertSerializer,
    AutoFixActionSerializer
)
from common.permissions import IsOrganizationMember


class DiagnosticScanViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing diagnostic scans
    """
    permission_classes = [IsAuthenticated, IsOrganizationMember]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['device', 'scan_type', 'status']
    search_fields = ['error_message']
    ordering_fields = ['created_at', 'started_at', 'completed_at', 'issues_found']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter scans by organization"""
        user = self.request.user
        return DiagnosticScan.objects.filter(
            organization=user.organization
        ).select_related(
            'device', 'organization', 'initiated_by'
        ).prefetch_related('issues')

    def get_serializer_class(self):
        """Use detailed serializer for retrieve action"""
        if self.action == 'retrieve':
            return DiagnosticScanDetailSerializer
        return DiagnosticScanSerializer

    def perform_create(self, serializer):
        """Create a new scan with organization context"""
        serializer.save(
            organization=self.request.user.organization,
            initiated_by=self.request.user
        )

    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        """Start a pending scan"""
        scan = self.get_object()
        if scan.status != 'PENDING':
            return Response(
                {'error': 'Scan is not in pending state'},
                status=status.HTTP_400_BAD_REQUEST
            )

        scan.status = 'RUNNING'
        scan.started_at = timezone.now()
        scan.save()

        # TODO: Trigger actual scan via Celery task
        # from .tasks import perform_diagnostic_scan
        # perform_diagnostic_scan.delay(scan.id)

        serializer = self.get_serializer(scan)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel a running scan"""
        scan = self.get_object()
        if scan.status not in ['PENDING', 'RUNNING']:
            return Response(
                {'error': 'Cannot cancel scan in current state'},
                status=status.HTTP_400_BAD_REQUEST
            )

        scan.status = 'CANCELLED'
        scan.completed_at = timezone.now()
        scan.save()

        serializer = self.get_serializer(scan)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get diagnostic scan statistics"""
        queryset = self.get_queryset()

        stats = {
            'total_scans': queryset.count(),
            'completed_scans': queryset.filter(status='COMPLETED').count(),
            'running_scans': queryset.filter(status='RUNNING').count(),
            'failed_scans': queryset.filter(status='FAILED').count(),
            'total_issues_found': sum(queryset.values_list('issues_found', flat=True)),
            'critical_issues': sum(queryset.values_list('critical_issues', flat=True)),
            'high_issues': sum(queryset.values_list('high_issues', flat=True)),
            'by_type': queryset.values('scan_type').annotate(count=Count('id'))
        }

        return Response(stats)


class DetectedIssueViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing detected issues
    """
    permission_classes = [IsAuthenticated, IsOrganizationMember]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['device', 'category', 'severity', 'status', 'auto_fixable', 'fix_applied']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'severity', 'resolved_at']
    ordering = ['-severity', '-created_at']

    def get_queryset(self):
        """Filter issues by organization"""
        user = self.request.user
        return DetectedIssue.objects.filter(
            organization=user.organization
        ).select_related(
            'scan', 'device', 'organization', 'resolved_by'
        ).prefetch_related('recommendations', 'alerts')

    def get_serializer_class(self):
        """Use detailed serializer for retrieve action"""
        if self.action == 'retrieve':
            return DetectedIssueDetailSerializer
        return DetectedIssueSerializer

    def perform_create(self, serializer):
        """Create a new issue with organization context"""
        serializer.save(organization=self.request.user.organization)

    @action(detail=True, methods=['post'])
    def acknowledge(self, request, pk=None):
        """Acknowledge an issue"""
        issue = self.get_object()
        issue.status = 'ACKNOWLEDGED'
        issue.save()

        serializer = self.get_serializer(issue)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """Mark an issue as resolved"""
        issue = self.get_object()
        issue.status = 'RESOLVED'
        issue.resolved_at = timezone.now()
        issue.resolved_by = request.user
        issue.save()

        serializer = self.get_serializer(issue)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def ignore(self, request, pk=None):
        """Ignore an issue"""
        issue = self.get_object()
        issue.status = 'IGNORED'
        issue.save()

        serializer = self.get_serializer(issue)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get issue statistics"""
        queryset = self.get_queryset()

        stats = {
            'total_issues': queryset.count(),
            'new_issues': queryset.filter(status='NEW').count(),
            'in_progress': queryset.filter(status='IN_PROGRESS').count(),
            'resolved': queryset.filter(status='RESOLVED').count(),
            'ignored': queryset.filter(status='IGNORED').count(),
            'by_severity': {
                'critical': queryset.filter(severity='CRITICAL').count(),
                'high': queryset.filter(severity='HIGH').count(),
                'medium': queryset.filter(severity='MEDIUM').count(),
                'low': queryset.filter(severity='LOW').count(),
            },
            'by_category': queryset.values('category').annotate(count=Count('id')),
            'auto_fixable': queryset.filter(auto_fixable=True).count(),
            'fix_applied': queryset.filter(fix_applied=True).count(),
        }

        return Response(stats)

    @action(detail=False, methods=['get'])
    def critical(self, request):
        """Get all critical issues"""
        queryset = self.get_queryset().filter(severity='CRITICAL', status__in=['NEW', 'ACKNOWLEDGED', 'IN_PROGRESS'])
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class RecommendationViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing recommendations
    """
    permission_classes = [IsAuthenticated, IsOrganizationMember]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['issue', 'risk_level', 'status', 'requires_restart', 'requires_downtime']
    search_fields = ['title', 'description']
    ordering_fields = ['created_at', 'estimated_time', 'success_rate']
    ordering = ['risk_level', '-created_at']

    def get_queryset(self):
        """Filter recommendations by organization"""
        user = self.request.user
        return Recommendation.objects.filter(
            organization=user.organization
        ).select_related(
            'issue', 'organization', 'applied_by'
        )

    def perform_create(self, serializer):
        """Create a new recommendation with organization context"""
        serializer.save(organization=self.request.user.organization)

    @action(detail=True, methods=['post'])
    def accept(self, request, pk=None):
        """Accept a recommendation"""
        recommendation = self.get_object()
        recommendation.status = 'ACCEPTED'
        recommendation.save()

        serializer = self.get_serializer(recommendation)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def reject(self, request, pk=None):
        """Reject a recommendation"""
        recommendation = self.get_object()
        recommendation.status = 'REJECTED'
        recommendation.save()

        serializer = self.get_serializer(recommendation)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def apply(self, request, pk=None):
        """Apply a recommendation"""
        recommendation = self.get_object()
        recommendation.status = 'APPLIED'
        recommendation.applied_at = timezone.now()
        recommendation.applied_by = request.user
        recommendation.times_applied += 1
        recommendation.save()

        # TODO: Trigger actual fix application via Celery task
        # from .tasks import apply_recommendation
        # apply_recommendation.delay(recommendation.id)

        serializer = self.get_serializer(recommendation)
        return Response(serializer.data)


class SystemAlertViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing system alerts
    """
    permission_classes = [IsAuthenticated, IsOrganizationMember]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['device', 'alert_type', 'source', 'status']
    search_fields = ['title', 'message']
    ordering_fields = ['created_at', 'acknowledged_at', 'resolved_at']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter alerts by organization"""
        user = self.request.user
        return SystemAlert.objects.filter(
            organization=user.organization
        ).select_related(
            'device', 'organization', 'issue', 'acknowledged_by'
        )

    def perform_create(self, serializer):
        """Create a new alert with organization context"""
        serializer.save(organization=self.request.user.organization)

    @action(detail=True, methods=['post'])
    def acknowledge(self, request, pk=None):
        """Acknowledge an alert"""
        alert = self.get_object()
        alert.status = 'ACKNOWLEDGED'
        alert.acknowledged_at = timezone.now()
        alert.acknowledged_by = request.user
        alert.save()

        serializer = self.get_serializer(alert)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def resolve(self, request, pk=None):
        """Resolve an alert"""
        alert = self.get_object()
        alert.status = 'RESOLVED'
        alert.resolved_at = timezone.now()
        alert.save()

        serializer = self.get_serializer(alert)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def dismiss(self, request, pk=None):
        """Dismiss an alert"""
        alert = self.get_object()
        alert.status = 'DISMISSED'
        alert.save()

        serializer = self.get_serializer(alert)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def active(self, request):
        """Get all active alerts"""
        queryset = self.get_queryset().filter(status='ACTIVE')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def critical(self, request):
        """Get all critical alerts"""
        queryset = self.get_queryset().filter(alert_type='CRITICAL', status='ACTIVE')
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)


class AutoFixActionViewSet(viewsets.ModelViewSet):
    """
    ViewSet for managing auto-fix actions
    """
    permission_classes = [IsAuthenticated, IsOrganizationMember]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['device', 'issue', 'action_type', 'status', 'rollback_possible']
    search_fields = ['error_message']
    ordering_fields = ['created_at', 'executed_at', 'completed_at']
    ordering = ['-created_at']

    def get_queryset(self):
        """Filter actions by organization"""
        user = self.request.user
        return AutoFixAction.objects.filter(
            organization=user.organization
        ).select_related(
            'issue', 'recommendation', 'device', 'organization'
        )

    def perform_create(self, serializer):
        """Create a new action with organization context"""
        serializer.save(organization=self.request.user.organization)

    @action(detail=True, methods=['post'])
    def execute(self, request, pk=None):
        """Execute an auto-fix action"""
        action = self.get_object()
        if action.status != 'PENDING':
            return Response(
                {'error': 'Action is not in pending state'},
                status=status.HTTP_400_BAD_REQUEST
            )

        action.status = 'RUNNING'
        action.executed_at = timezone.now()
        action.save()

        # TODO: Trigger actual fix execution via Celery task
        # from .tasks import execute_auto_fix
        # execute_auto_fix.delay(action.id)

        serializer = self.get_serializer(action)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def rollback(self, request, pk=None):
        """Rollback an auto-fix action"""
        action = self.get_object()
        if not action.rollback_possible:
            return Response(
                {'error': 'Rollback is not possible for this action'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if action.status != 'SUCCESS':
            return Response(
                {'error': 'Can only rollback successful actions'},
                status=status.HTTP_400_BAD_REQUEST
            )

        action.status = 'ROLLED_BACK'
        action.rolled_back_at = timezone.now()
        action.save()

        # TODO: Trigger actual rollback via Celery task
        # from .tasks import rollback_auto_fix
        # rollback_auto_fix.delay(action.id)

        serializer = self.get_serializer(action)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def stats(self, request):
        """Get auto-fix action statistics"""
        queryset = self.get_queryset()

        stats = {
            'total_actions': queryset.count(),
            'pending': queryset.filter(status='PENDING').count(),
            'running': queryset.filter(status='RUNNING').count(),
            'success': queryset.filter(status='SUCCESS').count(),
            'failed': queryset.filter(status='FAILED').count(),
            'rolled_back': queryset.filter(status='ROLLED_BACK').count(),
            'by_action_type': queryset.values('action_type').annotate(count=Count('id')),
            'success_rate': (queryset.filter(status='SUCCESS').count() / queryset.count() * 100) if queryset.count() > 0 else 0
        }

        return Response(stats)
