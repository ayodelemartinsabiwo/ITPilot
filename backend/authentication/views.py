"""
Views for authentication API.
"""

from rest_framework import generics, status, views
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from django.utils import timezone
from datetime import timedelta
from .models import User, OTPVerification, APIKey
from .serializers import (
    UserSerializer, UserRegistrationSerializer, LoginSerializer,
    ChangePasswordSerializer, PasswordResetRequestSerializer,
    PasswordResetConfirmSerializer, VerifyOTPSerializer,
    APIKeySerializer, CreateAPIKeySerializer
)
from common.utils import TokenGenerator, EmailService
from common.models import AuditLog
import hashlib


class UserRegistrationView(generics.CreateAPIView):
    """Register a new user."""
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserRegistrationSerializer

    def create(self, request, *args, **kwargs):
        from django.conf import settings
        from django.utils.text import slugify
        from organizations.models import Organization, OrganizationMember
        import uuid

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Create default organization for the user
        try:
            org_name = f"{user.first_name} {user.last_name}'s Organization"
            org_slug = slugify(f"{user.email}-{uuid.uuid4().hex[:8]}")

            organization = Organization.objects.create(
                name=org_name,
                slug=org_slug,
                email=user.email,
                is_active=True,
                is_verified=True,  # Auto-verify for new users
            )

            # Add user as owner of the organization
            OrganizationMember.objects.create(
                organization=organization,
                user=user,
                role='OWNER',
                is_active=True,
            )
        except Exception as e:
            import logging
            logging.error(f"Error creating organization for user {user.email}: {str(e)}")

        # Check if email is configured
        email_configured = bool(settings.EMAIL_HOST_USER and settings.EMAIL_HOST_PASSWORD)

        try:
            if email_configured:
                # Generate OTP for email verification
                otp_code = TokenGenerator.generate_otp()
                OTPVerification.objects.create(
                    user=user,
                    otp_type='EMAIL',
                    otp_code=otp_code,
                    email_or_phone=user.email,
                    expires_at=timezone.now() + timedelta(minutes=15)
                )

                # Send verification email asynchronously (non-blocking)
                EmailService.send_email_async(
                    subject='Verify your ITPilot account',
                    to_email=user.email,
                    template_name='email_verification',
                    context={'user': user, 'otp_code': otp_code}
                )

                message = 'User registered successfully. Please check your email for verification code.'
            else:
                # Email not configured - auto-verify user
                user.is_email_verified = True
                user.save()
                message = 'User registered successfully. You can log in now.'

        except Exception as e:
            # Log error but don't fail registration - auto-verify on error
            import logging
            logging.error(f"Error during OTP/email process: {str(e)}")
            user.is_email_verified = True
            user.save()
            message = 'User registered successfully. You can log in now.'

        return Response({
            'success': True,
            'message': message,
            'data': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)


class LoginView(views.APIView):
    """User login."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = authenticate(
            email=serializer.validated_data['email'],
            password=serializer.validated_data['password']
        )

        if not user:
            return Response({
                'success': False,
                'message': 'Invalid credentials'
            }, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_active:
            return Response({
                'success': False,
                'message': 'Account is inactive'
            }, status=status.HTTP_403_FORBIDDEN)

        # Generate tokens
        refresh = RefreshToken.for_user(user)

        # Log login
        AuditLog.objects.create(
            user=user,
            action='LOGIN',
            resource_type='authentication',
            ip_address=request.META.get('REMOTE_ADDR'),
            status='success'
        )

        return Response({
            'success': True,
            'message': 'Login successful',
            'data': {
                'user': UserSerializer(user).data,
                'tokens': {
                    'access': str(refresh.access_token),
                    'refresh': str(refresh)
                }
            }
        })


class UserProfileView(generics.RetrieveUpdateAPIView):
    """Get or update user profile."""
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class ChangePasswordView(views.APIView):
    """Change user password."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = ChangePasswordSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user

        if not user.check_password(serializer.validated_data['old_password']):
            return Response({
                'success': False,
                'message': 'Old password is incorrect'
            }, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(serializer.validated_data['new_password'])
        user.save()

        return Response({
            'success': True,
            'message': 'Password changed successfully'
        })


class PasswordResetRequestView(views.APIView):
    """Request password reset."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = User.objects.get(email=serializer.validated_data['email'])
        except User.DoesNotExist:
            # Don't reveal if email exists
            return Response({
                'success': True,
                'message': 'If the email exists, a reset code has been sent.'
            })

        # Generate OTP
        otp_code = TokenGenerator.generate_otp()
        OTPVerification.objects.create(
            user=user,
            otp_type='PASSWORD_RESET',
            otp_code=otp_code,
            email_or_phone=user.email,
            expires_at=timezone.now() + timedelta(minutes=15)
        )

        # Send reset email asynchronously (non-blocking)
        EmailService.send_email_async(
            subject='Password Reset - ITPilot',
            to_email=user.email,
            template_name='password_reset',
            context={'user': user, 'otp_code': otp_code}
        )

        return Response({
            'success': True,
            'message': 'If the email exists, a reset code has been sent.'
        })


class PasswordResetConfirmView(views.APIView):
    """Confirm password reset with OTP."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = PasswordResetConfirmSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            user = User.objects.get(email=serializer.validated_data['email'])
            otp = OTPVerification.objects.filter(
                user=user,
                otp_type='PASSWORD_RESET',
                otp_code=serializer.validated_data['otp_code'],
                is_verified=False
            ).latest('created_at')

            if not otp.can_attempt():
                return Response({
                    'success': False,
                    'message': 'OTP expired or maximum attempts exceeded'
                }, status=status.HTTP_400_BAD_REQUEST)

            otp.is_verified = True
            otp.save()

            user.set_password(serializer.validated_data['new_password'])
            user.save()

            return Response({
                'success': True,
                'message': 'Password reset successfully'
            })

        except (User.DoesNotExist, OTPVerification.DoesNotExist):
            return Response({
                'success': False,
                'message': 'Invalid OTP or email'
            }, status=status.HTTP_400_BAD_REQUEST)


class VerifyOTPView(views.APIView):
    """Verify OTP code."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = VerifyOTPSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        try:
            otp = OTPVerification.objects.filter(
                user=request.user,
                otp_type=serializer.validated_data['otp_type'],
                otp_code=serializer.validated_data['otp_code'],
                is_verified=False
            ).latest('created_at')

            if not otp.can_attempt():
                return Response({
                    'success': False,
                    'message': 'OTP expired or maximum attempts exceeded'
                }, status=status.HTTP_400_BAD_REQUEST)

            otp.is_verified = True
            otp.save()

            # Update user verification status
            if otp.otp_type == 'EMAIL':
                request.user.is_email_verified = True
            elif otp.otp_type == 'PHONE':
                request.user.is_phone_verified = True

            request.user.save()

            return Response({
                'success': True,
                'message': 'Verification successful'
            })

        except OTPVerification.DoesNotExist:
            return Response({
                'success': False,
                'message': 'Invalid OTP'
            }, status=status.HTTP_400_BAD_REQUEST)


class APIKeyListCreateView(generics.ListCreateAPIView):
    """List and create API keys."""
    permission_classes = [IsAuthenticated]
    serializer_class = APIKeySerializer

    def get_queryset(self):
        return APIKey.objects.filter(user=self.request.user)

    def get_serializer_class(self):
        if self.request.method == 'POST':
            return CreateAPIKeySerializer
        return APIKeySerializer

    def perform_create(self, serializer):
        # Generate API key
        api_key = TokenGenerator.generate_api_key()
        key_hash = hashlib.sha256(api_key.encode()).hexdigest()
        key_prefix = api_key[:8]

        api_key_obj = serializer.save(
            user=self.request.user,
            key_hash=key_hash,
            key_prefix=key_prefix
        )

        # Return the full key only once
        self.api_key_created = api_key


class DashboardStatsView(views.APIView):
    """Get dashboard statistics for the authenticated user."""
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from devices.models import Device
        from tickets.models import Ticket
        from organizations.models import OrganizationMember
        from django.db.models import Q, Count
        from datetime import timedelta

        user = request.user

        # Get user's organizations
        user_orgs = OrganizationMember.objects.filter(
            user=user,
            is_active=True
        ).values_list('organization_id', flat=True)

        # Get devices count
        devices_query = Device.objects.filter(
            Q(organization_id__in=user_orgs) | Q(user=user)
        ).distinct()

        total_devices = devices_query.count()
        online_devices = devices_query.filter(status='ONLINE').count()
        offline_devices = devices_query.filter(status='OFFLINE').count()

        # Get tickets statistics
        tickets_query = Ticket.objects.filter(
            Q(created_by=user) |
            Q(assigned_to=user) |
            Q(organization_id__in=user_orgs)
        ).distinct()

        total_tickets = tickets_query.count()
        open_tickets = tickets_query.filter(status='OPEN').count()
        in_progress_tickets = tickets_query.filter(status='IN_PROGRESS').count()
        resolved_tickets = tickets_query.filter(status='RESOLVED').count()

        # Get recent tickets (last 7 days)
        seven_days_ago = timezone.now() - timedelta(days=7)
        recent_tickets = tickets_query.filter(
            created_at__gte=seven_days_ago
        ).count()

        # Get tickets by priority
        tickets_by_priority = tickets_query.values('priority').annotate(
            count=Count('id')
        )
        priority_stats = {item['priority']: item['count'] for item in tickets_by_priority}

        # Get recent activity (last 5 tickets)
        recent_activity = tickets_query.order_by('-created_at')[:5].values(
            'id', 'ticket_number', 'title', 'status', 'priority', 'created_at'
        )

        return Response({
            'success': True,
            'data': {
                'devices': {
                    'total': total_devices,
                    'online': online_devices,
                    'offline': offline_devices,
                },
                'tickets': {
                    'total': total_tickets,
                    'open': open_tickets,
                    'in_progress': in_progress_tickets,
                    'resolved': resolved_tickets,
                    'recent': recent_tickets,
                    'by_priority': {
                        'low': priority_stats.get('LOW', 0),
                        'medium': priority_stats.get('MEDIUM', 0),
                        'high': priority_stats.get('HIGH', 0),
                        'critical': priority_stats.get('CRITICAL', 0),
                    }
                },
                'recent_activity': list(recent_activity),
                'user': {
                    'full_name': user.full_name,
                    'email': user.email,
                    'role': user.role,
                }
            }
        })

