"""
Admin controls and audit models for ITPilot.

This module contains models for managing activity logs, audit records,
custom roles, and organization policies.
"""

from django.db import models
from common.models import TimeStampedModel


class ActivityLog(TimeStampedModel):
    """
    Model for logging user activities across the system.
    Tracks all user actions for compliance and auditing purposes.
    """
    ACTION_CHOICES = [
        ('CREATE', 'Create'),
        ('READ', 'Read'),
        ('UPDATE', 'Update'),
        ('DELETE', 'Delete'),
        ('LOGIN', 'Login'),
        ('LOGOUT', 'Logout'),
        ('EXPORT', 'Export'),
        ('IMPORT', 'Import'),
        ('PERMISSION_GRANT', 'Permission Grant'),
        ('PERMISSION_REVOKE', 'Permission Revoke'),
        ('CONFIG_CHANGE', 'Configuration Change'),
        ('DEVICE_ACTION', 'Device Action'),
        ('REMOTE_SESSION', 'Remote Session'),
        ('RESET_PASSWORD', 'Reset Password'),
        ('API_CALL', 'API Call'),
    ]

    user = models.ForeignKey(
        'authentication.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='activity_logs'
    )
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='activity_logs'
    )
    action = models.CharField(
        max_length=50,
        choices=ACTION_CHOICES
    )
    resource_type = models.CharField(
        max_length=100,
        db_index=True,
        help_text='Type of resource affected (e.g., User, Device, Organization)'
    )
    resource_id = models.CharField(
        max_length=255,
        null=True,
        blank=True,
        help_text='ID of the specific resource affected'
    )
    details = models.JSONField(
        default=dict,
        blank=True,
        help_text='Additional details about the activity in JSON format'
    )
    ip_address = models.GenericIPAddressField(
        null=True,
        blank=True,
        help_text='IP address from which the action was performed'
    )
    user_agent = models.TextField(
        null=True,
        blank=True,
        help_text='User agent string of the client'
    )

    class Meta:
        db_table = 'activity_logs'
        verbose_name = 'Activity Log'
        verbose_name_plural = 'Activity Logs'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['organization', '-created_at']),
            models.Index(fields=['action', '-created_at']),
            models.Index(fields=['resource_type', '-created_at']),
            models.Index(fields=['organization', 'action', '-created_at']),
        ]

    def __str__(self):
        return f"{self.action} - {self.resource_type} - {self.created_at}"


class AuditRecord(TimeStampedModel):
    """
    Model for detailed audit records of significant system events.
    Captures before and after states of changes for compliance.
    """
    EVENT_TYPE_CHOICES = [
        ('USER_CREATED', 'User Created'),
        ('USER_UPDATED', 'User Updated'),
        ('USER_DELETED', 'User Deleted'),
        ('USER_ACTIVATED', 'User Activated'),
        ('USER_DEACTIVATED', 'User Deactivated'),
        ('DEVICE_ADDED', 'Device Added'),
        ('DEVICE_REMOVED', 'Device Removed'),
        ('DEVICE_UPDATED', 'Device Updated'),
        ('PERMISSION_CHANGED', 'Permission Changed'),
        ('ROLE_ASSIGNED', 'Role Assigned'),
        ('ROLE_REVOKED', 'Role Revoked'),
        ('POLICY_CREATED', 'Policy Created'),
        ('POLICY_UPDATED', 'Policy Updated'),
        ('POLICY_DELETED', 'Policy Deleted'),
        ('SECURITY_EVENT', 'Security Event'),
        ('CONFIGURATION_CHANGED', 'Configuration Changed'),
        ('API_KEY_CREATED', 'API Key Created'),
        ('API_KEY_REVOKED', 'API Key Revoked'),
    ]

    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='audit_records'
    )
    event_type = models.CharField(
        max_length=50,
        choices=EVENT_TYPE_CHOICES,
        db_index=True
    )
    actor = models.ForeignKey(
        'authentication.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_records_created'
    )
    target_user = models.ForeignKey(
        'authentication.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='audit_records_targeting'
    )
    action = models.CharField(
        max_length=255,
        help_text='Description of the action taken'
    )
    before_state = models.JSONField(
        default=dict,
        blank=True,
        help_text='State of the resource before the change'
    )
    after_state = models.JSONField(
        default=dict,
        blank=True,
        help_text='State of the resource after the change'
    )
    is_sensitive = models.BooleanField(
        default=False,
        help_text='Flag for sensitive operations (e.g., password changes)'
    )

    class Meta:
        db_table = 'audit_records'
        verbose_name = 'Audit Record'
        verbose_name_plural = 'Audit Records'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['organization', '-created_at']),
            models.Index(fields=['event_type', '-created_at']),
            models.Index(fields=['actor', '-created_at']),
            models.Index(fields=['target_user', '-created_at']),
            models.Index(fields=['is_sensitive', '-created_at']),
            models.Index(fields=['organization', 'event_type', '-created_at']),
        ]

    def __str__(self):
        return f"{self.event_type} - {self.action} - {self.created_at}"


class CustomRole(TimeStampedModel):
    """
    Model for custom user roles with granular permissions.
    Allows organizations to define custom roles tailored to their needs.
    """
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='custom_roles'
    )
    name = models.CharField(
        max_length=100,
        help_text='Name of the custom role'
    )
    description = models.TextField(
        blank=True,
        help_text='Description of the role and its responsibilities'
    )
    permissions = models.JSONField(
        default=list,
        help_text='Array of permission strings/identifiers'
    )
    is_system_role = models.BooleanField(
        default=False,
        help_text='Flag to indicate if this is a system-defined role'
    )
    created_by = models.ForeignKey(
        'authentication.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='custom_roles_created'
    )

    class Meta:
        db_table = 'custom_roles'
        verbose_name = 'Custom Role'
        verbose_name_plural = 'Custom Roles'
        ordering = ['name']
        indexes = [
            models.Index(fields=['organization', 'name']),
            models.Index(fields=['is_system_role']),
            models.Index(fields=['created_by']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['organization', 'name'],
                name='unique_role_per_org'
            ),
        ]

    def __str__(self):
        return f"{self.name} - {self.organization.name}"


class OrganizationPolicy(TimeStampedModel):
    """
    Model for managing organization-wide policies.
    Supports various policy types with JSON configuration and enforcement tracking.
    """
    POLICY_TYPE_CHOICES = [
        ('PASSWORD', 'Password Policy'),
        ('MFA', 'Multi-Factor Authentication'),
        ('SESSION', 'Session Management'),
        ('DEVICE', 'Device Policy'),
        ('SECURITY', 'Security Policy'),
        ('DATA_RETENTION', 'Data Retention'),
        ('ACCESS_CONTROL', 'Access Control'),
        ('API', 'API Policy'),
        ('AUDIT', 'Audit Policy'),
        ('ENCRYPTION', 'Encryption Policy'),
    ]

    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='policies'
    )
    policy_type = models.CharField(
        max_length=50,
        choices=POLICY_TYPE_CHOICES,
        db_index=True
    )
    policy_config = models.JSONField(
        default=dict,
        help_text='Configuration parameters for the policy'
    )
    enabled = models.BooleanField(
        default=True,
        db_index=True,
        help_text='Whether this policy is currently enabled'
    )
    enforced_at = models.DateTimeField(
        null=True,
        blank=True,
        help_text='Timestamp when the policy was last enforced'
    )
    enforced_by = models.ForeignKey(
        'authentication.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='enforced_policies'
    )

    class Meta:
        db_table = 'organization_policies'
        verbose_name = 'Organization Policy'
        verbose_name_plural = 'Organization Policies'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['organization', 'policy_type']),
            models.Index(fields=['enabled', '-created_at']),
            models.Index(fields=['organization', 'enabled']),
        ]
        constraints = [
            models.UniqueConstraint(
                fields=['organization', 'policy_type'],
                name='unique_policy_type_per_org'
            ),
        ]

    def __str__(self):
        return f"{self.get_policy_type_display()} - {self.organization.name}"
