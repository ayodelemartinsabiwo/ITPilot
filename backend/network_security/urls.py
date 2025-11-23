"""
Network Security URL Configuration
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    WiFiAnalysisViewSet,
    ThreatDetectionViewSet,
    PatchStatusViewSet,
    AntivirusStatusViewSet,
    PasswordAuditViewSet
)

app_name = 'network_security'

router = DefaultRouter()
router.register(r'wifi', WiFiAnalysisViewSet, basename='wifi')
router.register(r'threats', ThreatDetectionViewSet, basename='threat')
router.register(r'patches', PatchStatusViewSet, basename='patch')
router.register(r'antivirus', AntivirusStatusViewSet, basename='antivirus')
router.register(r'passwords', PasswordAuditViewSet, basename='password')

urlpatterns = [
    path('', include(router.urls)),
]
