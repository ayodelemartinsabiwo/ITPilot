"""
Django admin configuration for Notifications app.
"""

from django.contrib import admin
from .models import (
    Notification,
    NotificationPreference,
    EmailNotification,
    SMSNotification,
    PushNotification
)


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    """Admin interface for Notification model."""
    list_display = [
        'user', 'notification_type', 'priority', 'title',
        'is_read', 'read_at', 'created_at'
    ]
    list_filter = ['notification_type', 'priority', 'is_read', 'created_at']
    search_fields = ['user__email', 'title', 'message']
    readonly_fields = ['id', 'read_at', 'created_at', 'updated_at']
    autocomplete_fields = ['user', 'organization']
    fieldsets = (
        ('User', {
            'fields': ('user', 'organization')
        }),
        ('Notification', {
            'fields': (
                'notification_type', 'priority', 'title', 'message'
            )
        }),
        ('Related Object', {
            'fields': ('related_object_type', 'related_object_id')
        }),
        ('Action', {
            'fields': ('action_url', 'action_text')
        }),
        ('Status', {
            'fields': ('is_read', 'read_at')
        }),
        ('Delivery', {
            'fields': ('delivered_via',)
        }),
        ('Metadata', {
            'fields': ('metadata', 'expires_at', 'id', 'created_at', 'updated_at')
        }),
    )


@admin.register(NotificationPreference)
class NotificationPreferenceAdmin(admin.ModelAdmin):
    """Admin interface for NotificationPreference model."""
    list_display = [
        'user', 'enable_email', 'enable_sms', 'enable_push',
        'enable_in_app', 'enable_quiet_hours', 'enable_daily_digest'
    ]
    list_filter = [
        'enable_email', 'enable_sms', 'enable_push', 'enable_in_app',
        'enable_quiet_hours', 'enable_daily_digest'
    ]
    search_fields = ['user__email']
    readonly_fields = ['id', 'created_at', 'updated_at']
    autocomplete_fields = ['user']
    fieldsets = (
        ('User', {
            'fields': ('user',)
        }),
        ('Channel Preferences', {
            'fields': ('enable_email', 'enable_sms', 'enable_push', 'enable_in_app')
        }),
        ('Ticket Updates', {
            'fields': ('ticket_updates_email', 'ticket_updates_push')
        }),
        ('Device Alerts', {
            'fields': ('device_alerts_email', 'device_alerts_push')
        }),
        ('Payment Notifications', {
            'fields': ('payment_notifications_email', 'payment_notifications_push')
        }),
        ('System Notifications', {
            'fields': ('system_notifications_email', 'system_notifications_push')
        }),
        ('Marketing', {
            'fields': ('marketing_emails', 'newsletter')
        }),
        ('Quiet Hours', {
            'fields': ('enable_quiet_hours', 'quiet_hours_start', 'quiet_hours_end')
        }),
        ('Daily Digest', {
            'fields': ('enable_daily_digest', 'digest_time')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )


@admin.register(EmailNotification)
class EmailNotificationAdmin(admin.ModelAdmin):
    """Admin interface for EmailNotification model."""
    list_display = [
        'to_email', 'subject', 'status', 'sent_at',
        'delivered_at', 'opens_count', 'clicks_count', 'created_at'
    ]
    list_filter = ['status', 'provider', 'created_at']
    search_fields = ['to_email', 'from_email', 'subject', 'message_id']
    readonly_fields = [
        'id', 'sent_at', 'delivered_at', 'message_id',
        'opens_count', 'clicks_count', 'last_opened_at',
        'created_at', 'updated_at'
    ]
    autocomplete_fields = ['notification', 'user']
    fieldsets = (
        ('Notification', {
            'fields': ('notification', 'user')
        }),
        ('Email', {
            'fields': ('to_email', 'from_email', 'subject', 'body_text', 'body_html')
        }),
        ('Status', {
            'fields': ('status', 'sent_at', 'delivered_at')
        }),
        ('Tracking', {
            'fields': (
                'message_id', 'provider', 'opens_count',
                'clicks_count', 'last_opened_at'
            )
        }),
        ('Error', {
            'fields': ('error_message',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )


@admin.register(SMSNotification)
class SMSNotificationAdmin(admin.ModelAdmin):
    """Admin interface for SMSNotification model."""
    list_display = [
        'to_phone', 'message_preview', 'status', 'sent_at',
        'delivered_at', 'provider', 'cost', 'created_at'
    ]
    list_filter = ['status', 'provider', 'created_at']
    search_fields = ['to_phone', 'message', 'message_id']
    readonly_fields = [
        'id', 'sent_at', 'delivered_at', 'message_id',
        'cost', 'created_at', 'updated_at'
    ]
    autocomplete_fields = ['notification', 'user']
    fieldsets = (
        ('Notification', {
            'fields': ('notification', 'user')
        }),
        ('SMS', {
            'fields': ('to_phone', 'message')
        }),
        ('Status', {
            'fields': ('status', 'sent_at', 'delivered_at')
        }),
        ('Provider', {
            'fields': ('provider', 'message_id')
        }),
        ('Cost', {
            'fields': ('cost', 'currency')
        }),
        ('Error', {
            'fields': ('error_message',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )

    def message_preview(self, obj):
        """Show message preview."""
        return obj.message[:50] + '...' if len(obj.message) > 50 else obj.message
    message_preview.short_description = 'Message'


@admin.register(PushNotification)
class PushNotificationAdmin(admin.ModelAdmin):
    """Admin interface for PushNotification model."""
    list_display = [
        'user', 'title', 'platform', 'status', 'sent_at',
        'delivered_at', 'provider', 'created_at'
    ]
    list_filter = ['status', 'platform', 'provider', 'created_at']
    search_fields = ['user__email', 'title', 'body', 'message_id']
    readonly_fields = [
        'id', 'sent_at', 'delivered_at', 'message_id',
        'created_at', 'updated_at'
    ]
    autocomplete_fields = ['notification', 'user']
    fieldsets = (
        ('Notification', {
            'fields': ('notification', 'user')
        }),
        ('Push Details', {
            'fields': ('title', 'body', 'icon', 'image', 'click_action')
        }),
        ('Device', {
            'fields': ('device_token', 'platform')
        }),
        ('Status', {
            'fields': ('status', 'sent_at', 'delivered_at')
        }),
        ('Provider', {
            'fields': ('provider', 'message_id')
        }),
        ('Error', {
            'fields': ('error_message',)
        }),
        ('Data', {
            'fields': ('data',)
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )
