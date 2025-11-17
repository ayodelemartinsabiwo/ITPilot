"""
Views for Organizations app.
"""

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db import transaction
from django.utils import timezone
from authentication.models import User
from .models import Organization, OrganizationMember, Domain
from .serializers import (
    OrganizationSerializer,
    OrganizationMemberSerializer,
    DomainSerializer,
    InviteMemberSerializer
)
import secrets


class OrganizationViewSet(viewsets.ModelViewSet):
    """ViewSet for Organization CRUD operations."""
    serializer_class = OrganizationSerializer
    permission_classes = [permissions.IsAuthenticated]
    lookup_field = 'id'

    def get_queryset(self):
        """Get organizations where user is a member."""
        user = self.request.user
        if user.is_superuser:
            return Organization.objects.all()
        return Organization.objects.filter(
            members__user=user,
            members__is_active=True
        ).distinct()

    @transaction.atomic
    def perform_create(self, serializer):
        """Create organization and add creator as owner."""
        organization = serializer.save()
        # Add creator as owner
        OrganizationMember.objects.create(
            organization=organization,
            user=self.request.user,
            role='OWNER',
            is_active=True,
            invited_by=self.request.user,
            joined_at=timezone.now()
        )

    @action(detail=True, methods=['post'])
    def invite_member(self, request, id=None):
        """Invite a user to join the organization."""
        organization = self.get_object()
        serializer = InviteMemberSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        # Check if user has permission to invite
        member = OrganizationMember.objects.filter(
            organization=organization,
            user=request.user,
            is_active=True
        ).first()

        if not member or not member.can_manage_members():
            return Response(
                {'error': 'You do not have permission to invite members'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Check if organization can add more members
        if not organization.can_add_member():
            return Response(
                {'error': f'Organization has reached maximum member limit of {organization.max_members}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        email = serializer.validated_data['email']
        role = serializer.validated_data['role']
        title = serializer.validated_data.get('title', '')
        department = serializer.validated_data.get('department', '')

        # Get or create user
        user, created = User.objects.get_or_create(
            email=email,
            defaults={
                'first_name': email.split('@')[0],
                'last_name': '',
            }
        )

        # Check if user is already a member
        existing_member = OrganizationMember.objects.filter(
            organization=organization,
            user=user
        ).first()

        if existing_member:
            if existing_member.is_active:
                return Response(
                    {'error': 'User is already a member of this organization'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            else:
                # Reactivate membership
                existing_member.is_active = True
                existing_member.role = role
                existing_member.title = title
                existing_member.department = department
                existing_member.invited_by = request.user
                existing_member.invited_at = timezone.now()
                existing_member.save()
                return Response(
                    OrganizationMemberSerializer(existing_member).data,
                    status=status.HTTP_200_OK
                )

        # Create new membership
        new_member = OrganizationMember.objects.create(
            organization=organization,
            user=user,
            role=role,
            title=title,
            department=department,
            is_active=True,
            invited_by=request.user,
            joined_at=timezone.now() if not created else None
        )

        return Response(
            OrganizationMemberSerializer(new_member).data,
            status=status.HTTP_201_CREATED
        )

    @action(detail=True, methods=['get'])
    def members(self, request, id=None):
        """Get all members of the organization."""
        organization = self.get_object()
        members = OrganizationMember.objects.filter(
            organization=organization,
            is_active=True
        ).select_related('user', 'invited_by')
        serializer = OrganizationMemberSerializer(members, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def domains(self, request, id=None):
        """Get all domains of the organization."""
        organization = self.get_object()
        domains = Domain.objects.filter(organization=organization)
        serializer = DomainSerializer(domains, many=True)
        return Response(serializer.data)


class OrganizationMemberViewSet(viewsets.ModelViewSet):
    """ViewSet for OrganizationMember CRUD operations."""
    serializer_class = OrganizationMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get members of organizations where user has access."""
        user = self.request.user
        if user.is_superuser:
            return OrganizationMember.objects.all()

        # Get organizations where user is admin
        admin_orgs = OrganizationMember.objects.filter(
            user=user,
            role__in=['OWNER', 'ADMIN'],
            is_active=True
        ).values_list('organization_id', flat=True)

        return OrganizationMember.objects.filter(
            organization_id__in=admin_orgs
        )

    @action(detail=True, methods=['post'])
    def deactivate(self, request, pk=None):
        """Deactivate (remove) a member from organization."""
        member = self.get_object()

        # Check if requester has permission
        requester_member = OrganizationMember.objects.filter(
            organization=member.organization,
            user=request.user,
            is_active=True
        ).first()

        if not requester_member or not requester_member.can_manage_members():
            return Response(
                {'error': 'You do not have permission to remove members'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Prevent removing the last owner
        if member.role == 'OWNER':
            owner_count = OrganizationMember.objects.filter(
                organization=member.organization,
                role='OWNER',
                is_active=True
            ).count()
            if owner_count <= 1:
                return Response(
                    {'error': 'Cannot remove the last owner. Transfer ownership first.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        member.is_active = False
        member.save()

        return Response(
            {'message': 'Member removed successfully'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def change_role(self, request, pk=None):
        """Change a member's role."""
        member = self.get_object()
        new_role = request.data.get('role')

        if new_role not in dict(OrganizationMember.ROLE_CHOICES).keys():
            return Response(
                {'error': 'Invalid role'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if requester has permission
        requester_member = OrganizationMember.objects.filter(
            organization=member.organization,
            user=request.user,
            is_active=True
        ).first()

        if not requester_member or not requester_member.is_owner():
            return Response(
                {'error': 'Only owners can change member roles'},
                status=status.HTTP_403_FORBIDDEN
            )

        # Prevent removing the last owner
        if member.role == 'OWNER' and new_role != 'OWNER':
            owner_count = OrganizationMember.objects.filter(
                organization=member.organization,
                role='OWNER',
                is_active=True
            ).count()
            if owner_count <= 1:
                return Response(
                    {'error': 'Cannot change role of the last owner. Add another owner first.'},
                    status=status.HTTP_400_BAD_REQUEST
                )

        member.role = new_role
        member.save()

        return Response(
            OrganizationMemberSerializer(member).data,
            status=status.HTTP_200_OK
        )


class DomainViewSet(viewsets.ModelViewSet):
    """ViewSet for Domain CRUD operations."""
    serializer_class = DomainSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get domains of organizations where user is admin."""
        user = self.request.user
        if user.is_superuser:
            return Domain.objects.all()

        # Get organizations where user is admin
        admin_orgs = OrganizationMember.objects.filter(
            user=user,
            role__in=['OWNER', 'ADMIN'],
            is_active=True
        ).values_list('organization_id', flat=True)

        return Domain.objects.filter(organization_id__in=admin_orgs)

    def perform_create(self, serializer):
        """Generate verification token when creating domain."""
        serializer.save(
            verification_token=secrets.token_urlsafe(32)
        )

    @action(detail=True, methods=['post'])
    def verify(self, request, pk=None):
        """Verify domain ownership."""
        domain = self.get_object()

        # TODO: Implement actual domain verification logic
        # This should check DNS records, HTML files, or meta tags
        # For now, we'll just mark as verified

        domain.verification_status = 'VERIFIED'
        domain.verified_at = timezone.now()
        domain.save()

        # If this is the first verified domain, set as primary
        if not domain.organization.domains.filter(is_primary=True).exists():
            domain.is_primary = True
            domain.save()

        return Response(
            {'message': 'Domain verified successfully'},
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def set_primary(self, request, pk=None):
        """Set domain as primary for organization."""
        domain = self.get_object()

        if not domain.is_verified():
            return Response(
                {'error': 'Only verified domains can be set as primary'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Unset other primary domains
        Domain.objects.filter(
            organization=domain.organization,
            is_primary=True
        ).update(is_primary=False)

        domain.is_primary = True
        domain.save()

        return Response(
            {'message': 'Domain set as primary successfully'},
            status=status.HTTP_200_OK
        )
