"""
Integrations app configuration.
"""

from django.apps import AppConfig


class IntegrationsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'integrations'
    verbose_name = 'Integrations'

    def ready(self):
        """Import signals when app is ready."""
        # import integrations.signals  # Uncomment when signals are created
        pass
