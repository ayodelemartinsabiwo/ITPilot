"""
URL configuration for Tickets app.
"""

from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import TicketViewSet, TicketMessageViewSet, TicketEscalationViewSet

app_name = 'tickets'

router = DefaultRouter()
router.register(r'tickets', TicketViewSet, basename='ticket')
router.register(r'messages', TicketMessageViewSet, basename='message')
router.register(r'escalations', TicketEscalationViewSet, basename='escalation')

urlpatterns = [
    path('', include(router.urls)),
]
