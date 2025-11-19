"""
Django management command to verify all unverified users.

This is a temporary command to auto-verify users who registered
before email service was properly configured.
"""

from django.core.management.base import BaseCommand
from authentication.models import User


class Command(BaseCommand):
    help = 'Auto-verify all unverified users (use when email service is not configured)'

    def add_arguments(self, parser):
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Show what would be verified without making changes',
        )

    def handle(self, *args, **options):
        dry_run = options['dry_run']

        # Get all unverified users
        unverified_users = User.objects.filter(is_email_verified=False)
        count = unverified_users.count()

        if count == 0:
            self.stdout.write(self.style.SUCCESS('No unverified users found.'))
            return

        if dry_run:
            self.stdout.write(
                self.style.WARNING(f'DRY RUN: Would verify {count} users:')
            )
            for user in unverified_users:
                self.stdout.write(f'  - {user.email}')
        else:
            # Update all unverified users
            updated = unverified_users.update(is_email_verified=True)

            self.stdout.write(
                self.style.SUCCESS(f'Successfully verified {updated} users.')
            )

            # List verified users
            for user in User.objects.filter(email__in=unverified_users.values('email')):
                self.stdout.write(f'  ✓ {user.email}')
