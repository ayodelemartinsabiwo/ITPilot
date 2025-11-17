"""
URL configuration for Devices app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DeviceViewSet, DeviceHealthViewSet, DeviceMetricsViewSet

app_name = 'devices'

router = DefaultRouter()
router.register(r'devices', DeviceViewSet, basename='device')
router.register(r'health', DeviceHealthViewSet, basename='health')
router.register(r'metrics', DeviceMetricsViewSet, basename='metrics')

urlpatterns = [
    path('', include(router.urls)),
]
