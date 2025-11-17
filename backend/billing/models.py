"""
Billing models for ITPilot subscription and payment management.
"""

from django.db import models
from django.core.validators import MinValueValidator
from common.models import TimeStampedModel
from decimal import Decimal


class Plan(TimeStampedModel):
    """
    Subscription plans.
    """
    BILLING_INTERVAL_CHOICES = [
        ('MONTHLY', 'Monthly'),
        ('QUARTERLY', 'Quarterly'),
        ('YEARLY', 'Yearly'),
    ]

    name = models.CharField(max_length=100)
    slug = models.SlugField(max_length=100, unique=True, db_index=True)
    description = models.TextField(blank=True)

    # Pricing
    price = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    currency = models.CharField(max_length=3, default='USD')
    billing_interval = models.CharField(
        max_length=20,
        choices=BILLING_INTERVAL_CHOICES,
        default='MONTHLY'
    )

    # Features & Limits
    max_users = models.IntegerField(default=5)
    max_devices = models.IntegerField(default=10)
    max_tickets_per_month = models.IntegerField(default=50)
    max_storage_gb = models.IntegerField(default=10)
    has_ai_support = models.BooleanField(default=False)
    has_remote_access = models.BooleanField(default=False)
    has_integrations = models.BooleanField(default=False)
    has_analytics = models.BooleanField(default=False)
    has_priority_support = models.BooleanField(default=False)

    # Additional Features
    features = models.JSONField(default=list, blank=True)

    # Visibility
    is_active = models.BooleanField(default=True)
    is_popular = models.BooleanField(default=False)
    is_custom = models.BooleanField(default=False)

    # Trial
    trial_days = models.IntegerField(default=14)

    # External IDs
    stripe_price_id = models.CharField(max_length=255, blank=True)
    paystack_plan_code = models.CharField(max_length=255, blank=True)
    flutterwave_plan_id = models.CharField(max_length=255, blank=True)

    # Ordering
    sort_order = models.IntegerField(default=0)

    class Meta:
        db_table = 'billing_plans'
        ordering = ['sort_order', 'price']

    def __str__(self):
        return f"{self.name} - {self.price} {self.currency}/{self.billing_interval}"


class Subscription(TimeStampedModel):
    """
    User/Organization subscriptions.
    """
    STATUS_CHOICES = [
        ('TRIAL', 'Trial'),
        ('ACTIVE', 'Active'),
        ('PAST_DUE', 'Past Due'),
        ('CANCELLED', 'Cancelled'),
        ('EXPIRED', 'Expired'),
    ]

    user = models.ForeignKey(
        'authentication.User',
        on_delete=models.CASCADE,
        related_name='subscriptions'
    )
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='subscriptions'
    )
    plan = models.ForeignKey(
        Plan,
        on_delete=models.PROTECT,
        related_name='subscriptions'
    )

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='TRIAL')

    # Dates
    trial_ends_at = models.DateTimeField(null=True, blank=True)
    current_period_start = models.DateTimeField()
    current_period_end = models.DateTimeField()
    cancelled_at = models.DateTimeField(null=True, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)

    # Billing
    billing_cycle_anchor = models.DateTimeField()
    next_billing_date = models.DateTimeField()

    # Payment Method
    payment_provider = models.CharField(
        max_length=20,
        choices=[
            ('STRIPE', 'Stripe'),
            ('PAYSTACK', 'Paystack'),
            ('FLUTTERWAVE', 'Flutterwave'),
            ('MANUAL', 'Manual'),
        ],
        default='STRIPE'
    )

    # External IDs
    stripe_subscription_id = models.CharField(max_length=255, blank=True)
    paystack_subscription_code = models.CharField(max_length=255, blank=True)
    flutterwave_subscription_id = models.CharField(max_length=255, blank=True)

    # Settings
    auto_renew = models.BooleanField(default=True)
    cancel_at_period_end = models.BooleanField(default=False)

    # Metadata
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = 'subscriptions'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'status']),
            models.Index(fields=['organization', 'status']),
            models.Index(fields=['status', 'next_billing_date']),
        ]

    def __str__(self):
        return f"{self.organization.name} - {self.plan.name} ({self.status})"

    def is_active(self):
        """Check if subscription is active."""
        return self.status in ['TRIAL', 'ACTIVE']

    def is_trialing(self):
        """Check if subscription is in trial period."""
        return self.status == 'TRIAL'

    def days_until_renewal(self):
        """Calculate days until next renewal."""
        from django.utils import timezone
        if self.next_billing_date:
            delta = self.next_billing_date - timezone.now()
            return max(0, delta.days)
        return 0


class Payment(TimeStampedModel):
    """
    Payment records.
    """
    STATUS_CHOICES = [
        ('PENDING', 'Pending'),
        ('PROCESSING', 'Processing'),
        ('SUCCEEDED', 'Succeeded'),
        ('FAILED', 'Failed'),
        ('REFUNDED', 'Refunded'),
        ('CANCELLED', 'Cancelled'),
    ]

    subscription = models.ForeignKey(
        Subscription,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='payments'
    )
    user = models.ForeignKey(
        'authentication.User',
        on_delete=models.CASCADE,
        related_name='payments'
    )
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='payments'
    )

    # Amount
    amount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    currency = models.CharField(max_length=3, default='USD')

    # Status
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')

    # Payment Provider
    payment_provider = models.CharField(
        max_length=20,
        choices=[
            ('STRIPE', 'Stripe'),
            ('PAYSTACK', 'Paystack'),
            ('FLUTTERWAVE', 'Flutterwave'),
            ('MANUAL', 'Manual'),
        ]
    )
    payment_method = models.CharField(
        max_length=50,
        choices=[
            ('CARD', 'Credit/Debit Card'),
            ('BANK_TRANSFER', 'Bank Transfer'),
            ('MOBILE_MONEY', 'Mobile Money'),
            ('USSD', 'USSD'),
            ('OTHER', 'Other'),
        ],
        default='CARD'
    )

    # External References
    transaction_id = models.CharField(max_length=255, unique=True, db_index=True)
    stripe_payment_intent_id = models.CharField(max_length=255, blank=True)
    paystack_reference = models.CharField(max_length=255, blank=True)
    flutterwave_transaction_id = models.CharField(max_length=255, blank=True)

    # Timestamps
    paid_at = models.DateTimeField(null=True, blank=True)
    refunded_at = models.DateTimeField(null=True, blank=True)

    # Additional Info
    description = models.TextField(blank=True)
    receipt_url = models.URLField(blank=True)
    failure_reason = models.TextField(blank=True)
    customer_email = models.EmailField()
    customer_phone = models.CharField(max_length=20, blank=True)

    # Metadata
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = 'payments'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['organization', '-created_at']),
            models.Index(fields=['status', '-created_at']),
            models.Index(fields=['transaction_id']),
        ]

    def __str__(self):
        return f"Payment {self.transaction_id} - {self.amount} {self.currency} ({self.status})"

    def is_successful(self):
        """Check if payment was successful."""
        return self.status == 'SUCCEEDED'


class Invoice(TimeStampedModel):
    """
    Invoices for subscriptions and payments.
    """
    STATUS_CHOICES = [
        ('DRAFT', 'Draft'),
        ('OPEN', 'Open'),
        ('PAID', 'Paid'),
        ('VOID', 'Void'),
        ('UNCOLLECTIBLE', 'Uncollectible'),
    ]

    subscription = models.ForeignKey(
        Subscription,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='invoices'
    )
    user = models.ForeignKey(
        'authentication.User',
        on_delete=models.CASCADE,
        related_name='invoices'
    )
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='invoices'
    )

    # Invoice Details
    invoice_number = models.CharField(max_length=50, unique=True, db_index=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='DRAFT')

    # Amounts
    subtotal = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    tax = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    discount = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        default=Decimal('0.00'),
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    total = models.DecimalField(
        max_digits=10,
        decimal_places=2,
        validators=[MinValueValidator(Decimal('0.00'))]
    )
    currency = models.CharField(max_length=3, default='USD')

    # Dates
    invoice_date = models.DateField()
    due_date = models.DateField()
    paid_at = models.DateTimeField(null=True, blank=True)

    # Payment
    payment = models.ForeignKey(
        Payment,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='invoices'
    )

    # Line Items
    line_items = models.JSONField(default=list, blank=True)

    # External IDs
    stripe_invoice_id = models.CharField(max_length=255, blank=True)
    invoice_pdf_url = models.URLField(blank=True)

    # Metadata
    notes = models.TextField(blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        db_table = 'invoices'
        ordering = ['-invoice_date', '-created_at']
        indexes = [
            models.Index(fields=['user', '-invoice_date']),
            models.Index(fields=['organization', '-invoice_date']),
            models.Index(fields=['status', '-invoice_date']),
            models.Index(fields=['invoice_number']),
        ]

    def __str__(self):
        return f"Invoice {self.invoice_number} - {self.total} {self.currency}"

    def save(self, *args, **kwargs):
        """Generate invoice number if not exists."""
        if not self.invoice_number:
            from django.utils import timezone
            today = timezone.now().strftime('%Y%m%d')
            last_invoice = Invoice.objects.filter(
                invoice_number__startswith=f'INV-{today}'
            ).order_by('-invoice_number').first()

            if last_invoice:
                last_num = int(last_invoice.invoice_number.split('-')[-1])
                new_num = last_num + 1
            else:
                new_num = 1

            self.invoice_number = f'INV-{today}-{new_num:04d}'

        super().save(*args, **kwargs)

    def is_paid(self):
        """Check if invoice is paid."""
        return self.status == 'PAID'

    def is_overdue(self):
        """Check if invoice is overdue."""
        from django.utils import timezone
        if self.status in ['OPEN'] and self.due_date:
            return timezone.now().date() > self.due_date
        return False
