"""
WebSocket consumers for real-time notifications.
"""

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async


class NotificationConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for real-time notifications.
    """

    async def connect(self):
        """Handle WebSocket connection."""
        self.user = self.scope['user']

        # Reject if user is not authenticated
        if not self.user.is_authenticated:
            await self.close()
            return

        # Join user's notification group
        self.user_group_name = f'user_notifications_{self.user.id}'

        await self.channel_layer.group_add(
            self.user_group_name,
            self.channel_name
        )

        await self.accept()

        # Send connection confirmation
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Connected to notification stream'
        }))

        # Send unread count
        unread_count = await self.get_unread_count()
        await self.send(text_data=json.dumps({
            'type': 'unread_count',
            'count': unread_count
        }))

    async def disconnect(self, close_code):
        """Handle WebSocket disconnection."""
        # Leave user's notification group
        if hasattr(self, 'user_group_name'):
            await self.channel_layer.group_discard(
                self.user_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        """Handle incoming WebSocket messages."""
        try:
            data = json.loads(text_data)
            message_type = data.get('type', 'unknown')

            if message_type == 'mark_as_read':
                await self.handle_mark_as_read(data)
            elif message_type == 'ping':
                await self.send(text_data=json.dumps({'type': 'pong'}))
            else:
                await self.send_error(f'Unknown message type: {message_type}')

        except json.JSONDecodeError:
            await self.send_error('Invalid JSON')
        except Exception as e:
            await self.send_error(f'Error processing message: {str(e)}')

    async def handle_mark_as_read(self, data):
        """Handle marking notification as read."""
        notification_id = data.get('notification_id')

        if not notification_id:
            await self.send_error('notification_id is required')
            return

        success = await self.mark_notification_as_read(notification_id)

        if success:
            # Send updated unread count
            unread_count = await self.get_unread_count()
            await self.send(text_data=json.dumps({
                'type': 'notification_read',
                'notification_id': notification_id,
                'unread_count': unread_count
            }))
        else:
            await self.send_error('Failed to mark notification as read')

    async def notification_message(self, event):
        """Send notification to WebSocket."""
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'notification': event['notification']
        }))

    async def unread_count_update(self, event):
        """Send unread count update to WebSocket."""
        await self.send(text_data=json.dumps({
            'type': 'unread_count',
            'count': event['count']
        }))

    async def send_error(self, error_message):
        """Send error message to WebSocket."""
        await self.send(text_data=json.dumps({
            'type': 'error',
            'message': error_message
        }))

    @database_sync_to_async
    def get_unread_count(self):
        """Get unread notification count for user."""
        from .models import Notification
        return Notification.objects.filter(
            user=self.user,
            is_read=False
        ).count()

    @database_sync_to_async
    def mark_notification_as_read(self, notification_id):
        """Mark notification as read in database."""
        from .models import Notification

        try:
            notification = Notification.objects.get(
                id=notification_id,
                user=self.user
            )
            notification.mark_as_read()
            return True
        except Notification.DoesNotExist:
            return False


# Helper function to send notification via WebSocket
async def send_notification_to_user(user_id, notification_data):
    """
    Send notification to user via WebSocket.
    This should be called from views/signals to push real-time notifications.
    """
    from channels.layers import get_channel_layer
    channel_layer = get_channel_layer()

    await channel_layer.group_send(
        f'user_notifications_{user_id}',
        {
            'type': 'notification_message',
            'notification': notification_data
        }
    )
