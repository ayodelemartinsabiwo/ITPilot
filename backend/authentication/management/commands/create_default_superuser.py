"""
Django management command to create a default superuser if one doesn't exist.

This command creates a superuser with credentials from environment variables.
Safe to run multiple times - will skip if superuser already exists.
"""

from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model
from django.conf import settings
import os

User = get_user_model()


class Command(BaseCommand):
    help = 'Create a default superuser from environment variables if one does not exist'

    def handle(self, *args, **options):
        # Get credentials from environment variables
        email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@itpilot.com')
        password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'admin123')
        first_name = os.environ.get('DJANGO_SUPERUSER_FIRST_NAME', 'Admin')
        last_name = os.environ.get('DJANGO_SUPERUSER_LAST_NAME', 'User')

        # Check if any superuser exists
        if User.objects.filter(is_superuser=True).exists():
            self.stdout.write(
                self.style.WARNING('Superuser already exists. Skipping creation.')
            )
            return

        # Create superuser
        try:
            user = User.objects.create_superuser(
                email=email,
                password=password,
                first_name=first_name,
                last_name=last_name,
            )

            self.stdout.write(
                self.style.SUCCESS(f'Successfully created superuser: {email}')
            )
            self.stdout.write(
                self.style.SUCCESS(f'Login at: {settings.ALLOWED_HOSTS[0] if settings.ALLOWED_HOSTS else "localhost"}/admin/')
            )
            self.stdout.write(
                self.style.WARNING(f'Email: {email}')
            )
            self.stdout.write(
                self.style.WARNING('Password: (from DJANGO_SUPERUSER_PASSWORD env var)')
            )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error creating superuser: {str(e)}')
            )
