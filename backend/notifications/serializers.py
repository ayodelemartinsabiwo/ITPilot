"""
Serializers for Notifications app.
"""

from rest_framework import serializers
from .models import (
    Notification,
    NotificationPreference,
    EmailNotification,
    SMSNotification,
    PushNotification
)


class NotificationSerializer(serializers.ModelSerializer):
    """Serializer for Notification model."""
    is_expired = serializers.SerializerMethodField()

    class Meta:
        model = Notification
        fields = [
            'id', 'user', 'organization', 'notification_type', 'priority',
            'title', 'message', 'related_object_type', 'related_object_id',
            'action_url', 'action_text', 'is_read', 'read_at',
            'delivered_via', 'metadata', 'expires_at', 'is_expired',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'read_at', 'created_at', 'updated_at']

    def get_is_expired(self, obj):
        """Check if notification is expired."""
        return obj.is_expired()


class NotificationPreferenceSerializer(serializers.ModelSerializer):
    """Serializer for NotificationPreference model."""

    class Meta:
        model = NotificationPreference
        fields = [
            'id', 'user', 'enable_email', 'enable_sms', 'enable_push',
            'enable_in_app', 'ticket_updates_email', 'ticket_updates_push',
            'device_alerts_email', 'device_alerts_push',
            'payment_notifications_email', 'payment_notifications_push',
            'system_notifications_email', 'system_notifications_push',
            'marketing_emails', 'newsletter', 'enable_quiet_hours',
            'quiet_hours_start', 'quiet_hours_end', 'enable_daily_digest',
            'digest_time', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']


class EmailNotificationSerializer(serializers.ModelSerializer):
    """Serializer for EmailNotification model."""
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = EmailNotification
        fields = [
            'id', 'notification', 'user', 'user_email', 'to_email',
            'from_email', 'subject', 'body_text', 'body_html', 'status',
            'sent_at', 'delivered_at', 'message_id', 'provider',
            'opens_count', 'clicks_count', 'last_opened_at',
            'error_message', 'created_at'
        ]
        read_only_fields = [
            'id', 'sent_at', 'delivered_at', 'message_id',
            'opens_count', 'clicks_count', 'last_opened_at', 'created_at'
        ]


class SMSNotificationSerializer(serializers.ModelSerializer):
    """Serializer for SMSNotification model."""
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = SMSNotification
        fields = [
            'id', 'notification', 'user', 'user_email', 'to_phone',
            'message', 'status', 'sent_at', 'delivered_at', 'provider',
            'message_id', 'cost', 'currency', 'error_message', 'created_at'
        ]
        read_only_fields = [
            'id', 'sent_at', 'delivered_at', 'message_id',
            'cost', 'created_at'
        ]


class PushNotificationSerializer(serializers.ModelSerializer):
    """Serializer for PushNotification model."""
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = PushNotification
        fields = [
            'id', 'notification', 'user', 'user_email', 'title', 'body',
            'icon', 'image', 'click_action', 'device_token', 'platform',
            'status', 'sent_at', 'delivered_at', 'provider', 'message_id',
            'error_message', 'data', 'created_at'
        ]
        read_only_fields = [
            'id', 'sent_at', 'delivered_at', 'message_id', 'created_at'
        ]
