# ITPilot - AI-Powered IT Support Platform

![ITPilot](https://img.shields.io/badge/version-1.0.0-orange)
![Django](https://img.shields.io/badge/django-5.0-green)
![Python](https://img.shields.io/badge/python-3.11+-blue)
![License](https://img.shields.io/badge/license-Proprietary-red)

## Overview

ITPilot is an enterprise-grade SaaS IT support platform delivering AI-powered diagnostics and remote technician assistance for Microsoft 365 organizations, SMEs, and individuals.

## Key Features

- 🤖 **AI-Powered Diagnostics** - Intelligent troubleshooting and issue resolution
- 🔐 **Enterprise Security** - AES-256 encryption, GDPR/NDPR compliant
- 📊 **Real-time Monitoring** - Device health, performance metrics, and alerts
- 🔗 **Cloud Integration** - Microsoft 365, Google Workspace, Zoho
- 👥 **Multi-tenant Architecture** - Isolated organization data
- 🎫 **Ticketing System** - AI triage and technician escalation
- 💳 **Billing Integration** - Stripe, Paystack, Flutterwave
- 🚀 **Scalable** - Microservices, containerized, Kubernetes-ready

## Architecture

```
ITPilot/
├── backend/                 # Django backend services
│   ├── core/               # Core settings and configuration
│   ├── authentication/     # OAuth2, JWT, RBAC
│   ├── organizations/      # Multi-tenant management
│   ├── devices/            # Device monitoring and health
│   ├── tickets/            # Ticketing and escalation
│   ├── ai_engine/          # AI chatbot integration
│   ├── integrations/       # Microsoft, Google, Zoho APIs
│   ├── remote_access/      # Secure remote sessions
│   ├── billing/            # Subscription and payments
│   └── notifications/      # Real-time alerts
├── frontend/               # Next.js React frontend
│   ├── components/         # Reusable UI components
│   ├── pages/             # Application pages
│   ├── styles/            # Orange/Black/White theme
│   └── services/          # API integration
├── device-agent/          # Cross-platform device client
├── docker/                # Docker configurations
└── kubernetes/            # K8s deployment configs
```

## Tech Stack

### Backend
- **Framework**: Django 5.0 + Django REST Framework
- **Database**: PostgreSQL 16
- **Cache/Queue**: Redis + Celery
- **WebSockets**: Django Channels
- **Auth**: OAuth2, JWT, RBAC
- **Payment**: Stripe, Paystack, Flutterwave SDKs

### Frontend
- **Framework**: Next.js 14 + React 18
- **Styling**: Tailwind CSS + Custom theme
- **State Management**: Redux Toolkit
- **Real-time**: Socket.io client
- **Charts**: Recharts + D3.js

### DevOps
- **Containerization**: Docker + Docker Compose
- **Orchestration**: Kubernetes
- **CI/CD**: GitHub Actions
- **Monitoring**: Prometheus + Grafana
- **Logging**: ELK Stack

## Quick Start

### Prerequisites
- Python 3.11+
- Node.js 20+
- PostgreSQL 16
- Redis 7+
- Docker & Docker Compose

### Development Setup

1. **Clone the repository**
```bash
git clone <repository-url>
cd ITPilot
```

2. **Backend Setup**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your configuration
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

3. **Frontend Setup**
```bash
cd frontend
npm install
cp .env.example .env.local
# Edit .env.local with API endpoints
npm run dev
```

4. **Docker Setup** (Recommended)
```bash
docker-compose up -d
```

## Environment Variables

See `.env.example` files in respective directories for required configuration.

## API Documentation

Once running, access:
- Swagger UI: `http://localhost:8000/api/docs/`
- ReDoc: `http://localhost:8000/api/redoc/`

## Security

- AES-256 encryption for sensitive data
- JWT with refresh token rotation
- Rate limiting on all endpoints
- CORS protection
- SQL injection prevention
- XSS protection
- CSRF tokens
- Audit logging for compliance

## Scaling

The platform is designed for horizontal scaling:
- Stateless API services
- Redis-based session storage
- Database read replicas
- CDN for static assets
- Load balancer ready

## Testing

```bash
# Backend tests
cd backend
pytest --cov=. --cov-report=html

# Frontend tests
cd frontend
npm run test
npm run test:coverage
```

## Deployment

See `docs/deployment/` for detailed deployment guides:
- AWS deployment
- Google Cloud Platform
- Azure deployment
- On-premise setup

## Contributing

This is a proprietary project. Contact the development team for contribution guidelines.

## License

Proprietary - All Rights Reserved

## Support

For technical support: support@itpilot.com
For sales inquiries: sales@itpilot.com

---

**Built with ❤️ for IT Teams Worldwide**
