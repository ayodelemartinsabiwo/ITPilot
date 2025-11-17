"""
Views for Tickets app.
"""

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from organizations.models import OrganizationMember
from devices.models import Device
from authentication.models import User
from .models import Ticket, TicketMessage, TicketEscalation, TicketAttachment
from .serializers import (
    TicketSerializer,
    TicketDetailSerializer,
    TicketMessageSerializer,
    TicketEscalationSerializer,
    TicketAttachmentSerializer,
    CreateTicketSerializer,
    UpdateTicketStatusSerializer,
    AssignTicketSerializer,
    RateTicketSerializer
)


class TicketViewSet(viewsets.ModelViewSet):
    """ViewSet for Ticket CRUD operations."""
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'retrieve':
            return TicketDetailSerializer
        return TicketSerializer

    def get_queryset(self):
        """Get tickets for user's organizations."""
        user = self.request.user
        if user.is_superuser:
            return Ticket.objects.all()

        # Get organizations where user is a member
        user_orgs = OrganizationMember.objects.filter(
            user=user,
            is_active=True
        ).values_list('organization_id', flat=True)

        # Get tickets created by user or assigned to user or in user's orgs
        return Ticket.objects.filter(
            Q(organization_id__in=user_orgs) |
            Q(created_by=user) |
            Q(assigned_to=user)
        ).select_related(
            'organization', 'created_by', 'assigned_to', 'device'
        ).distinct()

    def perform_create(self, serializer):
        """Create ticket with current user as creator."""
        # Get user's organization
        org_membership = OrganizationMember.objects.filter(
            user=self.request.user,
            is_active=True
        ).first()

        if not org_membership:
            raise serializers.ValidationError({
                'organization': 'User is not a member of any organization'
            })

        serializer.save(
            organization=org_membership.organization,
            created_by=self.request.user
        )

    @action(detail=False, methods=['post'])
    def create_ticket(self, request):
        """Create a new ticket."""
        serializer = CreateTicketSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Get user's organization
        org_membership = OrganizationMember.objects.filter(
            user=request.user,
            is_active=True
        ).first()

        if not org_membership:
            return Response(
                {'error': 'User is not a member of any organization'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Get device if specified
        device = None
        if serializer.validated_data.get('device'):
            device = Device.objects.filter(
                id=serializer.validated_data['device'],
                organization=org_membership.organization
            ).first()

        # Create ticket
        ticket = Ticket.objects.create(
            organization=org_membership.organization,
            created_by=request.user,
            title=serializer.validated_data['title'],
            description=serializer.validated_data['description'],
            category=serializer.validated_data['category'],
            priority=serializer.validated_data['priority'],
            device=device,
            tags=serializer.validated_data.get('tags', [])
        )

        return Response(
            TicketDetailSerializer(ticket).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'])
    def add_message(self, request, pk=None):
        """Add a message to the ticket."""
        ticket = self.get_object()
        serializer = TicketMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        message = TicketMessage.objects.create(
            ticket=ticket,
            user=request.user,
            message=serializer.validated_data['message'],
            is_internal=serializer.validated_data.get('is_internal', False)
        )

        # Set first response time if this is the first technician response
        if not ticket.first_response_at and request.user != ticket.created_by:
            if request.user.role in ['TECHNICIAN', 'ADMIN', 'SUPERADMIN']:
                ticket.first_response_at = timezone.now()
                ticket.save(update_fields=['first_response_at'])

        return Response(
            TicketMessageSerializer(message).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'])
    def update_status(self, request, pk=None):
        """Update ticket status."""
        ticket = self.get_object()
        serializer = UpdateTicketStatusSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        new_status = serializer.validated_data['status']
        notes = serializer.validated_data.get('notes', '')

        # Update status
        old_status = ticket.status
        ticket.status = new_status

        # Update timestamps based on status
        if new_status == 'RESOLVED' and old_status != 'RESOLVED':
            ticket.resolved_at = timezone.now()
        elif new_status == 'CLOSED' and old_status != 'CLOSED':
            ticket.closed_at = timezone.now()

        ticket.save()

        # Add system message
        if notes:
            TicketMessage.objects.create(
                ticket=ticket,
                user=request.user,
                message=f"Status changed from {old_status} to {new_status}. {notes}",
                is_system=True
            )

        return Response(
            TicketDetailSerializer(ticket).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def assign(self, request, pk=None):
        """Assign ticket to a technician."""
        ticket = self.get_object()
        serializer = AssignTicketSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Get technician
        technician = User.objects.filter(
            id=serializer.validated_data['assigned_to']
        ).first()

        if not technician:
            return Response(
                {'error': 'Technician not found'},
                status=status.HTTP_404_NOT_FOUND
            )

        # Update assignment
        old_assignee = ticket.assigned_to
        ticket.assigned_to = technician
        ticket.status = 'IN_PROGRESS'
        ticket.save()

        # Add system message
        message = f"Ticket assigned to {technician.full_name}"
        if old_assignee:
            message = f"Ticket reassigned from {old_assignee.full_name} to {technician.full_name}"

        notes = serializer.validated_data.get('notes', '')
        if notes:
            message += f". {notes}"

        TicketMessage.objects.create(
            ticket=ticket,
            user=request.user,
            message=message,
            is_system=True
        )

        return Response(
            TicketDetailSerializer(ticket).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def escalate(self, request, pk=None):
        """Escalate ticket to higher level."""
        ticket = self.get_object()

        escalated_to = request.data.get('escalated_to')
        from_level = request.data.get('from_level', 'L1')
        to_level = request.data.get('to_level', 'L2')
        reason = request.data.get('reason', 'OTHER')
        notes = request.data.get('notes', '')

        # Get escalation target user
        target_user = None
        if escalated_to:
            target_user = User.objects.filter(id=escalated_to).first()

        # Create escalation
        escalation = TicketEscalation.objects.create(
            ticket=ticket,
            escalated_by=request.user,
            escalated_to=target_user,
            from_level=from_level,
            to_level=to_level,
            reason=reason,
            notes=notes
        )

        # Update ticket priority if not already critical
        if ticket.priority != 'CRITICAL' and reason == 'SLA_BREACH':
            ticket.priority = 'HIGH'
            ticket.save()

        # Add system message
        TicketMessage.objects.create(
            ticket=ticket,
            user=request.user,
            message=f"Ticket escalated from {from_level} to {to_level}. Reason: {reason}. {notes}",
            is_system=True
        )

        return Response(
            TicketEscalationSerializer(escalation).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['post'])
    def rate(self, request, pk=None):
        """Rate a resolved/closed ticket."""
        ticket = self.get_object()

        # Only creator can rate
        if ticket.created_by != request.user:
            return Response(
                {'error': 'Only ticket creator can rate the ticket'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Only resolved/closed tickets can be rated
        if ticket.status not in ['RESOLVED', 'CLOSED']:
            return Response(
                {'error': 'Only resolved or closed tickets can be rated'},
                status=status.HTTP_400_BAD_REQUEST
            )

        serializer = RateTicketSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        ticket.rating = serializer.validated_data['rating']
        ticket.feedback = serializer.validated_data.get('feedback', '')
        ticket.save()

        return Response(
            TicketDetailSerializer(ticket).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['get'])
    def messages(self, request, pk=None):
        """Get all messages for a ticket."""
        ticket = self.get_object()
        messages = ticket.messages.all()
        serializer = TicketMessageSerializer(messages, many=True)
        return Response(serializer.data)


class TicketMessageViewSet(viewsets.ModelViewSet):
    """ViewSet for TicketMessage CRUD operations."""
    serializer_class = TicketMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get messages for user's tickets."""
        user = self.request.user
        if user.is_superuser:
            return TicketMessage.objects.all()

        user_orgs = OrganizationMember.objects.filter(
            user=user,
            is_active=True
        ).values_list('organization_id', flat=True)

        return TicketMessage.objects.filter(
            Q(ticket__organization_id__in=user_orgs) |
            Q(ticket__created_by=user) |
            Q(ticket__assigned_to=user)
        ).select_related('ticket', 'user').distinct()

    def perform_create(self, serializer):
        """Create message with current user."""
        serializer.save(user=self.request.user)


class TicketEscalationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for TicketEscalation read operations."""
    serializer_class = TicketEscalationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get escalations for user's tickets."""
        user = self.request.user
        if user.is_superuser:
            return TicketEscalation.objects.all()

        user_orgs = OrganizationMember.objects.filter(
            user=user,
            is_active=True
        ).values_list('organization_id', flat=True)

        return TicketEscalation.objects.filter(
            Q(ticket__organization_id__in=user_orgs) |
            Q(escalated_by=user) |
            Q(escalated_to=user)
        ).select_related('ticket', 'escalated_by', 'escalated_to').distinct()
