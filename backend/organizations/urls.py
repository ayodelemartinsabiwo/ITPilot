"""
URL configuration for Organizations app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import OrganizationViewSet, OrganizationMemberViewSet, DomainViewSet

app_name = 'organizations'

router = DefaultRouter()
router.register(r'organizations', OrganizationViewSet, basename='organization')
router.register(r'members', OrganizationMemberViewSet, basename='member')
router.register(r'domains', DomainViewSet, basename='domain')

urlpatterns = [
    path('', include(router.urls)),
]
