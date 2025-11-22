"""
Network Security models for ITPilot.
Handles WiFi analysis, threat detection, patch management, antivirus status,
and password auditing for managed devices.
"""

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from common.models import TimeStampedModel


class WiFiAnalysis(TimeStampedModel):
    """
    WiFi network analysis data for devices.
    """
    device = models.ForeignKey(
        'devices.Device',
        on_delete=models.CASCADE,
        related_name='wifi_analyses'
    )

    # WiFi Information
    ssid = models.CharField(max_length=255)
    signal_strength = models.IntegerField(
        validators=[MinValueValidator(-100), MaxValueValidator(0)],
        help_text='WiFi signal strength in dBm'
    )
    channel = models.IntegerField(
        validators=[MinValueValidator(1), MaxValueValidator(165)]
    )
    frequency = models.IntegerField(help_text='Frequency in MHz')

    # Network Performance
    download_speed = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Download speed in Mbps'
    )
    upload_speed = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True,
        help_text='Upload speed in Mbps'
    )
    latency = models.IntegerField(
        null=True,
        blank=True,
        help_text='Latency in milliseconds'
    )
    packet_loss = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text='Packet loss percentage'
    )

    # Interference Detection
    interference_detected = models.BooleanField(default=False)

    class Meta:
        db_table = 'wifi_analyses'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['device', '-created_at']),
            models.Index(fields=['ssid', '-created_at']),
            models.Index(fields=['created_at']),
        ]

    def __str__(self):
        return f"{self.device.name} - {self.ssid} ({self.created_at})"


class ThreatDetection(TimeStampedModel):
    """
    Security threat detection records for devices and organizations.
    """
    THREAT_TYPE_CHOICES = [
        ('MALWARE', 'Malware'),
        ('UNAUTHORIZED_ACCESS', 'Unauthorized Access'),
        ('RISKY_APP', 'Risky Application'),
        ('PHISHING', 'Phishing'),
    ]

    SEVERITY_CHOICES = [
        ('CRITICAL', 'Critical'),
        ('HIGH', 'High'),
        ('MEDIUM', 'Medium'),
        ('LOW', 'Low'),
    ]

    STATUS_CHOICES = [
        ('DETECTED', 'Detected'),
        ('IN_PROGRESS', 'In Progress'),
        ('RESOLVED', 'Resolved'),
        ('IGNORED', 'Ignored'),
    ]

    device = models.ForeignKey(
        'devices.Device',
        on_delete=models.CASCADE,
        related_name='threats'
    )
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='threats'
    )

    # Threat Information
    threat_type = models.CharField(max_length=50, choices=THREAT_TYPE_CHOICES)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DETECTED')
    details = models.JSONField(default=dict, blank=True)

    # Timing
    detected_at = models.DateTimeField()

    class Meta:
        db_table = 'threat_detections'
        ordering = ['-detected_at', '-severity']
        indexes = [
            models.Index(fields=['device', '-detected_at']),
            models.Index(fields=['organization', '-detected_at']),
            models.Index(fields=['threat_type', '-detected_at']),
            models.Index(fields=['severity', '-detected_at']),
            models.Index(fields=['status', '-detected_at']),
        ]

    def __str__(self):
        return f"{self.device.name} - {self.threat_type} ({self.severity})"


class PatchStatus(TimeStampedModel):
    """
    Patch and update status for devices.
    """
    PATCH_TYPE_CHOICES = [
        ('OS_UPDATE', 'Operating System Update'),
        ('SECURITY_PATCH', 'Security Patch'),
        ('DRIVER_UPDATE', 'Driver Update'),
    ]

    SEVERITY_CHOICES = [
        ('CRITICAL', 'Critical'),
        ('HIGH', 'High'),
        ('MEDIUM', 'Medium'),
        ('LOW', 'Low'),
    ]

    device = models.ForeignKey(
        'devices.Device',
        on_delete=models.CASCADE,
        related_name='patches'
    )

    # Patch Information
    patch_type = models.CharField(max_length=50, choices=PATCH_TYPE_CHOICES)
    patch_name = models.CharField(max_length=255)
    current_version = models.CharField(max_length=100, blank=True)
    available_version = models.CharField(max_length=100, blank=True)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)

    # Timing
    release_date = models.DateField()
    installed = models.BooleanField(default=False)

    class Meta:
        db_table = 'patch_statuses'
        ordering = ['-release_date', '-severity']
        indexes = [
            models.Index(fields=['device', '-release_date']),
            models.Index(fields=['patch_type', '-release_date']),
            models.Index(fields=['severity', '-release_date']),
            models.Index(fields=['installed']),
        ]

    def __str__(self):
        return f"{self.device.name} - {self.patch_name} ({self.patch_type})"


class AntivirusStatus(TimeStampedModel):
    """
    Antivirus status and configuration for devices.
    """
    SCAN_STATUS_CHOICES = [
        ('IDLE', 'Idle'),
        ('SCANNING', 'Scanning'),
        ('THREAT_FOUND', 'Threat Found'),
        ('SCAN_FAILED', 'Scan Failed'),
    ]

    device = models.ForeignKey(
        'devices.Device',
        on_delete=models.CASCADE,
        related_name='antivirus_statuses'
    )

    # Antivirus Information
    antivirus_name = models.CharField(max_length=255)
    version = models.CharField(max_length=100, blank=True)
    enabled = models.BooleanField(default=True)

    # Update Information
    last_update = models.DateTimeField(null=True, blank=True)
    definitions_date = models.DateField(null=True, blank=True)

    # Scan Status
    scan_status = models.CharField(
        max_length=20,
        choices=SCAN_STATUS_CHOICES,
        default='IDLE'
    )

    class Meta:
        db_table = 'antivirus_statuses'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['device', '-created_at']),
            models.Index(fields=['antivirus_name', '-created_at']),
            models.Index(fields=['enabled']),
            models.Index(fields=['scan_status', '-created_at']),
        ]

    def __str__(self):
        return f"{self.device.name} - {self.antivirus_name} ({self.version})"


class PasswordAudit(TimeStampedModel):
    """
    Password strength and compliance audit records for users.
    """
    STRENGTH_CHOICES = [
        (0, 'Very Weak'),
        (25, 'Weak'),
        (50, 'Fair'),
        (75, 'Good'),
        (100, 'Strong'),
    ]

    user = models.ForeignKey(
        'authentication.User',
        on_delete=models.CASCADE,
        related_name='password_audits'
    )

    # Service Information
    service_name = models.CharField(max_length=255)

    # Password Strength
    strength_score = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        help_text='Password strength score from 0 to 100'
    )

    # Reuse Detection
    is_reused = models.BooleanField(
        default=False,
        help_text='Whether the password is reused across services'
    )

    # Password Change Information
    last_changed = models.DateField(null=True, blank=True)
    days_since_change = models.IntegerField(
        null=True,
        blank=True,
        validators=[MinValueValidator(0)],
        help_text='Number of days since password was last changed'
    )

    # Compliance
    compliant = models.BooleanField(
        default=True,
        help_text='Whether the password meets compliance requirements'
    )

    class Meta:
        db_table = 'password_audits'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['service_name']),
            models.Index(fields=['is_reused']),
            models.Index(fields=['compliant']),
            models.Index(fields=['strength_score']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.service_name} (Score: {self.strength_score})"
