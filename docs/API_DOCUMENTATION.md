# ITPilot API Documentation

## Base URL

```
Production: https://api.itpilot.com/api/v1
Development: http://localhost:8000/api/v1
```

## Authentication

ITPilot uses JWT (JSON Web Tokens) for authentication.

### Obtaining Tokens

**POST** `/auth/login/`

```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

Response:
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "USER"
    },
    "tokens": {
      "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
      "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
    }
  }
}
```

### Using Tokens

Include the access token in the Authorization header:

```
Authorization: Bearer eyJ0eXAiOiJKV1QiLCJhbGc...
```

### Refreshing Tokens

**POST** `/auth/token/refresh/`

```json
{
  "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
}
```

## API Endpoints

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register/` | Register new user |
| POST | `/auth/login/` | Login user |
| POST | `/auth/token/refresh/` | Refresh access token |
| GET | `/auth/profile/` | Get user profile |
| PUT | `/auth/profile/` | Update user profile |
| POST | `/auth/change-password/` | Change password |
| POST | `/auth/password-reset/request/` | Request password reset |
| POST | `/auth/password-reset/confirm/` | Confirm password reset |
| POST | `/auth/verify-otp/` | Verify OTP code |

### Organizations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/organizations/` | List organizations |
| POST | `/organizations/` | Create organization |
| GET | `/organizations/{id}/` | Get organization details |
| PUT | `/organizations/{id}/` | Update organization |
| DELETE | `/organizations/{id}/` | Delete organization |
| GET | `/organizations/{id}/members/` | List members |
| POST | `/organizations/{id}/members/` | Add member |
| DELETE | `/organizations/{id}/members/{user_id}/` | Remove member |

### Devices

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/devices/` | List devices |
| POST | `/devices/` | Register device |
| GET | `/devices/{id}/` | Get device details |
| PUT | `/devices/{id}/` | Update device |
| DELETE | `/devices/{id}/` | Delete device |
| POST | `/devices/{id}/health/` | Submit health metrics |
| GET | `/devices/{id}/metrics/` | Get device metrics |
| POST | `/devices/{id}/diagnostics/` | Run diagnostics |

### Tickets

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tickets/` | List tickets |
| POST | `/tickets/` | Create ticket |
| GET | `/tickets/{id}/` | Get ticket details |
| PUT | `/tickets/{id}/` | Update ticket |
| DELETE | `/tickets/{id}/` | Delete ticket |
| POST | `/tickets/{id}/messages/` | Add message |
| POST | `/tickets/{id}/assign/` | Assign technician |
| POST | `/tickets/{id}/escalate/` | Escalate ticket |
| POST | `/tickets/{id}/resolve/` | Resolve ticket |
| POST | `/tickets/{id}/close/` | Close ticket |

### AI Chatbot

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ai/conversations/` | List conversations |
| POST | `/ai/conversations/` | Create conversation |
| GET | `/ai/conversations/{id}/` | Get conversation |
| POST | `/ai/conversations/{id}/messages/` | Send message |
| POST | `/ai/conversations/{id}/rate/` | Rate conversation |

### Integrations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/integrations/` | List integrations |
| POST | `/integrations/` | Create integration |
| GET | `/integrations/{id}/` | Get integration |
| PUT | `/integrations/{id}/` | Update integration |
| DELETE | `/integrations/{id}/` | Delete integration |
| POST | `/integrations/{id}/sync/` | Sync integration |
| GET | `/integrations/domain-health/` | Check domain health |

### Remote Access

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/remote-access/sessions/` | List sessions |
| POST | `/remote-access/sessions/` | Create session |
| GET | `/remote-access/sessions/{id}/` | Get session |
| POST | `/remote-access/sessions/{id}/approve/` | Approve session |
| POST | `/remote-access/sessions/{id}/end/` | End session |
| GET | `/remote-access/sessions/{id}/logs/` | Get session logs |

### Billing

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/billing/plans/` | List subscription plans |
| GET | `/billing/subscriptions/` | List subscriptions |
| POST | `/billing/subscriptions/` | Create subscription |
| GET | `/billing/subscriptions/{id}/` | Get subscription |
| PUT | `/billing/subscriptions/{id}/` | Update subscription |
| POST | `/billing/subscriptions/{id}/cancel/` | Cancel subscription |
| GET | `/billing/payments/` | List payments |
| GET | `/billing/invoices/` | List invoices |
| POST | `/billing/webhooks/stripe/` | Stripe webhook |
| POST | `/billing/webhooks/paystack/` | Paystack webhook |

### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications/` | List notifications |
| GET | `/notifications/{id}/` | Get notification |
| POST | `/notifications/{id}/read/` | Mark as read |
| POST | `/notifications/read-all/` | Mark all as read |
| GET | `/notifications/preferences/` | Get preferences |
| PUT | `/notifications/preferences/` | Update preferences |

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "message": "Error message",
  "errors": {
    "field": ["Error details"]
  },
  "status_code": 400
}
```

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 204 | No Content - Request successful, no data |
| 400 | Bad Request - Invalid data |
| 401 | Unauthorized - Invalid/missing token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |

## Rate Limiting

- Anonymous users: 100 requests/hour
- Authenticated users: 1000 requests/hour
- Rate limit headers included in response:
  - `X-RateLimit-Limit`
  - `X-RateLimit-Remaining`
  - `X-RateLimit-Reset`

## Pagination

List endpoints support pagination:

**Query Parameters:**
- `page` - Page number (default: 1)
- `page_size` - Items per page (default: 20, max: 100)

**Response:**
```json
{
  "count": 100,
  "next": "http://api.example.com/api/v1/tickets/?page=3",
  "previous": "http://api.example.com/api/v1/tickets/?page=1",
  "results": [
    // Items
  ]
}
```

## Filtering & Search

Use query parameters for filtering:

```
GET /api/v1/tickets/?status=OPEN&priority=HIGH&search=network
```

Common filters:
- `search` - Text search
- `ordering` - Sort by field (prefix with `-` for descending)
- `created_at__gte` - Created after date
- `created_at__lte` - Created before date

## WebSocket Connections

### Connection

```javascript
const socket = io('wss://api.itpilot.com', {
  auth: {
    token: 'your-jwt-token'
  }
});
```

### Events

**Notifications:**
```javascript
socket.on('notification', (data) => {
  console.log('New notification:', data);
});
```

**Chat:**
```javascript
socket.emit('chat_message', {
  conversation_id: 'uuid',
  message: 'Hello'
});

socket.on('chat_response', (data) => {
  console.log('AI response:', data);
});
```

**Remote Session:**
```javascript
socket.emit('join_session', {
  session_id: 'uuid'
});

socket.on('session_data', (data) => {
  // Handle remote session data
});
```

## Examples

### Register User

```bash
curl -X POST https://api.itpilot.com/api/v1/auth/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "password_confirm": "SecurePass123!",
    "first_name": "John",
    "last_name": "Doe"
  }'
```

### Create Ticket

```bash
curl -X POST https://api.itpilot.com/api/v1/tickets/ \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Network connectivity issues",
    "description": "Unable to connect to VPN",
    "priority": "HIGH",
    "category": "NETWORK"
  }'
```

### Get Device Health

```bash
curl -X GET https://api.itpilot.com/api/v1/devices/{device_id}/metrics/ \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## SDK Examples

### Python

```python
import requests

class ITPilotClient:
    def __init__(self, api_url, email, password):
        self.api_url = api_url
        self.token = self.login(email, password)

    def login(self, email, password):
        response = requests.post(
            f"{self.api_url}/auth/login/",
            json={"email": email, "password": password}
        )
        return response.json()['data']['tokens']['access']

    def get_tickets(self):
        headers = {"Authorization": f"Bearer {self.token}"}
        response = requests.get(
            f"{self.api_url}/tickets/",
            headers=headers
        )
        return response.json()['data']

# Usage
client = ITPilotClient(
    "https://api.itpilot.com/api/v1",
    "user@example.com",
    "password"
)
tickets = client.get_tickets()
```

### JavaScript

```javascript
class ITPilotClient {
  constructor(apiUrl) {
    this.apiUrl = apiUrl;
    this.token = null;
  }

  async login(email, password) {
    const response = await fetch(`${this.apiUrl}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await response.json();
    this.token = data.data.tokens.access;
    return this.token;
  }

  async getTickets() {
    const response = await fetch(`${this.apiUrl}/tickets/`, {
      headers: { 'Authorization': `Bearer ${this.token}` }
    });
    return response.json();
  }
}

// Usage
const client = new ITPilotClient('https://api.itpilot.com/api/v1');
await client.login('user@example.com', 'password');
const tickets = await client.getTickets();
```

## Interactive Documentation

For interactive API exploration:
- Swagger UI: https://api.itpilot.com/api/docs/
- ReDoc: https://api.itpilot.com/api/redoc/

## Support

API Support: api-support@itpilot.com
