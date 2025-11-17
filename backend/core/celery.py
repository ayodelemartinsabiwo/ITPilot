"""
Celery configuration for ITPilot.
Handles background tasks and scheduled jobs.
"""

import os
from celery import Celery
from celery.schedules import crontab

# Set the default Django settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')

app = Celery('itpilot')

# Load configuration from Django settings
app.config_from_object('django.conf:settings', namespace='CELERY')

# Auto-discover tasks in all installed apps
app.autodiscover_tasks()

# Celery Beat Schedule - Periodic Tasks
app.conf.beat_schedule = {
    'check-device-health': {
        'task': 'devices.tasks.check_all_device_health',
        'schedule': crontab(minute='*/5'),  # Every 5 minutes
    },
    'check-license-expiry': {
        'task': 'billing.tasks.check_license_expiry',
        'schedule': crontab(hour=9, minute=0),  # Daily at 9 AM
    },
    'cleanup-expired-sessions': {
        'task': 'remote_access.tasks.cleanup_expired_sessions',
        'schedule': crontab(minute='*/15'),  # Every 15 minutes
    },
    'process-pending-tickets': {
        'task': 'tickets.tasks.process_pending_tickets',
        'schedule': crontab(minute='*/2'),  # Every 2 minutes
    },
    'send-scheduled-notifications': {
        'task': 'notifications.tasks.send_scheduled_notifications',
        'schedule': crontab(minute='*/1'),  # Every minute
    },
    'cleanup-old-audit-logs': {
        'task': 'common.tasks.cleanup_old_audit_logs',
        'schedule': crontab(hour=2, minute=0),  # Daily at 2 AM
    },
    'check-domain-health': {
        'task': 'integrations.tasks.check_domain_health',
        'schedule': crontab(hour='*/6'),  # Every 6 hours
    },
}

@app.task(bind=True, ignore_result=True)
def debug_task(self):
    """Debug task for testing Celery configuration."""
    print(f'Request: {self.request!r}')
