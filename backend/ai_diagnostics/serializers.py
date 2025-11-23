"""
AI Diagnostics Serializers
"""
from rest_framework import serializers
from .models import (
    DiagnosticScan,
    DetectedIssue,
    Recommendation,
    SystemAlert,
    AutoFixAction
)


class DiagnosticScanSerializer(serializers.ModelSerializer):
    """Serializer for DiagnosticScan model"""

    device_name = serializers.CharField(source='device.name', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    initiated_by_name = serializers.SerializerMethodField()
    duration = serializers.SerializerMethodField()

    class Meta:
        model = DiagnosticScan
        fields = [
            'id', 'device', 'device_name', 'organization', 'organization_name',
            'initiated_by', 'initiated_by_name', 'scan_type', 'status',
            'started_at', 'completed_at', 'duration',
            'issues_found', 'critical_issues', 'high_issues',
            'medium_issues', 'low_issues',
            'scan_areas', 'scan_results', 'error_message',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'organization']

    def get_initiated_by_name(self, obj):
        if obj.initiated_by:
            return f"{obj.initiated_by.first_name} {obj.initiated_by.last_name}".strip() or obj.initiated_by.email
        return None

    def get_duration(self, obj):
        if obj.started_at and obj.completed_at:
            duration = obj.completed_at - obj.started_at
            return duration.total_seconds()
        return None


class DetectedIssueSerializer(serializers.ModelSerializer):
    """Serializer for DetectedIssue model"""

    scan_type = serializers.CharField(source='scan.scan_type', read_only=True)
    device_name = serializers.CharField(source='device.name', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    resolved_by_name = serializers.SerializerMethodField()
    recommendations_count = serializers.SerializerMethodField()

    class Meta:
        model = DetectedIssue
        fields = [
            'id', 'scan', 'scan_type', 'device', 'device_name',
            'organization', 'organization_name',
            'category', 'severity', 'status',
            'title', 'description', 'technical_details',
            'auto_fixable', 'fix_applied',
            'resolved_at', 'resolved_by', 'resolved_by_name',
            'recommendations_count',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'organization']

    def get_resolved_by_name(self, obj):
        if obj.resolved_by:
            return f"{obj.resolved_by.first_name} {obj.resolved_by.last_name}".strip() or obj.resolved_by.email
        return None

    def get_recommendations_count(self, obj):
        return obj.recommendations.count()


class RecommendationSerializer(serializers.ModelSerializer):
    """Serializer for Recommendation model"""

    issue_title = serializers.CharField(source='issue.title', read_only=True)
    issue_severity = serializers.CharField(source='issue.severity', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    applied_by_name = serializers.SerializerMethodField()

    class Meta:
        model = Recommendation
        fields = [
            'id', 'issue', 'issue_title', 'issue_severity',
            'organization', 'organization_name',
            'title', 'description', 'steps',
            'estimated_time', 'risk_level',
            'requires_restart', 'requires_downtime',
            'status', 'applied_at', 'applied_by', 'applied_by_name',
            'success_rate', 'times_applied',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'organization', 'success_rate', 'times_applied']

    def get_applied_by_name(self, obj):
        if obj.applied_by:
            return f"{obj.applied_by.first_name} {obj.applied_by.last_name}".strip() or obj.applied_by.email
        return None


class SystemAlertSerializer(serializers.ModelSerializer):
    """Serializer for SystemAlert model"""

    device_name = serializers.CharField(source='device.name', read_only=True, allow_null=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    issue_title = serializers.CharField(source='issue.title', read_only=True, allow_null=True)
    acknowledged_by_name = serializers.SerializerMethodField()

    class Meta:
        model = SystemAlert
        fields = [
            'id', 'device', 'device_name', 'organization', 'organization_name',
            'issue', 'issue_title',
            'alert_type', 'source', 'status',
            'title', 'message', 'details',
            'acknowledged_at', 'acknowledged_by', 'acknowledged_by_name',
            'resolved_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'organization']

    def get_acknowledged_by_name(self, obj):
        if obj.acknowledged_by:
            return f"{obj.acknowledged_by.first_name} {obj.acknowledged_by.last_name}".strip() or obj.acknowledged_by.email
        return None


class AutoFixActionSerializer(serializers.ModelSerializer):
    """Serializer for AutoFixAction model"""

    issue_title = serializers.CharField(source='issue.title', read_only=True)
    device_name = serializers.CharField(source='device.name', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    recommendation_title = serializers.CharField(source='recommendation.title', read_only=True, allow_null=True)
    execution_duration = serializers.SerializerMethodField()

    class Meta:
        model = AutoFixAction
        fields = [
            'id', 'issue', 'issue_title', 'recommendation', 'recommendation_title',
            'device', 'device_name', 'organization', 'organization_name',
            'action_type', 'status', 'parameters',
            'executed_at', 'completed_at', 'execution_duration',
            'result', 'error_message',
            'rollback_possible', 'rollback_data', 'rolled_back_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'organization']

    def get_execution_duration(self, obj):
        if obj.executed_at and obj.completed_at:
            duration = obj.completed_at - obj.executed_at
            return duration.total_seconds()
        return None


# Detailed serializers with nested relationships
class DetectedIssueDetailSerializer(DetectedIssueSerializer):
    """Detailed serializer for DetectedIssue with recommendations"""
    recommendations = RecommendationSerializer(many=True, read_only=True)
    alerts = SystemAlertSerializer(many=True, read_only=True)

    class Meta(DetectedIssueSerializer.Meta):
        fields = DetectedIssueSerializer.Meta.fields + ['recommendations', 'alerts']


class DiagnosticScanDetailSerializer(DiagnosticScanSerializer):
    """Detailed serializer for DiagnosticScan with issues"""
    issues = DetectedIssueSerializer(many=True, read_only=True)

    class Meta(DiagnosticScanSerializer.Meta):
        fields = DiagnosticScanSerializer.Meta.fields + ['issues']
