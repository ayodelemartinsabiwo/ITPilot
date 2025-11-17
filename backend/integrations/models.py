"""
Integration models for ITPilot third-party service connections.
"""

from django.db import models
from django.core.validators import URLValidator
from common.models import TimeStampedModel
from django.utils import timezone


class Integration(TimeStampedModel):
    """
    Third-party service integrations.
    """
    INTEGRATION_TYPE_CHOICES = [
        ('MICROSOFT_365', 'Microsoft 365'),
        ('GOOGLE_WORKSPACE', 'Google Workspace'),
        ('SLACK', 'Slack'),
        ('TEAMS', 'Microsoft Teams'),
        ('JIRA', 'Jira'),
        ('SALESFORCE', 'Salesforce'),
        ('ZENDESK', 'Zendesk'),
        ('OKTA', 'Okta'),
        ('AZURE_AD', 'Azure Active Directory'),
        ('CUSTOM', 'Custom Integration'),
    ]

    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
        ('ERROR', 'Error'),
        ('EXPIRED', 'Expired'),
    ]

    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='integrations'
    )
    created_by = models.ForeignKey(
        'authentication.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='integrations_created'
    )

    # Integration Details
    integration_type = models.CharField(max_length=30, choices=INTEGRATION_TYPE_CHOICES)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')

    # Configuration
    config = models.JSONField(default=dict, blank=True)  # Integration-specific configuration
    webhook_url = models.URLField(blank=True, validators=[URLValidator()])

    # Authentication
    auth_method = models.CharField(
        max_length=20,
        choices=[
            ('OAUTH2', 'OAuth 2.0'),
            ('API_KEY', 'API Key'),
            ('BASIC_AUTH', 'Basic Authentication'),
            ('BEARER_TOKEN', 'Bearer Token'),
        ],
        default='OAUTH2'
    )
    is_authenticated = models.BooleanField(default=False)

    # Usage Tracking
    last_sync_at = models.DateTimeField(null=True, blank=True)
    sync_frequency_minutes = models.IntegerField(default=60)  # How often to sync
    total_sync_count = models.IntegerField(default=0)
    failed_sync_count = models.IntegerField(default=0)

    # Error Tracking
    last_error = models.TextField(blank=True)
    last_error_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'integrations'
        ordering = ['-created_at']
        unique_together = [['organization', 'integration_type', 'name']]
        indexes = [
            models.Index(fields=['organization', 'status']),
            models.Index(fields=['integration_type', 'status']),
        ]

    def __str__(self):
        return f"{self.get_integration_type_display()} - {self.organization.name}"

    def is_sync_due(self):
        """Check if integration is due for sync."""
        if not self.last_sync_at:
            return True
        from datetime import timedelta
        next_sync = self.last_sync_at + timedelta(minutes=self.sync_frequency_minutes)
        return timezone.now() >= next_sync


class OAuthToken(TimeStampedModel):
    """
    OAuth tokens for integrations.
    """
    integration = models.OneToOneField(
        Integration,
        on_delete=models.CASCADE,
        related_name='oauth_token'
    )

    # Token Details
    access_token = models.TextField()
    refresh_token = models.TextField(blank=True)
    token_type = models.CharField(max_length=50, default='Bearer')
    scope = models.TextField(blank=True)

    # Expiration
    expires_at = models.DateTimeField()
    refresh_token_expires_at = models.DateTimeField(null=True, blank=True)

    # Additional Data
    id_token = models.TextField(blank=True)
    extra_data = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = 'oauth_tokens'
        ordering = ['-created_at']

    def __str__(self):
        return f"OAuth Token for {self.integration}"

    def is_expired(self):
        """Check if access token is expired."""
        return timezone.now() >= self.expires_at

    def needs_refresh(self):
        """Check if token needs refresh (expires within 5 minutes)."""
        from datetime import timedelta
        buffer_time = timezone.now() + timedelta(minutes=5)
        return buffer_time >= self.expires_at


class DomainHealth(TimeStampedModel):
    """
    Domain health monitoring (DNS, email configuration).
    """
    HEALTH_STATUS_CHOICES = [
        ('HEALTHY', 'Healthy'),
        ('WARNING', 'Warning'),
        ('CRITICAL', 'Critical'),
        ('UNKNOWN', 'Unknown'),
    ]

    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='domain_health_checks'
    )
    domain = models.CharField(max_length=255)

    # Overall Status
    status = models.CharField(
        max_length=20,
        choices=HEALTH_STATUS_CHOICES,
        default='UNKNOWN'
    )

    # DNS Records
    mx_records = models.JSONField(default=list, blank=True)
    mx_status = models.CharField(max_length=20, default='UNKNOWN')

    # Email Authentication
    spf_record = models.TextField(blank=True)
    spf_status = models.CharField(
        max_length=20,
        choices=[
            ('PASS', 'Pass'),
            ('FAIL', 'Fail'),
            ('MISSING', 'Missing'),
            ('UNKNOWN', 'Unknown'),
        ],
        default='UNKNOWN'
    )

    dkim_records = models.JSONField(default=list, blank=True)
    dkim_status = models.CharField(max_length=20, default='UNKNOWN')

    dmarc_record = models.TextField(blank=True)
    dmarc_status = models.CharField(max_length=20, default='UNKNOWN')

    # SSL/TLS
    ssl_valid = models.BooleanField(default=False)
    ssl_expiry_date = models.DateTimeField(null=True, blank=True)
    ssl_issuer = models.CharField(max_length=255, blank=True)

    # Blacklist Status
    is_blacklisted = models.BooleanField(default=False)
    blacklist_sources = models.JSONField(default=list, blank=True)

    # Issues & Recommendations
    issues = models.JSONField(default=list, blank=True)
    recommendations = models.JSONField(default=list, blank=True)

    # Last Check
    last_checked_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = 'domain_health'
        ordering = ['-last_checked_at']
        unique_together = [['organization', 'domain']]
        indexes = [
            models.Index(fields=['organization', '-last_checked_at']),
            models.Index(fields=['domain', '-last_checked_at']),
            models.Index(fields=['status', '-last_checked_at']),
        ]

    def __str__(self):
        return f"{self.domain} - {self.status}"

    def calculate_overall_status(self):
        """Calculate overall health status based on checks."""
        critical_issues = 0
        warnings = 0

        # Check MX
        if self.mx_status == 'FAIL':
            critical_issues += 1

        # Check SPF
        if self.spf_status in ['FAIL', 'MISSING']:
            warnings += 1

        # Check DMARC
        if self.dmarc_status in ['FAIL', 'MISSING']:
            warnings += 1

        # Check SSL
        if not self.ssl_valid:
            critical_issues += 1

        # Check Blacklist
        if self.is_blacklisted:
            critical_issues += 1

        # Determine status
        if critical_issues > 0:
            self.status = 'CRITICAL'
        elif warnings > 1:
            self.status = 'WARNING'
        elif warnings == 1:
            self.status = 'WARNING'
        else:
            self.status = 'HEALTHY'

        self.save(update_fields=['status'])


class IntegrationLog(TimeStampedModel):
    """
    Logs for integration activities and sync operations.
    """
    LOG_TYPE_CHOICES = [
        ('SYNC', 'Sync Operation'),
        ('AUTH', 'Authentication'),
        ('WEBHOOK', 'Webhook'),
        ('API_CALL', 'API Call'),
        ('ERROR', 'Error'),
    ]

    integration = models.ForeignKey(
        Integration,
        on_delete=models.CASCADE,
        related_name='logs'
    )

    # Log Details
    log_type = models.CharField(max_length=20, choices=LOG_TYPE_CHOICES)
    message = models.TextField()
    level = models.CharField(
        max_length=20,
        choices=[
            ('DEBUG', 'Debug'),
            ('INFO', 'Info'),
            ('WARNING', 'Warning'),
            ('ERROR', 'Error'),
            ('CRITICAL', 'Critical'),
        ],
        default='INFO'
    )

    # Request/Response
    request_data = models.JSONField(default=dict, blank=True)
    response_data = models.JSONField(default=dict, blank=True)
    status_code = models.IntegerField(null=True, blank=True)

    # Performance
    duration_ms = models.IntegerField(default=0)

    # Error Details
    error_trace = models.TextField(blank=True)

    class Meta:
        db_table = 'integration_logs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['integration', '-created_at']),
            models.Index(fields=['log_type', '-created_at']),
            models.Index(fields=['level', '-created_at']),
        ]

    def __str__(self):
        return f"{self.log_type} - {self.integration} ({self.level})"
