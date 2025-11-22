"""
AI Diagnostics Admin Configuration
"""
from django.contrib import admin
from .models import (
    DiagnosticScan,
    DetectedIssue,
    Recommendation,
    SystemAlert,
    AutoFixAction
)


@admin.register(DiagnosticScan)
class DiagnosticScanAdmin(admin.ModelAdmin):
    list_display = ['id', 'device', 'scan_type', 'status', 'issues_found', 'started_at', 'completed_at']
    list_filter = ['scan_type', 'status', 'created_at']
    search_fields = ['device__name', 'device__hostname']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'


@admin.register(DetectedIssue)
class DetectedIssueAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'category', 'severity', 'status', 'device', 'auto_fixable', 'fix_applied']
    list_filter = ['category', 'severity', 'status', 'auto_fixable', 'created_at']
    search_fields = ['title', 'description', 'device__name']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'


@admin.register(Recommendation)
class RecommendationAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'issue', 'risk_level', 'status', 'estimated_time', 'success_rate']
    list_filter = ['risk_level', 'status', 'requires_restart', 'created_at']
    search_fields = ['title', 'description', 'issue__title']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(SystemAlert)
class SystemAlertAdmin(admin.ModelAdmin):
    list_display = ['id', 'title', 'alert_type', 'source', 'status', 'device', 'created_at']
    list_filter = ['alert_type', 'source', 'status', 'created_at']
    search_fields = ['title', 'message', 'device__name']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'


@admin.register(AutoFixAction)
class AutoFixActionAdmin(admin.ModelAdmin):
    list_display = ['id', 'action_type', 'device', 'status', 'executed_at', 'completed_at']
    list_filter = ['action_type', 'status', 'rollback_possible', 'created_at']
    search_fields = ['device__name', 'issue__title']
    readonly_fields = ['created_at', 'updated_at']
    date_hierarchy = 'created_at'
