"""
Application configuration for the admin_controls app.
"""

from django.apps import AppConfig


class AdminControlsConfig(AppConfig):
    """Configuration class for admin_controls application."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'admin_controls'
    verbose_name = 'Admin Controls'
