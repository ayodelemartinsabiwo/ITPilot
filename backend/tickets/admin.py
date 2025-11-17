"""
Django admin configuration for Tickets app.
"""

from django.contrib import admin
from .models import Ticket, TicketMessage, TicketEscalation, TicketAttachment


class TicketMessageInline(admin.TabularInline):
    """Inline admin for ticket messages."""
    model = TicketMessage
    extra = 0
    readonly_fields = ['user', 'created_at']
    fields = ['user', 'message', 'is_internal', 'is_system', 'created_at']


class TicketEscalationInline(admin.TabularInline):
    """Inline admin for ticket escalations."""
    model = TicketEscalation
    extra = 0
    readonly_fields = ['escalated_by', 'created_at']
    fields = ['escalated_by', 'escalated_to', 'from_level', 'to_level', 'reason', 'is_active', 'created_at']


@admin.register(Ticket)
class TicketAdmin(admin.ModelAdmin):
    """Admin interface for Ticket model."""
    list_display = [
        'ticket_number', 'title', 'organization', 'created_by',
        'assigned_to', 'category', 'priority', 'status',
        'sla_breached', 'rating', 'created_at'
    ]
    list_filter = [
        'status', 'priority', 'category', 'sla_breached',
        'rating', 'created_at', 'resolved_at'
    ]
    search_fields = [
        'ticket_number', 'title', 'description',
        'created_by__email', 'assigned_to__email',
        'organization__name'
    ]
    readonly_fields = [
        'id', 'ticket_number', 'first_response_at',
        'resolved_at', 'closed_at', 'created_at', 'updated_at'
    ]
    autocomplete_fields = ['organization', 'created_by', 'assigned_to', 'device']
    inlines = [TicketMessageInline, TicketEscalationInline]
    fieldsets = (
        ('Ticket Information', {
            'fields': (
                'ticket_number', 'organization', 'title',
                'description', 'category', 'device'
            )
        }),
        ('Assignment', {
            'fields': ('created_by', 'assigned_to')
        }),
        ('Status & Priority', {
            'fields': ('status', 'priority')
        }),
        ('SLA & Timestamps', {
            'fields': (
                'response_sla_minutes', 'resolution_sla_minutes',
                'sla_breached', 'first_response_at', 'resolved_at',
                'closed_at', 'due_at'
            )
        }),
        ('Rating & Feedback', {
            'fields': ('rating', 'feedback')
        }),
        ('Metadata', {
            'fields': ('tags', 'custom_fields', 'internal_notes')
        }),
        ('System', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )


@admin.register(TicketMessage)
class TicketMessageAdmin(admin.ModelAdmin):
    """Admin interface for TicketMessage model."""
    list_display = [
        'ticket', 'user', 'message_preview', 'is_internal',
        'is_system', 'created_at'
    ]
    list_filter = ['is_internal', 'is_system', 'created_at']
    search_fields = [
        'ticket__ticket_number', 'user__email', 'message'
    ]
    readonly_fields = ['id', 'created_at', 'updated_at']
    autocomplete_fields = ['ticket', 'user']
    fieldsets = (
        ('Message', {
            'fields': ('ticket', 'user', 'message')
        }),
        ('Settings', {
            'fields': ('is_internal', 'is_system')
        }),
        ('Attachments', {
            'fields': ('attachments',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )

    def message_preview(self, obj):
        """Show message preview."""
        return obj.message[:50] + '...' if len(obj.message) > 50 else obj.message
    message_preview.short_description = 'Message'


@admin.register(TicketEscalation)
class TicketEscalationAdmin(admin.ModelAdmin):
    """Admin interface for TicketEscalation model."""
    list_display = [
        'ticket', 'from_level', 'to_level', 'escalated_by',
        'escalated_to', 'reason', 'is_active', 'created_at'
    ]
    list_filter = [
        'from_level', 'to_level', 'reason', 'is_active', 'created_at'
    ]
    search_fields = [
        'ticket__ticket_number', 'escalated_by__email',
        'escalated_to__email', 'notes'
    ]
    readonly_fields = ['id', 'created_at', 'updated_at']
    autocomplete_fields = ['ticket', 'escalated_by', 'escalated_to']
    fieldsets = (
        ('Escalation', {
            'fields': (
                'ticket', 'escalated_by', 'escalated_to',
                'from_level', 'to_level'
            )
        }),
        ('Details', {
            'fields': ('reason', 'notes', 'is_active', 'resolved_at')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )


@admin.register(TicketAttachment)
class TicketAttachmentAdmin(admin.ModelAdmin):
    """Admin interface for TicketAttachment model."""
    list_display = [
        'filename', 'ticket', 'uploaded_by', 'file_size_display',
        'mime_type', 'created_at'
    ]
    list_filter = ['mime_type', 'created_at']
    search_fields = ['filename', 'ticket__ticket_number', 'uploaded_by__email']
    readonly_fields = ['id', 'file_size_display', 'created_at', 'updated_at']
    autocomplete_fields = ['ticket', 'uploaded_by']
    fieldsets = (
        ('File', {
            'fields': ('ticket', 'uploaded_by', 'file', 'filename')
        }),
        ('Details', {
            'fields': ('file_size', 'file_size_display', 'mime_type')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )

    def file_size_display(self, obj):
        """Display human-readable file size."""
        return obj.get_file_size_display()
    file_size_display.short_description = 'File Size'
