"""
Serializers for Organizations app.
"""

from rest_framework import serializers
from django.utils.text import slugify
from .models import Organization, OrganizationMember, Domain


class OrganizationSerializer(serializers.ModelSerializer):
    """Serializer for Organization model."""
    member_count = serializers.SerializerMethodField()
    device_count = serializers.SerializerMethodField()
    user_role = serializers.SerializerMethodField()

    class Meta:
        model = Organization
        fields = [
            'id', 'name', 'slug', 'description', 'email', 'phone', 'website',
            'address_line1', 'address_line2', 'city', 'state', 'country',
            'postal_code', 'logo', 'primary_color', 'is_active', 'is_verified',
            'max_members', 'max_devices', 'billing_email', 'tax_id',
            'member_count', 'device_count', 'user_role', 'settings',
            'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'slug', 'is_verified', 'created_at', 'updated_at']

    def get_member_count(self, obj):
        """Get organization member count."""
        return obj.get_member_count()

    def get_device_count(self, obj):
        """Get organization device count."""
        return obj.get_device_count()

    def get_user_role(self, obj):
        """Get current user's role in organization."""
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            member = OrganizationMember.objects.filter(
                organization=obj,
                user=request.user,
                is_active=True
            ).first()
            return member.role if member else None
        return None

    def create(self, validated_data):
        """Auto-generate slug from name."""
        if 'slug' not in validated_data or not validated_data['slug']:
            validated_data['slug'] = slugify(validated_data['name'])
        return super().create(validated_data)


class OrganizationMemberSerializer(serializers.ModelSerializer):
    """Serializer for OrganizationMember model."""
    user_email = serializers.EmailField(source='user.email', read_only=True)
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    user_profile_picture = serializers.ImageField(source='user.profile_picture', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    invited_by_name = serializers.CharField(source='invited_by.full_name', read_only=True)

    class Meta:
        model = OrganizationMember
        fields = [
            'id', 'organization', 'organization_name', 'user', 'user_email',
            'user_name', 'user_profile_picture', 'role', 'title', 'department',
            'is_active', 'invited_by', 'invited_by_name', 'invited_at',
            'joined_at', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'invited_by', 'invited_at', 'joined_at',
            'created_at', 'updated_at'
        ]

    def validate(self, data):
        """Validate organization member data."""
        organization = data.get('organization')
        user = data.get('user')

        # Check if organization can add more members
        if organization and not organization.can_add_member():
            raise serializers.ValidationError({
                'organization': f'Organization has reached maximum member limit of {organization.max_members}'
            })

        # Check if user is already a member
        if organization and user:
            existing = OrganizationMember.objects.filter(
                organization=organization,
                user=user
            ).exists()
            if existing and not self.instance:
                raise serializers.ValidationError({
                    'user': 'User is already a member of this organization'
                })

        return data


class DomainSerializer(serializers.ModelSerializer):
    """Serializer for Domain model."""
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    verification_instructions = serializers.SerializerMethodField()

    class Meta:
        model = Domain
        fields = [
            'id', 'organization', 'organization_name', 'domain', 'is_primary',
            'verification_status', 'verification_token', 'verification_method',
            'verified_at', 'auto_join_enabled', 'auto_join_role',
            'verification_instructions', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'verification_token', 'verification_status', 'verified_at',
            'created_at', 'updated_at'
        ]

    def get_verification_instructions(self, obj):
        """Get domain verification instructions."""
        return obj.get_verification_instructions()

    def validate_domain(self, value):
        """Validate domain format."""
        # Remove protocol if present
        value = value.lower().strip()
        if value.startswith('http://') or value.startswith('https://'):
            raise serializers.ValidationError('Enter domain without protocol (e.g., example.com)')
        if '/' in value:
            raise serializers.ValidationError('Enter domain without path (e.g., example.com)')
        return value


class InviteMemberSerializer(serializers.Serializer):
    """Serializer for inviting members to organization."""
    email = serializers.EmailField()
    role = serializers.ChoiceField(choices=OrganizationMember.ROLE_CHOICES, default='MEMBER')
    title = serializers.CharField(max_length=100, required=False, allow_blank=True)
    department = serializers.CharField(max_length=100, required=False, allow_blank=True)

    def validate_role(self, value):
        """Validate role permissions."""
        if value == 'OWNER':
            raise serializers.ValidationError('Cannot invite members as OWNER. Transfer ownership instead.')
        return value
