"""
AI Diagnostics URL Configuration
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    DiagnosticScanViewSet,
    DetectedIssueViewSet,
    RecommendationViewSet,
    SystemAlertViewSet,
    AutoFixActionViewSet
)

app_name = 'ai_diagnostics'

router = DefaultRouter()
router.register(r'scans', DiagnosticScanViewSet, basename='scan')
router.register(r'issues', DetectedIssueViewSet, basename='issue')
router.register(r'recommendations', RecommendationViewSet, basename='recommendation')
router.register(r'alerts', SystemAlertViewSet, basename='alert')
router.register(r'auto-fix', AutoFixActionViewSet, basename='auto-fix')

urlpatterns = [
    path('', include(router.urls)),
]
