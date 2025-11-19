"""
Management command to clean up test users from database.
This deletes all users except superusers/admins.
"""

from django.core.management.base import BaseCommand
from authentication.models import User


class Command(BaseCommand):
    help = 'Delete all non-admin users from the database'

    def add_arguments(self, parser):
        parser.add_argument(
            '--confirm',
            action='store_true',
            help='Confirm deletion of non-admin users',
        )

    def handle(self, *args, **options):
        if not options['confirm']:
            self.stdout.write(
                self.style.WARNING(
                    'This command will delete ALL non-admin users from the database!'
                )
            )
            self.stdout.write(
                self.style.WARNING(
                    'Run with --confirm flag to proceed: python manage.py cleanup_users --confirm'
                )
            )
            return

        # Get all non-admin users
        non_admin_users = User.objects.filter(
            is_superuser=False,
            is_staff=False
        )

        count = non_admin_users.count()

        if count == 0:
            self.stdout.write(
                self.style.SUCCESS('No non-admin users found.')
            )
            return

        # Show users that will be deleted
        self.stdout.write(
            self.style.WARNING(f'\nUsers to be deleted ({count}):')
        )
        for user in non_admin_users[:10]:  # Show first 10
            self.stdout.write(
                f'  - {user.email} ({user.first_name} {user.last_name})'
            )

        if count > 10:
            self.stdout.write(f'  ... and {count - 10} more users')

        # Delete users
        non_admin_users.delete()

        self.stdout.write(
            self.style.SUCCESS(
                f'\n✓ Successfully deleted {count} non-admin user(s).'
            )
        )

        # Show remaining users
        remaining = User.objects.all().count()
        self.stdout.write(
            self.style.SUCCESS(
                f'✓ {remaining} admin/superuser(s) remain in database.'
            )
        )
