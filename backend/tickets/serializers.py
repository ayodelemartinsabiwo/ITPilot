"""
Serializers for Tickets app.
"""

from rest_framework import serializers
from .models import Ticket, TicketMessage, TicketEscalation, TicketAttachment


class TicketMessageSerializer(serializers.ModelSerializer):
    """Serializer for TicketMessage model."""
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = TicketMessage
        fields = [
            'id', 'ticket', 'user', 'user_name', 'user_email',
            'message', 'is_internal', 'is_system', 'attachments',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'is_system', 'created_at', 'updated_at']


class TicketAttachmentSerializer(serializers.ModelSerializer):
    """Serializer for TicketAttachment model."""
    uploaded_by_name = serializers.CharField(source='uploaded_by.full_name', read_only=True)
    file_url = serializers.SerializerMethodField()
    file_size_display = serializers.SerializerMethodField()

    class Meta:
        model = TicketAttachment
        fields = [
            'id', 'ticket', 'uploaded_by', 'uploaded_by_name',
            'file', 'file_url', 'filename', 'file_size',
            'file_size_display', 'mime_type', 'created_at'
        ]
        read_only_fields = ['id', 'uploaded_by', 'created_at']

    def get_file_url(self, obj):
        """Get file URL."""
        request = self.context.get('request')
        if obj.file and hasattr(obj.file, 'url'):
            if request:
                return request.build_absolute_uri(obj.file.url)
            return obj.file.url
        return None

    def get_file_size_display(self, obj):
        """Get human-readable file size."""
        return obj.get_file_size_display()


class TicketEscalationSerializer(serializers.ModelSerializer):
    """Serializer for TicketEscalation model."""
    escalated_by_name = serializers.CharField(source='escalated_by.full_name', read_only=True)
    escalated_to_name = serializers.CharField(source='escalated_to.full_name', read_only=True)
    ticket_number = serializers.CharField(source='ticket.ticket_number', read_only=True)

    class Meta:
        model = TicketEscalation
        fields = [
            'id', 'ticket', 'ticket_number', 'escalated_by',
            'escalated_by_name', 'escalated_to', 'escalated_to_name',
            'from_level', 'to_level', 'reason', 'notes',
            'is_active', 'resolved_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'escalated_by', 'created_at', 'updated_at']


class TicketSerializer(serializers.ModelSerializer):
    """Serializer for Ticket model."""
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    created_by_email = serializers.EmailField(source='created_by.email', read_only=True)
    assigned_to_name = serializers.CharField(source='assigned_to.full_name', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    device_name = serializers.CharField(source='device.name', read_only=True)
    message_count = serializers.SerializerMethodField()
    is_overdue = serializers.SerializerMethodField()
    response_time_minutes = serializers.SerializerMethodField()
    resolution_time_minutes = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = [
            'id', 'organization', 'organization_name', 'created_by',
            'created_by_name', 'created_by_email', 'assigned_to',
            'assigned_to_name', 'ticket_number', 'title', 'description',
            'category', 'priority', 'status', 'device', 'device_name',
            'first_response_at', 'resolved_at', 'closed_at', 'due_at',
            'response_sla_minutes', 'resolution_sla_minutes', 'sla_breached',
            'rating', 'feedback', 'tags', 'custom_fields', 'internal_notes',
            'message_count', 'is_overdue', 'response_time_minutes',
            'resolution_time_minutes', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'ticket_number', 'created_by', 'organization',
            'first_response_at', 'resolved_at', 'closed_at',
            'created_at', 'updated_at'
        ]

    def get_message_count(self, obj):
        """Get number of messages on ticket."""
        return obj.messages.count()

    def get_is_overdue(self, obj):
        """Check if ticket is overdue."""
        return obj.is_overdue()

    def get_response_time_minutes(self, obj):
        """Get response time in minutes."""
        return obj.get_response_time_minutes()

    def get_resolution_time_minutes(self, obj):
        """Get resolution time in minutes."""
        return obj.get_resolution_time_minutes()


class TicketDetailSerializer(TicketSerializer):
    """Detailed ticket serializer with messages and escalations."""
    messages = TicketMessageSerializer(many=True, read_only=True)
    escalations = TicketEscalationSerializer(many=True, read_only=True)
    attachments = TicketAttachmentSerializer(many=True, read_only=True)

    class Meta(TicketSerializer.Meta):
        fields = TicketSerializer.Meta.fields + ['messages', 'escalations', 'attachments']


class CreateTicketSerializer(serializers.Serializer):
    """Serializer for creating a new ticket."""
    title = serializers.CharField(max_length=255)
    description = serializers.TextField()
    category = serializers.ChoiceField(choices=Ticket.CATEGORY_CHOICES)
    priority = serializers.ChoiceField(choices=Ticket.PRIORITY_CHOICES, default='MEDIUM')
    device = serializers.UUIDField(required=False, allow_null=True)
    tags = serializers.ListField(
        child=serializers.CharField(max_length=50),
        required=False,
        default=list
    )


class UpdateTicketStatusSerializer(serializers.Serializer):
    """Serializer for updating ticket status."""
    status = serializers.ChoiceField(choices=Ticket.STATUS_CHOICES)
    notes = serializers.CharField(required=False, allow_blank=True)


class AssignTicketSerializer(serializers.Serializer):
    """Serializer for assigning ticket to technician."""
    assigned_to = serializers.UUIDField()
    notes = serializers.CharField(required=False, allow_blank=True)


class RateTicketSerializer(serializers.Serializer):
    """Serializer for rating a resolved ticket."""
    rating = serializers.IntegerField(min_value=1, max_value=5)
    feedback = serializers.CharField(required=False, allow_blank=True)
