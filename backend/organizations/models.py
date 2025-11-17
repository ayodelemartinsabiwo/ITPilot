"""
Organization models for ITPilot multi-tenant support.
"""

from django.db import models
from django.core.validators import RegexValidator
from common.models import TimeStampedModel


class Organization(TimeStampedModel):
    """
    Organization model for multi-tenant support.
    """
    name = models.CharField(max_length=255)
    slug = models.SlugField(max_length=255, unique=True, db_index=True)
    description = models.TextField(blank=True)

    # Contact information
    email = models.EmailField()
    phone = models.CharField(max_length=20, blank=True)
    website = models.URLField(blank=True)

    # Address
    address_line1 = models.CharField(max_length=255, blank=True)
    address_line2 = models.CharField(max_length=255, blank=True)
    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)
    country = models.CharField(max_length=100, blank=True)
    postal_code = models.CharField(max_length=20, blank=True)

    # Branding
    logo = models.ImageField(upload_to='organizations/logos/', blank=True, null=True)
    primary_color = models.CharField(
        max_length=7,
        default='#3B82F6',
        validators=[RegexValidator(r'^#[0-9A-Fa-f]{6}$')]
    )

    # Settings
    is_active = models.BooleanField(default=True)
    is_verified = models.BooleanField(default=False)
    max_members = models.IntegerField(default=50)
    max_devices = models.IntegerField(default=100)

    # Billing
    billing_email = models.EmailField(blank=True)
    tax_id = models.CharField(max_length=50, blank=True)

    # Metadata
    settings = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = 'organizations'
        ordering = ['name']
        indexes = [
            models.Index(fields=['slug']),
            models.Index(fields=['is_active', '-created_at']),
        ]

    def __str__(self):
        return self.name

    def get_member_count(self):
        """Get number of organization members."""
        return self.members.filter(is_active=True).count()

    def get_device_count(self):
        """Get number of devices in organization."""
        return self.devices.filter(is_active=True).count()

    def can_add_member(self):
        """Check if organization can add more members."""
        return self.get_member_count() < self.max_members

    def can_add_device(self):
        """Check if organization can add more devices."""
        return self.get_device_count() < self.max_devices


class OrganizationMember(TimeStampedModel):
    """
    Organization member with role-based access control.
    """
    ROLE_CHOICES = [
        ('OWNER', 'Owner'),
        ('ADMIN', 'Administrator'),
        ('MEMBER', 'Member'),
        ('GUEST', 'Guest'),
    ]

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='members'
    )
    user = models.ForeignKey(
        'authentication.User',
        on_delete=models.CASCADE,
        related_name='organization_memberships'
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='MEMBER')
    title = models.CharField(max_length=100, blank=True)
    department = models.CharField(max_length=100, blank=True)
    is_active = models.BooleanField(default=True)
    invited_by = models.ForeignKey(
        'authentication.User',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='organization_invitations_sent'
    )
    invited_at = models.DateTimeField(auto_now_add=True)
    joined_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'organization_members'
        ordering = ['-created_at']
        unique_together = [['organization', 'user']]
        indexes = [
            models.Index(fields=['organization', 'user']),
            models.Index(fields=['organization', 'role']),
            models.Index(fields=['user', 'is_active']),
        ]

    def __str__(self):
        return f"{self.user.email} - {self.organization.name} ({self.role})"

    def is_owner(self):
        """Check if member is owner."""
        return self.role == 'OWNER'

    def is_admin(self):
        """Check if member is admin or owner."""
        return self.role in ['OWNER', 'ADMIN']

    def can_manage_members(self):
        """Check if member can manage other members."""
        return self.is_admin()

    def can_manage_devices(self):
        """Check if member can manage devices."""
        return self.is_admin()


class Domain(TimeStampedModel):
    """
    Domain verification for organizations.
    """
    VERIFICATION_STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('VERIFIED', 'Verified'),
        ('FAILED', 'Failed'),
    ]

    organization = models.ForeignKey(
        Organization,
        on_delete=models.CASCADE,
        related_name='domains'
    )
    domain = models.CharField(max_length=255, unique=True, db_index=True)
    is_primary = models.BooleanField(default=False)

    # Verification
    verification_status = models.CharField(
        max_length=20,
        choices=VERIFICATION_STATUS_CHOICES,
        default='PENDING'
    )
    verification_token = models.CharField(max_length=100, blank=True)
    verification_method = models.CharField(
        max_length=20,
        choices=[
            ('DNS_TXT', 'DNS TXT Record'),
            ('HTML_META', 'HTML Meta Tag'),
            ('HTML_FILE', 'HTML File'),
        ],
        default='DNS_TXT'
    )
    verified_at = models.DateTimeField(null=True, blank=True)

    # Auto-join settings
    auto_join_enabled = models.BooleanField(default=False)
    auto_join_role = models.CharField(
        max_length=20,
        choices=OrganizationMember.ROLE_CHOICES,
        default='MEMBER'
    )

    class Meta:
        db_table = 'organization_domains'
        ordering = ['-is_primary', 'domain']
        indexes = [
            models.Index(fields=['organization', '-is_primary']),
            models.Index(fields=['domain']),
            models.Index(fields=['verification_status']),
        ]

    def __str__(self):
        return f"{self.domain} ({self.organization.name})"

    def is_verified(self):
        """Check if domain is verified."""
        return self.verification_status == 'VERIFIED'

    def get_verification_instructions(self):
        """Get domain verification instructions."""
        if self.verification_method == 'DNS_TXT':
            return {
                'type': 'DNS TXT Record',
                'record': f'itpilot-verification={self.verification_token}',
                'instructions': f'Add a TXT record to {self.domain} with value: itpilot-verification={self.verification_token}'
            }
        elif self.verification_method == 'HTML_META':
            return {
                'type': 'HTML Meta Tag',
                'tag': f'<meta name="itpilot-verification" content="{self.verification_token}">',
                'instructions': f'Add this meta tag to the <head> section of your website\'s homepage'
            }
        elif self.verification_method == 'HTML_FILE':
            return {
                'type': 'HTML File',
                'filename': f'itpilot-verification.html',
                'content': self.verification_token,
                'instructions': f'Upload a file named itpilot-verification.html containing "{self.verification_token}" to your website root'
            }
        return {}
