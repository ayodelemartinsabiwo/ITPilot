"""
Views for Billing app.
"""

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q
from organizations.models import OrganizationMember
from .models import Plan, Subscription, Payment, Invoice
from .serializers import (
    PlanSerializer,
    SubscriptionSerializer,
    PaymentSerializer,
    InvoiceSerializer
)


class PlanViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Plan read operations."""
    serializer_class = PlanSerializer
    permission_classes = [permissions.AllowAny]  # Plans are public
    queryset = Plan.objects.filter(is_active=True)
    lookup_field = 'slug'


class SubscriptionViewSet(viewsets.ModelViewSet):
    """ViewSet for Subscription CRUD operations."""
    serializer_class = SubscriptionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get subscriptions for user."""
        user = self.request.user
        if user.is_superuser:
            return Subscription.objects.all()

        user_orgs = OrganizationMember.objects.filter(
            user=user,
            is_active=True
        ).values_list('organization_id', flat=True)

        return Subscription.objects.filter(
            Q(user=user) | Q(organization_id__in=user_orgs)
        ).select_related('user', 'organization', 'plan').distinct()

    @action(detail=True, methods=['post'])
    def cancel(self, request, pk=None):
        """Cancel subscription."""
        subscription = self.get_object()

        if subscription.status in ['CANCELLED', 'EXPIRED']:
            return Response(
                {'error': 'Subscription is already cancelled or expired'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Set to cancel at period end
        from django.utils import timezone
        subscription.cancel_at_period_end = True
        subscription.cancelled_at = timezone.now()
        subscription.save()

        return Response(
            SubscriptionSerializer(subscription).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def reactivate(self, request, pk=None):
        """Reactivate a cancelled subscription."""
        subscription = self.get_object()

        if not subscription.cancel_at_period_end:
            return Response(
                {'error': 'Subscription is not set to cancel'},
                status=status.HTTP_400_BAD_REQUEST
            )

        subscription.cancel_at_period_end = False
        subscription.cancelled_at = None
        subscription.save()

        return Response(
            SubscriptionSerializer(subscription).data,
            status=status.HTTP_200_OK
        )

    @action(detail=False, methods=['get'], url_path='my-subscription')
    def my_subscription(self, request):
        """Get current user's active subscription."""
        user = request.user

        # Try to find user's active subscription
        subscription = Subscription.objects.filter(
            user=user,
            status='ACTIVE'
        ).select_related('plan').first()

        # If no direct subscription, check organization subscription
        if not subscription:
            user_orgs = OrganizationMember.objects.filter(
                user=user,
                is_active=True
            ).values_list('organization_id', flat=True)

            subscription = Subscription.objects.filter(
                organization_id__in=user_orgs,
                status='ACTIVE'
            ).select_related('plan', 'organization').first()

        if not subscription:
            return Response(
                {
                    'success': True,
                    'subscription': None,
                    'message': 'No active subscription found'
                },
                status=status.HTTP_200_OK
            )

        return Response(
            {
                'success': True,
                'subscription': SubscriptionSerializer(subscription).data
            },
            status=status.HTTP_200_OK
        )


class PaymentViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Payment read operations."""
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get payments for user."""
        user = self.request.user
        if user.is_superuser:
            return Payment.objects.all()

        user_orgs = OrganizationMember.objects.filter(
            user=user,
            is_active=True
        ).values_list('organization_id', flat=True)

        return Payment.objects.filter(
            Q(user=user) | Q(organization_id__in=user_orgs)
        ).select_related('user', 'organization', 'subscription').distinct()


class InvoiceViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for Invoice read operations."""
    serializer_class = InvoiceSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get invoices for user."""
        user = self.request.user
        if user.is_superuser:
            return Invoice.objects.all()

        user_orgs = OrganizationMember.objects.filter(
            user=user,
            is_active=True
        ).values_list('organization_id', flat=True)

        return Invoice.objects.filter(
            Q(user=user) | Q(organization_id__in=user_orgs)
        ).select_related('user', 'organization', 'subscription', 'payment').distinct()

    @action(detail=True, methods=['get'])
    def download(self, request, pk=None):
        """Get invoice PDF download link."""
        invoice = self.get_object()

        if invoice.invoice_pdf_url:
            return Response({
                'download_url': invoice.invoice_pdf_url
            })

        # TODO: Generate PDF if not exists
        return Response(
            {'error': 'Invoice PDF not available'},
            status=status.HTTP_404_NOT_FOUND
        )
