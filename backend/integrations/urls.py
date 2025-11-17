"""
URL configuration for Integrations app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import IntegrationViewSet, DomainHealthViewSet, IntegrationLogViewSet

app_name = 'integrations'

router = DefaultRouter()
router.register(r'integrations', IntegrationViewSet, basename='integration')
router.register(r'domain-health', DomainHealthViewSet, basename='domain-health')
router.register(r'logs', IntegrationLogViewSet, basename='log')

urlpatterns = [
    path('', include(router.urls)),
]
