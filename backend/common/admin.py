"""
Admin interface for common models.
"""

from django.contrib import admin
from .models import AuditLog, SystemConfiguration


@admin.register(AuditLog)
class AuditLogAdmin(admin.ModelAdmin):
    list_display = ['user', 'organization', 'action', 'resource_type', 'status', 'created_at']
    list_filter = ['action', 'status', 'created_at']
    search_fields = ['user__email', 'resource_type', 'ip_address']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'
    ordering = ['-created_at']

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False


@admin.register(SystemConfiguration)
class SystemConfigurationAdmin(admin.ModelAdmin):
    list_display = ['key', 'description', 'is_active', 'updated_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['key', 'description']
    readonly_fields = ['created_at', 'updated_at']
