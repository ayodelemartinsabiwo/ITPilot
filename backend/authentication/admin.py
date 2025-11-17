"""
Admin interface for authentication models.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, OTPVerification, RefreshToken, APIKey


@admin.register(User)
class UserAdmin(BaseUserAdmin):
    list_display = ['email', 'full_name', 'role', 'is_active', 'is_email_verified', 'created_at']
    list_filter = ['role', 'is_active', 'is_email_verified', 'created_at']
    search_fields = ['email', 'first_name', 'last_name']
    ordering = ['-created_at']

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Personal Info', {'fields': ('first_name', 'last_name', 'phone', 'profile_picture')}),
        ('Permissions', {'fields': ('role', 'is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('Verification', {'fields': ('is_email_verified', 'is_phone_verified')}),
        ('OAuth', {'fields': ('oauth_provider', 'oauth_id')}),
        ('Settings', {'fields': ('timezone', 'language')}),
        ('Security', {'fields': ('last_login', 'last_login_ip', 'failed_login_attempts', 'account_locked_until')}),
    )

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'first_name', 'last_name', 'password1', 'password2', 'role'),
        }),
    )


@admin.register(OTPVerification)
class OTPVerificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'otp_type', 'is_verified', 'expires_at', 'attempts', 'created_at']
    list_filter = ['otp_type', 'is_verified', 'created_at']
    search_fields = ['user__email', 'email_or_phone']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(APIKey)
class APIKeyAdmin(admin.ModelAdmin):
    list_display = ['name', 'user', 'key_prefix', 'is_active', 'last_used_at', 'created_at']
    list_filter = ['is_active', 'created_at']
    search_fields = ['name', 'user__email']
    readonly_fields = ['key_hash', 'key_prefix', 'created_at', 'last_used_at']
