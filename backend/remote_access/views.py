"""
Views for Remote Access app.
"""

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from datetime import timedelta
from organizations.models import OrganizationMember
from devices.models import Device
from tickets.models import Ticket
from .models import RemoteSession, SessionLog, SessionRecording, RemoteCommand
from .serializers import (
    RemoteSessionSerializer,
    SessionLogSerializer,
    SessionRecordingSerializer,
    RemoteCommandSerializer,
    CreateRemoteSessionSerializer
)


class RemoteSessionViewSet(viewsets.ModelViewSet):
    """ViewSet for RemoteSession CRUD operations."""
    serializer_class = RemoteSessionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get remote sessions for user."""
        user = self.request.user
        if user.is_superuser:
            return RemoteSession.objects.all()

        user_orgs = OrganizationMember.objects.filter(
            user=user,
            is_active=True
        ).values_list('organization_id', flat=True)

        return RemoteSession.objects.filter(
            Q(organization_id__in=user_orgs) |
            Q(technician=user) |
            Q(device__user=user)
        ).select_related(
            'technician', 'device', 'organization', 'approved_by', 'ticket'
        ).distinct()

    @action(detail=False, methods=['post'])
    def create_session(self, request):
        """Create a new remote session."""
        serializer = CreateRemoteSessionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        device_id = serializer.validated_data['device_id']
        device = Device.objects.filter(id=device_id).first()

        if not device:
            return Response(
                {'error': 'Device not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Check if user has access to device's organization
        user_orgs = OrganizationMember.objects.filter(
            user=request.user,
            is_active=True
        ).values_list('organization_id', flat=True)

        if device.organization_id not in user_orgs:
            return Response(
                {'error': 'You do not have access to this device'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get ticket if specified
        ticket = None
        ticket_id = serializer.validated_data.get('ticket_id')
        if ticket_id:
            ticket = Ticket.objects.filter(id=ticket_id).first()

        # Calculate expiration
        max_duration = serializer.validated_data['max_duration_minutes']
        expires_at = timezone.now() + timedelta(minutes=max_duration)

        # Create session
        session = RemoteSession.objects.create(
            technician=request.user,
            device=device,
            organization=device.organization,
            session_type=serializer.validated_data['session_type'],
            ticket=ticket,
            reason=serializer.validated_data.get('reason', ''),
            max_duration_minutes=max_duration,
            require_2fa=serializer.validated_data['require_2fa'],
            expires_at=expires_at
        )

        return Response(
            RemoteSessionSerializer(session).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'])
    def approve(self, request, pk=None):
        """Approve a pending remote session."""
        session = self.get_object()

        if session.status != 'PENDING':
            return Response(
                {'error': 'Session is not pending approval'},
                status=status.HTTP_400_BAD_REQUEST
            )

        session.status = 'ACTIVE'
        session.approved_by = request.user
        session.approved_at = timezone.now()
        session.started_at = timezone.now()
        session.save()

        # Log approval
        SessionLog.objects.create(
            session=session,
            action_type='CONNECT',
            description='Session approved and started',
            user=request.user,
            was_successful=True
        )

        return Response(
            RemoteSessionSerializer(session).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def start(self, request, pk=None):
        """Start a remote session."""
        session = self.get_object()

        if session.status == 'ACTIVE':
            return Response(
                {'error': 'Session is already active'},
                status=status.HTTP_400_BAD_REQUEST
            )

        if not session.requires_approval or session.approved_at:
            session.status = 'ACTIVE'
            session.started_at = timezone.now()
            session.save()

            SessionLog.objects.create(
                session=session,
                action_type='CONNECT',
                description='Session started',
                user=request.user,
                was_successful=True
            )

            return Response(
                RemoteSessionSerializer(session).data,
                status=status.HTTP_200_OK
            )

        return Response(
            {'error': 'Session requires approval'},
            status=status.HTTP_400_BAD_REQUEST
        )

    @action(detail=True, methods=['post'])
    def end(self, request, pk=None):
        """End a remote session."""
        session = self.get_object()

        if session.status != 'ACTIVE':
            return Response(
                {'error': 'Session is not active'},
                status=status.HTTP_400_BAD_REQUEST
            )

        session.status = 'COMPLETED'
        session.ended_at = timezone.now()
        session.calculate_duration()

        SessionLog.objects.create(
            session=session,
            action_type='DISCONNECT',
            description='Session ended',
            user=request.user,
            was_successful=True
        )

        return Response(
            RemoteSessionSerializer(session).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['get'])
    def logs(self, request, pk=None):
        """Get session logs."""
        session = self.get_object()
        logs = session.logs.all()
        serializer = SessionLogSerializer(logs, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def recording(self, request, pk=None):
        """Get session recording."""
        session = self.get_object()
        try:
            recording = session.recording
            serializer = SessionRecordingSerializer(recording)
            return Response(serializer.data)
        except SessionRecording.DoesNotExist:
            return Response(
                {'error': 'No recording found for this session'},
                status=status.HTTP_404_NOT_FOUND
            )


class SessionLogViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for SessionLog read operations."""
    serializer_class = SessionLogSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get session logs for user's sessions."""
        user = self.request.user
        if user.is_superuser:
            return SessionLog.objects.all()

        user_orgs = OrganizationMember.objects.filter(
            user=user,
            is_active=True
        ).values_list('organization_id', flat=True)

        return SessionLog.objects.filter(
            Q(session__organization_id__in=user_orgs) |
            Q(session__technician=user) |
            Q(user=user)
        ).select_related('session', 'user').distinct()


class SessionRecordingViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for SessionRecording read operations."""
    serializer_class = SessionRecordingSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get session recordings for user's sessions."""
        user = self.request.user
        if user.is_superuser:
            return SessionRecording.objects.all()

        user_orgs = OrganizationMember.objects.filter(
            user=user,
            is_active=True
        ).values_list('organization_id', flat=True)

        return SessionRecording.objects.filter(
            Q(session__organization_id__in=user_orgs) |
            Q(session__technician=user)
        ).select_related('session').distinct()

    @action(detail=True, methods=['post'])
    def increment_access(self, request, pk=None):
        """Increment access count for recording."""
        recording = self.get_object()
        recording.access_count += 1
        recording.last_accessed_at = timezone.now()
        recording.save(update_fields=['access_count', 'last_accessed_at'])

        return Response({'access_count': recording.access_count})
