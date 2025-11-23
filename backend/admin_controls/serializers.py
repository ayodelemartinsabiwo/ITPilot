"""
Admin Controls Serializers
"""
from rest_framework import serializers
from .models import (
    ActivityLog,
    AuditRecord,
    CustomRole,
    OrganizationPolicy
)


class ActivityLogSerializer(serializers.ModelSerializer):
    """Serializer for ActivityLog model"""

    user_email = serializers.CharField(source='user.email', read_only=True, allow_null=True)
    user_name = serializers.SerializerMethodField()
    organization_name = serializers.CharField(source='organization.name', read_only=True)

    class Meta:
        model = ActivityLog
        fields = [
            'id', 'user', 'user_email', 'user_name',
            'organization', 'organization_name',
            'action', 'resource_type', 'resource_id',
            'details', 'ip_address', 'user_agent',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'organization']

    def get_user_name(self, obj):
        if obj.user:
            return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.email
        return "System"


class AuditRecordSerializer(serializers.ModelSerializer):
    """Serializer for AuditRecord model"""

    organization_name = serializers.CharField(source='organization.name', read_only=True)
    actor_email = serializers.CharField(source='actor.email', read_only=True, allow_null=True)
    actor_name = serializers.SerializerMethodField()
    target_user_email = serializers.CharField(source='target_user.email', read_only=True, allow_null=True)
    target_user_name = serializers.SerializerMethodField()

    class Meta:
        model = AuditRecord
        fields = [
            'id', 'organization', 'organization_name',
            'event_type', 'actor', 'actor_email', 'actor_name',
            'target_user', 'target_user_email', 'target_user_name',
            'action', 'before_state', 'after_state', 'is_sensitive',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'organization']

    def get_actor_name(self, obj):
        if obj.actor:
            return f"{obj.actor.first_name} {obj.actor.last_name}".strip() or obj.actor.email
        return "System"

    def get_target_user_name(self, obj):
        if obj.target_user:
            return f"{obj.target_user.first_name} {obj.target_user.last_name}".strip() or obj.target_user.email
        return None


class CustomRoleSerializer(serializers.ModelSerializer):
    """Serializer for CustomRole model"""

    organization_name = serializers.CharField(source='organization.name', read_only=True)
    created_by_email = serializers.CharField(source='created_by.email', read_only=True, allow_null=True)
    created_by_name = serializers.SerializerMethodField()
    permission_count = serializers.SerializerMethodField()

    class Meta:
        model = CustomRole
        fields = [
            'id', 'organization', 'organization_name',
            'name', 'description', 'permissions', 'permission_count',
            'is_system_role', 'created_by', 'created_by_email', 'created_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'organization', 'is_system_role']

    def get_created_by_name(self, obj):
        if obj.created_by:
            return f"{obj.created_by.first_name} {obj.created_by.last_name}".strip() or obj.created_by.email
        return None

    def get_permission_count(self, obj):
        if isinstance(obj.permissions, list):
            return len(obj.permissions)
        return 0

    def validate_permissions(self, value):
        """Ensure permissions is a list"""
        if not isinstance(value, list):
            raise serializers.ValidationError("Permissions must be a list")
        return value


class OrganizationPolicySerializer(serializers.ModelSerializer):
    """Serializer for OrganizationPolicy model"""

    organization_name = serializers.CharField(source='organization.name', read_only=True)
    enforced_by_email = serializers.CharField(source='enforced_by.email', read_only=True, allow_null=True)
    enforced_by_name = serializers.SerializerMethodField()
    policy_type_display = serializers.CharField(source='get_policy_type_display', read_only=True)

    class Meta:
        model = OrganizationPolicy
        fields = [
            'id', 'organization', 'organization_name',
            'policy_type', 'policy_type_display', 'policy_config',
            'enabled', 'enforced_at', 'enforced_by', 'enforced_by_email', 'enforced_by_name',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'organization']

    def get_enforced_by_name(self, obj):
        if obj.enforced_by:
            return f"{obj.enforced_by.first_name} {obj.enforced_by.last_name}".strip() or obj.enforced_by.email
        return None

    def validate_policy_config(self, value):
        """Ensure policy_config is a dict"""
        if not isinstance(value, dict):
            raise serializers.ValidationError("Policy configuration must be a dictionary")
        return value
