"""
Celery tasks for common operations.
"""

from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import AuditLog
from django.conf import settings
import logging

logger = logging.getLogger(__name__)


@shared_task
def cleanup_old_audit_logs():
    """
    Clean up audit logs older than retention period.
    """
    try:
        retention_days = settings.AUDIT_LOG_RETENTION_DAYS
        cutoff_date = timezone.now() - timedelta(days=retention_days)

        deleted_count, _ = AuditLog.objects.filter(
            created_at__lt=cutoff_date
        ).delete()

        logger.info(f"Cleaned up {deleted_count} old audit logs")
        return deleted_count
    except Exception as e:
        logger.error(f"Error cleaning up audit logs: {str(e)}")
        raise


@shared_task
def send_email_async(subject, to_email, template_name, context):
    """
    Send email asynchronously.
    """
    from .utils import EmailService
    return EmailService.send_email(subject, to_email, template_name, context)
