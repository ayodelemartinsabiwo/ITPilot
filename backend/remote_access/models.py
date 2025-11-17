"""
Remote Access models for ITPilot remote session management.
"""

from django.db import models
from common.models import TimeStampedModel
import secrets


class RemoteSession(TimeStampedModel):
    """
    Remote access session model.
    """
    SESSION_TYPE_CHOICES = [
        ('SCREEN_SHARE', 'Screen Share'),
        ('REMOTE_CONTROL', 'Remote Control'),
        ('FILE_TRANSFER', 'File Transfer'),
        ('TERMINAL', 'Terminal Access'),
    ]

    STATUS_CHOICES = [
        ('PENDING', 'Pending Approval'),
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
        ('CANCELLED', 'Cancelled'),
        ('EXPIRED', 'Expired'),
        ('ERROR', 'Error'),
    ]

    # Participants
    technician = models.ForeignKey(
        'authentication.User',
        on_delete=models.CASCADE,
        related_name='remote_sessions_initiated'
    )
    device = models.ForeignKey(
        'devices.Device',
        on_delete=models.CASCADE,
        related_name='remote_sessions'
    )
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='remote_sessions'
    )

    # Session Details
    session_type = models.CharField(max_length=20, choices=SESSION_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    session_token = models.CharField(max_length=100, unique=True, db_index=True)

    # Related Ticket
    ticket = models.ForeignKey(
        'tickets.Ticket',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='remote_sessions'
    )

    # Approval
    requires_approval = models.BooleanField(default=True)
    approved_by = models.ForeignKey(
        'authentication.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='remote_sessions_approved'
    )
    approved_at = models.DateTimeField(null=True, blank=True)

    # Timing
    started_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField()
    duration_seconds = models.IntegerField(default=0)
    max_duration_minutes = models.IntegerField(default=60)  # 1 hour default

    # Recording
    is_recorded = models.BooleanField(default=True)
    recording_url = models.URLField(blank=True)

    # Connection Details
    connection_method = models.CharField(
        max_length=20,
        choices=[
            ('WEBRTC', 'WebRTC'),
            ('VNC', 'VNC'),
            ('RDP', 'RDP'),
            ('SSH', 'SSH'),
        ],
        default='WEBRTC'
    )
    connection_info = models.JSONField(default=dict, blank=True)

    # Security
    require_2fa = models.BooleanField(default=False)
    ip_whitelist = models.JSONField(default=list, blank=True)
    allowed_actions = models.JSONField(default=list, blank=True)

    # Metadata
    reason = models.TextField(blank=True)
    notes = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = 'remote_sessions'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['session_token']),
            models.Index(fields=['technician', '-created_at']),
            models.Index(fields=['device', '-created_at']),
            models.Index(fields=['organization', 'status', '-created_at']),
            models.Index(fields=['status', '-created_at']),
        ]

    def __str__(self):
        return f"Remote Session {self.session_token} - {self.device.name}"

    def save(self, *args, **kwargs):
        """Generate session token if not exists."""
        if not self.session_token:
            self.session_token = secrets.token_urlsafe(32)
        super().save(*args, **kwargs)

    def is_active(self):
        """Check if session is currently active."""
        return self.status == 'ACTIVE'

    def is_expired(self):
        """Check if session is expired."""
        from django.utils import timezone
        return timezone.now() > self.expires_at

    def calculate_duration(self):
        """Calculate session duration in seconds."""
        if self.started_at and self.ended_at:
            delta = self.ended_at - self.started_at
            self.duration_seconds = int(delta.total_seconds())
            self.save(update_fields=['duration_seconds'])


class SessionLog(TimeStampedModel):
    """
    Logs for remote session activities.
    """
    ACTION_TYPE_CHOICES = [
        ('CONNECT', 'Connected'),
        ('DISCONNECT', 'Disconnected'),
        ('COMMAND', 'Command Executed'),
        ('FILE_UPLOAD', 'File Uploaded'),
        ('FILE_DOWNLOAD', 'File Downloaded'),
        ('SCREEN_CAPTURE', 'Screen Captured'),
        ('CONTROL_GRANTED', 'Control Granted'),
        ('CONTROL_REVOKED', 'Control Revoked'),
        ('ERROR', 'Error Occurred'),
    ]

    session = models.ForeignKey(
        RemoteSession,
        on_delete=models.CASCADE,
        related_name='logs'
    )

    # Action Details
    action_type = models.CharField(max_length=20, choices=ACTION_TYPE_CHOICES)
    description = models.TextField()
    user = models.ForeignKey(
        'authentication.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='remote_session_logs'
    )

    # Data
    action_data = models.JSONField(default=dict, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    # Success/Failure
    was_successful = models.BooleanField(default=True)
    error_message = models.TextField(blank=True)

    class Meta:
        db_table = 'remote_session_logs'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['session', 'created_at']),
            models.Index(fields=['action_type', '-created_at']),
        ]

    def __str__(self):
        return f"{self.action_type} - Session {self.session.session_token}"


class SessionRecording(TimeStampedModel):
    """
    Session recording metadata and storage.
    """
    RECORDING_STATUS_CHOICES = [
        ('RECORDING', 'Recording'),
        ('PROCESSING', 'Processing'),
        ('READY', 'Ready'),
        ('FAILED', 'Failed'),
        ('DELETED', 'Deleted'),
    ]

    session = models.OneToOneField(
        RemoteSession,
        on_delete=models.CASCADE,
        related_name='recording'
    )

    # Recording Details
    status = models.CharField(
        max_length=20,
        choices=RECORDING_STATUS_CHOICES,
        default='RECORDING'
    )
    file_path = models.CharField(max_length=500, blank=True)
    file_size_bytes = models.BigIntegerField(default=0)
    duration_seconds = models.IntegerField(default=0)

    # Storage
    storage_provider = models.CharField(
        max_length=50,
        choices=[
            ('LOCAL', 'Local Storage'),
            ('S3', 'Amazon S3'),
            ('AZURE_BLOB', 'Azure Blob Storage'),
            ('GCS', 'Google Cloud Storage'),
        ],
        default='LOCAL'
    )
    storage_url = models.URLField(blank=True)

    # Format & Quality
    video_format = models.CharField(max_length=20, default='mp4')
    video_codec = models.CharField(max_length=50, blank=True)
    resolution = models.CharField(max_length=20, blank=True)  # e.g., "1920x1080"
    fps = models.IntegerField(default=30)

    # Access Control
    is_encrypted = models.BooleanField(default=True)
    encryption_key_id = models.CharField(max_length=255, blank=True)
    access_count = models.IntegerField(default=0)
    last_accessed_at = models.DateTimeField(null=True, blank=True)

    # Retention
    retention_days = models.IntegerField(default=90)
    delete_at = models.DateTimeField(null=True, blank=True)

    # Processing
    processing_started_at = models.DateTimeField(null=True, blank=True)
    processing_completed_at = models.DateTimeField(null=True, blank=True)
    processing_error = models.TextField(blank=True)

    class Meta:
        db_table = 'session_recordings'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['session', 'status']),
            models.Index(fields=['status', '-created_at']),
        ]

    def __str__(self):
        return f"Recording for Session {self.session.session_token}"

    def get_file_size_display(self):
        """Get human-readable file size."""
        size = self.file_size_bytes
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024:
                return f"{size:.2f} {unit}"
            size /= 1024
        return f"{size:.2f} TB"

    def is_expired(self):
        """Check if recording is past retention period."""
        from django.utils import timezone
        if self.delete_at:
            return timezone.now() > self.delete_at
        return False


class RemoteCommand(TimeStampedModel):
    """
    Commands executed during remote sessions.
    """
    COMMAND_STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('EXECUTING', 'Executing'),
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
        ('CANCELLED', 'Cancelled'),
    ]

    session = models.ForeignKey(
        RemoteSession,
        on_delete=models.CASCADE,
        related_name='commands'
    )
    executed_by = models.ForeignKey(
        'authentication.User',
        on_delete=models.CASCADE,
        related_name='remote_commands'
    )

    # Command Details
    command = models.TextField()
    command_type = models.CharField(
        max_length=50,
        choices=[
            ('SHELL', 'Shell Command'),
            ('POWERSHELL', 'PowerShell'),
            ('SCRIPT', 'Script Execution'),
            ('SYSTEM', 'System Command'),
        ],
        default='SHELL'
    )
    status = models.CharField(max_length=20, choices=COMMAND_STATUS_CHOICES, default='PENDING')

    # Execution
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    duration_ms = models.IntegerField(default=0)

    # Output
    stdout = models.TextField(blank=True)
    stderr = models.TextField(blank=True)
    exit_code = models.IntegerField(null=True, blank=True)

    # Security
    requires_approval = models.BooleanField(default=False)
    approved_by = models.ForeignKey(
        'authentication.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='commands_approved'
    )
    is_dangerous = models.BooleanField(default=False)

    class Meta:
        db_table = 'remote_commands'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['session', 'created_at']),
            models.Index(fields=['status', '-created_at']),
        ]

    def __str__(self):
        return f"Command in Session {self.session.session_token}"
