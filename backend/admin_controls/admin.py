"""
Admin interface for admin_controls models.
"""

from django.contrib import admin
from django.utils.html import format_html
from .models import ActivityLog, AuditRecord, CustomRole, OrganizationPolicy


@admin.register(ActivityLog)
class ActivityLogAdmin(admin.ModelAdmin):
    """Admin interface for ActivityLog model."""
    list_display = [
        'get_user_email',
        'action',
        'resource_type',
        'resource_id',
        'get_organization_name',
        'created_at'
    ]
    list_filter = [
        'action',
        'resource_type',
        'organization',
        'created_at'
    ]
    search_fields = [
        'user__email',
        'organization__name',
        'resource_type',
        'resource_id',
        'ip_address'
    ]
    readonly_fields = [
        'id',
        'created_at',
        'updated_at',
        'details'
    ]
    ordering = ['-created_at']
    date_hierarchy = 'created_at'

    fieldsets = (
        ('User Information', {
            'fields': ('user', 'ip_address', 'user_agent')
        }),
        ('Organization', {
            'fields': ('organization',)
        }),
        ('Activity Details', {
            'fields': ('action', 'resource_type', 'resource_id')
        }),
        ('Additional Information', {
            'fields': ('details',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
        ('System', {
            'fields': ('id',),
            'classes': ('collapse',)
        }),
    )

    def get_user_email(self, obj):
        """Display user email or 'System' if no user."""
        return obj.user.email if obj.user else 'System'
    get_user_email.short_description = 'User'
    get_user_email.admin_order_field = 'user__email'

    def get_organization_name(self, obj):
        """Display organization name."""
        return obj.organization.name
    get_organization_name.short_description = 'Organization'
    get_organization_name.admin_order_field = 'organization__name'


@admin.register(AuditRecord)
class AuditRecordAdmin(admin.ModelAdmin):
    """Admin interface for AuditRecord model."""
    list_display = [
        'event_type',
        'get_actor_email',
        'get_target_user_email',
        'action',
        'get_sensitive_badge',
        'get_organization_name',
        'created_at'
    ]
    list_filter = [
        'event_type',
        'is_sensitive',
        'organization',
        'created_at'
    ]
    search_fields = [
        'action',
        'actor__email',
        'target_user__email',
        'organization__name'
    ]
    readonly_fields = [
        'id',
        'created_at',
        'updated_at',
        'before_state',
        'after_state'
    ]
    ordering = ['-created_at']
    date_hierarchy = 'created_at'

    fieldsets = (
        ('Event Information', {
            'fields': ('event_type', 'action')
        }),
        ('Actors', {
            'fields': ('organization', 'actor', 'target_user')
        }),
        ('State Changes', {
            'fields': ('before_state', 'after_state')
        }),
        ('Security', {
            'fields': ('is_sensitive',),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
        ('System', {
            'fields': ('id',),
            'classes': ('collapse',)
        }),
    )

    def get_actor_email(self, obj):
        """Display actor email or 'System' if no actor."""
        return obj.actor.email if obj.actor else 'System'
    get_actor_email.short_description = 'Actor'
    get_actor_email.admin_order_field = 'actor__email'

    def get_target_user_email(self, obj):
        """Display target user email or '-' if none."""
        return obj.target_user.email if obj.target_user else '-'
    get_target_user_email.short_description = 'Target User'
    get_target_user_email.admin_order_field = 'target_user__email'

    def get_organization_name(self, obj):
        """Display organization name."""
        return obj.organization.name
    get_organization_name.short_description = 'Organization'
    get_organization_name.admin_order_field = 'organization__name'

    def get_sensitive_badge(self, obj):
        """Display sensitivity status as colored badge."""
        if obj.is_sensitive:
            return format_html(
                '<span style="background-color: #ff4444; color: white; padding: 3px 8px; border-radius: 3px;">SENSITIVE</span>'
            )
        return format_html(
            '<span style="background-color: #44aa44; color: white; padding: 3px 8px; border-radius: 3px;">Normal</span>'
        )
    get_sensitive_badge.short_description = 'Sensitivity'


@admin.register(CustomRole)
class CustomRoleAdmin(admin.ModelAdmin):
    """Admin interface for CustomRole model."""
    list_display = [
        'name',
        'get_organization_name',
        'get_permission_count',
        'get_system_role_badge',
        'get_created_by_email',
        'created_at'
    ]
    list_filter = [
        'is_system_role',
        'organization',
        'created_at'
    ]
    search_fields = [
        'name',
        'description',
        'organization__name',
        'created_by__email'
    ]
    readonly_fields = [
        'id',
        'created_at',
        'updated_at',
        'permissions'
    ]
    ordering = ['name']

    fieldsets = (
        ('Role Information', {
            'fields': ('name', 'description', 'organization')
        }),
        ('Permissions', {
            'fields': ('permissions',),
            'description': 'Array of permission strings/identifiers'
        }),
        ('System', {
            'fields': ('is_system_role', 'created_by'),
            'classes': ('collapse',)
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
        ('Identifiers', {
            'fields': ('id',),
            'classes': ('collapse',)
        }),
    )

    def get_organization_name(self, obj):
        """Display organization name."""
        return obj.organization.name
    get_organization_name.short_description = 'Organization'
    get_organization_name.admin_order_field = 'organization__name'

    def get_permission_count(self, obj):
        """Display count of permissions."""
        return len(obj.permissions) if obj.permissions else 0
    get_permission_count.short_description = 'Permission Count'

    def get_system_role_badge(self, obj):
        """Display system role status as badge."""
        if obj.is_system_role:
            return format_html(
                '<span style="background-color: #0066cc; color: white; padding: 3px 8px; border-radius: 3px;">System</span>'
            )
        return format_html(
            '<span style="background-color: #999999; color: white; padding: 3px 8px; border-radius: 3px;">Custom</span>'
        )
    get_system_role_badge.short_description = 'Type'

    def get_created_by_email(self, obj):
        """Display creator email."""
        return obj.created_by.email if obj.created_by else '-'
    get_created_by_email.short_description = 'Created By'
    get_created_by_email.admin_order_field = 'created_by__email'


@admin.register(OrganizationPolicy)
class OrganizationPolicyAdmin(admin.ModelAdmin):
    """Admin interface for OrganizationPolicy model."""
    list_display = [
        'policy_type',
        'get_organization_name',
        'get_enabled_badge',
        'enforced_at',
        'get_enforced_by_email',
        'created_at'
    ]
    list_filter = [
        'policy_type',
        'enabled',
        'organization',
        'created_at'
    ]
    search_fields = [
        'organization__name',
        'enforced_by__email'
    ]
    readonly_fields = [
        'id',
        'created_at',
        'updated_at',
        'policy_config'
    ]
    ordering = ['-created_at']
    date_hierarchy = 'created_at'

    fieldsets = (
        ('Policy Information', {
            'fields': ('policy_type', 'organization')
        }),
        ('Configuration', {
            'fields': ('policy_config',),
            'description': 'JSON configuration for the policy'
        }),
        ('Enforcement', {
            'fields': ('enabled', 'enforced_at', 'enforced_by')
        }),
        ('Timestamps', {
            'fields': ('created_at', 'updated_at'),
            'classes': ('collapse',)
        }),
        ('System', {
            'fields': ('id',),
            'classes': ('collapse',)
        }),
    )

    def get_organization_name(self, obj):
        """Display organization name."""
        return obj.organization.name
    get_organization_name.short_description = 'Organization'
    get_organization_name.admin_order_field = 'organization__name'

    def get_enabled_badge(self, obj):
        """Display enabled status as colored badge."""
        if obj.enabled:
            return format_html(
                '<span style="background-color: #44aa44; color: white; padding: 3px 8px; border-radius: 3px;">Enabled</span>'
            )
        return format_html(
            '<span style="background-color: #cc4444; color: white; padding: 3px 8px; border-radius: 3px;">Disabled</span>'
        )
    get_enabled_badge.short_description = 'Status'

    def get_enforced_by_email(self, obj):
        """Display enforcer email or '-' if none."""
        return obj.enforced_by.email if obj.enforced_by else '-'
    get_enforced_by_email.short_description = 'Enforced By'
    get_enforced_by_email.admin_order_field = 'enforced_by__email'
