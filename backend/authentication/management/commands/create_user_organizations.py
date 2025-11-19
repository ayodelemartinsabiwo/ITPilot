"""
Django management command to create default organizations for existing users.

This is a one-time migration command to help users who registered
before auto-organization creation was implemented.
"""

from django.core.management.base import BaseCommand
from django.utils.text import slugify
from authentication.models import User
from organizations.models import Organization, OrganizationMember
import uuid


class Command(BaseCommand):
    help = 'Create default organizations for existing users without organizations'

    def handle(self, *args, **options):
        # Get all users without organizations
        users_without_orgs = User.objects.filter(
            organization_memberships__isnull=True
        ).distinct()

        count = users_without_orgs.count()

        if count == 0:
            self.stdout.write(self.style.SUCCESS('All users have organizations.'))
            return

        self.stdout.write(
            self.style.WARNING(f'Found {count} users without organizations. Creating...')
        )

        created = 0
        for user in users_without_orgs:
            try:
                # Create organization for user
                org_name = f"{user.first_name} {user.last_name}'s Organization"
                org_slug = slugify(f"{user.email}-{uuid.uuid4().hex[:8]}")

                organization = Organization.objects.create(
                    name=org_name,
                    slug=org_slug,
                    email=user.email,
                    is_active=True,
                    is_verified=True,
                )

                # Add user as owner
                OrganizationMember.objects.create(
                    organization=organization,
                    user=user,
                    role='OWNER',
                    is_active=True,
                )

                created += 1
                self.stdout.write(f'  ✓ Created organization for {user.email}')

            except Exception as e:
                self.stdout.write(
                    self.style.ERROR(f'  ✗ Error creating organization for {user.email}: {str(e)}')
                )

        self.stdout.write('')
        self.stdout.write(
            self.style.SUCCESS(f'Successfully created {created} organizations.')
        )
