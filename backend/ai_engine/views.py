"""
Views for AI Engine app.
"""

from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.utils import timezone
from django.db.models import Q
from organizations.models import OrganizationMember
from .models import ChatSession, ChatMessage, AIResponse, KnowledgeBase
from .serializers import (
    ChatSessionSerializer,
    ChatSessionDetailSerializer,
    ChatMessageSerializer,
    AIResponseSerializer,
    KnowledgeBaseSerializer,
    SendMessageSerializer,
    MarkHelpfulSerializer
)
import time


class ChatSessionViewSet(viewsets.ModelViewSet):
    """ViewSet for ChatSession CRUD operations."""
    permission_classes = [permissions.IsAuthenticated]

    def get_serializer_class(self):
        """Return appropriate serializer based on action."""
        if self.action == 'retrieve':
            return ChatSessionDetailSerializer
        return ChatSessionSerializer

    def get_queryset(self):
        """Get chat sessions for user."""
        user = self.request.user
        if user.is_superuser:
            return ChatSession.objects.all()

        return ChatSession.objects.filter(user=user)

    def perform_create(self, serializer):
        """Create chat session for current user."""
        org_membership = OrganizationMember.objects.filter(
            user=self.request.user,
            is_active=True
        ).first()

        serializer.save(
            user=self.request.user,
            organization=org_membership.organization if org_membership else None
        )

    @action(detail=True, methods=['post'])
    def send_message(self, request, pk=None):
        """Send a message in the chat session."""
        session = self.get_object()
        serializer = SendMessageSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        message_text = serializer.validated_data['message']

        # Create user message
        user_message = ChatMessage.objects.create(
            session=session,
            role='USER',
            content=message_text
        )

        # Update session message count
        session.message_count += 1
        session.save(update_fields=['message_count'])

        # Generate title if first message
        if session.message_count == 1:
            session.generate_title()

        # TODO: Integrate with OpenAI API to generate AI response
        # For now, create a simple response
        start_time = time.time()
        ai_response_text = self._generate_ai_response(message_text, session)
        response_time_ms = int((time.time() - start_time) * 1000)

        # Create AI message
        ai_message = ChatMessage.objects.create(
            session=session,
            role='AI',
            content=ai_response_text,
            model='gpt-3.5-turbo',  # Example model
            response_time_ms=response_time_ms
        )

        # Update session stats
        session.ai_response_count += 1
        session.message_count += 1
        total_response_time = (session.avg_response_time_ms * (session.ai_response_count - 1)) + response_time_ms
        session.avg_response_time_ms = int(total_response_time / session.ai_response_count)
        session.save(update_fields=['ai_response_count', 'message_count', 'avg_response_time_ms'])

        return Response({
            'user_message': ChatMessageSerializer(user_message).data,
            'ai_message': ChatMessageSerializer(ai_message).data
        }, status=status.HTTP_201_CREATED)

    def _generate_ai_response(self, user_message, session):
        """Generate AI response (placeholder for OpenAI integration)."""
        # TODO: Implement actual OpenAI API integration
        # This is a placeholder response
        return f"I understand you said: '{user_message}'. How can I assist you further with your IT support needs?"

    @action(detail=True, methods=['post'])
    def end_session(self, request, pk=None):
        """End the chat session."""
        session = self.get_object()
        session.status = 'COMPLETED'
        session.ended_at = timezone.now()
        session.save()

        return Response(
            ChatSessionDetailSerializer(session).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def rate(self, request, pk=None):
        """Rate the chat session."""
        session = self.get_object()
        rating = request.data.get('rating')
        feedback = request.data.get('feedback', '')

        if not rating or rating not in range(1, 6):
            return Response(
                {'error': 'Rating must be between 1 and 5'},
                status=status.HTTP_400_BAD_REQUEST
            )

        session.rating = rating
        session.feedback = feedback
        session.save()

        return Response(
            ChatSessionSerializer(session).data,
            status=status.HTTP_200_OK
        )


class ChatMessageViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for ChatMessage read operations."""
    serializer_class = ChatMessageSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get chat messages for user's sessions."""
        user = self.request.user
        if user.is_superuser:
            return ChatMessage.objects.all()

        return ChatMessage.objects.filter(
            session__user=user
        ).select_related('session')

    @action(detail=True, methods=['post'])
    def mark_helpful(self, request, pk=None):
        """Mark a message as helpful or not helpful."""
        message = self.get_object()
        serializer = MarkHelpfulSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        message.is_helpful = serializer.validated_data['is_helpful']
        message.feedback_text = serializer.validated_data.get('feedback', '')
        message.save()

        return Response(
            ChatMessageSerializer(message).data,
            status=status.HTTP_200_OK
        )


class AIResponseViewSet(viewsets.ReadOnlyModelViewSet):
    """ViewSet for AIResponse read operations."""
    serializer_class = AIResponseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get AI responses for user."""
        user = self.request.user
        if user.is_superuser:
            return AIResponse.objects.all()

        return AIResponse.objects.filter(user=user)


class KnowledgeBaseViewSet(viewsets.ModelViewSet):
    """ViewSet for KnowledgeBase CRUD operations."""
    serializer_class = KnowledgeBaseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        """Get knowledge base articles."""
        user = self.request.user
        if user.is_superuser:
            return KnowledgeBase.objects.all()

        # Get user's organization
        user_orgs = OrganizationMember.objects.filter(
            user=user,
            is_active=True
        ).values_list('organization_id', flat=True)

        # Return public articles or organization-specific articles
        return KnowledgeBase.objects.filter(
            Q(is_public=True) | Q(organization_id__in=user_orgs),
            is_active=True
        ).distinct()

    def perform_create(self, serializer):
        """Create knowledge base article with current user as author."""
        org_membership = OrganizationMember.objects.filter(
            user=self.request.user,
            is_active=True
        ).first()

        serializer.save(
            author=self.request.user,
            organization=org_membership.organization if org_membership else None
        )

    @action(detail=True, methods=['post'])
    def mark_helpful(self, request, pk=None):
        """Mark article as helpful or not helpful."""
        article = self.get_object()
        is_helpful = request.data.get('is_helpful', True)

        if is_helpful:
            article.helpful_count += 1
        else:
            article.not_helpful_count += 1

        article.save()

        return Response(
            KnowledgeBaseSerializer(article).data,
            status=status.HTTP_200_OK
        )

    @action(detail=True, methods=['post'])
    def increment_view(self, request, pk=None):
        """Increment view count for article."""
        article = self.get_object()
        article.view_count += 1
        article.save(update_fields=['view_count'])

        return Response({'view_count': article.view_count})

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Search knowledge base articles."""
        query = request.query_params.get('q', '')
        category = request.query_params.get('category', '')

        queryset = self.get_queryset()

        if query:
            queryset = queryset.filter(
                Q(title__icontains=query) |
                Q(content__icontains=query) |
                Q(summary__icontains=query)
            )

        if category:
            queryset = queryset.filter(category=category)

        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)
