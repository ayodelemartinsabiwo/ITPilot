"""
Custom exception handlers for ITPilot.
"""

from rest_framework.views import exception_handler
from rest_framework.response import Response
from rest_framework import status
import logging

logger = logging.getLogger(__name__)


def custom_exception_handler(exc, context):
    """
    Custom exception handler that provides consistent error responses.
    """
    # Call REST framework's default exception handler first
    response = exception_handler(exc, context)

    if response is not None:
        # Customize the response data
        custom_response_data = {
            'success': False,
            'errors': response.data,
            'status_code': response.status_code,
        }
        response.data = custom_response_data
    else:
        # Handle unexpected exceptions
        logger.exception(f"Unhandled exception: {exc}")
        response = Response(
            {
                'success': False,
                'errors': {'detail': 'An unexpected error occurred. Please try again later.'},
                'status_code': status.HTTP_500_INTERNAL_SERVER_ERROR,
            },
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

    return response


class ITPilotException(Exception):
    """Base exception class for ITPilot."""
    default_message = "An error occurred"
    default_code = "error"

    def __init__(self, message=None, code=None):
        self.message = message or self.default_message
        self.code = code or self.default_code
        super().__init__(self.message)


class OrganizationNotFoundException(ITPilotException):
    default_message = "Organization not found"
    default_code = "organization_not_found"


class DeviceNotFoundException(ITPilotException):
    default_message = "Device not found"
    default_code = "device_not_found"


class TicketNotFoundException(ITPilotException):
    default_message = "Ticket not found"
    default_code = "ticket_not_found"


class RemoteSessionException(ITPilotException):
    default_message = "Remote session error"
    default_code = "remote_session_error"


class IntegrationException(ITPilotException):
    default_message = "Integration error"
    default_code = "integration_error"


class BillingException(ITPilotException):
    default_message = "Billing error"
    default_code = "billing_error"
