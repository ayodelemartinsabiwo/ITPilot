"""
Django management command to seed initial data for ITPilot.

This command creates sample plans, organizations, and other essential data.
"""

from django.core.management.base import BaseCommand
from billing.models import Plan
from decimal import Decimal


class Command(BaseCommand):
    help = 'Seed initial data for ITPilot (Plans, etc.)'

    def handle(self, *args, **options):
        self.stdout.write('Seeding initial data...')

        # Create subscription plans
        plans_data = [
            {
                'name': 'Free',
                'slug': 'free',
                'description': 'Perfect for individuals and small teams getting started',
                'price': Decimal('0.00'),
                'currency': 'USD',
                'billing_interval': 'MONTHLY',
                'max_users': 1,
                'max_devices': 2,
                'max_tickets_per_month': 10,
                'max_storage_gb': 1,
                'has_ai_support': False,
                'has_remote_access': False,
                'has_integrations': False,
                'has_analytics': False,
                'has_priority_support': False,
                'features': [
                    'Up to 2 devices',
                    '10 tickets per month',
                    '1GB storage',
                    'Email support',
                    'Basic reporting'
                ],
                'is_active': True,
                'is_popular': False,
                'trial_days': 0,
                'sort_order': 1,
            },
            {
                'name': 'Starter',
                'slug': 'starter',
                'description': 'For growing teams with basic IT support needs',
                'price': Decimal('29.99'),
                'currency': 'USD',
                'billing_interval': 'MONTHLY',
                'max_users': 5,
                'max_devices': 25,
                'max_tickets_per_month': 100,
                'max_storage_gb': 10,
                'has_ai_support': True,
                'has_remote_access': False,
                'has_integrations': True,
                'has_analytics': True,
                'has_priority_support': False,
                'features': [
                    'Up to 5 users',
                    '25 devices',
                    '100 tickets/month',
                    '10GB storage',
                    'AI-powered diagnostics',
                    'Cloud integrations',
                    'Analytics dashboard',
                    'Email & chat support',
                    '14-day free trial'
                ],
                'is_active': True,
                'is_popular': True,
                'trial_days': 14,
                'sort_order': 2,
            },
            {
                'name': 'Professional',
                'slug': 'professional',
                'description': 'Advanced features for professional IT teams',
                'price': Decimal('99.99'),
                'currency': 'USD',
                'billing_interval': 'MONTHLY',
                'max_users': 25,
                'max_devices': 100,
                'max_tickets_per_month': 500,
                'max_storage_gb': 50,
                'has_ai_support': True,
                'has_remote_access': True,
                'has_integrations': True,
                'has_analytics': True,
                'has_priority_support': True,
                'features': [
                    'Up to 25 users',
                    '100 devices',
                    '500 tickets/month',
                    '50GB storage',
                    'AI-powered diagnostics',
                    'Remote access & control',
                    'All integrations',
                    'Advanced analytics',
                    'Priority support (24/7)',
                    'Custom workflows',
                    '14-day free trial'
                ],
                'is_active': True,
                'is_popular': False,
                'trial_days': 14,
                'sort_order': 3,
            },
            {
                'name': 'Enterprise',
                'slug': 'enterprise',
                'description': 'Custom solutions for large organizations',
                'price': Decimal('299.99'),
                'currency': 'USD',
                'billing_interval': 'MONTHLY',
                'max_users': 999,
                'max_devices': 9999,
                'max_tickets_per_month': 99999,
                'max_storage_gb': 500,
                'has_ai_support': True,
                'has_remote_access': True,
                'has_integrations': True,
                'has_analytics': True,
                'has_priority_support': True,
                'features': [
                    'Unlimited users',
                    'Unlimited devices',
                    'Unlimited tickets',
                    '500GB storage',
                    'AI-powered diagnostics',
                    'Remote access & control',
                    'All integrations',
                    'Advanced analytics',
                    'Dedicated support manager',
                    'Custom SLA',
                    'SSO & advanced security',
                    'API access',
                    'Custom integrations',
                    'Onboarding & training'
                ],
                'is_active': True,
                'is_popular': False,
                'is_custom': True,
                'trial_days': 30,
                'sort_order': 4,
            },
        ]

        plans_created = 0
        plans_updated = 0

        for plan_data in plans_data:
            plan, created = Plan.objects.update_or_create(
                slug=plan_data['slug'],
                defaults=plan_data
            )
            if created:
                plans_created += 1
                self.stdout.write(
                    self.style.SUCCESS(f'  ✓ Created plan: {plan.name}')
                )
            else:
                plans_updated += 1
                self.stdout.write(
                    self.style.WARNING(f'  ↻ Updated plan: {plan.name}')
                )

        self.stdout.write('')
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully seeded {plans_created} plans '
                f'(updated {plans_updated} existing)'
            )
        )
