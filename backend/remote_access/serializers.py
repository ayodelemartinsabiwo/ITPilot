"""
Serializers for Remote Access app.
"""

from rest_framework import serializers
from .models import RemoteSession, SessionLog, SessionRecording, RemoteCommand


class RemoteSessionSerializer(serializers.ModelSerializer):
    """Serializer for RemoteSession model."""
    technician_name = serializers.CharField(source='technician.full_name', read_only=True)
    device_name = serializers.CharField(source='device.name', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.full_name', read_only=True)
    is_active = serializers.SerializerMethodField()
    is_expired = serializers.SerializerMethodField()

    class Meta:
        model = RemoteSession
        fields = [
            'id', 'technician', 'technician_name', 'device', 'device_name',
            'organization', 'organization_name', 'session_type', 'status',
            'session_token', 'ticket', 'requires_approval', 'approved_by',
            'approved_by_name', 'approved_at', 'started_at', 'ended_at',
            'expires_at', 'duration_seconds', 'max_duration_minutes',
            'is_recorded', 'recording_url', 'connection_method',
            'connection_info', 'require_2fa', 'ip_whitelist',
            'allowed_actions', 'reason', 'notes', 'metadata',
            'is_active', 'is_expired', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'session_token', 'approved_by', 'approved_at',
            'started_at', 'ended_at', 'duration_seconds', 'created_at', 'updated_at'
        ]

    def get_is_active(self, obj):
        """Check if session is active."""
        return obj.is_active()

    def get_is_expired(self, obj):
        """Check if session is expired."""
        return obj.is_expired()


class SessionLogSerializer(serializers.ModelSerializer):
    """Serializer for SessionLog model."""
    user_name = serializers.CharField(source='user.full_name', read_only=True)

    class Meta:
        model = SessionLog
        fields = [
            'id', 'session', 'action_type', 'description', 'user',
            'user_name', 'action_data', 'ip_address', 'was_successful',
            'error_message', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class SessionRecordingSerializer(serializers.ModelSerializer):
    """Serializer for SessionRecording model."""
    file_size_display = serializers.SerializerMethodField()
    is_expired = serializers.SerializerMethodField()

    class Meta:
        model = SessionRecording
        fields = [
            'id', 'session', 'status', 'file_path', 'file_size_bytes',
            'file_size_display', 'duration_seconds', 'storage_provider',
            'storage_url', 'video_format', 'video_codec', 'resolution',
            'fps', 'is_encrypted', 'access_count', 'last_accessed_at',
            'retention_days', 'delete_at', 'is_expired', 'created_at'
        ]
        read_only_fields = [
            'id', 'access_count', 'last_accessed_at', 'created_at', 'updated_at'
        ]

    def get_file_size_display(self, obj):
        """Get human-readable file size."""
        return obj.get_file_size_display()

    def get_is_expired(self, obj):
        """Check if recording is expired."""
        return obj.is_expired()


class RemoteCommandSerializer(serializers.ModelSerializer):
    """Serializer for RemoteCommand model."""
    executed_by_name = serializers.CharField(source='executed_by.full_name', read_only=True)
    approved_by_name = serializers.CharField(source='approved_by.full_name', read_only=True)

    class Meta:
        model = RemoteCommand
        fields = [
            'id', 'session', 'executed_by', 'executed_by_name', 'command',
            'command_type', 'status', 'started_at', 'completed_at',
            'duration_ms', 'stdout', 'stderr', 'exit_code',
            'requires_approval', 'approved_by', 'approved_by_name',
            'is_dangerous', 'created_at'
        ]
        read_only_fields = [
            'id', 'executed_by', 'status', 'started_at', 'completed_at',
            'duration_ms', 'stdout', 'stderr', 'exit_code',
            'approved_by', 'created_at'
        ]


class CreateRemoteSessionSerializer(serializers.Serializer):
    """Serializer for creating a remote session."""
    device_id = serializers.UUIDField()
    session_type = serializers.ChoiceField(choices=RemoteSession.SESSION_TYPE_CHOICES)
    ticket_id = serializers.UUIDField(required=False, allow_null=True)
    reason = serializers.CharField(required=False, allow_blank=True)
    max_duration_minutes = serializers.IntegerField(default=60, min_value=5, max_value=480)
    require_2fa = serializers.BooleanField(default=False)
