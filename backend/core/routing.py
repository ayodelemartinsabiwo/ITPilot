"""
WebSocket routing configuration for ITPilot.
"""

from django.urls import path
from notifications.consumers import NotificationConsumer
from remote_access.consumers import RemoteSessionConsumer
from ai_engine.consumers import ChatConsumer

websocket_urlpatterns = [
    path('ws/notifications/', NotificationConsumer.as_asgi()),
    path('ws/remote-session/<str:session_id>/', RemoteSessionConsumer.as_asgi()),
    path('ws/chat/<uuid:session_id>/', ChatConsumer.as_asgi()),
]
