"""
Serializers for Integrations app.
"""

from rest_framework import serializers
from .models import Integration, OAuthToken, DomainHealth, IntegrationLog


class IntegrationSerializer(serializers.ModelSerializer):
    """Serializer for Integration model."""
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    created_by_name = serializers.CharField(source='created_by.full_name', read_only=True)
    is_sync_due = serializers.SerializerMethodField()

    class Meta:
        model = Integration
        fields = [
            'id', 'organization', 'organization_name', 'created_by',
            'created_by_name', 'integration_type', 'name', 'description',
            'status', 'config', 'webhook_url', 'auth_method',
            'is_authenticated', 'last_sync_at', 'sync_frequency_minutes',
            'total_sync_count', 'failed_sync_count', 'last_error',
            'last_error_at', 'is_sync_due', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'created_by', 'is_authenticated', 'last_sync_at',
            'total_sync_count', 'failed_sync_count', 'last_error',
            'last_error_at', 'created_at', 'updated_at'
        ]

    def get_is_sync_due(self, obj):
        """Check if sync is due."""
        return obj.is_sync_due()


class OAuthTokenSerializer(serializers.ModelSerializer):
    """Serializer for OAuthToken model."""
    integration_name = serializers.CharField(source='integration.name', read_only=True)
    is_expired = serializers.SerializerMethodField()
    needs_refresh = serializers.SerializerMethodField()

    class Meta:
        model = OAuthToken
        fields = [
            'id', 'integration', 'integration_name', 'token_type',
            'scope', 'expires_at', 'refresh_token_expires_at',
            'is_expired', 'needs_refresh', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_is_expired(self, obj):
        """Check if token is expired."""
        return obj.is_expired()

    def get_needs_refresh(self, obj):
        """Check if token needs refresh."""
        return obj.needs_refresh()


class DomainHealthSerializer(serializers.ModelSerializer):
    """Serializer for DomainHealth model."""
    organization_name = serializers.CharField(source='organization.name', read_only=True)

    class Meta:
        model = DomainHealth
        fields = [
            'id', 'organization', 'organization_name', 'domain', 'status',
            'mx_records', 'mx_status', 'spf_record', 'spf_status',
            'dkim_records', 'dkim_status', 'dmarc_record', 'dmarc_status',
            'ssl_valid', 'ssl_expiry_date', 'ssl_issuer', 'is_blacklisted',
            'blacklist_sources', 'issues', 'recommendations',
            'last_checked_at', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'last_checked_at', 'created_at', 'updated_at']


class IntegrationLogSerializer(serializers.ModelSerializer):
    """Serializer for IntegrationLog model."""
    integration_name = serializers.CharField(source='integration.name', read_only=True)

    class Meta:
        model = IntegrationLog
        fields = [
            'id', 'integration', 'integration_name', 'log_type',
            'message', 'level', 'request_data', 'response_data',
            'status_code', 'duration_ms', 'error_trace', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']
