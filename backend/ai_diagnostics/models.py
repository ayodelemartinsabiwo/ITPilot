"""
AI Diagnostics Models
Handles diagnostic scans, issue detection, recommendations, and auto-fix actions.
"""
from django.db import models
from django.contrib.auth import get_user_model
from common.models import TimeStampedModel

User = get_user_model()


class DiagnosticScan(TimeStampedModel):
    """Represents a diagnostic scan performed on a device"""

    SCAN_TYPE_CHOICES = [
        ('FULL', 'Full System Scan'),
        ('QUICK', 'Quick Scan'),
        ('TARGETED', 'Targeted Scan'),
        ('SCHEDULED', 'Scheduled Scan'),
    ]

    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('RUNNING', 'Running'),
        ('COMPLETED', 'Completed'),
        ('FAILED', 'Failed'),
        ('CANCELLED', 'Cancelled'),
    ]

    device = models.ForeignKey(
        'devices.Device',
        on_delete=models.CASCADE,
        related_name='diagnostic_scans'
    )
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='diagnostic_scans'
    )
    initiated_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        related_name='initiated_scans'
    )
    scan_type = models.CharField(max_length=20, choices=SCAN_TYPE_CHOICES, default='FULL')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')

    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    issues_found = models.IntegerField(default=0)
    critical_issues = models.IntegerField(default=0)
    high_issues = models.IntegerField(default=0)
    medium_issues = models.IntegerField(default=0)
    low_issues = models.IntegerField(default=0)

    scan_areas = models.JSONField(default=list)  # Areas scanned: ['hardware', 'software', 'network', 'security']
    scan_results = models.JSONField(default=dict)  # Detailed scan results
    error_message = models.TextField(blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['device', '-created_at']),
            models.Index(fields=['organization', '-created_at']),
            models.Index(fields=['status', '-created_at']),
        ]

    def __str__(self):
        return f"{self.scan_type} scan on {self.device} - {self.status}"


class DetectedIssue(TimeStampedModel):
    """Represents an issue detected during a diagnostic scan"""

    CATEGORY_CHOICES = [
        ('HARDWARE', 'Hardware'),
        ('SOFTWARE', 'Software'),
        ('NETWORK', 'Network'),
        ('SECURITY', 'Security'),
        ('PERFORMANCE', 'Performance'),
        ('STORAGE', 'Storage'),
    ]

    SEVERITY_CHOICES = [
        ('LOW', 'Low'),
        ('MEDIUM', 'Medium'),
        ('HIGH', 'High'),
        ('CRITICAL', 'Critical'),
    ]

    STATUS_CHOICES = [
        ('NEW', 'New'),
        ('ACKNOWLEDGED', 'Acknowledged'),
        ('IN_PROGRESS', 'In Progress'),
        ('RESOLVED', 'Resolved'),
        ('IGNORED', 'Ignored'),
    ]

    scan = models.ForeignKey(
        DiagnosticScan,
        on_delete=models.CASCADE,
        related_name='issues'
    )
    device = models.ForeignKey(
        'devices.Device',
        on_delete=models.CASCADE,
        related_name='detected_issues'
    )
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='detected_issues'
    )

    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    severity = models.CharField(max_length=20, choices=SEVERITY_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='NEW')

    title = models.CharField(max_length=255)
    description = models.TextField()
    technical_details = models.JSONField(default=dict)

    auto_fixable = models.BooleanField(default=False)
    fix_applied = models.BooleanField(default=False)

    resolved_at = models.DateTimeField(null=True, blank=True)
    resolved_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='resolved_issues'
    )

    class Meta:
        ordering = ['-severity', '-created_at']
        indexes = [
            models.Index(fields=['device', '-created_at']),
            models.Index(fields=['organization', 'status', '-created_at']),
            models.Index(fields=['severity', '-created_at']),
        ]

    def __str__(self):
        return f"{self.severity} - {self.title}"


class Recommendation(TimeStampedModel):
    """Represents a recommendation for fixing an issue"""

    RISK_LEVEL_CHOICES = [
        ('LOW', 'Low Risk'),
        ('MEDIUM', 'Medium Risk'),
        ('HIGH', 'High Risk'),
    ]

    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('ACCEPTED', 'Accepted'),
        ('REJECTED', 'Rejected'),
        ('APPLIED', 'Applied'),
    ]

    issue = models.ForeignKey(
        DetectedIssue,
        on_delete=models.CASCADE,
        related_name='recommendations'
    )
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='recommendations'
    )

    title = models.CharField(max_length=255)
    description = models.TextField()
    steps = models.JSONField(default=list)  # List of step-by-step instructions

    estimated_time = models.IntegerField(help_text='Estimated time in minutes')
    risk_level = models.CharField(max_length=20, choices=RISK_LEVEL_CHOICES)

    requires_restart = models.BooleanField(default=False)
    requires_downtime = models.BooleanField(default=False)

    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    applied_at = models.DateTimeField(null=True, blank=True)
    applied_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='applied_recommendations'
    )

    success_rate = models.FloatField(default=0.0, help_text='Success rate percentage')
    times_applied = models.IntegerField(default=0)

    class Meta:
        ordering = ['risk_level', '-created_at']

    def __str__(self):
        return f"{self.title} for {self.issue}"


class SystemAlert(TimeStampedModel):
    """System alerts generated by AI diagnostics"""

    ALERT_TYPE_CHOICES = [
        ('CRITICAL', 'Critical Alert'),
        ('WARNING', 'Warning'),
        ('INFO', 'Information'),
        ('SUCCESS', 'Success'),
    ]

    SOURCE_CHOICES = [
        ('DIAGNOSTIC_SCAN', 'Diagnostic Scan'),
        ('REAL_TIME_MONITORING', 'Real-time Monitoring'),
        ('THRESHOLD_VIOLATION', 'Threshold Violation'),
        ('SYSTEM_EVENT', 'System Event'),
    ]

    STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('ACKNOWLEDGED', 'Acknowledged'),
        ('RESOLVED', 'Resolved'),
        ('DISMISSED', 'Dismissed'),
    ]

    device = models.ForeignKey(
        'devices.Device',
        on_delete=models.CASCADE,
        related_name='system_alerts',
        null=True,
        blank=True
    )
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='system_alerts'
    )
    issue = models.ForeignKey(
        DetectedIssue,
        on_delete=models.CASCADE,
        related_name='alerts',
        null=True,
        blank=True
    )

    alert_type = models.CharField(max_length=20, choices=ALERT_TYPE_CHOICES)
    source = models.CharField(max_length=30, choices=SOURCE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='ACTIVE')

    title = models.CharField(max_length=255)
    message = models.TextField()
    details = models.JSONField(default=dict)

    acknowledged_at = models.DateTimeField(null=True, blank=True)
    acknowledged_by = models.ForeignKey(
        User,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='acknowledged_alerts'
    )

    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['organization', 'status', '-created_at']),
            models.Index(fields=['device', 'status', '-created_at']),
            models.Index(fields=['alert_type', '-created_at']),
        ]

    def __str__(self):
        return f"{self.alert_type} - {self.title}"


class AutoFixAction(TimeStampedModel):
    """Represents an automated fix action executed by the system"""

    ACTION_TYPE_CHOICES = [
        ('CLEANUP', 'Disk Cleanup'),
        ('UPDATE', 'Software Update'),
        ('RESTART_SERVICE', 'Restart Service'),
        ('CLEAR_CACHE', 'Clear Cache'),
        ('FIX_REGISTRY', 'Fix Registry'),
        ('OPTIMIZE', 'System Optimization'),
        ('SECURITY_PATCH', 'Security Patch'),
    ]

    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('RUNNING', 'Running'),
        ('SUCCESS', 'Success'),
        ('FAILED', 'Failed'),
        ('ROLLED_BACK', 'Rolled Back'),
    ]

    issue = models.ForeignKey(
        DetectedIssue,
        on_delete=models.CASCADE,
        related_name='auto_fix_actions'
    )
    recommendation = models.ForeignKey(
        Recommendation,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='auto_fix_actions'
    )
    device = models.ForeignKey(
        'devices.Device',
        on_delete=models.CASCADE,
        related_name='auto_fix_actions'
    )
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='auto_fix_actions'
    )

    action_type = models.CharField(max_length=30, choices=ACTION_TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')

    parameters = models.JSONField(default=dict)  # Action-specific parameters

    executed_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    result = models.JSONField(default=dict)
    error_message = models.TextField(blank=True)

    rollback_possible = models.BooleanField(default=False)
    rollback_data = models.JSONField(default=dict)  # Data needed for rollback
    rolled_back_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['device', '-created_at']),
            models.Index(fields=['organization', 'status', '-created_at']),
        ]

    def __str__(self):
        return f"{self.action_type} on {self.device} - {self.status}"
