"""
Django admin configuration for Billing app.
"""

from django.contrib import admin
from .models import Plan, Subscription, Payment, Invoice


@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    """Admin interface for Plan model."""
    list_display = [
        'name', 'price', 'currency', 'billing_interval',
        'max_users', 'max_devices', 'is_active', 'is_popular',
        'trial_days', 'sort_order'
    ]
    list_filter = ['billing_interval', 'is_active', 'is_popular', 'is_custom']
    search_fields = ['name', 'slug', 'description']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['id', 'created_at', 'updated_at']
    fieldsets = (
        ('Plan Details', {
            'fields': ('name', 'slug', 'description', 'sort_order')
        }),
        ('Pricing', {
            'fields': ('price', 'currency', 'billing_interval')
        }),
        ('Limits', {
            'fields': (
                'max_users', 'max_devices', 'max_tickets_per_month',
                'max_storage_gb'
            )
        }),
        ('Features', {
            'fields': (
                'has_ai_support', 'has_remote_access', 'has_integrations',
                'has_analytics', 'has_priority_support', 'features'
            )
        }),
        ('Visibility', {
            'fields': ('is_active', 'is_popular', 'is_custom')
        }),
        ('Trial', {
            'fields': ('trial_days',)
        }),
        ('External IDs', {
            'fields': ('stripe_price_id', 'paystack_plan_code', 'flutterwave_plan_id')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )


@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    """Admin interface for Subscription model."""
    list_display = [
        'user', 'organization', 'plan', 'status',
        'current_period_start', 'current_period_end',
        'next_billing_date', 'auto_renew', 'created_at'
    ]
    list_filter = ['status', 'payment_provider', 'auto_renew', 'cancel_at_period_end']
    search_fields = ['user__email', 'organization__name', 'plan__name']
    readonly_fields = ['id', 'created_at', 'updated_at']
    autocomplete_fields = ['user', 'organization', 'plan']
    fieldsets = (
        ('Subscription', {
            'fields': ('user', 'organization', 'plan', 'status')
        }),
        ('Dates', {
            'fields': (
                'trial_ends_at', 'current_period_start',
                'current_period_end', 'cancelled_at', 'ended_at'
            )
        }),
        ('Billing', {
            'fields': ('billing_cycle_anchor', 'next_billing_date', 'payment_provider')
        }),
        ('External IDs', {
            'fields': (
                'stripe_subscription_id', 'paystack_subscription_code',
                'flutterwave_subscription_id'
            )
        }),
        ('Settings', {
            'fields': ('auto_renew', 'cancel_at_period_end')
        }),
        ('Metadata', {
            'fields': ('metadata', 'id', 'created_at', 'updated_at')
        }),
    )


@admin.register(Payment)
class PaymentAdmin(admin.ModelAdmin):
    """Admin interface for Payment model."""
    list_display = [
        'transaction_id', 'user', 'organization', 'amount',
        'currency', 'status', 'payment_provider', 'paid_at',
        'created_at'
    ]
    list_filter = ['status', 'payment_provider', 'payment_method', 'created_at']
    search_fields = [
        'transaction_id', 'user__email', 'organization__name',
        'customer_email'
    ]
    readonly_fields = ['id', 'transaction_id', 'created_at', 'updated_at']
    autocomplete_fields = ['subscription', 'user', 'organization']
    fieldsets = (
        ('Payment Details', {
            'fields': (
                'subscription', 'user', 'organization', 'amount', 'currency'
            )
        }),
        ('Status', {
            'fields': ('status',)
        }),
        ('Provider', {
            'fields': ('payment_provider', 'payment_method')
        }),
        ('External References', {
            'fields': (
                'transaction_id', 'stripe_payment_intent_id',
                'paystack_reference', 'flutterwave_transaction_id'
            )
        }),
        ('Timestamps', {
            'fields': ('paid_at', 'refunded_at')
        }),
        ('Customer Info', {
            'fields': ('customer_email', 'customer_phone')
        }),
        ('Additional', {
            'fields': ('description', 'receipt_url', 'failure_reason')
        }),
        ('Metadata', {
            'fields': ('metadata', 'id', 'created_at', 'updated_at')
        }),
    )


@admin.register(Invoice)
class InvoiceAdmin(admin.ModelAdmin):
    """Admin interface for Invoice model."""
    list_display = [
        'invoice_number', 'user', 'organization', 'total',
        'currency', 'status', 'invoice_date', 'due_date',
        'paid_at', 'created_at'
    ]
    list_filter = ['status', 'created_at', 'invoice_date']
    search_fields = [
        'invoice_number', 'user__email', 'organization__name'
    ]
    readonly_fields = ['id', 'invoice_number', 'created_at', 'updated_at']
    autocomplete_fields = ['subscription', 'user', 'organization', 'payment']
    fieldsets = (
        ('Invoice Details', {
            'fields': (
                'invoice_number', 'subscription', 'user',
                'organization', 'status'
            )
        }),
        ('Amounts', {
            'fields': ('subtotal', 'tax', 'discount', 'total', 'currency')
        }),
        ('Dates', {
            'fields': ('invoice_date', 'due_date', 'paid_at')
        }),
        ('Payment', {
            'fields': ('payment',)
        }),
        ('Line Items', {
            'fields': ('line_items',)
        }),
        ('External', {
            'fields': ('stripe_invoice_id', 'invoice_pdf_url')
        }),
        ('Notes', {
            'fields': ('notes',)
        }),
        ('Metadata', {
            'fields': ('metadata', 'id', 'created_at', 'updated_at')
        }),
    )
