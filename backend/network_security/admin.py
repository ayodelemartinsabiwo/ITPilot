"""
Django admin configuration for Network Security app.
"""

from django.contrib import admin
from .models import (
    WiFiAnalysis,
    ThreatDetection,
    PatchStatus,
    AntivirusStatus,
    PasswordAudit,
)


@admin.register(WiFiAnalysis)
class WiFiAnalysisAdmin(admin.ModelAdmin):
    """Admin interface for WiFiAnalysis model."""
    list_display = [
        'device', 'ssid', 'signal_strength', 'channel', 'frequency',
        'download_speed', 'upload_speed', 'latency', 'packet_loss',
        'interference_detected', 'created_at'
    ]
    list_filter = [
        'ssid', 'channel', 'interference_detected', 'created_at'
    ]
    search_fields = [
        'device__name', 'device__device_id', 'ssid'
    ]
    readonly_fields = [
        'id', 'created_at', 'updated_at'
    ]
    autocomplete_fields = ['device']
    fieldsets = (
        ('Device Information', {
            'fields': ('device',)
        }),
        ('WiFi Information', {
            'fields': ('ssid', 'signal_strength', 'channel', 'frequency')
        }),
        ('Network Performance', {
            'fields': (
                'download_speed', 'upload_speed', 'latency', 'packet_loss'
            )
        }),
        ('Interference', {
            'fields': ('interference_detected',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )


@admin.register(ThreatDetection)
class ThreatDetectionAdmin(admin.ModelAdmin):
    """Admin interface for ThreatDetection model."""
    list_display = [
        'device', 'organization', 'threat_type', 'severity', 'status',
        'detected_at', 'created_at'
    ]
    list_filter = [
        'threat_type', 'severity', 'status', 'detected_at', 'created_at'
    ]
    search_fields = [
        'device__name', 'device__device_id', 'organization__name',
        'threat_type', 'details'
    ]
    readonly_fields = [
        'id', 'created_at', 'updated_at', 'details'
    ]
    autocomplete_fields = ['device', 'organization']
    fieldsets = (
        ('Device & Organization', {
            'fields': ('device', 'organization')
        }),
        ('Threat Information', {
            'fields': ('threat_type', 'severity', 'status')
        }),
        ('Timing', {
            'fields': ('detected_at',)
        }),
        ('Details', {
            'fields': ('details',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )


@admin.register(PatchStatus)
class PatchStatusAdmin(admin.ModelAdmin):
    """Admin interface for PatchStatus model."""
    list_display = [
        'device', 'patch_type', 'patch_name', 'current_version',
        'available_version', 'severity', 'release_date', 'installed',
        'created_at'
    ]
    list_filter = [
        'patch_type', 'severity', 'installed', 'release_date', 'created_at'
    ]
    search_fields = [
        'device__name', 'device__device_id', 'patch_name',
        'current_version', 'available_version'
    ]
    readonly_fields = [
        'id', 'created_at', 'updated_at'
    ]
    autocomplete_fields = ['device']
    fieldsets = (
        ('Device Information', {
            'fields': ('device',)
        }),
        ('Patch Information', {
            'fields': (
                'patch_type', 'patch_name', 'current_version',
                'available_version'
            )
        }),
        ('Severity & Timing', {
            'fields': ('severity', 'release_date', 'installed')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )


@admin.register(AntivirusStatus)
class AntivirusStatusAdmin(admin.ModelAdmin):
    """Admin interface for AntivirusStatus model."""
    list_display = [
        'device', 'antivirus_name', 'version', 'enabled',
        'last_update', 'definitions_date', 'scan_status', 'created_at'
    ]
    list_filter = [
        'antivirus_name', 'enabled', 'scan_status', 'created_at'
    ]
    search_fields = [
        'device__name', 'device__device_id', 'antivirus_name', 'version'
    ]
    readonly_fields = [
        'id', 'created_at', 'updated_at'
    ]
    autocomplete_fields = ['device']
    fieldsets = (
        ('Device Information', {
            'fields': ('device',)
        }),
        ('Antivirus Information', {
            'fields': ('antivirus_name', 'version', 'enabled')
        }),
        ('Update Information', {
            'fields': ('last_update', 'definitions_date')
        }),
        ('Scan Status', {
            'fields': ('scan_status',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )


@admin.register(PasswordAudit)
class PasswordAuditAdmin(admin.ModelAdmin):
    """Admin interface for PasswordAudit model."""
    list_display = [
        'user', 'service_name', 'strength_score', 'is_reused',
        'last_changed', 'days_since_change', 'compliant', 'created_at'
    ]
    list_filter = [
        'service_name', 'is_reused', 'compliant', 'created_at',
        'strength_score'
    ]
    search_fields = [
        'user__email', 'user__first_name', 'user__last_name',
        'service_name'
    ]
    readonly_fields = [
        'id', 'created_at', 'updated_at'
    ]
    autocomplete_fields = ['user']
    fieldsets = (
        ('User Information', {
            'fields': ('user',)
        }),
        ('Service Information', {
            'fields': ('service_name',)
        }),
        ('Password Strength', {
            'fields': ('strength_score',)
        }),
        ('Reuse Detection', {
            'fields': ('is_reused',)
        }),
        ('Password Change Information', {
            'fields': ('last_changed', 'days_since_change')
        }),
        ('Compliance', {
            'fields': ('compliant',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )
