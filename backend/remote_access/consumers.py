"""
WebSocket consumers for Remote Access real-time sessions.
"""

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from django.utils import timezone


class RemoteSessionConsumer(AsyncWebsocketConsumer):
    """
    WebSocket consumer for remote access sessions.
    """

    async def connect(self):
        """Handle WebSocket connection."""
        self.user = self.scope['user']

        # Reject if user is not authenticated
        if not self.user.is_authenticated:
            await self.close()
            return

        self.session_token = self.scope['url_route']['kwargs'].get('session_token')

        # Verify session access
        has_access = await self.verify_session_access()
        if not has_access:
            await self.close()
            return

        # Join session group
        self.session_group_name = f'remote_session_{self.session_token}'

        await self.channel_layer.group_add(
            self.session_group_name,
            self.channel_name
        )

        await self.accept()

        # Send connection confirmation
        await self.send(text_data=json.dumps({
            'type': 'connection_established',
            'message': 'Connected to remote session',
            'session_token': self.session_token
        }))

        # Log connection
        await self.log_action('CONNECT', 'User connected to session')

    async def disconnect(self, close_code):
        """Handle WebSocket disconnection."""
        # Log disconnection
        if hasattr(self, 'session_token'):
            await self.log_action('DISCONNECT', f'User disconnected (code: {close_code})')

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
            message_type = data.get('type', 'unknown')

            if message_type == 'remote_command':
                await self.handle_remote_command(data)
            elif message_type == 'screen_share':
                await self.handle_screen_share(data)
            elif message_type == 'control_request':
                await self.handle_control_request(data)
            elif message_type == 'cursor_move':
                await self.handle_cursor_move(data)
            elif message_type == 'ping':
                await self.send(text_data=json.dumps({'type': 'pong'}))
            else:
                await self.send_error(f'Unknown message type: {message_type}')

        except json.JSONDecodeError:
            await self.send_error('Invalid JSON')
        except Exception as e:
            await self.send_error(f'Error processing message: {str(e)}')

    async def handle_remote_command(self, data):
        """Handle remote command execution."""
        command = data.get('command', '')

        if not command:
            await self.send_error('Command cannot be empty')
            return

        # Log command
        await self.log_action('COMMAND', f'Executing command: {command}')

        # TODO: Implement actual command execution logic
        # This would integrate with device agent

        # Broadcast command to session participants
        await self.channel_layer.group_send(
            self.session_group_name,
            {
                'type': 'remote_command',
                'command': command,
                'user': str(self.user.id)
            }
        )

    async def handle_screen_share(self, data):
        """Handle screen share frame data."""
        frame_data = data.get('frame')

        if not frame_data:
            return

        # Broadcast screen frame to other participants
        await self.channel_layer.group_send(
            self.session_group_name,
            {
                'type': 'screen_frame',
                'frame': frame_data,
                'user': str(self.user.id)
            }
        )

    async def handle_control_request(self, data):
        """Handle remote control request."""
        action = data.get('action')  # 'grant' or 'revoke'

        await self.log_action(
            'CONTROL_GRANTED' if action == 'grant' else 'CONTROL_REVOKED',
            f'Remote control {action}ed'
        )

        await self.channel_layer.group_send(
            self.session_group_name,
            {
                'type': 'control_status',
                'action': action,
                'user': str(self.user.id)
            }
        )

    async def handle_cursor_move(self, data):
        """Handle cursor movement (for remote control)."""
        x = data.get('x', 0)
        y = data.get('y', 0)

        # Broadcast cursor position to session
        await self.channel_layer.group_send(
            self.session_group_name,
            {
                'type': 'cursor_position',
                'x': x,
                'y': y,
                'user': str(self.user.id)
            }
        )

    async def remote_command(self, event):
        """Send remote command to WebSocket."""
        # Don't send back to sender
        if event.get('user') != str(self.user.id):
            await self.send(text_data=json.dumps({
                'type': 'remote_command',
                'command': event['command'],
                'user': event['user']
            }))

    async def screen_frame(self, event):
        """Send screen frame to WebSocket."""
        # Don't send back to sender
        if event.get('user') != str(self.user.id):
            await self.send(text_data=json.dumps({
                'type': 'screen_frame',
                'frame': event['frame'],
                'user': event['user']
            }))

    async def control_status(self, event):
        """Send control status to WebSocket."""
        await self.send(text_data=json.dumps({
            'type': 'control_status',
            'action': event['action'],
            'user': event['user']
        }))

    async def cursor_position(self, event):
        """Send cursor position to WebSocket."""
        # Don't send back to sender
        if event.get('user') != str(self.user.id):
            await self.send(text_data=json.dumps({
                'type': 'cursor_position',
                'x': event['x'],
                'y': event['y'],
                'user': event['user']
            }))

    async def send_error(self, error_message):
        """Send error message to WebSocket."""
        await self.send(text_data=json.dumps({
            'type': 'error',
            'message': error_message
        }))

    @database_sync_to_async
    def verify_session_access(self):
        """Verify user has access to session."""
        from .models import RemoteSession
        from organizations.models import OrganizationMember

        try:
            session = RemoteSession.objects.get(session_token=self.session_token)

            # Check if user is technician or has access to organization
            if session.technician == self.user:
                return True

            # Check organization membership
            is_member = OrganizationMember.objects.filter(
                organization=session.organization,
                user=self.user,
                is_active=True
            ).exists()

            return is_member

        except RemoteSession.DoesNotExist:
            return False

    @database_sync_to_async
    def log_action(self, action_type, description):
        """Log session action to database."""
        from .models import RemoteSession, SessionLog

        try:
            session = RemoteSession.objects.get(session_token=self.session_token)
            SessionLog.objects.create(
                session=session,
                action_type=action_type,
                description=description,
                user=self.user,
                was_successful=True
            )
        except RemoteSession.DoesNotExist:
            pass
