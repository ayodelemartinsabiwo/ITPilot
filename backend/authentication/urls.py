"""
URL configuration for authentication.
"""

from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    UserRegistrationView, LoginView, UserProfileView,
    ChangePasswordView, PasswordResetRequestView,
    PasswordResetConfirmView, VerifyOTPView, APIKeyListCreateView
)

urlpatterns = [
    path('register/', UserRegistrationView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/', UserProfileView.as_view(), name='profile'),
    path('change-password/', ChangePasswordView.as_view(), name='change_password'),
    path('password-reset/request/', PasswordResetRequestView.as_view(), name='password_reset_request'),
    path('password-reset/confirm/', PasswordResetConfirmView.as_view(), name='password_reset_confirm'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify_otp'),
    path('api-keys/', APIKeyListCreateView.as_view(), name='api_keys'),
]
