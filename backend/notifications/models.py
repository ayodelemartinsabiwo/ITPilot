"""
Notification models for ITPilot notification system.
"""

from django.db import models
from common.models import TimeStampedModel


class Notification(TimeStampedModel):
    """
    User notifications.
    """
    TYPE_CHOICES = [
        ('INFO', 'Information'),
        ('SUCCESS', 'Success'),
        ('WARNING', 'Warning'),
        ('ERROR', 'Error'),
        ('TICKET_UPDATE', 'Ticket Update'),
        ('DEVICE_ALERT', 'Device Alert'),
        ('PAYMENT', 'Payment'),
        ('SYSTEM', 'System'),
    ]

    PRIORITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('URGENT', 'Urgent'),
    ]

    user = models.ForeignKey(
        'authentication.User',
        on_delete=models.CASCADE,
        related_name='notifications'
    )
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='notifications'
    )

    # Notification Details
    notification_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='MEDIUM')
    title = models.CharField(max_length=255)
    message = models.TextField()

    # Related Resources
    related_object_type = models.CharField(max_length=50, blank=True)  # e.g., 'ticket', 'device'
    related_object_id = models.CharField(max_length=255, blank=True)

    # Action
    action_url = models.CharField(max_length=500, blank=True)
    action_text = models.CharField(max_length=100, blank=True)

    # Status
    is_read = models.BooleanField(default=False)
    read_at = models.DateTimeField(null=True, blank=True)

    # Delivery
    delivered_via = models.JSONField(default=list, blank=True)  # ['in_app', 'email', 'sms', 'push']

    # Metadata
    metadata = models.JSONField(default=dict, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read', '-created_at']),
            models.Index(fields=['organization', '-created_at']),
            models.Index(fields=['notification_type', '-created_at']),
            models.Index(fields=['priority', 'is_read']),
        ]

    def __str__(self):
        return f"{self.title} - {self.user.email}"

    def mark_as_read(self):
        """Mark notification as read."""
        if not self.is_read:
            from django.utils import timezone
            self.is_read = True
            self.read_at = timezone.now()
            self.save(update_fields=['is_read', 'read_at'])

    def is_expired(self):
        """Check if notification is expired."""
        from django.utils import timezone
        if self.expires_at:
            return timezone.now() > self.expires_at
        return False


class NotificationPreference(TimeStampedModel):
    """
    User notification preferences.
    """
    user = models.OneToOneField(
        'authentication.User',
        on_delete=models.CASCADE,
        related_name='notification_preferences'
    )

    # Channel Preferences
    enable_email = models.BooleanField(default=True)
    enable_sms = models.BooleanField(default=False)
    enable_push = models.BooleanField(default=True)
    enable_in_app = models.BooleanField(default=True)

    # Notification Type Preferences
    ticket_updates_email = models.BooleanField(default=True)
    ticket_updates_push = models.BooleanField(default=True)

    device_alerts_email = models.BooleanField(default=True)
    device_alerts_push = models.BooleanField(default=True)

    payment_notifications_email = models.BooleanField(default=True)
    payment_notifications_push = models.BooleanField(default=False)

    system_notifications_email = models.BooleanField(default=True)
    system_notifications_push = models.BooleanField(default=True)

    marketing_emails = models.BooleanField(default=False)
    newsletter = models.BooleanField(default=False)

    # Quiet Hours
    enable_quiet_hours = models.BooleanField(default=False)
    quiet_hours_start = models.TimeField(null=True, blank=True)  # e.g., 22:00
    quiet_hours_end = models.TimeField(null=True, blank=True)  # e.g., 08:00

    # Digest
    enable_daily_digest = models.BooleanField(default=False)
    digest_time = models.TimeField(null=True, blank=True)  # e.g., 09:00

    class Meta:
        db_table = 'notification_preferences'

    def __str__(self):
        return f"Preferences for {self.user.email}"

    def is_in_quiet_hours(self):
        """Check if current time is in quiet hours."""
        if not self.enable_quiet_hours or not self.quiet_hours_start or not self.quiet_hours_end:
            return False

        from django.utils import timezone
        now = timezone.now().time()

        if self.quiet_hours_start < self.quiet_hours_end:
            # Normal case: 22:00 to 08:00 next day
            return self.quiet_hours_start <= now <= self.quiet_hours_end
        else:
            # Crosses midnight: 22:00 to 08:00
            return now >= self.quiet_hours_start or now <= self.quiet_hours_end


class EmailNotification(TimeStampedModel):
    """
    Email notification tracking.
    """
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('SENT', 'Sent'),
        ('DELIVERED', 'Delivered'),
        ('FAILED', 'Failed'),
        ('BOUNCED', 'Bounced'),
    ]

    notification = models.ForeignKey(
        Notification,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='email_notifications'
    )
    user = models.ForeignKey(
        'authentication.User',
        on_delete=models.CASCADE,
        related_name='email_notifications'
    )

    # Email Details
    to_email = models.EmailField()
    from_email = models.EmailField(default='noreply@itpilot.com')
    subject = models.CharField(max_length=255)
    body_text = models.TextField()
    body_html = models.TextField(blank=True)

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    sent_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    # Tracking
    message_id = models.CharField(max_length=255, blank=True)
    provider = models.CharField(max_length=50, default='smtp')  # smtp, sendgrid, mailgun, etc.
    opens_count = models.IntegerField(default=0)
    clicks_count = models.IntegerField(default=0)
    last_opened_at = models.DateTimeField(null=True, blank=True)

    # Error
    error_message = models.TextField(blank=True)

    class Meta:
        db_table = 'email_notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['to_email', '-created_at']),
        ]

    def __str__(self):
        return f"Email to {self.to_email} - {self.subject}"


class SMSNotification(TimeStampedModel):
    """
    SMS notification tracking.
    """
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('SENT', 'Sent'),
        ('DELIVERED', 'Delivered'),
        ('FAILED', 'Failed'),
    ]

    notification = models.ForeignKey(
        Notification,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='sms_notifications'
    )
    user = models.ForeignKey(
        'authentication.User',
        on_delete=models.CASCADE,
        related_name='sms_notifications'
    )

    # SMS Details
    to_phone = models.CharField(max_length=20)
    message = models.TextField(max_length=160)  # SMS character limit

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    sent_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    # Provider
    provider = models.CharField(
        max_length=50,
        choices=[
            ('TWILIO', 'Twilio'),
            ('VONAGE', 'Vonage'),
            ('AWS_SNS', 'AWS SNS'),
        ],
        default='TWILIO'
    )
    message_id = models.CharField(max_length=255, blank=True)

    # Cost
    cost = models.DecimalField(max_digits=10, decimal_places=4, default=0)
    currency = models.CharField(max_length=3, default='USD')

    # Error
    error_message = models.TextField(blank=True)

    class Meta:
        db_table = 'sms_notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['status', '-created_at']),
        ]

    def __str__(self):
        return f"SMS to {self.to_phone}"


class PushNotification(TimeStampedModel):
    """
    Push notification tracking.
    """
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('SENT', 'Sent'),
        ('DELIVERED', 'Delivered'),
        ('FAILED', 'Failed'),
    ]

    notification = models.ForeignKey(
        Notification,
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='push_notifications'
    )
    user = models.ForeignKey(
        'authentication.User',
        on_delete=models.CASCADE,
        related_name='push_notifications'
    )

    # Push Details
    title = models.CharField(max_length=255)
    body = models.TextField()
    icon = models.URLField(blank=True)
    image = models.URLField(blank=True)
    click_action = models.URLField(blank=True)

    # Device Token
    device_token = models.CharField(max_length=500)
    platform = models.CharField(
        max_length=20,
        choices=[
            ('IOS', 'iOS'),
            ('ANDROID', 'Android'),
            ('WEB', 'Web Push'),
        ]
    )

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    sent_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    # Provider
    provider = models.CharField(
        max_length=50,
        choices=[
            ('FCM', 'Firebase Cloud Messaging'),
            ('APNS', 'Apple Push Notification Service'),
            ('WEB_PUSH', 'Web Push'),
        ],
        default='FCM'
    )
    message_id = models.CharField(max_length=255, blank=True)

    # Error
    error_message = models.TextField(blank=True)

    # Metadata
    data = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = 'push_notifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['status', '-created_at']),
        ]

    def __str__(self):
        return f"Push to {self.user.email} - {self.title}"
