"""
Serializers for Billing app.
"""

from rest_framework import serializers
from .models import Plan, Subscription, Payment, Invoice


class PlanSerializer(serializers.ModelSerializer):
    """Serializer for Plan model."""

    class Meta:
        model = Plan
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'currency',
            'billing_interval', 'max_users', 'max_devices',
            'max_tickets_per_month', 'max_storage_gb', 'has_ai_support',
            'has_remote_access', 'has_integrations', 'has_analytics',
            'has_priority_support', 'features', 'is_active', 'is_popular',
            'is_custom', 'trial_days', 'created_at'
        ]
        read_only_fields = ['id', 'created_at']


class SubscriptionSerializer(serializers.ModelSerializer):
    """Serializer for Subscription model."""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    plan_name = serializers.CharField(source='plan.name', read_only=True)
    is_active = serializers.SerializerMethodField()
    days_until_renewal = serializers.SerializerMethodField()

    class Meta:
        model = Subscription
        fields = [
            'id', 'user', 'user_email', 'organization', 'organization_name',
            'plan', 'plan_name', 'status', 'trial_ends_at',
            'current_period_start', 'current_period_end', 'cancelled_at',
            'ended_at', 'billing_cycle_anchor', 'next_billing_date',
            'payment_provider', 'auto_renew', 'cancel_at_period_end',
            'is_active', 'days_until_renewal', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'user', 'created_at', 'updated_at']

    def get_is_active(self, obj):
        """Check if subscription is active."""
        return obj.is_active()

    def get_days_until_renewal(self, obj):
        """Get days until renewal."""
        return obj.days_until_renewal()


class PaymentSerializer(serializers.ModelSerializer):
    """Serializer for Payment model."""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    is_successful = serializers.SerializerMethodField()

    class Meta:
        model = Payment
        fields = [
            'id', 'subscription', 'user', 'user_email', 'organization',
            'organization_name', 'amount', 'currency', 'status',
            'payment_provider', 'payment_method', 'transaction_id',
            'paid_at', 'refunded_at', 'description', 'receipt_url',
            'failure_reason', 'customer_email', 'customer_phone',
            'is_successful', 'created_at'
        ]
        read_only_fields = ['id', 'transaction_id', 'created_at']

    def get_is_successful(self, obj):
        """Check if payment was successful."""
        return obj.is_successful()


class InvoiceSerializer(serializers.ModelSerializer):
    """Serializer for Invoice model."""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    is_paid = serializers.SerializerMethodField()
    is_overdue = serializers.SerializerMethodField()

    class Meta:
        model = Invoice
        fields = [
            'id', 'subscription', 'user', 'user_email', 'organization',
            'organization_name', 'invoice_number', 'status', 'subtotal',
            'tax', 'discount', 'total', 'currency', 'invoice_date',
            'due_date', 'paid_at', 'payment', 'line_items',
            'invoice_pdf_url', 'notes', 'is_paid', 'is_overdue',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'invoice_number', 'created_at', 'updated_at']

    def get_is_paid(self, obj):
        """Check if invoice is paid."""
        return obj.is_paid()

    def get_is_overdue(self, obj):
        """Check if invoice is overdue."""
        return obj.is_overdue()
