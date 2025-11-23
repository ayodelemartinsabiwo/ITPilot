"""
Network Security Serializers
"""
from rest_framework import serializers
from .models import (
    WiFiAnalysis,
    ThreatDetection,
    PatchStatus,
    AntivirusStatus,
    PasswordAudit
)


class WiFiAnalysisSerializer(serializers.ModelSerializer):
    """Serializer for WiFiAnalysis model"""

    device_name = serializers.CharField(source='device.name', read_only=True)
    network_quality = serializers.SerializerMethodField()
    performance_rating = serializers.SerializerMethodField()

    class Meta:
        model = WiFiAnalysis
        fields = [
            'id', 'device', 'device_name', 'ssid',
            'signal_strength', 'channel', 'frequency',
            'download_speed', 'upload_speed', 'latency', 'packet_loss',
            'interference_detected', 'network_quality', 'performance_rating',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_network_quality(self, obj):
        """Calculate network quality based on signal strength"""
        if obj.signal_strength >= -50:
            return 'Excellent'
        elif obj.signal_strength >= -60:
            return 'Good'
        elif obj.signal_strength >= -70:
            return 'Fair'
        else:
            return 'Poor'

    def get_performance_rating(self, obj):
        """Calculate performance rating based on speed and latency"""
        if not obj.download_speed or not obj.latency:
            return None

        # Simple rating based on download speed and latency
        speed_score = min(float(obj.download_speed) / 100 * 50, 50)  # Max 50 points from speed
        latency_score = max(50 - obj.latency, 0)  # Max 50 points from latency (lower is better)

        total_score = speed_score + latency_score
        if total_score >= 80:
            return 'Excellent'
        elif total_score >= 60:
            return 'Good'
        elif total_score >= 40:
            return 'Fair'
        else:
            return 'Poor'


class ThreatDetectionSerializer(serializers.ModelSerializer):
    """Serializer for ThreatDetection model"""

    device_name = serializers.CharField(source='device.name', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    threat_age_days = serializers.SerializerMethodField()

    class Meta:
        model = ThreatDetection
        fields = [
            'id', 'device', 'device_name', 'organization', 'organization_name',
            'threat_type', 'severity', 'status', 'details',
            'detected_at', 'threat_age_days',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at', 'organization']

    def get_threat_age_days(self, obj):
        """Calculate how many days since threat was detected"""
        from django.utils import timezone
        if obj.detected_at:
            delta = timezone.now() - obj.detected_at
            return delta.days
        return None


class PatchStatusSerializer(serializers.ModelSerializer):
    """Serializer for PatchStatus model"""

    device_name = serializers.CharField(source='device.name', read_only=True)
    days_since_release = serializers.SerializerMethodField()
    install_urgency = serializers.SerializerMethodField()

    class Meta:
        model = PatchStatus
        fields = [
            'id', 'device', 'device_name',
            'patch_type', 'patch_name', 'current_version', 'available_version',
            'severity', 'release_date', 'installed',
            'days_since_release', 'install_urgency',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_days_since_release(self, obj):
        """Calculate days since patch was released"""
        from django.utils import timezone
        if obj.release_date:
            delta = timezone.now().date() - obj.release_date
            return delta.days
        return None

    def get_install_urgency(self, obj):
        """Determine installation urgency based on severity and age"""
        if obj.installed:
            return 'Installed'

        days = self.get_days_since_release(obj)
        if not days:
            return 'Unknown'

        # Critical patches should be installed immediately
        if obj.severity == 'CRITICAL':
            if days > 7:
                return 'Overdue'
            else:
                return 'Urgent'

        # High severity patches should be installed within 30 days
        elif obj.severity == 'HIGH':
            if days > 30:
                return 'Overdue'
            elif days > 14:
                return 'Soon'
            else:
                return 'Normal'

        # Medium and low can wait
        else:
            if days > 90:
                return 'Overdue'
            else:
                return 'Normal'


class AntivirusStatusSerializer(serializers.ModelSerializer):
    """Serializer for AntivirusStatus model"""

    device_name = serializers.CharField(source='device.name', read_only=True)
    protection_status = serializers.SerializerMethodField()
    definitions_age_days = serializers.SerializerMethodField()

    class Meta:
        model = AntivirusStatus
        fields = [
            'id', 'device', 'device_name',
            'antivirus_name', 'version', 'enabled',
            'last_update', 'definitions_date', 'scan_status',
            'protection_status', 'definitions_age_days',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_protection_status(self, obj):
        """Determine overall protection status"""
        if not obj.enabled:
            return 'Disabled'

        if obj.scan_status == 'THREAT_FOUND':
            return 'Threat Detected'

        if obj.definitions_date:
            from django.utils import timezone
            days_old = (timezone.now().date() - obj.definitions_date).days

            if days_old > 7:
                return 'Outdated Definitions'

        if obj.enabled and obj.scan_status == 'IDLE':
            return 'Protected'

        return 'Unknown'

    def get_definitions_age_days(self, obj):
        """Calculate age of virus definitions"""
        if obj.definitions_date:
            from django.utils import timezone
            delta = timezone.now().date() - obj.definitions_date
            return delta.days
        return None


class PasswordAuditSerializer(serializers.ModelSerializer):
    """Serializer for PasswordAudit model"""

    user_email = serializers.CharField(source='user.email', read_only=True)
    strength_label = serializers.SerializerMethodField()
    requires_change = serializers.SerializerMethodField()

    class Meta:
        model = PasswordAudit
        fields = [
            'id', 'user', 'user_email', 'service_name',
            'strength_score', 'strength_label',
            'is_reused', 'last_changed', 'days_since_change',
            'compliant', 'requires_change',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_strength_label(self, obj):
        """Get password strength label"""
        if obj.strength_score >= 75:
            return 'Strong'
        elif obj.strength_score >= 50:
            return 'Good'
        elif obj.strength_score >= 25:
            return 'Fair'
        else:
            return 'Weak'

    def get_requires_change(self, obj):
        """Determine if password needs to be changed"""
        # Password needs change if:
        # 1. Not compliant
        # 2. Reused
        # 3. Not changed in 90 days
        if not obj.compliant:
            return True

        if obj.is_reused:
            return True

        if obj.days_since_change and obj.days_since_change > 90:
            return True

        return False
