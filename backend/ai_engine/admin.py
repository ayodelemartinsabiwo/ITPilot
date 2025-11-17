"""
Django admin configuration for AI Engine app.
"""

from django.contrib import admin
from .models import ChatSession, ChatMessage, AIResponse, KnowledgeBase


class ChatMessageInline(admin.TabularInline):
    """Inline admin for chat messages."""
    model = ChatMessage
    extra = 0
    readonly_fields = ['role', 'created_at']
    fields = ['role', 'content', 'model', 'tokens_used', 'response_time_ms', 'created_at']


@admin.register(ChatSession)
class ChatSessionAdmin(admin.ModelAdmin):
    """Admin interface for ChatSession model."""
    list_display = [
        'id', 'user', 'organization', 'title', 'status',
        'context_type', 'message_count', 'rating', 'created_at'
    ]
    list_filter = ['status', 'context_type', 'rating', 'created_at']
    search_fields = ['title', 'user__email', 'organization__name']
    readonly_fields = [
        'id', 'message_count', 'ai_response_count',
        'avg_response_time_ms', 'total_tokens_used',
        'created_at', 'updated_at'
    ]
    autocomplete_fields = ['user', 'organization', 'related_ticket', 'related_device']
    inlines = [ChatMessageInline]
    fieldsets = (
        ('Session Details', {
            'fields': ('user', 'organization', 'title', 'status', 'context_type')
        }),
        ('Related Resources', {
            'fields': ('related_ticket', 'related_device')
        }),
        ('Analytics', {
            'fields': (
                'message_count', 'ai_response_count',
                'avg_response_time_ms', 'total_tokens_used'
            )
        }),
        ('Rating & Feedback', {
            'fields': ('rating', 'feedback')
        }),
        ('Metadata', {
            'fields': ('metadata', 'ended_at', 'id', 'created_at', 'updated_at')
        }),
    )


@admin.register(ChatMessage)
class ChatMessageAdmin(admin.ModelAdmin):
    """Admin interface for ChatMessage model."""
    list_display = [
        'session', 'role', 'content_preview', 'model',
        'tokens_used', 'response_time_ms', 'is_helpful', 'created_at'
    ]
    list_filter = ['role', 'is_helpful', 'created_at']
    search_fields = ['session__id', 'content', 'intent']
    readonly_fields = ['id', 'created_at', 'updated_at']
    autocomplete_fields = ['session']
    fieldsets = (
        ('Message', {
            'fields': ('session', 'role', 'content')
        }),
        ('AI Details', {
            'fields': ('model', 'tokens_used', 'response_time_ms')
        }),
        ('Context & Intent', {
            'fields': ('intent', 'confidence')
        }),
        ('Attachments & References', {
            'fields': ('attachments', 'references')
        }),
        ('Feedback', {
            'fields': ('is_helpful', 'feedback_text')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )

    def content_preview(self, obj):
        """Show content preview."""
        return obj.content[:50] + '...' if len(obj.content) > 50 else obj.content
    content_preview.short_description = 'Content'


@admin.register(AIResponse)
class AIResponseAdmin(admin.ModelAdmin):
    """Admin interface for AIResponse model."""
    list_display = [
        'user', 'model', 'total_tokens', 'response_time_ms',
        'detected_intent', 'was_helpful', 'error_occurred', 'created_at'
    ]
    list_filter = [
        'model', 'detected_sentiment', 'was_helpful',
        'error_occurred', 'needs_human_review', 'created_at'
    ]
    search_fields = ['user__email', 'prompt', 'response_text', 'detected_intent']
    readonly_fields = ['id', 'created_at', 'updated_at']
    autocomplete_fields = ['user', 'chat_message']
    fieldsets = (
        ('User & Message', {
            'fields': ('user', 'chat_message')
        }),
        ('Request', {
            'fields': ('prompt', 'system_prompt', 'model', 'temperature', 'max_tokens')
        }),
        ('Response', {
            'fields': ('response_text', 'finish_reason')
        }),
        ('Token Usage', {
            'fields': ('prompt_tokens', 'completion_tokens', 'total_tokens')
        }),
        ('Performance', {
            'fields': ('response_time_ms', 'api_status_code')
        }),
        ('Classification', {
            'fields': ('detected_intent', 'detected_sentiment', 'confidence_score')
        }),
        ('Action', {
            'fields': ('action_triggered', 'action_params')
        }),
        ('Quality', {
            'fields': ('was_helpful', 'user_feedback', 'needs_human_review')
        }),
        ('Errors', {
            'fields': ('error_occurred', 'error_message', 'error_trace')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )


@admin.register(KnowledgeBase)
class KnowledgeBaseAdmin(admin.ModelAdmin):
    """Admin interface for KnowledgeBase model."""
    list_display = [
        'title', 'category', 'organization', 'author',
        'is_public', 'is_active', 'view_count',
        'helpful_count', 'created_at'
    ]
    list_filter = ['category', 'is_public', 'is_active', 'created_at']
    search_fields = ['title', 'content', 'summary', 'keywords', 'tags']
    readonly_fields = [
        'id', 'view_count', 'helpful_count', 'not_helpful_count',
        'version', 'created_at', 'updated_at'
    ]
    autocomplete_fields = ['organization', 'author']
    fieldsets = (
        ('Content', {
            'fields': ('title', 'summary', 'content', 'category')
        }),
        ('Organization', {
            'fields': ('organization', 'author')
        }),
        ('Search & Discovery', {
            'fields': ('keywords', 'tags')
        }),
        ('Visibility', {
            'fields': ('is_public', 'is_active')
        }),
        ('Analytics', {
            'fields': ('view_count', 'helpful_count', 'not_helpful_count')
        }),
        ('Versioning', {
            'fields': ('version', 'last_reviewed_at')
        }),
        ('Metadata', {
            'fields': ('id', 'created_at', 'updated_at')
        }),
    )
