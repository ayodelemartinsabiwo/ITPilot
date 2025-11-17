"""
Serializers for authentication.
"""

from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import User, OTPVerification, APIKey


class UserSerializer(serializers.ModelSerializer):
    """Serializer for User model."""

    full_name = serializers.ReadOnlyField()

    class Meta:
        model = User
        fields = [
            'id', 'email', 'phone', 'first_name', 'last_name', 'full_name',
            'role', 'is_active', 'is_email_verified', 'is_phone_verified',
            'profile_picture', 'timezone', 'language', 'created_at', 'updated_at'
        ]
        read_only_fields = ['id', 'role', 'is_active', 'created_at', 'updated_at']


class UserRegistrationSerializer(serializers.ModelSerializer):
    """Serializer for user registration."""

    password = serializers.CharField(
        write_only=True,
        required=True,
        validators=[validate_password]
    )
    password_confirm = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = [
            'email', 'phone', 'first_name', 'last_name',
            'password', 'password_confirm', 'timezone', 'language'
        ]

    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError({
                "password": "Password fields didn't match."
            })
        return attrs

    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user


class LoginSerializer(serializers.Serializer):
    """Serializer for user login."""

    email = serializers.EmailField(required=True)
    password = serializers.CharField(required=True, write_only=True)


class ChangePasswordSerializer(serializers.Serializer):
    """Serializer for changing password."""

    old_password = serializers.CharField(required=True, write_only=True)
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        validators=[validate_password]
    )
    new_password_confirm = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                "new_password": "Password fields didn't match."
            })
        return attrs


class PasswordResetRequestSerializer(serializers.Serializer):
    """Serializer for requesting password reset."""

    email = serializers.EmailField(required=True)


class PasswordResetConfirmSerializer(serializers.Serializer):
    """Serializer for confirming password reset."""

    email = serializers.EmailField(required=True)
    otp_code = serializers.CharField(required=True, max_length=10)
    new_password = serializers.CharField(
        required=True,
        write_only=True,
        validators=[validate_password]
    )
    new_password_confirm = serializers.CharField(required=True, write_only=True)

    def validate(self, attrs):
        if attrs['new_password'] != attrs['new_password_confirm']:
            raise serializers.ValidationError({
                "new_password": "Password fields didn't match."
            })
        return attrs


class OTPVerificationSerializer(serializers.ModelSerializer):
    """Serializer for OTP verification."""

    class Meta:
        model = OTPVerification
        fields = ['id', 'otp_type', 'email_or_phone', 'is_verified', 'expires_at', 'attempts']
        read_only_fields = ['id', 'is_verified', 'attempts']


class VerifyOTPSerializer(serializers.Serializer):
    """Serializer for verifying OTP."""

    email_or_phone = serializers.CharField(required=True)
    otp_code = serializers.CharField(required=True, max_length=10)
    otp_type = serializers.ChoiceField(
        choices=['EMAIL', 'PHONE', 'PASSWORD_RESET', 'TWO_FACTOR'],
        required=True
    )


class APIKeySerializer(serializers.ModelSerializer):
    """Serializer for API keys."""

    class Meta:
        model = APIKey
        fields = [
            'id', 'name', 'key_prefix', 'is_active', 'expires_at',
            'last_used_at', 'permissions', 'created_at'
        ]
        read_only_fields = ['id', 'key_prefix', 'last_used_at', 'created_at']


class CreateAPIKeySerializer(serializers.ModelSerializer):
    """Serializer for creating API keys."""

    class Meta:
        model = APIKey
        fields = ['name', 'expires_at', 'permissions']
