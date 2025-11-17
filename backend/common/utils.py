"""
Utility functions for ITPilot.
"""

from cryptography.fernet import Fernet
from django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
import secrets
import string
import hashlib
import base64
import logging

logger = logging.getLogger(__name__)


class EncryptionUtil:
    """
    Utility class for AES-256 encryption/decryption.
    """
    @staticmethod
    def get_cipher():
        """Get Fernet cipher with AES-256 key."""
        key = settings.AES_ENCRYPTION_KEY
        if not key:
            raise ValueError("AES_ENCRYPTION_KEY not configured")
        # Ensure key is properly formatted for Fernet
        if len(key) < 32:
            key = hashlib.sha256(key).digest()
        key = base64.urlsafe_b64encode(key[:32])
        return Fernet(key)

    @classmethod
    def encrypt(cls, data: str) -> str:
        """Encrypt data using AES-256."""
        cipher = cls.get_cipher()
        encrypted = cipher.encrypt(data.encode())
        return encrypted.decode()

    @classmethod
    def decrypt(cls, encrypted_data: str) -> str:
        """Decrypt data using AES-256."""
        cipher = cls.get_cipher()
        decrypted = cipher.decrypt(encrypted_data.encode())
        return decrypted.decode()


class TokenGenerator:
    """
    Utility class for generating secure tokens.
    """
    @staticmethod
    def generate_session_token(length=32):
        """Generate a secure random session token."""
        alphabet = string.ascii_letters + string.digits
        return ''.join(secrets.choice(alphabet) for _ in range(length))

    @staticmethod
    def generate_otp(length=6):
        """Generate a numeric OTP."""
        return ''.join(secrets.choice(string.digits) for _ in range(length))

    @staticmethod
    def generate_api_key():
        """Generate a secure API key."""
        return secrets.token_urlsafe(32)


class EmailService:
    """
    Utility class for sending emails.
    """
    @staticmethod
    def send_email(subject, to_email, template_name, context, from_email=None):
        """
        Send an HTML email using a template.

        Args:
            subject: Email subject
            to_email: Recipient email address (string or list)
            template_name: Template file name (without extension)
            context: Context dictionary for template rendering
            from_email: Sender email (optional)
        """
        try:
            if from_email is None:
                from_email = settings.DEFAULT_FROM_EMAIL

            # Render HTML content
            html_content = render_to_string(f'emails/{template_name}.html', context)

            # Create email
            if isinstance(to_email, str):
                to_email = [to_email]

            email = EmailMultiAlternatives(
                subject=subject,
                body='',  # Plain text fallback
                from_email=from_email,
                to=to_email,
            )
            email.attach_alternative(html_content, "text/html")
            email.send()

            logger.info(f"Email sent to {to_email}: {subject}")
            return True
        except Exception as e:
            logger.error(f"Error sending email to {to_email}: {str(e)}")
            return False


class ResponseFormatter:
    """
    Utility class for formatting API responses.
    """
    @staticmethod
    def success(data=None, message="Success", status_code=200):
        """Format a successful response."""
        response = {
            'success': True,
            'message': message,
            'status_code': status_code,
        }
        if data is not None:
            response['data'] = data
        return response

    @staticmethod
    def error(errors, message="Error", status_code=400):
        """Format an error response."""
        return {
            'success': False,
            'message': message,
            'errors': errors,
            'status_code': status_code,
        }


class PaginationHelper:
    """
    Utility class for custom pagination.
    """
    @staticmethod
    def paginate_queryset(queryset, page, page_size=20):
        """
        Paginate a queryset and return formatted response.
        """
        from django.core.paginator import Paginator, EmptyPage

        paginator = Paginator(queryset, page_size)

        try:
            page_obj = paginator.page(page)
        except EmptyPage:
            page_obj = paginator.page(paginator.num_pages)

        return {
            'count': paginator.count,
            'num_pages': paginator.num_pages,
            'current_page': page_obj.number,
            'has_next': page_obj.has_next(),
            'has_previous': page_obj.has_previous(),
            'results': list(page_obj),
        }
