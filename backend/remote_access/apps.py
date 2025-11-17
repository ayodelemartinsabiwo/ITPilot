"""
Remote Access app configuration.
"""

from django.apps import AppConfig


class RemoteAccessConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'remote_access'
    verbose_name = 'Remote Access'

    def ready(self):
        """Import signals when app is ready."""
        # import remote_access.signals  # Uncomment when signals are created
        pass
