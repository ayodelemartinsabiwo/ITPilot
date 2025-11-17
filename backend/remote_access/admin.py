"""
Django admin configuration for Remote Access app.
"""

from django.contrib import admin
from .models import RemoteSession, SessionLog, SessionRecording, RemoteCommand


class SessionLogInline(admin.TabularInline):
    """Inline admin for session logs."""
    model = SessionLog
    extra = 0
    readonly_fields = ['action_type', 'user', 'created_at']
    fields = ['action_type', 'description', 'user', 'was_successful', 'created_at']


@admin.register(RemoteSession)
class RemoteSessionAdmin(admin.ModelAdmin):
    """Admin interface for RemoteSession model."""
    list_display = [
        'session_token', 'technician', 'device', 'session_type',
        'status', 'started_at', 'ended_at', 'duration_seconds',
        'is_recorded', 'created_at'
    ]
    list_filter = ['session_type', 'status', 'is_recorded', 'requires_approval', 'created_at']
    search_fields = [
        'session_token', 'technician__email', 'device__name',
        'organization__name'
    ]
    readonly_fields = [
        'id', 'session_token', 'approved_at', 'started_at',
        'ended_at', 'duration_seconds', 'created_at', 'updated_at'
    ]
    autocomplete_fields = ['technician', 'device', 'organization', 'ticket', 'approved_by']
    inlines = [SessionLogInline]
    fieldsets = (
        ('Session Details', {
            'fields': (
                'session_token', 'technician', 'device', 'organization',
                'session_type', 'status', 'ticket'
            )
        }),
        ('Approval', {
            'fields': ('requires_approval', 'approved_by', 'approved_at')
        }),
        ('Timing', {
            'fields': (
                'started_at', 'ended_at', 'expires_at',
                'duration_seconds', 'max_duration_minutes'
            )
        }),
        ('Recording', {
            'fields': ('is_recorded', 'recording_url')
        }),
        ('Connection', {
            'fields': ('connection_method', 'connection_info')
        }),
        ('Security', {
            'fields': ('require_2fa', 'ip_whitelist', 'allowed_actions')
        }),
        ('Notes', {
            'fields': ('reason', 'notes', 'metadata')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )


@admin.register(SessionLog)
class SessionLogAdmin(admin.ModelAdmin):
    """Admin interface for SessionLog model."""
    list_display = [
        'session', 'action_type', 'user', 'description_preview',
        'was_successful', 'created_at'
    ]
    list_filter = ['action_type', 'was_successful', 'created_at']
    search_fields = ['session__session_token', 'user__email', 'description']
    readonly_fields = ['id', 'created_at', 'updated_at']
    autocomplete_fields = ['session', 'user']
    fieldsets = (
        ('Session', {
            'fields': ('session',)
        }),
        ('Action', {
            'fields': ('action_type', 'description', 'user')
        }),
        ('Data', {
            'fields': ('action_data', 'ip_address')
        }),
        ('Result', {
            'fields': ('was_successful', 'error_message')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )

    def description_preview(self, obj):
        """Show description preview."""
        return obj.description[:50] + '...' if len(obj.description) > 50 else obj.description
    description_preview.short_description = 'Description'


@admin.register(SessionRecording)
class SessionRecordingAdmin(admin.ModelAdmin):
    """Admin interface for SessionRecording model."""
    list_display = [
        'session', 'status', 'file_size_display', 'duration_seconds',
        'storage_provider', 'access_count', 'delete_at', 'created_at'
    ]
    list_filter = ['status', 'storage_provider', 'is_encrypted', 'created_at']
    search_fields = ['session__session_token', 'file_path']
    readonly_fields = [
        'id', 'access_count', 'last_accessed_at',
        'processing_started_at', 'processing_completed_at',
        'created_at', 'updated_at'
    ]
    autocomplete_fields = ['session']
    fieldsets = (
        ('Session', {
            'fields': ('session', 'status')
        }),
        ('File Details', {
            'fields': (
                'file_path', 'file_size_bytes', 'duration_seconds',
                'storage_provider', 'storage_url'
            )
        }),
        ('Format & Quality', {
            'fields': ('video_format', 'video_codec', 'resolution', 'fps')
        }),
        ('Security', {
            'fields': ('is_encrypted', 'encryption_key_id')
        }),
        ('Access', {
            'fields': ('access_count', 'last_accessed_at')
        }),
        ('Retention', {
            'fields': ('retention_days', 'delete_at')
        }),
        ('Processing', {
            'fields': (
                'processing_started_at', 'processing_completed_at',
                'processing_error'
            )
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )

    def file_size_display(self, obj):
        """Display human-readable file size."""
        return obj.get_file_size_display()
    file_size_display.short_description = 'File Size'


@admin.register(RemoteCommand)
class RemoteCommandAdmin(admin.ModelAdmin):
    """Admin interface for RemoteCommand model."""
    list_display = [
        'session', 'command_type', 'command_preview', 'executed_by',
        'status', 'exit_code', 'is_dangerous', 'created_at'
    ]
    list_filter = ['command_type', 'status', 'is_dangerous', 'requires_approval', 'created_at']
    search_fields = ['session__session_token', 'command', 'executed_by__email']
    readonly_fields = [
        'id', 'started_at', 'completed_at', 'duration_ms',
        'exit_code', 'approved_by', 'created_at', 'updated_at'
    ]
    autocomplete_fields = ['session', 'executed_by', 'approved_by']
    fieldsets = (
        ('Session', {
            'fields': ('session', 'executed_by')
        }),
        ('Command', {
            'fields': ('command', 'command_type', 'status', 'is_dangerous')
        }),
        ('Execution', {
            'fields': ('started_at', 'completed_at', 'duration_ms')
        }),
        ('Output', {
            'fields': ('stdout', 'stderr', 'exit_code')
        }),
        ('Approval', {
            'fields': ('requires_approval', 'approved_by')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )

    def command_preview(self, obj):
        """Show command preview."""
        return obj.command[:50] + '...' if len(obj.command) > 50 else obj.command
    command_preview.short_description = 'Command'
