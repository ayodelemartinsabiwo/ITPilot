"""
Devices app configuration.
"""

from django.apps import AppConfig


class DevicesConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'devices'
    verbose_name = 'Devices'

    def ready(self):
        """Import signals when app is ready."""
        # import devices.signals  # Uncomment when signals are created
        pass
