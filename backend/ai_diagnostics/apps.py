"""
AI Diagnostics App Configuration
"""
from django.apps import AppConfig


class AIDiagnosticsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ai_diagnostics'
    verbose_name = 'AI Diagnostics'

    def ready(self):
        """Import signals when app is ready"""
        try:
            import ai_diagnostics.signals  # noqa
        except ImportError:
            pass
