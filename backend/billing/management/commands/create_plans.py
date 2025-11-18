"""
Management command to create subscription plans with Nigerian Naira pricing.
"""

from django.core.management.base import BaseCommand
from billing.models import Plan


class Command(BaseCommand):
    help = 'Create subscription plans for ITPilot'

    def handle(self, *args, **options):
        self.stdout.write('Creating subscription plans...')

        plans_data = [
            {
                'name': 'Starter',
                'slug': 'starter',
                'description': 'Perfect for small teams getting started with IT automation',
                'price': 35000,  # ₦35,000/month
                'currency': 'NGN',
                'billing_interval': 'MONTHLY',
                'max_users': 5,
                'max_devices': 50,
                'max_tickets_per_month': 100,
                'max_storage_gb': 5,
                'has_ai_support': True,
                'has_remote_access': False,
                'has_integrations': False,
                'has_analytics': True,
                'has_priority_support': False,
                'features': [
                    'AI chatbot (1,000 messages/month)',
                    'Basic ticketing system',
                    'Email support',
                    'Real-time monitoring',
                    'Mobile app access',
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
                'price': 120000,  # ₦120,000/month
                'currency': 'NGN',
                'billing_interval': 'MONTHLY',
                'max_users': 25,
                'max_devices': 500,
                'max_tickets_per_month': 1000,
                'max_storage_gb': 50,
                'has_ai_support': True,
                'has_remote_access': True,
                'has_integrations': True,
                'has_analytics': True,
                'has_priority_support': True,
                'features': [
                    'AI chatbot (10,000 messages/month)',
                    'Advanced ticketing with automation',
                    'Priority support (24/5)',
                    'Real-time monitoring & alerts',
                    'Remote access (RDP/SSH)',
                    'Advanced analytics & reporting',
                    'Custom workflows',
                    'API access',
                    'SSO integration',
                    'Slack/Teams integration'
                ],
                'is_active': True,
                'is_popular': True,
                'trial_days': 14,
                'sort_order': 2,
            },
            {
                'name': 'Enterprise',
                'slug': 'enterprise',
                'description': 'For large organizations requiring enterprise-grade features',
                'price': 360000,  # ₦360,000/month
                'currency': 'NGN',
                'billing_interval': 'MONTHLY',
                'max_users': -1,  # Unlimited
                'max_devices': -1,  # Unlimited
                'max_tickets_per_month': -1,  # Unlimited
                'max_storage_gb': -1,  # Unlimited
                'has_ai_support': True,
                'has_remote_access': True,
                'has_integrations': True,
                'has_analytics': True,
                'has_priority_support': True,
                'features': [
                    'AI chatbot (unlimited)',
                    'Enterprise ticketing suite',
                    '24/7 priority support',
                    'Real-time monitoring & predictive alerts',
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
                'trial_days': 14,
                'sort_order': 3,
            },
        ]

        # Also create annual plans with discount
        annual_plans_data = []
        for plan_data in plans_data:
            annual_plan = plan_data.copy()
            annual_plan['slug'] = f"{plan_data['slug']}-annual"
            annual_plan['name'] = f"{plan_data['name']} (Annual)"
            annual_plan['billing_interval'] = 'YEARLY'
            # 17% discount for annual payment (10 months price)
            annual_plan['price'] = int(plan_data['price'] * 10)
            annual_plan['sort_order'] = plan_data['sort_order'] + 10
            annual_plans_data.append(annual_plan)

        all_plans = plans_data + annual_plans_data

        created_count = 0
        updated_count = 0

        for plan_data in all_plans:
            plan, created = Plan.objects.update_or_create(
                slug=plan_data['slug'],
                defaults=plan_data
            )

            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(
                        f'✓ Created plan: {plan.name} - ₦{plan.price:,}/{plan.billing_interval}'
                    )
                )
            else:
                updated_count += 1
                self.stdout.write(
                    self.style.WARNING(
                        f'↻ Updated plan: {plan.name} - ₦{plan.price:,}/{plan.billing_interval}'
                    )
                )

        self.stdout.write(
            self.style.SUCCESS(
                f'\n✓ Successfully created {created_count} plans and updated {updated_count} plans'
            )
        )
        self.stdout.write(self.style.SUCCESS('Total plans in database: {}'.format(Plan.objects.count())))
