"""
Django admin configuration for Devices app.
"""

from django.contrib import admin
from .models import Device, DeviceHealth, DeviceMetrics


@admin.register(Device)
class DeviceAdmin(admin.ModelAdmin):
    """Admin interface for Device model."""
    list_display = [
        'name', 'device_id', 'organization', 'user', 'os_type',
        'device_type', 'status', 'is_active', 'is_online',
        'last_seen_at', 'created_at'
    ]
    list_filter = [
        'os_type', 'device_type', 'status', 'is_active',
        'is_managed', 'is_encrypted', 'is_compliant', 'created_at'
    ]
    search_fields = [
        'name', 'device_id', 'hostname', 'serial_number',
        'mac_address', 'ip_address', 'organization__name',
        'user__email'
    ]
    readonly_fields = [
        'id', 'device_id', 'api_key_hash', 'last_seen_at',
        'last_sync_at', 'created_at', 'updated_at'
    ]
    autocomplete_fields = ['organization', 'user']
    fieldsets = (
        ('Organization & User', {
            'fields': ('organization', 'user')
        }),
        ('Device Information', {
            'fields': (
                'name', 'hostname', 'device_id', 'serial_number',
                'mac_address', 'ip_address'
            )
        }),
        ('System Information', {
            'fields': (
                'os_type', 'os_version', 'os_build', 'cpu_model',
                'cpu_cores', 'ram_total_gb', 'disk_total_gb'
            )
        }),
        ('Device Type', {
            'fields': ('manufacturer', 'model', 'device_type')
        }),
        ('Status & Management', {
            'fields': (
                'status', 'is_active', 'is_managed', 'is_encrypted',
                'is_compliant'
            )
        }),
        ('Agent Information', {
            'fields': (
                'agent_version', 'agent_installed_at', 'last_seen_at',
                'last_sync_at'
            )
        }),
        ('Authentication', {
            'fields': ('api_key_hash', 'registration_token')
        }),
        ('Metadata', {
            'fields': ('tags', 'metadata', 'notes', 'id', 'created_at', 'updated_at')
        }),
    )

    def is_online(self, obj):
        """Display online status."""
        return obj.is_online()
    is_online.boolean = True
    is_online.short_description = 'Online'


@admin.register(DeviceHealth)
class DeviceHealthAdmin(admin.ModelAdmin):
    """Admin interface for DeviceHealth model."""
    list_display = [
        'device', 'status', 'cpu_usage_percent', 'ram_usage_percent',
        'disk_usage_percent', 'battery_percent', 'created_at'
    ]
    list_filter = ['status', 'battery_is_charging', 'created_at']
    search_fields = ['device__name', 'device__device_id']
    readonly_fields = ['id', 'status', 'issues', 'warnings', 'created_at', 'updated_at']
    autocomplete_fields = ['device']
    fieldsets = (
        ('Device & Status', {
            'fields': ('device', 'status')
        }),
        ('CPU Metrics', {
            'fields': ('cpu_usage_percent', 'cpu_temperature')
        }),
        ('Memory Metrics', {
            'fields': ('ram_used_gb', 'ram_usage_percent')
        }),
        ('Disk Metrics', {
            'fields': ('disk_used_gb', 'disk_usage_percent')
        }),
        ('Battery Metrics', {
            'fields': (
                'battery_percent', 'battery_is_charging',
                'battery_estimated_minutes'
            )
        }),
        ('Network Metrics', {
            'fields': (
                'network_upload_mbps', 'network_download_mbps',
                'network_latency_ms'
            )
        }),
        ('System', {
            'fields': ('uptime_seconds',)
        }),
        ('Issues & Warnings', {
            'fields': ('issues', 'warnings')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )


@admin.register(DeviceMetrics)
class DeviceMetricsAdmin(admin.ModelAdmin):
    """Admin interface for DeviceMetrics model."""
    list_display = [
        'device', 'metric_type', 'period_start', 'period_end',
        'avg_cpu_usage', 'avg_ram_usage', 'avg_disk_usage',
        'uptime_percentage', 'created_at'
    ]
    list_filter = ['metric_type', 'period_start']
    search_fields = ['device__name', 'device__device_id']
    readonly_fields = ['id', 'created_at', 'updated_at']
    autocomplete_fields = ['device']
    fieldsets = (
        ('Device & Period', {
            'fields': ('device', 'metric_type', 'period_start', 'period_end')
        }),
        ('Averaged Metrics', {
            'fields': ('avg_cpu_usage', 'avg_ram_usage', 'avg_disk_usage')
        }),
        ('Peak Metrics', {
            'fields': ('peak_cpu_usage', 'peak_ram_usage', 'peak_disk_usage')
        }),
        ('Uptime', {
            'fields': ('total_uptime_seconds', 'uptime_percentage')
        }),
        ('Health Statistics', {
            'fields': (
                'health_checks_count', 'healthy_count',
                'warning_count', 'critical_count'
            )
        }),
        ('Network', {
            'fields': ('total_upload_gb', 'total_download_gb')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )
