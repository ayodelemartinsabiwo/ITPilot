"""
Ticket models for ITPilot support system.
"""

from django.db import models
from common.models import TimeStampedModel


class Ticket(TimeStampedModel):
    """
    Support ticket model.
    """
    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('CRITICAL', 'Critical'),
    ]

    STATUS_CHOICES = [
        ('OPEN', 'Open'),
        ('IN_PROGRESS', 'In Progress'),
        ('PENDING', 'Pending User Response'),
        ('RESOLVED', 'Resolved'),
        ('CLOSED', 'Closed'),
        ('CANCELLED', 'Cancelled'),
    ]

    CATEGORY_CHOICES = [
        ('HARDWARE', 'Hardware Issue'),
        ('SOFTWARE', 'Software Issue'),
        ('NETWORK', 'Network Issue'),
        ('ACCESS', 'Access/Permission Issue'),
        ('EMAIL', 'Email Issue'),
        ('PRINTING', 'Printing Issue'),
        ('BACKUP', 'Backup/Recovery'),
        ('SECURITY', 'Security Concern'),
        ('REQUEST', 'Service Request'),
        ('OTHER', 'Other'),
    ]

    # Organization & User
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='tickets'
    )
    created_by = models.ForeignKey(
        'authentication.User',
        on_delete=models.CASCADE,
        related_name='tickets_created'
    )
    assigned_to = models.ForeignKey(
        'authentication.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tickets_assigned'
    )

    # Ticket Details
    ticket_number = models.CharField(max_length=20, unique=True, db_index=True)
    title = models.CharField(max_length=255)
    description = models.TextField()
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='MEDIUM')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='OPEN')

    # Related Resources
    device = models.ForeignKey(
        'devices.Device',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='tickets'
    )

    # Timestamps
    first_response_at = models.DateTimeField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    due_at = models.DateTimeField(null=True, blank=True)

    # SLA Tracking
    response_sla_minutes = models.IntegerField(default=240)  # 4 hours default
    resolution_sla_minutes = models.IntegerField(default=1440)  # 24 hours default
    sla_breached = models.BooleanField(default=False)

    # Ratings
    rating = models.IntegerField(
        null=True,
        blank=True,
        choices=[(i, i) for i in range(1, 6)]
    )
    feedback = models.TextField(blank=True)

    # Metadata
    tags = models.JSONField(default=list, blank=True)
    custom_fields = models.JSONField(default=dict, blank=True)
    internal_notes = models.TextField(blank=True)

    class Meta:
        db_table = 'tickets'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['organization', 'status', '-created_at']),
            models.Index(fields=['ticket_number']),
            models.Index(fields=['created_by', '-created_at']),
            models.Index(fields=['assigned_to', 'status']),
            models.Index(fields=['priority', 'status']),
            models.Index(fields=['category', '-created_at']),
        ]

    def __str__(self):
        return f"#{self.ticket_number} - {self.title}"

    def save(self, *args, **kwargs):
        """Generate ticket number if not exists."""
        if not self.ticket_number:
            # Generate ticket number: TICKET-YYYYMMDD-XXXX
            from django.utils import timezone
            today = timezone.now().strftime('%Y%m%d')
            last_ticket = Ticket.objects.filter(
                ticket_number__startswith=f'TICKET-{today}'
            ).order_by('-ticket_number').first()

            if last_ticket:
                last_num = int(last_ticket.ticket_number.split('-')[-1])
                new_num = last_num + 1
            else:
                new_num = 1

            self.ticket_number = f'TICKET-{today}-{new_num:04d}'

        super().save(*args, **kwargs)

    def get_response_time_minutes(self):
        """Calculate response time in minutes."""
        if self.first_response_at:
            delta = self.first_response_at - self.created_at
            return int(delta.total_seconds() / 60)
        return None

    def get_resolution_time_minutes(self):
        """Calculate resolution time in minutes."""
        if self.resolved_at:
            delta = self.resolved_at - self.created_at
            return int(delta.total_seconds() / 60)
        return None

    def is_overdue(self):
        """Check if ticket is overdue."""
        from django.utils import timezone
        if self.due_at and self.status not in ['RESOLVED', 'CLOSED', 'CANCELLED']:
            return timezone.now() > self.due_at
        return False


class TicketMessage(TimeStampedModel):
    """
    Messages/comments on tickets.
    """
    ticket = models.ForeignKey(
        Ticket,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    user = models.ForeignKey(
        'authentication.User',
        on_delete=models.CASCADE,
        related_name='ticket_messages'
    )
    message = models.TextField()
    is_internal = models.BooleanField(default=False)  # Internal note vs customer visible
    is_system = models.BooleanField(default=False)  # System generated message

    # Attachments
    attachments = models.JSONField(default=list, blank=True)

    class Meta:
        db_table = 'ticket_messages'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['ticket', 'created_at']),
            models.Index(fields=['user', '-created_at']),
        ]

    def __str__(self):
        return f"Message on {self.ticket.ticket_number} by {self.user.email}"


class TicketEscalation(TimeStampedModel):
    """
    Ticket escalation tracking.
    """
    ESCALATION_REASON_CHOICES = [
        ('SLA_BREACH', 'SLA Breach'),
        ('PRIORITY_INCREASE', 'Priority Increased'),
        ('CUSTOMER_REQUEST', 'Customer Request'),
        ('TECHNICAL_COMPLEXITY', 'Technical Complexity'),
        ('MANAGEMENT_REVIEW', 'Management Review'),
        ('OTHER', 'Other'),
    ]

    ESCALATION_LEVEL_CHOICES = [
        ('L1', 'Level 1 - Technician'),
        ('L2', 'Level 2 - Senior Technician'),
        ('L3', 'Level 3 - Technical Lead'),
        ('L4', 'Level 4 - Management'),
    ]

    ticket = models.ForeignKey(
        Ticket,
        on_delete=models.CASCADE,
        related_name='escalations'
    )
    escalated_by = models.ForeignKey(
        'authentication.User',
        on_delete=models.CASCADE,
        related_name='escalations_created'
    )
    escalated_to = models.ForeignKey(
        'authentication.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='escalations_received'
    )
    from_level = models.CharField(max_length=10, choices=ESCALATION_LEVEL_CHOICES)
    to_level = models.CharField(max_length=10, choices=ESCALATION_LEVEL_CHOICES)
    reason = models.CharField(max_length=30, choices=ESCALATION_REASON_CHOICES)
    notes = models.TextField()
    is_active = models.BooleanField(default=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'ticket_escalations'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['ticket', '-created_at']),
            models.Index(fields=['escalated_to', 'is_active']),
        ]

    def __str__(self):
        return f"Escalation: {self.ticket.ticket_number} {self.from_level} → {self.to_level}"


class TicketAttachment(TimeStampedModel):
    """
    File attachments for tickets.
    """
    ticket = models.ForeignKey(
        Ticket,
        on_delete=models.CASCADE,
        related_name='attachments'
    )
    uploaded_by = models.ForeignKey(
        'authentication.User',
        on_delete=models.CASCADE,
        related_name='ticket_attachments'
    )
    file = models.FileField(upload_to='tickets/attachments/%Y/%m/%d/')
    filename = models.CharField(max_length=255)
    file_size = models.BigIntegerField()  # Size in bytes
    mime_type = models.CharField(max_length=100)

    class Meta:
        db_table = 'ticket_attachments'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['ticket', '-created_at']),
        ]

    def __str__(self):
        return f"{self.filename} on {self.ticket.ticket_number}"

    def get_file_size_display(self):
        """Get human-readable file size."""
        size = self.file_size
        for unit in ['B', 'KB', 'MB', 'GB']:
            if size < 1024:
                return f"{size:.2f} {unit}"
            size /= 1024
        return f"{size:.2f} TB"
