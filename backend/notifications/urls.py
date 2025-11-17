"""
URL configuration for Notifications app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    NotificationViewSet,
    NotificationPreferenceViewSet,
    EmailNotificationViewSet,
    SMSNotificationViewSet,
    PushNotificationViewSet
)

app_name = 'notifications'

router = DefaultRouter()
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'preferences', NotificationPreferenceViewSet, basename='preference')
router.register(r'email', EmailNotificationViewSet, basename='email')
router.register(r'sms', SMSNotificationViewSet, basename='sms')
router.register(r'push', PushNotificationViewSet, basename='push')

urlpatterns = [
    path('', include(router.urls)),
]
