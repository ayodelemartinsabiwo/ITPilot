"""
WebSocket consumers for AI Engine real-time chat.
"""

import json
import time
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone


class ChatConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for real-time AI chat.
    """

    async def connect(self):
        """Handle WebSocket connection."""
        self.user = self.scope['user']

        # Reject if user is not authenticated
        if not self.user.is_authenticated:
            await self.close()
            return

        self.session_id = self.scope['url_route']['kwargs'].get('session_id')

        # Join session group
        self.session_group_name = f'chat_session_{self.session_id}'

        await self.channel_layer.group_add(
            self.session_group_name,
            self.channel_name
        )

        await self.accept()

        # Send connection confirmation
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Connected to chat session',
            'session_id': str(self.session_id)
        }))

    async def disconnect(self, close_code):
        """Handle WebSocket disconnection."""
        # Leave session group
        if hasattr(self, 'session_group_name'):
            await self.channel_layer.group_discard(
                self.session_group_name,
                self.channel_name
            )

    async def receive(self, text_data):
        """Handle incoming WebSocket messages."""
        try:
            data = json.loads(text_data)
            message_type = data.get('type', 'message')

            if message_type == 'chat_message':
                await self.handle_chat_message(data)
            elif message_type == 'typing_indicator':
                await self.handle_typing_indicator(data)
            else:
                await self.send_error('Unknown message type')

        except json.JSONDecodeError:
            await self.send_error('Invalid JSON')
        except Exception as e:
            await self.send_error(f'Error processing message: {str(e)}')

    async def handle_chat_message(self, data):
        """Handle chat message from user."""
        message_content = data.get('message', '').strip()

        if not message_content:
            await self.send_error('Message cannot be empty')
            return

        # Save user message to database
        user_message = await self.save_user_message(message_content)

        # Broadcast user message to group
        await self.channel_layer.group_send(
            self.session_group_name,
            {
                'type': 'chat_message',
                'message': {
                    'id': str(user_message['id']),
                    'role': 'USER',
                    'content': message_content,
                    'created_at': user_message['created_at']
                }
            }
        )

        # Generate AI response
        await self.generate_ai_response(message_content)

    async def handle_typing_indicator(self, data):
        """Handle typing indicator."""
        is_typing = data.get('is_typing', False)

        # Broadcast typing indicator to group (except sender)
        await self.channel_layer.group_send(
            self.session_group_name,
            {
                'type': 'typing_indicator',
                'user': str(self.user.id),
                'is_typing': is_typing
            }
        )

    async def generate_ai_response(self, user_message):
        """Generate AI response to user message."""
        # Send typing indicator
        await self.send(text_data=json.dumps({
            'type': 'ai_typing',
            'is_typing': True
        }))

        start_time = time.time()

        # TODO: Integrate with actual OpenAI API
        # For now, generate a simple response
        ai_response_text = await self.get_ai_response(user_message)

        response_time_ms = int((time.time() - start_time) * 1000)

        # Save AI message to database
        ai_message = await self.save_ai_message(
            ai_response_text,
            response_time_ms
        )

        # Send AI response
        await self.channel_layer.group_send(
            self.session_group_name,
            {
                'type': 'chat_message',
                'message': {
                    'id': str(ai_message['id']),
                    'role': 'AI',
                    'content': ai_response_text,
                    'response_time_ms': response_time_ms,
                    'created_at': ai_message['created_at']
                }
            }
        )

        # Stop typing indicator
        await self.send(text_data=json.dumps({
            'type': 'ai_typing',
            'is_typing': False
        }))

    async def get_ai_response(self, user_message):
        """Get AI response (placeholder for OpenAI integration)."""
        # TODO: Implement actual OpenAI API integration
        # This is a placeholder
        await self.asyncio_sleep(1)  # Simulate API delay
        return f"I understand you said: '{user_message}'. How can I assist you further?"

    async def asyncio_sleep(self, seconds):
        """Async sleep helper."""
        import asyncio
        await asyncio.sleep(seconds)

    async def chat_message(self, event):
        """Send chat message to WebSocket."""
        await self.send(text_data=json.dumps({
            'type': 'chat_message',
            'message': event['message']
        }))

    async def typing_indicator(self, event):
        """Send typing indicator to WebSocket."""
        # Don't send typing indicator back to sender
        if event['user'] != str(self.user.id):
            await self.send(text_data=json.dumps({
                'type': 'typing_indicator',
                'user': event['user'],
                'is_typing': event['is_typing']
            }))

    async def send_error(self, error_message):
        """Send error message to WebSocket."""
        await self.send(text_data=json.dumps({
            'type': 'error',
            'message': error_message
        }))

    @database_sync_to_async
    def save_user_message(self, content):
        """Save user message to database."""
        from .models import ChatSession, ChatMessage

        session = ChatSession.objects.get(id=self.session_id, user=self.user)
        message = ChatMessage.objects.create(
            session=session,
            role='USER',
            content=content
        )

        # Update session message count
        session.message_count += 1
        session.save(update_fields=['message_count'])

        # Generate title if first message
        if session.message_count == 1:
            session.generate_title()

        return {
            'id': message.id,
            'created_at': message.created_at.isoformat()
        }

    @database_sync_to_async
    def save_ai_message(self, content, response_time_ms):
        """Save AI message to database."""
        from .models import ChatSession, ChatMessage

        session = ChatSession.objects.get(id=self.session_id, user=self.user)
        message = ChatMessage.objects.create(
            session=session,
            role='AI',
            content=content,
            model='gpt-3.5-turbo',  # Example model
            response_time_ms=response_time_ms
        )

        # Update session stats
        session.ai_response_count += 1
        session.message_count += 1
        total_response_time = (session.avg_response_time_ms * (session.ai_response_count - 1)) + response_time_ms
        session.avg_response_time_ms = int(total_response_time / session.ai_response_count)
        session.save(update_fields=['ai_response_count', 'message_count', 'avg_response_time_ms'])

        return {
            'id': message.id,
            'created_at': message.created_at.isoformat()
        }
