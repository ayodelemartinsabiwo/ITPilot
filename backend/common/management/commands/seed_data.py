"""
Django management command to seed initial data for ITPilot.

This command creates subscription plans matching frontend pricing page.
All prices in Naira (NGN) as shown on frontend.
"""

from django.core.management.base import BaseCommand
from billing.models import Plan
from decimal import Decimal


class Command(BaseCommand):
    help = 'Seed subscription plans matching frontend pricing (Naira)'

    def handle(self, *args, **options):
        self.stdout.write('Seeding subscription plans (matching frontend in Naira)...')

        # Delete/deactivate old plans not in frontend (e.g., Free plan)
        old_plans = Plan.objects.exclude(slug__in=['starter', 'professional', 'enterprise', 'custom'])
        if old_plans.exists():
            deleted_count = old_plans.count()
            old_plans.delete()
            self.stdout.write(
                self.style.WARNING(f'  🗑️  Deleted {deleted_count} old plan(s) not in frontend')
            )

        # Plans matching frontend/app/pricing/page.tsx - ALL IN NAIRA (NGN)
        plans_data = [
            {
                'name': 'Starter',
                'slug': 'starter',
                'description': 'Perfect for small teams getting started with IT automation',
                'price': Decimal('35000.00'),  # ₦35,000/month
                'currency': 'NGN',
                'billing_interval': 'MONTHLY',
                'max_users': 10,
                'max_devices': 50,
                'max_tickets_per_month': 1000,
                'max_storage_gb': 5,
                'has_ai_support': True,
                'has_remote_access': False,
                'has_integrations': False,
                'has_analytics': True,
                'has_priority_support': False,
                'features': [
                    'Up to 50 devices',
                    'AI chatbot (1,000 messages/month)',
                    'Basic ticketing system',
                    'Email support',
                    'Real-time monitoring',
                    'Mobile app access',
                    '5 GB storage',
                    'Basic analytics'
                ],
                'is_active': True,
                'is_popular': False,
                'trial_days': 14,
                'sort_order': 1,
            },
            {
                'name': 'Professional',
                'slug': 'professional',
                'description': 'For growing teams that need advanced features and integrations',
                'price': Decimal('120000.00'),  # ₦120,000/month
                'currency': 'NGN',
                'billing_interval': 'MONTHLY',
                'max_users': 50,
                'max_devices': 500,
                'max_tickets_per_month': 10000,
                'max_storage_gb': 50,
                'has_ai_support': True,
                'has_remote_access': True,
                'has_integrations': True,
                'has_analytics': True,
                'has_priority_support': True,
                'features': [
                    'Up to 500 devices',
                    'AI chatbot (10,000 messages/month)',
                    'Advanced ticketing with automation',
                    'Priority support (24/5)',
                    'Real-time monitoring & alerts',
                    'Mobile app access',
                    'Remote access (RDP/SSH)',
                    '50 GB storage',
                    'Advanced analytics & reporting',
                    'Custom workflows',
                    'API access',
                    'SSO integration',
                    'Slack/Teams integration'
                ],
                'is_active': True,
                'is_popular': True,  # MOST POPULAR as per frontend
                'trial_days': 14,
                'sort_order': 2,
            },
            {
                'name': 'Enterprise',
                'slug': 'enterprise',
                'description': 'For large organizations requiring enterprise-grade features',
                'price': Decimal('360000.00'),  # ₦360,000/month
                'currency': 'NGN',
                'billing_interval': 'MONTHLY',
                'max_users': 999,
                'max_devices': 9999,
                'max_tickets_per_month': 99999,
                'max_storage_gb': 999,
                'has_ai_support': True,
                'has_remote_access': True,
                'has_integrations': True,
                'has_analytics': True,
                'has_priority_support': True,
                'features': [
                    'Unlimited devices',
                    'AI chatbot (unlimited)',
                    'Enterprise ticketing suite',
                    '24/7 priority support',
                    'Real-time monitoring & predictive alerts',
                    'Mobile app access',
                    'Remote access (RDP/SSH/VNC)',
                    'Unlimited storage',
                    'Custom analytics & dashboards',
                    'Advanced automation & workflows',
                    'Full API access',
                    'SSO & SAML integration',
                    'All integrations included',
                    'White-labeling',
                    'Dedicated infrastructure',
                    '99.9% SLA guarantee',
                    'Dedicated account manager',
                    'Custom training sessions',
                    'GDPR/HIPAA compliance tools'
                ],
                'is_active': True,
                'is_popular': False,
                'is_custom': False,
                'trial_days': 14,
                'sort_order': 3,
            },
            {
                'name': 'Custom',
                'slug': 'custom',
                'description': 'Tailored solutions for unique enterprise requirements',
                'price': Decimal('0.00'),  # Custom pricing - contact sales
                'currency': 'NGN',
                'billing_interval': 'MONTHLY',
                'max_users': 9999,
                'max_devices': 99999,
                'max_tickets_per_month': 999999,
                'max_storage_gb': 9999,
                'has_ai_support': True,
                'has_remote_access': True,
                'has_integrations': True,
                'has_analytics': True,
                'has_priority_support': True,
                'features': [
                    'Everything in Enterprise, plus:',
                    'Custom feature development',
                    'On-premise deployment option',
                    'Custom SLA agreements',
                    'Dedicated support team',
                    'Custom integrations',
                    'Multi-region deployment',
                    'Advanced security features',
                    'Compliance certifications',
                    'Custom contract terms'
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
                    self.style.SUCCESS(f'  ✓ Created plan: {plan.name} - ₦{plan.price:,.0f}/month')
                )
            else:
                plans_updated += 1
                self.stdout.write(
                    self.style.WARNING(f'  ↻ Updated plan: {plan.name} - ₦{plan.price:,.0f}/month')
                )

        self.stdout.write('')
        self.stdout.write(
            self.style.SUCCESS(
                f'Successfully seeded {plans_created} plans (updated {plans_updated} existing)'
            )
        )
        self.stdout.write(
            self.style.SUCCESS('✓ All plans now match frontend pricing in Naira (NGN)')
        )
