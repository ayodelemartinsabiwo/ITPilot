"""
URL configuration for ITPilot project.
"""

from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularRedocView,
    SpectacularSwaggerView,
)
from rest_framework import permissions

urlpatterns = [
    # Admin
    path('admin/', admin.site.urls),

    # API Documentation
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/redoc/', SpectacularRedocView.as_view(url_name='schema'), name='redoc'),

    # API v1 Endpoints
    path('api/v1/auth/', include('authentication.urls')),
    path('api/v1/organizations/', include('organizations.urls')),
    path('api/v1/devices/', include('devices.urls')),
    path('api/v1/tickets/', include('tickets.urls')),
    path('api/v1/ai/', include('ai_engine.urls')),
    path('api/v1/integrations/', include('integrations.urls')),
    path('api/v1/remote-access/', include('remote_access.urls')),
    path('api/v1/billing/', include('billing.urls')),
    path('api/v1/notifications/', include('notifications.urls')),

    # New Dashboard Sections
    path('api/v1/ai-diagnostics/', include('ai_diagnostics.urls')),
    path('api/v1/network-security/', include('network_security.urls')),
    path('api/v1/admin/', include('admin_controls.urls')),
]

# Serve media files in development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

# Customize admin site
admin.site.site_header = "ITPilot Administration"
admin.site.site_title = "ITPilot Admin Portal"
admin.site.index_title = "Welcome to ITPilot Admin"
