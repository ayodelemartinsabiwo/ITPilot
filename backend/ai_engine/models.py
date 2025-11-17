"""
AI Engine models for ITPilot chatbot and AI assistance.
"""

from django.db import models
from common.models import TimeStampedModel


class ChatSession(TimeStampedModel):
    """
    Chat session for AI conversations.
    """
    SESSION_STATUS_CHOICES = [
        ('ACTIVE', 'Active'),
        ('COMPLETED', 'Completed'),
        ('ARCHIVED', 'Archived'),
    ]

    user = models.ForeignKey(
        'authentication.User',
        on_delete=models.CASCADE,
        related_name='chat_sessions'
    )
    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='chat_sessions',
        null=True,
        blank=True
    )

    # Session Details
    title = models.CharField(max_length=255, blank=True)
    status = models.CharField(
        max_length=20,
        choices=SESSION_STATUS_CHOICES,
        default='ACTIVE'
    )

    # Context
    context_type = models.CharField(
        max_length=50,
        choices=[
            ('GENERAL', 'General Support'),
            ('DEVICE', 'Device Issue'),
            ('TICKET', 'Ticket Related'),
            ('TROUBLESHOOTING', 'Troubleshooting'),
            ('ONBOARDING', 'User Onboarding'),
        ],
        default='GENERAL'
    )
    related_ticket = models.ForeignKey(
        'tickets.Ticket',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='chat_sessions'
    )
    related_device = models.ForeignKey(
        'devices.Device',
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='chat_sessions'
    )

    # Analytics
    message_count = models.IntegerField(default=0)
    ai_response_count = models.IntegerField(default=0)
    avg_response_time_ms = models.IntegerField(default=0)
    total_tokens_used = models.IntegerField(default=0)

    # Rating
    rating = models.IntegerField(
        null=True,
        blank=True,
        choices=[(i, i) for i in range(1, 6)]
    )
    feedback = models.TextField(blank=True)

    # Metadata
    metadata = models.JSONField(default=dict, blank=True)
    ended_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'chat_sessions'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['organization', '-created_at']),
            models.Index(fields=['status', '-created_at']),
        ]

    def __str__(self):
        return f"Chat Session {self.id} - {self.user.email}"

    def generate_title(self):
        """Generate session title from first user message."""
        if not self.title:
            first_message = self.messages.filter(
                role='USER'
            ).order_by('created_at').first()
            if first_message:
                # Use first 50 chars of first message as title
                self.title = first_message.content[:50]
                if len(first_message.content) > 50:
                    self.title += '...'
                self.save(update_fields=['title'])


class ChatMessage(TimeStampedModel):
    """
    Individual messages in a chat session.
    """
    ROLE_CHOICES = [
        ('USER', 'User'),
        ('AI', 'AI Assistant'),
        ('SYSTEM', 'System'),
    ]

    session = models.ForeignKey(
        ChatSession,
        on_delete=models.CASCADE,
        related_name='messages'
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    content = models.TextField()

    # AI Response Details
    model = models.CharField(max_length=100, blank=True)  # e.g., gpt-4, gpt-3.5-turbo
    tokens_used = models.IntegerField(default=0)
    response_time_ms = models.IntegerField(default=0)

    # Context & Intent
    intent = models.CharField(max_length=100, blank=True)  # Detected user intent
    confidence = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )  # AI confidence score

    # Attachments & References
    attachments = models.JSONField(default=list, blank=True)
    references = models.JSONField(default=list, blank=True)  # Referenced docs/articles

    # Feedback
    is_helpful = models.BooleanField(null=True, blank=True)
    feedback_text = models.TextField(blank=True)

    class Meta:
        db_table = 'chat_messages'
        ordering = ['created_at']
        indexes = [
            models.Index(fields=['session', 'created_at']),
            models.Index(fields=['role', '-created_at']),
        ]

    def __str__(self):
        return f"{self.role} message in session {self.session.id}"


class AIResponse(TimeStampedModel):
    """
    Detailed AI response tracking for analytics and improvement.
    """
    chat_message = models.OneToOneField(
        ChatMessage,
        on_delete=models.CASCADE,
        related_name='ai_response_details',
        null=True,
        blank=True
    )
    user = models.ForeignKey(
        'authentication.User',
        on_delete=models.CASCADE,
        related_name='ai_responses'
    )

    # Request Details
    prompt = models.TextField()
    system_prompt = models.TextField(blank=True)
    model = models.CharField(max_length=100)
    temperature = models.DecimalField(
        max_digits=3,
        decimal_places=2,
        default=0.7
    )
    max_tokens = models.IntegerField(default=500)

    # Response Details
    response_text = models.TextField()
    finish_reason = models.CharField(max_length=50, blank=True)

    # Token Usage
    prompt_tokens = models.IntegerField(default=0)
    completion_tokens = models.IntegerField(default=0)
    total_tokens = models.IntegerField(default=0)

    # Performance
    response_time_ms = models.IntegerField(default=0)
    api_status_code = models.IntegerField(default=200)

    # Context & Classification
    detected_intent = models.CharField(max_length=100, blank=True)
    detected_sentiment = models.CharField(
        max_length=20,
        choices=[
            ('POSITIVE', 'Positive'),
            ('NEUTRAL', 'Neutral'),
            ('NEGATIVE', 'Negative'),
        ],
        blank=True
    )
    confidence_score = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        null=True,
        blank=True
    )

    # Action Taken
    action_triggered = models.CharField(max_length=100, blank=True)
    action_params = models.JSONField(default=dict, blank=True)

    # Quality Metrics
    was_helpful = models.BooleanField(null=True, blank=True)
    user_feedback = models.TextField(blank=True)
    needs_human_review = models.BooleanField(default=False)

    # Error Tracking
    error_occurred = models.BooleanField(default=False)
    error_message = models.TextField(blank=True)
    error_trace = models.TextField(blank=True)

    class Meta:
        db_table = 'ai_responses'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', '-created_at']),
            models.Index(fields=['model', '-created_at']),
            models.Index(fields=['error_occurred', '-created_at']),
        ]

    def __str__(self):
        return f"AI Response for {self.user.email} - {self.model}"


class KnowledgeBase(TimeStampedModel):
    """
    Knowledge base articles for AI context and user help.
    """
    CATEGORY_CHOICES = [
        ('TROUBLESHOOTING', 'Troubleshooting'),
        ('HOW_TO', 'How To'),
        ('FAQ', 'FAQ'),
        ('BEST_PRACTICES', 'Best Practices'),
        ('POLICY', 'Policy'),
        ('TECHNICAL', 'Technical Documentation'),
    ]

    organization = models.ForeignKey(
        'organizations.Organization',
        on_delete=models.CASCADE,
        related_name='knowledge_base',
        null=True,
        blank=True
    )
    author = models.ForeignKey(
        'authentication.User',
        on_delete=models.SET_NULL,
        null=True,
        related_name='kb_articles_authored'
    )

    # Content
    title = models.CharField(max_length=255)
    content = models.TextField()
    summary = models.TextField(blank=True)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)

    # Search & Discovery
    keywords = models.JSONField(default=list, blank=True)
    tags = models.JSONField(default=list, blank=True)

    # Visibility
    is_public = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)

    # Analytics
    view_count = models.IntegerField(default=0)
    helpful_count = models.IntegerField(default=0)
    not_helpful_count = models.IntegerField(default=0)

    # Versioning
    version = models.IntegerField(default=1)
    last_reviewed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        db_table = 'knowledge_base'
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['organization', 'is_active']),
            models.Index(fields=['category', 'is_active']),
            models.Index(fields=['is_public', 'is_active']),
        ]

    def __str__(self):
        return self.title

    def calculate_helpfulness_ratio(self):
        """Calculate helpfulness ratio."""
        total = self.helpful_count + self.not_helpful_count
        if total == 0:
            return 0
        return (self.helpful_count / total) * 100
