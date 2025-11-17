"""
URL configuration for Remote Access app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RemoteSessionViewSet, SessionLogViewSet, SessionRecordingViewSet

app_name = 'remote_access'

router = DefaultRouter()
router.register(r'sessions', RemoteSessionViewSet, basename='session')
router.register(r'logs', SessionLogViewSet, basename='log')
router.register(r'recordings', SessionRecordingViewSet, basename='recording')

urlpatterns = [
    path('', include(router.urls)),
]
