"""
Serializers for Devices app.
"""

from rest_framework import serializers
from .models import Device, DeviceHealth, DeviceMetrics


class DeviceSerializer(serializers.ModelSerializer):
    """Serializer for Device model."""
    is_online = serializers.SerializerMethodField()
    health_status = serializers.SerializerMethodField()
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)

    class Meta:
        model = Device
        fields = [
            'id', 'organization', 'organization_name', 'user', 'user_email',
            'user_name', 'name', 'hostname', 'device_id', 'serial_number',
            'mac_address', 'ip_address', 'os_type', 'os_version', 'os_build',
            'cpu_model', 'cpu_cores', 'ram_total_gb', 'disk_total_gb',
            'manufacturer', 'model', 'device_type', 'status', 'is_active',
            'is_managed', 'is_encrypted', 'is_compliant', 'agent_version',
            'agent_installed_at', 'last_seen_at', 'last_sync_at', 'tags',
            'metadata', 'notes', 'is_online', 'health_status',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'device_id', 'last_seen_at', 'last_sync_at',
            'created_at', 'updated_at'
        ]

    def get_is_online(self, obj):
        """Check if device is online."""
        return obj.is_online()

    def get_health_status(self, obj):
        """Get device health status."""
        return obj.get_health_status()

    def create(self, validated_data):
        """Create device with auto-generated device_id."""
        import uuid
        from organizations.models import OrganizationMember, Organization
        from django.utils.text import slugify

        # Generate unique device_id if not provided
        if 'device_id' not in validated_data or not validated_data.get('device_id'):
            validated_data['device_id'] = f"DEV-{uuid.uuid4().hex[:12].upper()}"

        # Set organization from user if not provided
        if 'organization' not in validated_data:
            org_membership = OrganizationMember.objects.filter(
                user=self.context['request'].user,
                is_active=True
            ).first()

            if org_membership:
                validated_data['organization'] = org_membership.organization
            else:
                # TESTING MODE: Auto-create a default organization for the user
                user = self.context['request'].user
                org_name = f"{user.first_name} {user.last_name}'s Organization" if user.first_name else f"{user.email}'s Organization"
                org_slug = slugify(f"{user.email}-{uuid.uuid4().hex[:8]}")

                # Create organization
                organization = Organization.objects.create(
                    name=org_name,
                    slug=org_slug,
                    email=user.email,
                    is_active=True,
                    is_verified=True,
                )

                # Add user as owner
                OrganizationMember.objects.create(
                    organization=organization,
                    user=user,
                    role='OWNER',
                    is_active=True,
                )

                validated_data['organization'] = organization

        # Set user from request if not provided
        if 'user' not in validated_data:
            validated_data['user'] = self.context['request'].user

        return super().create(validated_data)


class DeviceHealthSerializer(serializers.ModelSerializer):
    """Serializer for DeviceHealth model."""
    device_name = serializers.CharField(source='device.name', read_only=True)

    class Meta:
        model = DeviceHealth
        fields = [
            'id', 'device', 'device_name', 'status', 'cpu_usage_percent',
            'cpu_temperature', 'ram_used_gb', 'ram_usage_percent',
            'disk_used_gb', 'disk_usage_percent', 'battery_percent',
            'battery_is_charging', 'battery_estimated_minutes',
            'network_upload_mbps', 'network_download_mbps',
            'network_latency_ms', 'uptime_seconds', 'issues', 'warnings',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'status', 'issues', 'warnings', 'created_at', 'updated_at']

    def create(self, validated_data):
        """Create device health record and check thresholds."""
        health = super().create(validated_data)
        health.check_thresholds()
        return health


class DeviceMetricsSerializer(serializers.ModelSerializer):
    """Serializer for DeviceMetrics model."""
    device_name = serializers.CharField(source='device.name', read_only=True)

    class Meta:
        model = DeviceMetrics
        fields = [
            'id', 'device', 'device_name', 'metric_type', 'period_start',
            'period_end', 'avg_cpu_usage', 'avg_ram_usage', 'avg_disk_usage',
            'peak_cpu_usage', 'peak_ram_usage', 'peak_disk_usage',
            'total_uptime_seconds', 'uptime_percentage', 'health_checks_count',
            'healthy_count', 'warning_count', 'critical_count',
            'total_upload_gb', 'total_download_gb', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']


class DeviceRegistrationSerializer(serializers.Serializer):
    """Serializer for device registration."""
    device_id = serializers.CharField(max_length=255)
    name = serializers.CharField(max_length=255)
    hostname = serializers.CharField(max_length=255, required=False)
    os_type = serializers.ChoiceField(choices=Device.OS_CHOICES)
    os_version = serializers.CharField(max_length=100, required=False)
    os_build = serializers.CharField(max_length=100, required=False)
    cpu_model = serializers.CharField(max_length=255, required=False)
    cpu_cores = serializers.IntegerField(required=False)
    ram_total_gb = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    disk_total_gb = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    manufacturer = serializers.CharField(max_length=100, required=False)
    model = serializers.CharField(max_length=100, required=False)
    device_type = serializers.CharField(max_length=20, required=False)
    serial_number = serializers.CharField(max_length=255, required=False)
    mac_address = serializers.CharField(max_length=17, required=False)
    agent_version = serializers.CharField(max_length=50, required=False)
    registration_token = serializers.CharField(max_length=100, required=False)


class DeviceHealthCheckSerializer(serializers.Serializer):
    """Serializer for device health check data submission."""
    cpu_usage_percent = serializers.DecimalField(max_digits=5, decimal_places=2, required=False)
    cpu_temperature = serializers.DecimalField(max_digits=5, decimal_places=2, required=False)
    ram_used_gb = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    ram_usage_percent = serializers.DecimalField(max_digits=5, decimal_places=2, required=False)
    disk_used_gb = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    disk_usage_percent = serializers.DecimalField(max_digits=5, decimal_places=2, required=False)
    battery_percent = serializers.IntegerField(required=False)
    battery_is_charging = serializers.BooleanField(required=False, default=False)
    battery_estimated_minutes = serializers.IntegerField(required=False)
    network_upload_mbps = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    network_download_mbps = serializers.DecimalField(max_digits=10, decimal_places=2, required=False)
    network_latency_ms = serializers.IntegerField(required=False)
    uptime_seconds = serializers.IntegerField(required=False)
