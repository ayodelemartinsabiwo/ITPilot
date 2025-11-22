"""
Network Security app configuration.
"""

from django.apps import AppConfig


class NetworkSecurityConfig(AppConfig):
    """Configuration for the Network Security app."""
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'network_security'
    verbose_name = 'Network Security'

    def ready(self):
        """Import signals when app is ready."""
        # import network_security.signals  # Uncomment when signals are created
        pass
