"""
Admin Controls URL Configuration
"""
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ActivityLogViewSet,
    AuditRecordViewSet,
    CustomRoleViewSet,
    OrganizationPolicyViewSet
)

app_name = 'admin_controls'

router = DefaultRouter()
router.register(r'activity-logs', ActivityLogViewSet, basename='activity-log')
router.register(r'audit-records', AuditRecordViewSet, basename='audit-record')
router.register(r'roles', CustomRoleViewSet, basename='role')
router.register(r'policies', OrganizationPolicyViewSet, basename='policy')

urlpatterns = [
    path('', include(router.urls)),
]
