"""
Device models for ITPilot device management and monitoring.
"""

from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator
from common.models import TimeStampedModel
import secrets


class Device(TimeStampedModel):
    """
    Device model for tracking endpoint devices.
    """
    OS_CHOICES = [
        ('WINDOWS', 'Windows'),
        ('MACOS', 'macOS'),
        ('LINUX', 'Linux'),
        ('IOS', 'iOS'),
        ('ANDROID', 'Android'),
        ('OTHER', 'Other'),
    ]

    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('INACTIVE', 'Inactive'),
        ('MAINTENANCE', 'Maintenance'),
        ('DECOMMISSIONED', 'Decommissioned'),
    ]

    # Organization & User
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='devices'
    )
    user = models.ForeignKey(
        'authentication.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='devices'
    )

    # Device Information
    name = models.CharField(max_length=255)
    hostname = models.CharField(max_length=255, blank=True)
    device_id = models.CharField(max_length=255, unique=True, db_index=True)
    serial_number = models.CharField(max_length=255, blank=True)
    mac_address = models.CharField(max_length=17, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)

    # System Information
    os_type = models.CharField(max_length=20, choices=OS_CHOICES)
    os_version = models.CharField(max_length=100, blank=True)
    os_build = models.CharField(max_length=100, blank=True)
    cpu_model = models.CharField(max_length=255, blank=True)
    cpu_cores = models.IntegerField(null=True, blank=True)
    ram_total_gb = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    disk_total_gb = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )

    # Device Type
    manufacturer = models.CharField(max_length=100, blank=True)
    model = models.CharField(max_length=100, blank=True)
    device_type = models.CharField(
        max_length=20,
        choices=[
            ('DESKTOP', 'Desktop'),
            ('LAPTOP', 'Laptop'),
            ('TABLET', 'Tablet'),
            ('PHONE', 'Phone'),
            ('SERVER', 'Server'),
            ('OTHER', 'Other'),
        ],
        default='DESKTOP'
    )

    # Status & Management
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')
    is_active = models.BooleanField(default=True)
    is_managed = models.BooleanField(default=True)
    is_encrypted = models.BooleanField(default=False)
    is_compliant = models.BooleanField(default=True)

    # Agent Information
    agent_version = models.CharField(max_length=50, blank=True)
    agent_installed_at = models.DateTimeField(null=True, blank=True)
    last_seen_at = models.DateTimeField(null=True, blank=True)
    last_sync_at = models.DateTimeField(null=True, blank=True)

    # Authentication
    api_key_hash = models.CharField(max_length=255, blank=True)
    registration_token = models.CharField(max_length=100, blank=True)

    # Metadata
    tags = models.JSONField(default=list, blank=True)
    metadata = models.JSONField(default=dict, blank=True)
    notes = models.TextField(blank=True)

    class Meta:
        db_table = 'devices'
        ordering = ['-last_seen_at', 'name']
        indexes = [
            models.Index(fields=['organization', 'is_active']),
            models.Index(fields=['device_id']),
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['status', '-last_seen_at']),
            models.Index(fields=['os_type']),
        ]

    def __str__(self):
        return f"{self.name} ({self.device_id})"

    def is_online(self):
        """Check if device is online (last seen within 5 minutes)."""
        from django.utils import timezone
        from datetime import timedelta
        if not self.last_seen_at:
            return False
        return timezone.now() - self.last_seen_at < timedelta(minutes=5)

    def get_health_status(self):
        """Get current device health status."""
        latest_health = self.health_records.order_by('-created_at').first()
        return latest_health.status if latest_health else 'UNKNOWN'

    def generate_registration_token(self):
        """Generate a new registration token."""
        self.registration_token = secrets.token_urlsafe(32)
        self.save()
        return self.registration_token


class DeviceHealth(TimeStampedModel):
    """
    Device health monitoring records.
    """
    HEALTH_STATUS_CHOICES = [
        ('HEALTHY', 'Healthy'),
        ('WARNING', 'Warning'),
        ('CRITICAL', 'Critical'),
        ('UNKNOWN', 'Unknown'),
    ]

    device = models.ForeignKey(
        Device,
        on_delete=models.CASCADE,
        related_name='health_records'
    )

    # Health Status
    status = models.CharField(
        max_length=20,
        choices=HEALTH_STATUS_CHOICES,
        default='UNKNOWN'
    )

    # CPU Metrics
    cpu_usage_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        null=True,
        blank=True
    )
    cpu_temperature = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )

    # Memory Metrics
    ram_used_gb = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    ram_usage_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        null=True,
        blank=True
    )

    # Disk Metrics
    disk_used_gb = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    disk_usage_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        null=True,
        blank=True
    )

    # Battery Metrics (for laptops/mobile devices)
    battery_percent = models.IntegerField(
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        null=True,
        blank=True
    )
    battery_is_charging = models.BooleanField(default=False)
    battery_estimated_minutes = models.IntegerField(null=True, blank=True)

    # Network Metrics
    network_upload_mbps = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    network_download_mbps = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        null=True,
        blank=True
    )
    network_latency_ms = models.IntegerField(null=True, blank=True)

    # System Uptime
    uptime_seconds = models.BigIntegerField(null=True, blank=True)

    # Issues
    issues = models.JSONField(default=list, blank=True)
    warnings = models.JSONField(default=list, blank=True)

    class Meta:
        db_table = 'device_health'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['device', '-created_at']),
            models.Index(fields=['status', '-created_at']),
        ]

    def __str__(self):
        return f"{self.device.name} - {self.status} ({self.created_at})"

    def check_thresholds(self):
        """Check health metrics against thresholds and set status."""
        issues = []
        warnings = []
        status = 'HEALTHY'

        # Check CPU
        if self.cpu_usage_percent:
            if self.cpu_usage_percent > 90:
                issues.append('CPU usage above 90%')
                status = 'CRITICAL'
            elif self.cpu_usage_percent > 80:
                warnings.append('CPU usage above 80%')
                if status == 'HEALTHY':
                    status = 'WARNING'

        # Check RAM
        if self.ram_usage_percent:
            if self.ram_usage_percent > 95:
                issues.append('RAM usage above 95%')
                status = 'CRITICAL'
            elif self.ram_usage_percent > 85:
                warnings.append('RAM usage above 85%')
                if status == 'HEALTHY':
                    status = 'WARNING'

        # Check Disk
        if self.disk_usage_percent:
            if self.disk_usage_percent > 95:
                issues.append('Disk usage above 95%')
                status = 'CRITICAL'
            elif self.disk_usage_percent > 85:
                warnings.append('Disk usage above 85%')
                if status == 'HEALTHY':
                    status = 'WARNING'

        # Check Battery
        if self.battery_percent is not None and not self.battery_is_charging:
            if self.battery_percent < 10:
                issues.append('Battery critically low (< 10%)')
                status = 'CRITICAL'
            elif self.battery_percent < 20:
                warnings.append('Battery low (< 20%)')
                if status == 'HEALTHY':
                    status = 'WARNING'

        self.issues = issues
        self.warnings = warnings
        self.status = status
        self.save()


class DeviceMetrics(TimeStampedModel):
    """
    Aggregated device metrics for analytics and reporting.
    """
    METRIC_TYPE_CHOICES = [
        ('DAILY', 'Daily'),
        ('WEEKLY', 'Weekly'),
        ('MONTHLY', 'Monthly'),
    ]

    device = models.ForeignKey(
        Device,
        on_delete=models.CASCADE,
        related_name='metrics'
    )
    metric_type = models.CharField(max_length=20, choices=METRIC_TYPE_CHOICES)
    period_start = models.DateTimeField()
    period_end = models.DateTimeField()

    # Averaged Metrics
    avg_cpu_usage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )
    avg_ram_usage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )
    avg_disk_usage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )

    # Peak Metrics
    peak_cpu_usage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )
    peak_ram_usage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )
    peak_disk_usage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )

    # Uptime
    total_uptime_seconds = models.BigIntegerField(default=0)
    uptime_percentage = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        validators=[MinValueValidator(0), MaxValueValidator(100)],
        null=True,
        blank=True
    )

    # Health
    health_checks_count = models.IntegerField(default=0)
    healthy_count = models.IntegerField(default=0)
    warning_count = models.IntegerField(default=0)
    critical_count = models.IntegerField(default=0)

    # Network
    total_upload_gb = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0
    )
    total_download_gb = models.DecimalField(
        max_digits=15,
        decimal_places=2,
        default=0
    )

    class Meta:
        db_table = 'device_metrics'
        ordering = ['-period_start']
        unique_together = [['device', 'metric_type', 'period_start']]
        indexes = [
            models.Index(fields=['device', 'metric_type', '-period_start']),
        ]

    def __str__(self):
        return f"{self.device.name} - {self.metric_type} ({self.period_start})"
