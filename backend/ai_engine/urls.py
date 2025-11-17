"""
URL configuration for AI Engine app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ChatSessionViewSet,
    ChatMessageViewSet,
    AIResponseViewSet,
    KnowledgeBaseViewSet
)

app_name = 'ai_engine'

router = DefaultRouter()
router.register(r'sessions', ChatSessionViewSet, basename='session')
router.register(r'messages', ChatMessageViewSet, basename='message')
router.register(r'responses', AIResponseViewSet, basename='response')
router.register(r'knowledge-base', KnowledgeBaseViewSet, basename='knowledge-base')

urlpatterns = [
    path('', include(router.urls)),
]
