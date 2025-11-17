"""
Django admin configuration for Integrations app.
"""

from django.contrib import admin
from .models import Integration, OAuthToken, DomainHealth, IntegrationLog


@admin.register(Integration)
class IntegrationAdmin(admin.ModelAdmin):
    """Admin interface for Integration model."""
    list_display = [
        'name', 'integration_type', 'organization', 'status',
        'is_authenticated', 'last_sync_at', 'total_sync_count',
        'failed_sync_count', 'created_at'
    ]
    list_filter = ['integration_type', 'status', 'auth_method', 'is_authenticated', 'created_at']
    search_fields = ['name', 'organization__name', 'description']
    readonly_fields = [
        'id', 'is_authenticated', 'last_sync_at', 'total_sync_count',
        'failed_sync_count', 'last_error_at', 'created_at', 'updated_at'
    ]
    autocomplete_fields = ['organization', 'created_by']
    fieldsets = (
        ('Integration Details', {
            'fields': ('organization', 'created_by', 'integration_type', 'name', 'description')
        }),
        ('Status', {
            'fields': ('status', 'is_authenticated')
        }),
        ('Configuration', {
            'fields': ('config', 'webhook_url', 'auth_method')
        }),
        ('Sync Settings', {
            'fields': (
                'last_sync_at', 'sync_frequency_minutes',
                'total_sync_count', 'failed_sync_count'
            )
        }),
        ('Errors', {
            'fields': ('last_error', 'last_error_at')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )


@admin.register(OAuthToken)
class OAuthTokenAdmin(admin.ModelAdmin):
    """Admin interface for OAuthToken model."""
    list_display = [
        'integration', 'token_type', 'expires_at',
        'refresh_token_expires_at', 'created_at'
    ]
    list_filter = ['token_type', 'created_at']
    search_fields = ['integration__name']
    readonly_fields = ['id', 'created_at', 'updated_at']
    autocomplete_fields = ['integration']
    fieldsets = (
        ('Integration', {
            'fields': ('integration',)
        }),
        ('Token Details', {
            'fields': ('access_token', 'refresh_token', 'token_type', 'scope')
        }),
        ('Expiration', {
            'fields': ('expires_at', 'refresh_token_expires_at')
        }),
        ('Additional Data', {
            'fields': ('id_token', 'extra_data')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )


@admin.register(DomainHealth)
class DomainHealthAdmin(admin.ModelAdmin):
    """Admin interface for DomainHealth model."""
    list_display = [
        'domain', 'organization', 'status', 'mx_status',
        'spf_status', 'dmarc_status', 'ssl_valid',
        'is_blacklisted', 'last_checked_at'
    ]
    list_filter = [
        'status', 'mx_status', 'spf_status', 'dmarc_status',
        'ssl_valid', 'is_blacklisted', 'last_checked_at'
    ]
    search_fields = ['domain', 'organization__name']
    readonly_fields = ['id', 'last_checked_at', 'created_at', 'updated_at']
    autocomplete_fields = ['organization']
    fieldsets = (
        ('Domain', {
            'fields': ('organization', 'domain', 'status')
        }),
        ('DNS Records', {
            'fields': ('mx_records', 'mx_status')
        }),
        ('Email Authentication', {
            'fields': (
                'spf_record', 'spf_status',
                'dkim_records', 'dkim_status',
                'dmarc_record', 'dmarc_status'
            )
        }),
        ('SSL/TLS', {
            'fields': ('ssl_valid', 'ssl_expiry_date', 'ssl_issuer')
        }),
        ('Blacklist', {
            'fields': ('is_blacklisted', 'blacklist_sources')
        }),
        ('Issues & Recommendations', {
            'fields': ('issues', 'recommendations')
        }),
        ('Metadata', {
            'fields': ('last_checked_at', 'id', 'created_at', 'updated_at')
        }),
    )


@admin.register(IntegrationLog)
class IntegrationLogAdmin(admin.ModelAdmin):
    """Admin interface for IntegrationLog model."""
    list_display = [
        'integration', 'log_type', 'level', 'message_preview',
        'status_code', 'duration_ms', 'created_at'
    ]
    list_filter = ['log_type', 'level', 'created_at']
    search_fields = ['integration__name', 'message']
    readonly_fields = ['id', 'created_at', 'updated_at']
    autocomplete_fields = ['integration']
    fieldsets = (
        ('Integration', {
            'fields': ('integration',)
        }),
        ('Log Details', {
            'fields': ('log_type', 'level', 'message')
        }),
        ('Request/Response', {
            'fields': ('request_data', 'response_data', 'status_code')
        }),
        ('Performance', {
            'fields': ('duration_ms',)
        }),
        ('Error', {
            'fields': ('error_trace',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )

    def message_preview(self, obj):
        """Show message preview."""
        return obj.message[:50] + '...' if len(obj.message) > 50 else obj.message
    message_preview.short_description = 'Message'
