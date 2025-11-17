"""
User and authentication models for ITPilot.
"""

from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
from django.db import models
from common.models import TimeStampedModel
import uuid


class UserManager(BaseUserManager):
    """Custom user manager for email-based authentication."""

    def create_user(self, email, password=None, **extra_fields):
        """Create and return a regular user."""
        if not email:
            raise ValueError('Users must have an email address')

        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        """Create and return a superuser."""
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('role', 'SUPERADMIN')

        if extra_fields.get('is_staff') is not True:
            raise ValueError('Superuser must have is_staff=True.')
        if extra_fields.get('is_superuser') is not True:
            raise ValueError('Superuser must have is_superuser=True.')

        return self.create_user(email, password, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin, TimeStampedModel):
    """
    Custom User model for ITPilot.
    """
    ROLE_CHOICES = [
        ('USER', 'User'),
        ('TECHNICIAN', 'Technician'),
        ('ADMIN', 'Admin'),
        ('SUPERADMIN', 'Super Admin'),
    ]

    email = models.EmailField(unique=True, db_index=True)
    phone = models.CharField(max_length=20, blank=True, null=True)
    first_name = models.CharField(max_length=150)
    last_name = models.CharField(max_length=150)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='USER')
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_email_verified = models.BooleanField(default=False)
    is_phone_verified = models.BooleanField(default=False)
    profile_picture = models.ImageField(
        upload_to='profile_pictures/',
        blank=True,
        null=True
    )
    timezone = models.CharField(max_length=50, default='UTC')
    language = models.CharField(max_length=10, default='en')
    last_login_ip = models.GenericIPAddressField(null=True, blank=True)
    failed_login_attempts = models.IntegerField(default=0)
    account_locked_until = models.DateTimeField(null=True, blank=True)

    # OAuth fields
    oauth_provider = models.CharField(max_length=20, blank=True, null=True)
    oauth_id = models.CharField(max_length=255, blank=True, null=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['first_name', 'last_name']

    class Meta:
        db_table = 'users'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['email']),
            models.Index(fields=['role']),
            models.Index(fields=['is_active']),
        ]

    def __str__(self):
        return self.email

    @property
    def full_name(self):
        """Get full name."""
        return f"{self.first_name} {self.last_name}"

    def has_active_subscription(self):
        """Check if user has an active subscription."""
        from billing.models import Subscription
        return Subscription.objects.filter(
            user=self,
            status='ACTIVE'
        ).exists()

    def can_create_ticket(self):
        """Check if user can create a ticket."""
        return self.is_active and (
            self.role in ['USER', 'ADMIN', 'SUPERADMIN'] or
            self.has_active_subscription()
        )


class OTPVerification(TimeStampedModel):
    """
    Model for OTP verification (email/phone).
    """
    OTP_TYPE_CHOICES = [
        ('EMAIL', 'Email Verification'),
        ('PHONE', 'Phone Verification'),
        ('PASSWORD_RESET', 'Password Reset'),
        ('TWO_FACTOR', 'Two-Factor Authentication'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otp_verifications')
    otp_type = models.CharField(max_length=20, choices=OTP_TYPE_CHOICES)
    otp_code = models.CharField(max_length=10)
    email_or_phone = models.CharField(max_length=255)
    is_verified = models.BooleanField(default=False)
    expires_at = models.DateTimeField()
    attempts = models.IntegerField(default=0)
    max_attempts = models.IntegerField(default=3)

    class Meta:
        db_table = 'otp_verifications'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'otp_type', '-created_at']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.otp_type}"

    def is_expired(self):
        """Check if OTP is expired."""
        from django.utils import timezone
        return timezone.now() > self.expires_at

    def can_attempt(self):
        """Check if user can attempt verification."""
        return self.attempts < self.max_attempts and not self.is_expired()


class RefreshToken(TimeStampedModel):
    """
    Model for storing refresh tokens (for blacklisting).
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='refresh_tokens')
    token = models.CharField(max_length=500, unique=True, db_index=True)
    expires_at = models.DateTimeField()
    is_blacklisted = models.BooleanField(default=False)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(null=True, blank=True)

    class Meta:
        db_table = 'refresh_tokens'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['token']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.token[:20]}..."


class APIKey(TimeStampedModel):
    """
    Model for API keys (for device agents and integrations).
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='api_keys')
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='api_keys',
        null=True,
        blank=True
    )
    name = models.CharField(max_length=255)
    key_hash = models.CharField(max_length=255, unique=True, db_index=True)
    key_prefix = models.CharField(max_length=10)
    is_active = models.BooleanField(default=True)
    expires_at = models.DateTimeField(null=True, blank=True)
    last_used_at = models.DateTimeField(null=True, blank=True)
    permissions = models.JSONField(default=list)

    class Meta:
        db_table = 'api_keys'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_active']),
            models.Index(fields=['key_hash']),
        ]

    def __str__(self):
        return f"{self.name} - {self.key_prefix}***"
