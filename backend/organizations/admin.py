"""
Django admin configuration for Organizations app.
"""

from django.contrib import admin
from .models import Organization, OrganizationMember, Domain


@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    """Admin interface for Organization model."""
    list_display = [
        'name', 'slug', 'email', 'is_active', 'is_verified',
        'max_members', 'max_devices', 'created_at'
    ]
    list_filter = ['is_active', 'is_verified', 'created_at']
    search_fields = ['name', 'slug', 'email', 'phone']
    prepopulated_fields = {'slug': ('name',)}
    readonly_fields = ['id', 'created_at', 'updated_at']
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'description', 'logo', 'primary_color')
        }),
        ('Contact Information', {
            'fields': ('email', 'phone', 'website')
        }),
        ('Address', {
            'fields': (
                'address_line1', 'address_line2', 'city',
                'state', 'country', 'postal_code'
            )
        }),
        ('Settings', {
            'fields': ('is_active', 'is_verified', 'max_members', 'max_devices')
        }),
        ('Billing', {
            'fields': ('billing_email', 'tax_id')
        }),
        ('Metadata', {
            'fields': ('settings', 'id', 'created_at', 'updated_at')
        }),
    )


@admin.register(OrganizationMember)
class OrganizationMemberAdmin(admin.ModelAdmin):
    """Admin interface for OrganizationMember model."""
    list_display = [
        'user', 'organization', 'role', 'title', 'department',
        'is_active', 'joined_at', 'created_at'
    ]
    list_filter = ['role', 'is_active', 'department', 'created_at']
    search_fields = [
        'user__email', 'user__first_name', 'user__last_name',
        'organization__name', 'title', 'department'
    ]
    readonly_fields = ['id', 'invited_at', 'created_at', 'updated_at']
    autocomplete_fields = ['organization', 'user', 'invited_by']
    fieldsets = (
        ('Membership', {
            'fields': ('organization', 'user', 'role', 'is_active')
        }),
        ('Details', {
            'fields': ('title', 'department')
        }),
        ('Invitation', {
            'fields': ('invited_by', 'invited_at', 'joined_at')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )


@admin.register(Domain)
class DomainAdmin(admin.ModelAdmin):
    """Admin interface for Domain model."""
    list_display = [
        'domain', 'organization', 'is_primary', 'verification_status',
        'verification_method', 'verified_at', 'created_at'
    ]
    list_filter = [
        'verification_status', 'verification_method', 'is_primary',
        'auto_join_enabled', 'created_at'
    ]
    search_fields = ['domain', 'organization__name']
    readonly_fields = ['id', 'verification_token', 'verified_at', 'created_at', 'updated_at']
    autocomplete_fields = ['organization']
    fieldsets = (
        ('Domain Information', {
            'fields': ('organization', 'domain', 'is_primary')
        }),
        ('Verification', {
            'fields': (
                'verification_status', 'verification_method',
                'verification_token', 'verified_at'
            )
        }),
        ('Auto-Join Settings', {
            'fields': ('auto_join_enabled', 'auto_join_role')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )
