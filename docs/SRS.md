# Software Requirements Specification (SRS)
# ITPilot - AI-Powered IT Support Platform

**Version:** 2.0
**Date:** November 22, 2025
**Status:** Production Ready

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [Product Purpose](#2-product-purpose)
3. [How It Can Be Achieved](#3-how-it-can-be-achieved)
4. [Dashboard Structure](#4-dashboard-structure)
5. [System Overview](#5-system-overview)
6. [Functional Requirements](#6-functional-requirements)
7. [Non-Functional Requirements](#7-non-functional-requirements)
8. [Technical Architecture](#8-technical-architecture)
9. [Security & Compliance](#9-security--compliance)
10. [Integration Requirements](#10-integration-requirements)
11. [Deployment & Scalability](#11-deployment--scalability)

---

## 1. Introduction

### 1.1 Document Purpose
This Software Requirements Specification (SRS) document provides a comprehensive description of the ITPilot platform, an AI-powered unified IT support solution designed to automate diagnostics, monitor system and cloud health, and enable secure remote technician assistance.

### 1.2 Scope
ITPilot serves enterprises, SMEs, and individual users by providing:
- Automated IT diagnostics and issue detection
- Real-time device and cloud health monitoring
- AI-powered support chatbot
- Secure remote technician access
- Multi-cloud integration (Microsoft 365, Google Workspace, Zoho)
- Compliance monitoring and management
- Unified dashboard for IT operations

### 1.3 Intended Audience
- **Enterprises**: Large organizations requiring centralized IT management
- **SMEs**: Small and medium businesses (1-500 employees)
- **Individual Users**: Tech-savvy individuals managing personal devices
- **IT Technicians**: Support professionals providing remote assistance
- **System Administrators**: IT staff managing organizational infrastructure

### 1.4 Product Perspective
ITPilot is a standalone SaaS platform that integrates with existing IT infrastructure through:
- Device agents (Windows, macOS, Linux)
- Cloud service APIs (Microsoft Graph, Google Workspace, Zoho)
- Third-party integrations (Stripe, Paystack, Flutterwave)

---

## 2. Product Purpose

### 2.1 Core Objective
**ITPilot is designed to provide an AI-powered, unified IT support platform that automates diagnostics, monitors system and cloud health, and enables secure remote technician assistance to improve reliability, security, and operational efficiency for enterprises, SMEs, and individual users.**

### 2.2 Key Value Propositions
1. **Automated IT Operations**: Reduce manual intervention through AI-driven diagnostics
2. **Proactive Monitoring**: Detect and resolve issues before they impact users
3. **Unified Dashboard**: Single pane of glass for all IT operations
4. **Enhanced Security**: Real-time threat detection and compliance monitoring
5. **Cost Efficiency**: Reduce IT support costs through automation
6. **Scalability**: Support from individual users to enterprise deployments

### 2.3 Target Outcomes
- **Improve System Reliability**: 99.5% uptime for monitored systems
- **Reduce Resolution Time**: 70% faster issue resolution through AI guidance
- **Enhance Security Posture**: Real-time threat detection and vulnerability management
- **Operational Efficiency**: 50% reduction in routine IT support tickets
- **User Satisfaction**: >90% user satisfaction rating

---

## 3. How It Can Be Achieved

### 3.1 Implementation Strategy
**By installing a device agent, connecting cloud accounts, and using an AI engine to monitor the system, detect issues, guide users, and escalate unresolved problems to technicians through secure remote sessions—all managed from a central dashboard.**

### 3.2 Technical Implementation

#### 3.2.1 Device Agent Installation
- **Cross-Platform Agents**: Native agents for Windows, macOS, and Linux
- **Silent Deployment**: MSI/PKG installers for enterprise deployment
- **Automatic Registration**: Devices auto-register with API keys
- **Heartbeat Monitoring**: Regular check-ins to confirm device status

#### 3.2.2 Cloud Account Connection
- **OAuth 2.0 Integration**: Secure authentication with Microsoft, Google, Zoho
- **Permission Scoping**: Granular permissions for data access
- **Multi-Account Support**: Connect multiple cloud accounts per organization
- **Token Management**: Automatic token refresh and revocation

#### 3.2.3 AI Engine Monitoring
- **Real-Time Analysis**: Continuous monitoring of device metrics
- **Pattern Recognition**: ML-based anomaly detection
- **Predictive Diagnostics**: Forecast potential issues before they occur
- **Natural Language Processing**: Understand user queries and provide contextual help

#### 3.2.4 Issue Detection & Guidance
- **Automated Scans**: Scheduled and on-demand system diagnostics
- **Severity Classification**: Categorize issues (Low, Medium, High, Critical)
- **Step-by-Step Guidance**: Interactive troubleshooting workflows
- **Knowledge Base**: Searchable repository of solutions

#### 3.2.5 Escalation to Technicians
- **Smart Routing**: Assign tickets to appropriate technicians
- **Context Preservation**: Full issue history available to technicians
- **Priority Queuing**: SLA-based ticket prioritization
- **Approval Workflow**: User approval required for remote access

#### 3.2.6 Secure Remote Sessions
- **Multiple Protocols**: WebRTC, VNC, RDP, SSH support
- **Time-Limited Access**: Sessions expire automatically
- **Session Recording**: Audit trail for compliance
- **Encrypted Communication**: AES-256 encryption for all sessions

#### 3.2.7 Central Dashboard Management
- **Role-Based Access**: Different views for users, technicians, admins
- **Real-Time Updates**: WebSocket-powered live data
- **Customizable Widgets**: Personalized dashboard layouts
- **Mobile Responsive**: Access from any device

---

## 4. Dashboard Structure

### 4.1 Overview
The dashboard follows a **parent-child label structure** with 8 main sections and an independent AI Chat feature. Each section contains specific subsections that functionally connect to other dashboard areas.

### 4.2 Structural Hierarchy

#### **1. Device Management**
Handles everything related to user devices running the ITPilot agent.

**Child Sections:**
- **Connected Devices**
  - Shows all registered devices with status indicators
  - **Connections**: AI Diagnostics (for scans), Support & Escalation (for tickets)

- **Device Health**
  - Displays CPU, RAM, disk, battery, and system state
  - **Connections**: Notifications Center (alerts), AI Diagnostics (health scans)

- **Performance Metrics**
  - Shows usage statistics and trends
  - **Connections**: Optimization Tools, AI Recommendations

- **Security Status**
  - Highlights vulnerabilities, missing updates, threats
  - **Connections**: Network & Security, Notifications Center

- **Compliance Check**
  - Ensures device meets organizational or Microsoft 365 policies
  - **Connections**: Admin & Controls (policies), Cloud Integrations (Intune compliance)

- **Optimization Tools**
  - Allows one-click fixes and system cleanup
  - **Connections**: AI Diagnostics (auto-fix suggestions)

---

#### **2. Cloud & Account Integrations**
Manages external cloud connections for deeper IT insight.

**Child Sections:**
- **Microsoft 365**
  - User accounts, device compliance, license usage
  - **Connections**: Device Management (compliance), Admin & Controls (roles)

- **Google Workspace**
  - Mail, drive sync, account health monitoring
  - **Connections**: Notifications Center (sync errors)

- **Zoho & Others**
  - Domain, email, service health tracking
  - **Connections**: Network & Security (domain tools)

- **License Usage**
  - Active/inactive license tracking
  - **Connections**: Billing & Subscriptions, Notifications Center

- **Service Health**
  - Cloud service uptime and outage monitoring
  - **Connections**: AI Diagnostics (cross-check issues)

- **Sync Errors**
  - Failed cloud synchronization alerts
  - **Connections**: Notifications Center

---

#### **3. AI Diagnostics**
Automated monitoring and issue detection powered by AI.

**Child Sections:**
- **Real-Time Scan**
  - Live checks on device, network, and cloud accounts
  - **Connections**: Device Management, Cloud Integrations

- **Issue Detection**
  - Identifies problems and classifies severity
  - **Connections**: Support & Escalation (ticket creation)

- **Recommendations**
  - AI-suggested fixes and optimization steps
  - **Connections**: Optimization Tools, Notifications

- **System Alerts**
  - Pushes warnings based on detected issues
  - **Connections**: Notifications Center

- **Auto-Fix Actions**
  - Executes safe system fixes without technician intervention
  - **Connections**: Device Management, Technician Queue (if fix fails)

---

#### **4. Network & Security**
Handles network diagnostics and protective measures.

**Child Sections:**
- **Wi-Fi Analysis**
  - Speed, channel interference, stability checks
  - **Connections**: AI Diagnostics (root cause analysis)

- **Threat Alerts**
  - Malware, unauthorized access, risky applications
  - **Connections**: Security Status, Notifications

- **Patch Status**
  - Missing system updates and driver checks
  - **Connections**: Compliance Check, Notifications

- **Antivirus Health**
  - Status of active antivirus applications
  - **Connections**: Security Status, AI Diagnostics

- **Password Strength**
  - Weak or reused password detection
  - **Connections**: Cloud Integrations (accounts), Notifications

---

#### **5. Support & Escalation**
Handles AI assistance, ticketing, and technician workflows.

**Child Sections:**
- **AI Chat Support**
  - Interactive AI chatbot for user assistance
  - **Connections**: Issue Detection, System Alerts, Open Tickets
  - **Note**: Also accessible as standalone tab in main navigation

- **Open Tickets**
  - Active issues raised by AI or users
  - **Connections**: Technician Queue, Device Management

- **Technician Queue**
  - Issues awaiting support assignment
  - **Connections**: Remote Session Control

- **Remote Session Control**
  - Technician requests for secure device access
  - **Connections**: Device Management (approve access)

- **Session History**
  - Previous technician session logs
  - **Connections**: Admin & Controls (audit logs)

---

#### **6. Admin & Controls**
Governs system-wide oversight and permissions.

**Child Sections:**
- **User Management**
  - Add, remove, and manage users
  - **Connections**: Role-Based Access across all modules

- **Roles & Permissions**
  - Defines admin, technician, and user rights
  - **Connections**: Support, Cloud Integrations, Device Management

- **Activity Logs**
  - Tracks actions taken across the platform
  - **Connections**: Session History

- **Audit Trail**
  - Formal compliance and security records
  - **Connections**: Remote Session Logs, Notifications

- **Organization Settings**
  - Company-wide configurations
  - **Connections**: Billing, Cloud Integrations, Device Policies

---

#### **7. Billing & Subscriptions**
Tracks payment details and plan entitlements.

**Child Sections:**
- **Plans & Usage**
  - Current subscription details and limits
  - **Connections**: License Usage, Feature Access

- **Payment History**
  - Transaction records for audits
  - **Connections**: Admin & Controls (audit trail)

- **Renewal Alerts**
  - Upcoming subscription deadline reminders
  - **Connections**: Notifications Center

---

#### **8. Notifications Center**
Central hub for all alerts and system messages.

**Child Sections:**
- **System Messages**
  - General platform updates and warnings
  - **Connections**: All modules

- **Security Alerts**
  - Threat, compliance, vulnerability notifications
  - **Connections**: Network & Security, Device Management

- **License Reminders**
  - Expiring subscription/license alerts
  - **Connections**: Billing & Subscriptions

- **Device Warnings**
  - Low battery, high temperature, critical alerts
  - **Connections**: Device Health, AI Diagnostics

---

#### **AI Chat Tab** (Standalone)
- **Location**: Main navigation bar alongside parent sections
- **Purpose**: Quick access to AI assistance without navigating to Support & Escalation
- **Functionality**: Full-featured AI chatbot with conversation history
- **Connections**: All modules for context-aware assistance

---

### 4.3 Cross-Module Functional Connections

#### 4.3.1 Notification Flow
```
Device Health → AI Diagnostics → Notifications Center → User Alert
Security Status → Network & Security → Notifications Center → Security Alert
License Usage → Billing & Subscriptions → Notifications Center → Renewal Alert
```

#### 4.3.2 Support Escalation Flow
```
AI Chat Support → Issue Detection → Open Tickets → Technician Queue → Remote Session
```

#### 4.3.3 Compliance Flow
```
Device Management → Compliance Check → Cloud Integrations (Intune) → Admin & Controls (policies)
```

#### 4.3.4 Optimization Flow
```
Performance Metrics → AI Diagnostics → Recommendations → Optimization Tools → Auto-Fix
```

---

## 5. System Overview

### 5.1 System Architecture
ITPilot follows a **microservices architecture** with clear separation between:
- **Frontend**: Next.js 14 (TypeScript, React, Tailwind CSS)
- **Backend**: Django 5.0 (Python, REST API, WebSockets)
- **Database**: PostgreSQL 16
- **Cache/Queue**: Redis 7, Celery
- **Monitoring**: Prometheus, Grafana

### 5.2 Key Components
1. **Device Agents**: Native applications for endpoint monitoring
2. **API Gateway**: RESTful API with JWT authentication
3. **AI Engine**: GPT-4 integration for diagnostics and chatbot
4. **WebSocket Server**: Real-time communication (Django Channels)
5. **Job Queue**: Background tasks (Celery + Redis)
6. **Notification Service**: Multi-channel alert delivery
7. **Integration Connectors**: Microsoft Graph, Google APIs, Zoho

---

## 6. Functional Requirements

### 6.1 Device Management (FR-DM)

**FR-DM-001**: Device Registration
- System SHALL allow devices to register via API key
- System SHALL support Windows, macOS, Linux platforms
- System SHALL assign unique device IDs upon registration

**FR-DM-002**: Health Monitoring
- System SHALL collect CPU, RAM, disk, battery, network metrics
- System SHALL update health metrics every 60 seconds
- System SHALL calculate health scores (0-100) based on metrics

**FR-DM-003**: Performance Tracking
- System SHALL store historical metrics for 90 days (default)
- System SHALL generate daily/weekly/monthly reports
- System SHALL support custom date range analysis

**FR-DM-004**: Security Scanning
- System SHALL check for missing patches daily
- System SHALL detect unauthorized software
- System SHALL verify antivirus status

**FR-DM-005**: Compliance Verification
- System SHALL check Microsoft 365 compliance policies
- System SHALL validate device encryption status
- System SHALL enforce password policies

**FR-DM-006**: Optimization Tools
- System SHALL provide disk cleanup functionality
- System SHALL identify resource-heavy processes
- System SHALL execute one-click optimizations

---

### 6.2 Cloud & Account Integrations (FR-CI)

**FR-CI-001**: Microsoft 365 Integration
- System SHALL authenticate via Microsoft Graph API
- System SHALL retrieve user accounts, licenses, compliance data
- System SHALL support multiple Microsoft 365 tenants

**FR-CI-002**: Google Workspace Integration
- System SHALL authenticate via Google Workspace API
- System SHALL monitor Gmail, Drive, Calendar services
- System SHALL detect sync errors and outages

**FR-CI-003**: Zoho Integration
- System SHALL connect to Zoho Mail and Zoho Workplace
- System SHALL monitor domain health (MX, SPF, DKIM, DMARC)
- System SHALL track email deliverability

**FR-CI-004**: License Management
- System SHALL track active/inactive licenses across all platforms
- System SHALL alert on license expiration (30/15/7 days)
- System SHALL generate license utilization reports

**FR-CI-005**: Service Health Monitoring
- System SHALL check service status every 5 minutes
- System SHALL detect outages and degraded performance
- System SHALL cross-reference with AI Diagnostics

**FR-CI-006**: Sync Error Handling
- System SHALL log all cloud sync failures
- System SHALL provide resolution steps
- System SHALL retry failed syncs automatically

---

### 6.3 AI Diagnostics (FR-AI)

**FR-AI-001**: Real-Time Scanning
- System SHALL perform on-demand diagnostics within 30 seconds
- System SHALL scan device, network, and cloud accounts simultaneously
- System SHALL prioritize scans based on user role

**FR-AI-002**: Issue Detection
- System SHALL identify issues using ML models
- System SHALL classify severity (Low, Medium, High, Critical)
- System SHALL deduplicate similar issues

**FR-AI-003**: Recommendations Engine
- System SHALL generate actionable recommendations
- System SHALL provide step-by-step instructions
- System SHALL estimate resolution time

**FR-AI-004**: System Alerts
- System SHALL push real-time alerts via WebSocket
- System SHALL support alert filtering and muting
- System SHALL aggregate similar alerts

**FR-AI-005**: Auto-Fix Capabilities
- System SHALL execute safe fixes without user intervention
- System SHALL require approval for high-risk fixes
- System SHALL rollback failed fixes automatically

---

### 6.4 Network & Security (FR-NS)

**FR-NS-001**: Wi-Fi Analysis
- System SHALL measure connection speed, latency, packet loss
- System SHALL detect channel interference
- System SHALL recommend optimal Wi-Fi settings

**FR-NS-002**: Threat Detection
- System SHALL scan for malware signatures
- System SHALL detect unauthorized network access
- System SHALL identify risky applications

**FR-NS-003**: Patch Management
- System SHALL identify missing OS updates
- System SHALL check driver versions
- System SHALL prioritize security patches

**FR-NS-004**: Antivirus Monitoring
- System SHALL verify antivirus status (enabled/disabled)
- System SHALL check definition update dates
- System SHALL alert on outdated protection

**FR-NS-005**: Password Security
- System SHALL check password strength across accounts
- System SHALL detect reused passwords
- System SHALL enforce password rotation policies

---

### 6.5 Support & Escalation (FR-SE)

**FR-SE-001**: AI Chat Support
- System SHALL provide 24/7 AI chatbot assistance
- System SHALL maintain conversation context
- System SHALL support file attachments

**FR-SE-002**: Ticket Management
- System SHALL auto-generate unique ticket numbers
- System SHALL support priority assignment
- System SHALL track SLA compliance

**FR-SE-003**: Technician Queue
- System SHALL route tickets based on expertise
- System SHALL balance workload across technicians
- System SHALL support ticket reassignment

**FR-SE-004**: Remote Session Control
- System SHALL require user approval for remote access
- System SHALL support multiple connection protocols
- System SHALL enforce session time limits

**FR-SE-005**: Session History
- System SHALL log all remote session activities
- System SHALL record session duration and actions taken
- System SHALL support session playback

---

### 6.6 Admin & Controls (FR-AC)

**FR-AC-001**: User Management
- System SHALL support user CRUD operations
- System SHALL enforce email verification
- System SHALL support bulk user import/export

**FR-AC-002**: Roles & Permissions
- System SHALL support custom role creation
- System SHALL enforce role-based access control (RBAC)
- System SHALL provide permission templates

**FR-AC-003**: Activity Logging
- System SHALL log all user actions
- System SHALL support log search and filtering
- System SHALL retain logs for 365 days

**FR-AC-004**: Audit Trail
- System SHALL create immutable audit records
- System SHALL support compliance exports (PDF, CSV)
- System SHALL notify admins of suspicious activities

**FR-AC-005**: Organization Settings
- System SHALL allow branding customization
- System SHALL support multi-organization management
- System SHALL enforce organization-level policies

---

### 6.7 Billing & Subscriptions (FR-BS)

**FR-BS-001**: Plan Management
- System SHALL support multiple subscription tiers
- System SHALL enforce plan limits (devices, users, features)
- System SHALL allow plan upgrades/downgrades

**FR-BS-002**: Payment Processing
- System SHALL integrate Stripe, Paystack, Flutterwave
- System SHALL support multiple currencies
- System SHALL handle payment failures gracefully

**FR-BS-003**: Renewal Management
- System SHALL auto-renew subscriptions by default
- System SHALL send renewal reminders (30/15/7/1 days)
- System SHALL allow cancellation anytime

---

### 6.8 Notifications Center (FR-NC)

**FR-NC-001**: Multi-Channel Delivery
- System SHALL support Email, SMS, Push, In-app notifications
- System SHALL allow channel preferences per notification type
- System SHALL enforce quiet hours

**FR-NC-002**: Real-Time Notifications
- System SHALL deliver in-app notifications via WebSocket
- System SHALL support notification badges and counts
- System SHALL mark notifications as read/unread

**FR-NC-003**: Notification Preferences
- System SHALL allow users to customize notification settings
- System SHALL support digest modes (hourly, daily)
- System SHALL allow muting specific notification types

---

## 7. Non-Functional Requirements

### 7.1 Performance (NFR-P)

**NFR-P-001**: Response Time
- API responses SHALL complete within 2 seconds (p95)
- Dashboard load time SHALL be under 3 seconds
- WebSocket messages SHALL deliver within 500ms

**NFR-P-002**: Scalability
- System SHALL support 50,000+ concurrent users
- System SHALL handle 10,000+ devices per organization
- System SHALL process 1M+ events per day

**NFR-P-003**: Throughput
- System SHALL process 1,000 API requests/second
- System SHALL handle 100 concurrent remote sessions
- System SHALL scan 500 devices/minute

---

### 7.2 Reliability (NFR-R)

**NFR-R-001**: Availability
- System SHALL maintain 99.5% uptime
- Planned maintenance SHALL not exceed 4 hours/month
- System SHALL support zero-downtime deployments

**NFR-R-002**: Data Integrity
- System SHALL ensure no data loss during failures
- System SHALL maintain database ACID properties
- System SHALL backup data every 6 hours

**NFR-R-003**: Fault Tolerance
- System SHALL auto-recover from component failures
- System SHALL implement circuit breakers for external APIs
- System SHALL queue failed operations for retry

---

### 7.3 Security (NFR-S)

**NFR-S-001**: Authentication
- System SHALL enforce multi-factor authentication (MFA)
- System SHALL support SSO (SAML, OAuth2)
- System SHALL lock accounts after 5 failed attempts

**NFR-S-002**: Encryption
- System SHALL encrypt data at rest (AES-256)
- System SHALL encrypt data in transit (TLS 1.3)
- System SHALL encrypt sensitive fields in database

**NFR-S-003**: Authorization
- System SHALL implement role-based access control
- System SHALL enforce principle of least privilege
- System SHALL audit all authorization decisions

---

### 7.4 Compliance (NFR-C)

**NFR-C-001**: Data Privacy
- System SHALL comply with GDPR
- System SHALL comply with NDPR (Nigeria Data Protection Regulation)
- System SHALL support data export/deletion requests

**NFR-C-002**: Audit & Logging
- System SHALL retain audit logs for 730 days (remote sessions)
- System SHALL retain activity logs for 365 days
- System SHALL support tamper-proof logging

---

### 7.5 Usability (NFR-U)

**NFR-U-001**: User Interface
- System SHALL support mobile, tablet, desktop views
- System SHALL meet WCAG 2.1 AA accessibility standards
- System SHALL support keyboard navigation

**NFR-U-002**: Internationalization
- System SHALL support English (primary)
- System SHALL allow UI language switching
- System SHALL support multiple timezones

---

## 8. Technical Architecture

### 8.1 Backend Architecture

```
Backend Apps (Django):
├── authentication/          # JWT, OAuth2, MFA
├── organizations/           # Multi-tenancy, teams
├── devices/                 # Device management, health monitoring
├── ai_diagnostics/          # NEW: AI scanning, recommendations
├── network_security/        # NEW: Network analysis, threats
├── tickets/                 # Ticketing, escalation
├── ai_engine/              # AI chatbot (moved to standalone)
├── integrations/           # Microsoft, Google, Zoho APIs
├── remote_access/          # Secure sessions
├── billing/                # Payments, subscriptions
├── notifications/          # Multi-channel alerts
├── admin_controls/         # NEW: Admin features, audit
└── common/                 # Shared utilities
```

### 8.2 Frontend Architecture

```
Frontend (Next.js):
app/
├── (auth)/                 # Login, register, reset password
├── dashboard/
│   ├── page.tsx           # Dashboard home
│   ├── device-management/
│   │   ├── devices/       # Connected devices
│   │   ├── health/        # Device health
│   │   ├── performance/   # Performance metrics
│   │   ├── security/      # Security status
│   │   ├── compliance/    # Compliance check
│   │   └── optimization/  # Optimization tools
│   ├── cloud-integrations/
│   │   ├── microsoft-365/
│   │   ├── google-workspace/
│   │   ├── zoho/
│   │   ├── licenses/
│   │   ├── service-health/
│   │   └── sync-errors/
│   ├── ai-diagnostics/
│   │   ├── real-time-scan/
│   │   ├── issues/
│   │   ├── recommendations/
│   │   ├── alerts/
│   │   └── auto-fix/
│   ├── network-security/
│   │   ├── wifi-analysis/
│   │   ├── threats/
│   │   ├── patches/
│   │   ├── antivirus/
│   │   └── passwords/
│   ├── support/
│   │   ├── ai-chat/       # Also in main nav
│   │   ├── tickets/
│   │   ├── queue/
│   │   ├── remote-sessions/
│   │   └── history/
│   ├── admin/
│   │   ├── users/
│   │   ├── roles/
│   │   ├── activity-logs/
│   │   ├── audit-trail/
│   │   └── settings/
│   ├── billing/
│   │   ├── plans/
│   │   ├── payments/
│   │   └── renewals/
│   └── notifications/
│       ├── system/
│       ├── security/
│       ├── licenses/
│       └── devices/
├── ai-chat/               # Standalone AI chat (main nav)
└── ...other pages
```

---

## 9. Security & Compliance

### 9.1 Security Measures
- AES-256 encryption for data at rest
- TLS 1.3 for data in transit
- JWT with refresh token rotation
- Rate limiting (100/hour anonymous, 1000/hour authenticated)
- CSRF/XSS protection
- SQL injection prevention
- Secure session management
- Account lockout after 5 failed attempts

### 9.2 Compliance Standards
- GDPR (General Data Protection Regulation)
- NDPR (Nigeria Data Protection Regulation)
- SOC 2 Type II (planned)
- ISO 27001 (planned)

---

## 10. Integration Requirements

### 10.1 Microsoft 365
- Microsoft Graph API
- Azure Active Directory
- Microsoft Intune (device compliance)
- Microsoft Defender (threat detection)

### 10.2 Google Workspace
- Google Workspace Admin SDK
- Gmail API
- Google Drive API
- Google Calendar API

### 10.3 Zoho
- Zoho Mail API
- Zoho Workplace API
- Domain management APIs

### 10.4 Payment Providers
- Stripe (Global payments)
- Paystack (Africa)
- Flutterwave (Africa)

---

## 11. Deployment & Scalability

### 11.1 Deployment Options
- Docker Compose (development)
- Kubernetes (production)
- Cloud platforms: AWS, GCP, Azure, DigitalOcean

### 11.2 Scalability Features
- Horizontal Pod Autoscaling (HPA)
- Database connection pooling
- Redis caching layer
- Celery for async tasks
- CDN for static assets
- Load balancer ready

### 11.3 Monitoring & Observability
- Prometheus for metrics
- Grafana for dashboards
- ELK stack for logging
- Sentry for error tracking

---

## 12. Subscription Plans

| Plan | Target | Price (NGN/mo) | Features |
|------|--------|----------------|----------|
| **Personal** | Individuals | ₦1,500-₦3,000 | AI support, 1 device, cloud backup |
| **Business Lite** | SMEs (1-20) | ₦7,500-₦25,000 | Domain health, 20 devices, license tracking |
| **Enterprise** | Large Orgs | Custom | Full API, unlimited devices, compliance |
| **One-time Support** | Any | Per-session | Pay-per-incident IT support |

---

## Document Control

**Version History:**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 2025-01-15 | ITPilot Team | Initial SRS document |
| 2.0 | 2025-11-22 | ITPilot Team | Added Product Purpose, Implementation Strategy, Dashboard Structure |

**Approval:**

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Product Owner | - | - | - |
| Technical Lead | - | - | - |
| QA Lead | - | - | - |

---

**End of Document**
