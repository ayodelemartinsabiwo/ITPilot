"""
Custom middleware for ITPilot.
"""

from django.utils.deprecation import MiddlewareMixin
from django.core.cache import cache
from django.http import JsonResponse
from .models import AuditLog
import logging

logger = logging.getLogger(__name__)


class TenantMiddleware(MiddlewareMixin):
    """
    Middleware to handle multi-tenancy.
    Extracts organization context from request headers.
    """
    def process_request(self, request):
        organization_id = request.headers.get('X-Organization-Id')

        if organization_id:
            request.organization_id = organization_id
        else:
            request.organization_id = None

        return None


class AuditLogMiddleware(MiddlewareMixin):
    """
    Middleware to log important API requests for compliance.
    """
    LOGGED_METHODS = ['POST', 'PUT', 'PATCH', 'DELETE']
    EXCLUDED_PATHS = ['/api/schema/', '/api/docs/', '/api/redoc/', '/admin/jsi18n/']

    def process_response(self, request, response):
        # Skip logging for excluded paths and methods
        if request.method not in self.LOGGED_METHODS:
            return response

        if any(request.path.startswith(path) for path in self.EXCLUDED_PATHS):
            return response

        # Skip if user is not authenticated
        if not hasattr(request, 'user') or not request.user.is_authenticated:
            return response

        try:
            # Extract relevant information
            user = request.user
            ip_address = self.get_client_ip(request)
            user_agent = request.META.get('HTTP_USER_AGENT', '')

            # Determine resource type from path
            resource_type = self.extract_resource_type(request.path)

            # Map HTTP method to action
            action_map = {
                'POST': 'CREATE',
                'PUT': 'UPDATE',
                'PATCH': 'UPDATE',
                'DELETE': 'DELETE',
            }
            action = action_map.get(request.method, 'ACCESS')

            # Create audit log asynchronously
            AuditLog.objects.create(
                user=user,
                organization_id=getattr(request, 'organization_id', None),
                action=action,
                resource_type=resource_type,
                ip_address=ip_address,
                user_agent=user_agent,
                details={
                    'method': request.method,
                    'path': request.path,
                    'status_code': response.status_code,
                },
                status='success' if 200 <= response.status_code < 400 else 'failed'
            )
        except Exception as e:
            logger.error(f"Error creating audit log: {str(e)}")

        return response

    @staticmethod
    def get_client_ip(request):
        """Extract client IP address from request."""
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return ip

    @staticmethod
    def extract_resource_type(path):
        """Extract resource type from URL path."""
        parts = path.strip('/').split('/')
        if len(parts) >= 3:
            return parts[2]
        return 'unknown'


class RateLimitMiddleware(MiddlewareMixin):
    """
    Custom rate limiting middleware using Redis cache.
    """
    def process_request(self, request):
        # Skip rate limiting for certain paths
        excluded_paths = ['/api/schema/', '/api/docs/', '/api/redoc/', '/admin/']
        if any(request.path.startswith(path) for path in excluded_paths):
            return None

        # Get client identifier
        client_id = self.get_client_identifier(request)

        # Define rate limits
        rate_limit = 100  # requests
        period = 3600  # per hour

        # Check rate limit
        cache_key = f'rate_limit:{client_id}'
        request_count = cache.get(cache_key, 0)

        if request_count >= rate_limit:
            return JsonResponse({
                'error': 'Rate limit exceeded',
                'detail': f'Maximum {rate_limit} requests per hour allowed.'
            }, status=429)

        # Increment request count
        cache.set(cache_key, request_count + 1, period)

        return None

    @staticmethod
    def get_client_identifier(request):
        """Get unique identifier for rate limiting."""
        if hasattr(request, 'user') and request.user.is_authenticated:
            return f'user:{request.user.id}'

        # Fallback to IP address
        x_forwarded_for = request.META.get('HTTP_X_FORWARDED_FOR')
        if x_forwarded_for:
            ip = x_forwarded_for.split(',')[0]
        else:
            ip = request.META.get('REMOTE_ADDR')
        return f'ip:{ip}'
