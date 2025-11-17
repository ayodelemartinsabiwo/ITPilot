"""
Views for Notifications app.
"""

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from .models import (
    Notification,
    NotificationPreference,
    EmailNotification,
    SMSNotification,
    PushNotification
)
from .serializers import (
    NotificationSerializer,
    NotificationPreferenceSerializer,
    EmailNotificationSerializer,
    SMSNotificationSerializer,
    PushNotificationSerializer
)


class NotificationViewSet(viewsets.ModelViewSet):
    """ViewSet for Notification CRUD operations."""
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get notifications for current user."""
        user = self.request.user
        if user.is_superuser:
            return Notification.objects.all()

        return Notification.objects.filter(user=user).select_related('organization')

    @action(detail=True, methods=['post'])
    def mark_as_read(self, request, pk=None):
        """Mark notification as read."""
        notification = self.get_object()
        notification.mark_as_read()
        return Response(
            NotificationSerializer(notification).data,
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['post'])
    def mark_all_as_read(self, request):
        """Mark all notifications as read."""
        from django.utils import timezone
        updated = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).update(
            is_read=True,
            read_at=timezone.now()
        )

        return Response({
            'message': f'{updated} notifications marked as read'
        }, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'])
    def unread_count(self, request):
        """Get count of unread notifications."""
        count = Notification.objects.filter(
            user=request.user,
            is_read=False
        ).count()

        return Response({'unread_count': count})

    @action(detail=False, methods=['delete'])
    def clear_all(self, request):
        """Clear all read notifications."""
        deleted_count, _ = Notification.objects.filter(
            user=request.user,
            is_read=True
        ).delete()

        return Response({
            'message': f'{deleted_count} notifications cleared'
        }, status=status.HTTP_200_OK)


class NotificationPreferenceViewSet(viewsets.ModelViewSet):
    """ViewSet for NotificationPreference CRUD operations."""
    serializer_class = NotificationPreferenceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get notification preferences for current user."""
        user = self.request.user
        if user.is_superuser:
            return NotificationPreference.objects.all()

        return NotificationPreference.objects.filter(user=user)

    def get_object(self):
        """Get or create notification preference for current user."""
        obj, created = NotificationPreference.objects.get_or_create(
            user=self.request.user
        )
        return obj

    @action(detail=False, methods=['get', 'put', 'patch'])
    def my_preferences(self, request):
        """Get or update current user's notification preferences."""
        preferences, created = NotificationPreference.objects.get_or_create(
            user=request.user
        )

        if request.method == 'GET':
            serializer = NotificationPreferenceSerializer(preferences)
            return Response(serializer.data)

        # Update preferences
        serializer = NotificationPreferenceSerializer(
            preferences,
            data=request.data,
            partial=request.method == 'PATCH'
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)


class EmailNotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for EmailNotification read operations."""
    serializer_class = EmailNotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get email notifications for current user."""
        user = self.request.user
        if user.is_superuser:
            return EmailNotification.objects.all()

        return EmailNotification.objects.filter(user=user)


class SMSNotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for SMSNotification read operations."""
    serializer_class = SMSNotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get SMS notifications for current user."""
        user = self.request.user
        if user.is_superuser:
            return SMSNotification.objects.all()

        return SMSNotification.objects.filter(user=user)


class PushNotificationViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for PushNotification read operations."""
    serializer_class = PushNotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get push notifications for current user."""
        user = self.request.user
        if user.is_superuser:
            return PushNotification.objects.all()

        return PushNotification.objects.filter(user=user)
