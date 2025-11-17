"""
Serializers for AI Engine app.
"""

from rest_framework import serializers
from .models import ChatSession, ChatMessage, AIResponse, KnowledgeBase


class ChatMessageSerializer(serializers.ModelSerializer):
    """Serializer for ChatMessage model."""

    class Meta:
        model = ChatMessage
        fields = [
            'id', 'session', 'role', 'content', 'model', 'tokens_used',
            'response_time_ms', 'intent', 'confidence', 'attachments',
            'references', 'is_helpful', 'feedback_text', 'created_at'
        ]
        read_only_fields = [
            'id', 'model', 'tokens_used', 'response_time_ms',
            'intent', 'confidence', 'created_at'
        ]


class ChatSessionSerializer(serializers.ModelSerializer):
    """Serializer for ChatSession model."""
    user_name = serializers.CharField(source='user.full_name', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    latest_message = serializers.SerializerMethodField()

    class Meta:
        model = ChatSession
        fields = [
            'id', 'user', 'user_name', 'organization', 'organization_name',
            'title', 'status', 'context_type', 'related_ticket',
            'related_device', 'message_count', 'ai_response_count',
            'avg_response_time_ms', 'total_tokens_used', 'rating',
            'feedback', 'metadata', 'latest_message', 'ended_at',
            'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'user', 'organization', 'message_count',
            'ai_response_count', 'avg_response_time_ms',
            'total_tokens_used', 'created_at', 'updated_at'
        ]

    def get_latest_message(self, obj):
        """Get the latest message in the session."""
        latest = obj.messages.order_by('-created_at').first()
        if latest:
            return {
                'content': latest.content[:100],
                'role': latest.role,
                'created_at': latest.created_at
            }
        return None


class ChatSessionDetailSerializer(ChatSessionSerializer):
    """Detailed chat session serializer with messages."""
    messages = ChatMessageSerializer(many=True, read_only=True)

    class Meta(ChatSessionSerializer.Meta):
        fields = ChatSessionSerializer.Meta.fields + ['messages']


class AIResponseSerializer(serializers.ModelSerializer):
    """Serializer for AIResponse model."""
    user_email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = AIResponse
        fields = [
            'id', 'user', 'user_email', 'prompt', 'system_prompt',
            'model', 'temperature', 'max_tokens', 'response_text',
            'finish_reason', 'prompt_tokens', 'completion_tokens',
            'total_tokens', 'response_time_ms', 'api_status_code',
            'detected_intent', 'detected_sentiment', 'confidence_score',
            'action_triggered', 'action_params', 'was_helpful',
            'user_feedback', 'needs_human_review', 'error_occurred',
            'error_message', 'created_at'
        ]
        read_only_fields = ['id', 'user', 'created_at']


class KnowledgeBaseSerializer(serializers.ModelSerializer):
    """Serializer for KnowledgeBase model."""
    author_name = serializers.CharField(source='author.full_name', read_only=True)
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    helpfulness_ratio = serializers.SerializerMethodField()

    class Meta:
        model = KnowledgeBase
        fields = [
            'id', 'organization', 'organization_name', 'author',
            'author_name', 'title', 'content', 'summary', 'category',
            'keywords', 'tags', 'is_public', 'is_active', 'view_count',
            'helpful_count', 'not_helpful_count', 'helpfulness_ratio',
            'version', 'last_reviewed_at', 'created_at', 'updated_at'
        ]
        read_only_fields = [
            'id', 'author', 'view_count', 'helpful_count',
            'not_helpful_count', 'version', 'created_at', 'updated_at'
        ]

    def get_helpfulness_ratio(self, obj):
        """Get helpfulness ratio."""
        return obj.calculate_helpfulness_ratio()


class SendMessageSerializer(serializers.Serializer):
    """Serializer for sending a chat message."""
    session_id = serializers.UUIDField(required=False, allow_null=True)
    message = serializers.CharField()
    context_type = serializers.CharField(required=False, default='GENERAL')
    related_ticket_id = serializers.UUIDField(required=False, allow_null=True)
    related_device_id = serializers.UUIDField(required=False, allow_null=True)


class MarkHelpfulSerializer(serializers.Serializer):
    """Serializer for marking a message as helpful/not helpful."""
    is_helpful = serializers.BooleanField()
    feedback = serializers.CharField(required=False, allow_blank=True)
