# ITPilot Restructuring Plan
# Aligning Application Structure with Dashboard Architecture

**Date:** November 22, 2025
**Version:** 1.0
**Status:** Implementation Ready

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Current State Analysis](#current-state-analysis)
3. [Target State Architecture](#target-state-architecture)
4. [Backend Restructuring](#backend-restructuring)
5. [Frontend Restructuring](#frontend-restructuring)
6. [Migration Strategy](#migration-strategy)
7. [Implementation Plan](#implementation-plan)

---

## Executive Summary

This document outlines the comprehensive restructuring of ITPilot's backend and frontend to align with the 8-section dashboard structure defined in the SRS. The restructuring aims to:

1. **Improve Organization**: Align code structure with user-facing dashboard sections
2. **Enhance Maintainability**: Clear separation of concerns
3. **Enable Scalability**: Modular architecture for feature additions
4. **Reduce Complexity**: Intuitive navigation for developers

---

## Current State Analysis

### Current Backend Apps (9 Apps)

| App Name | Primary Function | Lines of Code | Models | Endpoints |
|----------|------------------|---------------|--------|-----------|
| `authentication` | User auth, JWT, OAuth2 | ~800 | 4 | 12 |
| `organizations` | Multi-tenancy, teams | ~600 | 3 | 15 |
| `devices` | Device monitoring | ~700 | 3 | 12 |
| `ai_engine` | AI chatbot | ~500 | 4 | 11 |
| `tickets` | Support ticketing | ~800 | 4 | 13 |
| `integrations` | Cloud services | ~600 | 4 | 10 |
| `remote_access` | Remote sessions | ~700 | 4 | 12 |
| `billing` | Payments, subscriptions | ~600 | 4 | 9 |
| `notifications` | Multi-channel alerts | ~500 | 5 | 12 |

**Total**: 9 apps, 35 models, 106 endpoints

### Current Frontend Pages

```
frontend/app/dashboard/
├── page.tsx                # Dashboard home
├── analytics/              # Analytics dashboard
├── chat/                   # AI chat
├── devices/                # Device list
├── settings/               # User settings
├── tickets/                # Ticket list
└── users/                  # User management
```

**Issues Identified:**
1. No Network & Security section
2. No AI Diagnostics (separate from chat)
3. No Cloud Integrations dashboard
4. No Admin & Controls centralization
5. No Compliance features
6. No Billing dashboard
7. No Notifications Center UI

---

## Target State Architecture

### New Backend Structure (13 Apps)

```
backend/
├── core/                           # Django settings, WSGI, URLs
├── common/                         # Shared utilities, mixins
├── authentication/                 # JWT, OAuth2, MFA [NO CHANGE]
├── organizations/                  # Multi-tenancy [NO CHANGE]
├── device_management/              # RENAMED from devices
│   ├── models/
│   │   ├── device.py
│   │   ├── health.py
│   │   ├── performance.py
│   │   ├── security.py
│   │   └── compliance.py           # NEW
│   ├── views/
│   │   ├── device_views.py
│   │   ├── health_views.py
│   │   ├── performance_views.py
│   │   ├── security_views.py
│   │   ├── compliance_views.py     # NEW
│   │   └── optimization_views.py   # NEW
│   └── services/
│       ├── health_calculator.py
│       ├── optimization_engine.py  # NEW
│       └── compliance_checker.py   # NEW
├── cloud_integrations/             # RENAMED from integrations
│   ├── models/
│   │   ├── integration.py
│   │   ├── oauth_token.py
│   │   ├── microsoft365.py         # NEW
│   │   ├── google_workspace.py     # NEW
│   │   ├── zoho.py                 # NEW
│   │   ├── license.py              # NEW
│   │   └── service_health.py       # NEW
│   ├── views/
│   │   ├── microsoft365_views.py   # NEW
│   │   ├── google_workspace_views.py # NEW
│   │   ├── zoho_views.py           # NEW
│   │   ├── license_views.py        # NEW
│   │   └── service_health_views.py # NEW
│   └── services/
│       ├── microsoft_graph.py
│       ├── google_api.py
│       └── zoho_api.py
├── ai_diagnostics/                 # NEW APP
│   ├── models/
│   │   ├── diagnostic_scan.py      # NEW
│   │   ├── detected_issue.py       # NEW
│   │   ├── recommendation.py       # NEW
│   │   ├── system_alert.py         # NEW
│   │   └── auto_fix_action.py      # NEW
│   ├── views/
│   │   ├── scan_views.py           # NEW
│   │   ├── issue_views.py          # NEW
│   │   ├── recommendation_views.py # NEW
│   │   ├── alert_views.py          # NEW
│   │   └── autofix_views.py        # NEW
│   └── services/
│       ├── diagnostic_engine.py    # NEW
│       ├── issue_detector.py       # NEW
│       ├── recommendation_engine.py # NEW
│       └── autofix_executor.py     # NEW
├── network_security/               # NEW APP
│   ├── models/
│   │   ├── wifi_analysis.py        # NEW
│   │   ├── threat_detection.py     # NEW
│   │   ├── patch_status.py         # NEW
│   │   ├── antivirus_status.py     # NEW
│   │   └── password_audit.py       # NEW
│   ├── views/
│   │   ├── wifi_views.py           # NEW
│   │   ├── threat_views.py         # NEW
│   │   ├── patch_views.py          # NEW
│   │   ├── antivirus_views.py      # NEW
│   │   └── password_views.py       # NEW
│   └── services/
│       ├── wifi_analyzer.py        # NEW
│       ├── threat_scanner.py       # NEW
│       ├── patch_checker.py        # NEW
│       └── password_auditor.py     # NEW
├── support_escalation/             # RENAMED from tickets
│   ├── models/
│   │   ├── ticket.py               # Existing
│   │   ├── message.py              # Existing
│   │   ├── escalation.py           # Existing
│   │   ├── queue.py                # NEW
│   │   └── session_assignment.py   # NEW (link to remote_access)
│   ├── views/
│   │   ├── ticket_views.py
│   │   ├── queue_views.py          # NEW
│   │   ├── escalation_views.py
│   │   └── assignment_views.py     # NEW
│   └── services/
│       ├── ticket_router.py
│       └── sla_calculator.py
├── ai_chat/                        # EXTRACTED from ai_engine
│   ├── models/
│   │   ├── chat_session.py         # Moved from ai_engine
│   │   ├── chat_message.py         # Moved from ai_engine
│   │   ├── ai_response.py          # Moved from ai_engine
│   │   └── knowledge_base.py       # Moved from ai_engine
│   ├── views/
│   │   ├── chat_views.py
│   │   └── knowledge_base_views.py
│   ├── services/
│   │   └── ai_service.py
│   └── consumers/
│       └── chat_consumer.py        # WebSocket for real-time chat
├── remote_access/                  # NO STRUCTURAL CHANGE
│   └── # Existing structure maintained
├── admin_controls/                 # NEW APP
│   ├── models/
│   │   ├── role.py                 # NEW
│   │   ├── permission.py           # NEW
│   │   ├── activity_log.py         # NEW
│   │   ├── audit_record.py         # NEW
│   │   └── organization_policy.py  # NEW
│   ├── views/
│   │   ├── user_management_views.py # NEW
│   │   ├── role_views.py           # NEW
│   │   ├── activity_log_views.py   # NEW
│   │   ├── audit_views.py          # NEW
│   │   └── policy_views.py         # NEW
│   └── services/
│       ├── rbac_service.py         # NEW
│       └── audit_logger.py         # NEW
├── billing/                        # NO STRUCTURAL CHANGE
│   └── # Existing structure maintained
└── notifications/                  # ENHANCED
    ├── models/
    │   ├── notification.py         # Existing
    │   ├── preference.py           # Existing
    │   ├── email.py                # Existing
    │   ├── sms.py                  # Existing
    │   ├── push.py                 # Existing
    │   └── notification_category.py # NEW (System, Security, License, Device)
    └── views/
        ├── notification_views.py
        ├── preference_views.py
        └── category_views.py       # NEW
```

### New Frontend Structure

```
frontend/app/
├── (auth)/                         # Login, Register, Reset [NO CHANGE]
├── dashboard/
│   ├── layout.tsx                  # Main dashboard layout
│   ├── page.tsx                    # Dashboard home/overview
│   │
│   ├── device-management/          # SECTION 1
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Overview
│   │   ├── devices/                # Connected Devices
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Device details
│   │   ├── health/                 # Device Health
│   │   │   └── page.tsx
│   │   ├── performance/            # Performance Metrics
│   │   │   └── page.tsx
│   │   ├── security/               # Security Status
│   │   │   └── page.tsx
│   │   ├── compliance/             # Compliance Check [NEW]
│   │   │   └── page.tsx
│   │   └── optimization/           # Optimization Tools [NEW]
│   │       └── page.tsx
│   │
│   ├── cloud-integrations/         # SECTION 2 [NEW]
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Overview
│   │   ├── microsoft-365/          # Microsoft 365
│   │   │   ├── page.tsx
│   │   │   ├── users/
│   │   │   │   └── page.tsx
│   │   │   ├── compliance/
│   │   │   │   └── page.tsx
│   │   │   └── licenses/
│   │   │       └── page.tsx
│   │   ├── google-workspace/       # Google Workspace
│   │   │   ├── page.tsx
│   │   │   ├── gmail/
│   │   │   │   └── page.tsx
│   │   │   └── drive/
│   │   │       └── page.tsx
│   │   ├── zoho/                   # Zoho & Others
│   │   │   └── page.tsx
│   │   ├── licenses/               # License Usage
│   │   │   └── page.tsx
│   │   ├── service-health/         # Service Health
│   │   │   └── page.tsx
│   │   └── sync-errors/            # Sync Errors
│   │       └── page.tsx
│   │
│   ├── ai-diagnostics/             # SECTION 3 [NEW]
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Overview
│   │   ├── real-time-scan/         # Real-Time Scan
│   │   │   └── page.tsx
│   │   ├── issues/                 # Issue Detection
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Issue details
│   │   ├── recommendations/        # Recommendations
│   │   │   └── page.tsx
│   │   ├── alerts/                 # System Alerts
│   │   │   └── page.tsx
│   │   └── auto-fix/               # Auto-Fix Actions
│   │       └── page.tsx
│   │
│   ├── network-security/           # SECTION 4 [NEW]
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Overview
│   │   ├── wifi-analysis/          # Wi-Fi Analysis
│   │   │   └── page.tsx
│   │   ├── threats/                # Threat Alerts
│   │   │   └── page.tsx
│   │   ├── patches/                # Patch Status
│   │   │   └── page.tsx
│   │   ├── antivirus/              # Antivirus Health
│   │   │   └── page.tsx
│   │   └── passwords/              # Password Strength
│   │       └── page.tsx
│   │
│   ├── support/                    # SECTION 5 (RENAMED from tickets)
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Overview
│   │   ├── ai-chat/                # AI Chat Support (also in main nav)
│   │   │   └── page.tsx
│   │   ├── tickets/                # Open Tickets
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Ticket details
│   │   ├── queue/                  # Technician Queue [NEW]
│   │   │   └── page.tsx
│   │   ├── remote-sessions/        # Remote Session Control
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Session details
│   │   └── history/                # Session History
│   │       └── page.tsx
│   │
│   ├── admin/                      # SECTION 6 [NEW]
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Overview
│   │   ├── users/                  # User Management
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx        # User details
│   │   ├── roles/                  # Roles & Permissions
│   │   │   ├── page.tsx
│   │   │   └── [id]/
│   │   │       └── page.tsx        # Role details
│   │   ├── activity-logs/          # Activity Logs
│   │   │   └── page.tsx
│   │   ├── audit-trail/            # Audit Trail
│   │   │   └── page.tsx
│   │   └── settings/               # Organization Settings
│   │       └── page.tsx
│   │
│   ├── billing/                    # SECTION 7 [ENHANCED]
│   │   ├── layout.tsx
│   │   ├── page.tsx                # Overview
│   │   ├── plans/                  # Plans & Usage
│   │   │   └── page.tsx
│   │   ├── payments/               # Payment History
│   │   │   └── page.tsx
│   │   └── renewals/               # Renewal Alerts
│   │       └── page.tsx
│   │
│   └── notifications/              # SECTION 8 [NEW]
│       ├── layout.tsx
│       ├── page.tsx                # All Notifications
│       ├── system/                 # System Messages
│       │   └── page.tsx
│       ├── security/               # Security Alerts
│       │   └── page.tsx
│       ├── licenses/               # License Reminders
│       │   └── page.tsx
│       └── devices/                # Device Warnings
│           └── page.tsx
│
├── ai-chat/                        # STANDALONE (Main Nav) [NEW]
│   └── page.tsx                    # Full AI chat interface
│
└── ...other pages (about, pricing, etc.)
```

---

## Backend Restructuring

### Phase 1: New Apps Creation

#### 1.1 Create `ai_diagnostics` App

**Purpose**: Handle automated diagnostics, issue detection, and recommendations

**Models**:
```python
# ai_diagnostics/models/diagnostic_scan.py
class DiagnosticScan(models.Model):
    device = models.ForeignKey('devices.Device')
    scan_type = models.CharField(choices=['FULL', 'QUICK', 'TARGETED'])
    status = models.CharField(choices=['PENDING', 'RUNNING', 'COMPLETED', 'FAILED'])
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True)
    issues_found = models.IntegerField(default=0)

# ai_diagnostics/models/detected_issue.py
class DetectedIssue(models.Model):
    scan = models.ForeignKey(DiagnosticScan, related_name='issues')
    category = models.CharField(choices=['HARDWARE', 'SOFTWARE', 'NETWORK', 'SECURITY'])
    severity = models.CharField(choices=['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
    title = models.CharField(max_length=255)
    description = models.TextField()
    auto_fixable = models.BooleanField(default=False)

# ai_diagnostics/models/recommendation.py
class Recommendation(models.Model):
    issue = models.ForeignKey(DetectedIssue, related_name='recommendations')
    title = models.CharField(max_length=255)
    description = models.TextField()
    steps = models.JSONField()  # List of step-by-step instructions
    estimated_time = models.IntegerField()  # Minutes
    risk_level = models.CharField(choices=['LOW', 'MEDIUM', 'HIGH'])

# ai_diagnostics/models/auto_fix_action.py
class AutoFixAction(models.Model):
    issue = models.ForeignKey(DetectedIssue)
    action_type = models.CharField(max_length=50)
    parameters = models.JSONField()
    status = models.CharField(choices=['PENDING', 'RUNNING', 'SUCCESS', 'FAILED', 'ROLLED_BACK'])
    executed_at = models.DateTimeField(auto_now_add=True)
    result = models.JSONField(null=True)
```

**API Endpoints**:
```
POST   /api/v1/ai-diagnostics/scans/                    # Create diagnostic scan
GET    /api/v1/ai-diagnostics/scans/                    # List scans
GET    /api/v1/ai-diagnostics/scans/{id}/               # Scan details
POST   /api/v1/ai-diagnostics/scans/{id}/start/         # Start scan
GET    /api/v1/ai-diagnostics/issues/                   # List issues
GET    /api/v1/ai-diagnostics/issues/{id}/              # Issue details
GET    /api/v1/ai-diagnostics/recommendations/          # List recommendations
POST   /api/v1/ai-diagnostics/auto-fix/                 # Execute auto-fix
GET    /api/v1/ai-diagnostics/auto-fix/{id}/            # Auto-fix status
```

#### 1.2 Create `network_security` App

**Purpose**: Handle Wi-Fi analysis, threat detection, patch management, antivirus monitoring

**Models**:
```python
# network_security/models/wifi_analysis.py
class WiFiAnalysis(models.Model):
    device = models.ForeignKey('devices.Device')
    ssid = models.CharField(max_length=255)
    signal_strength = models.IntegerField()  # dBm
    channel = models.IntegerField()
    frequency = models.FloatField()  # GHz
    download_speed = models.FloatField()  # Mbps
    upload_speed = models.FloatField()
    latency = models.FloatField()  # ms
    packet_loss = models.FloatField()  # percentage
    interference_detected = models.BooleanField(default=False)

# network_security/models/threat_detection.py
class ThreatDetection(models.Model):
    device = models.ForeignKey('devices.Device')
    threat_type = models.CharField(choices=['MALWARE', 'UNAUTHORIZED_ACCESS', 'RISKY_APP', 'PHISHING'])
    severity = models.CharField(choices=['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
    detected_at = models.DateTimeField(auto_now_add=True)
    status = models.CharField(choices=['ACTIVE', 'MITIGATED', 'FALSE_POSITIVE'])
    details = models.JSONField()

# network_security/models/patch_status.py
class PatchStatus(models.Model):
    device = models.ForeignKey('devices.Device')
    patch_type = models.CharField(choices=['OS_UPDATE', 'SECURITY_PATCH', 'DRIVER_UPDATE'])
    patch_name = models.CharField(max_length=255)
    current_version = models.CharField(max_length=100, null=True)
    available_version = models.CharField(max_length=100)
    severity = models.CharField(choices=['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'])
    release_date = models.DateField()
    installed = models.BooleanField(default=False)

# network_security/models/password_audit.py
class PasswordAudit(models.Model):
    user = models.ForeignKey('authentication.User')
    service = models.CharField(max_length=255)  # Which service/account
    strength_score = models.IntegerField()  # 0-100
    is_reused = models.BooleanField(default=False)
    last_changed = models.DateTimeField(null=True)
    days_since_change = models.IntegerField()
    compliant = models.BooleanField(default=True)
```

**API Endpoints**:
```
GET    /api/v1/network-security/wifi/                   # List Wi-Fi analyses
POST   /api/v1/network-security/wifi/analyze/           # Run Wi-Fi analysis
GET    /api/v1/network-security/threats/                # List threats
GET    /api/v1/network-security/threats/{id}/           # Threat details
POST   /api/v1/network-security/threats/{id}/mitigate/  # Mitigate threat
GET    /api/v1/network-security/patches/                # List missing patches
GET    /api/v1/network-security/patches/{id}/install/   # Install patch
GET    /api/v1/network-security/antivirus/              # Antivirus status
GET    /api/v1/network-security/passwords/              # Password audits
POST   /api/v1/network-security/passwords/audit/        # Run password audit
```

#### 1.3 Create `admin_controls` App

**Purpose**: Centralized admin features, RBAC, audit logging

**Models**:
```python
# admin_controls/models/activity_log.py
class ActivityLog(models.Model):
    user = models.ForeignKey('authentication.User')
    organization = models.ForeignKey('organizations.Organization')
    action = models.CharField(max_length=100)
    resource_type = models.CharField(max_length=50)
    resource_id = models.IntegerField(null=True)
    details = models.JSONField()
    ip_address = models.GenericIPAddressField()
    user_agent = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)

# admin_controls/models/audit_record.py
class AuditRecord(models.Model):
    organization = models.ForeignKey('organizations.Organization')
    event_type = models.CharField(max_length=100)
    actor = models.ForeignKey('authentication.User')
    target_user = models.ForeignKey('authentication.User', related_name='audit_targets', null=True)
    action = models.CharField(max_length=255)
    before_state = models.JSONField(null=True)
    after_state = models.JSONField(null=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    is_sensitive = models.BooleanField(default=False)
```

**API Endpoints**:
```
GET    /api/v1/admin/activity-logs/                     # List activity logs
GET    /api/v1/admin/activity-logs/export/              # Export logs
GET    /api/v1/admin/audit-trail/                       # List audit records
GET    /api/v1/admin/audit-trail/export/                # Export audit trail
GET    /api/v1/admin/users/                             # List users
POST   /api/v1/admin/users/                             # Create user
PUT    /api/v1/admin/users/{id}/                        # Update user
DELETE /api/v1/admin/users/{id}/                        # Delete user
GET    /api/v1/admin/roles/                             # List roles
POST   /api/v1/admin/roles/                             # Create custom role
```

### Phase 2: Rename/Reorganize Existing Apps

#### 2.1 Rename `devices` → `device_management`

**Changes**:
1. Rename app directory
2. Update `apps.py` to `DeviceManagementConfig`
3. Add new models: `DeviceCompliance`, `OptimizationAction`
4. Add new views: `ComplianceCheckView`, `OptimizationToolsView`
5. Update URL routing: `/api/v1/devices/` → `/api/v1/device-management/`

#### 2.2 Rename `integrations` → `cloud_integrations`

**Changes**:
1. Rename app directory
2. Update `apps.py` to `CloudIntegrationsConfig`
3. Add new models: `Microsoft365Account`, `GoogleWorkspaceAccount`, `ZohoAccount`, `LicenseTracking`
4. Add new views: Platform-specific views for each integration
5. Update URL routing: `/api/v1/integrations/` → `/api/v1/cloud-integrations/`

#### 2.3 Rename `tickets` → `support_escalation`

**Changes**:
1. Rename app directory
2. Update `apps.py` to `SupportEscalationConfig`
3. Add new model: `TechnicianQueue`
4. Add new views: `QueueManagementView`
5. Update URL routing: `/api/v1/tickets/` → `/api/v1/support/`

#### 2.4 Split `ai_engine` → `ai_chat` + integrate with `ai_diagnostics`

**Changes**:
1. Create new `ai_chat` app
2. Move chat-related models to `ai_chat`
3. Keep diagnostic logic in `ai_diagnostics`
4. Update URL routing:
   - `/api/v1/ai/` → `/api/v1/ai-chat/` (chat functionality)
   - `/api/v1/ai-diagnostics/` (new diagnostic functionality)

### Phase 3: Enhance Existing Apps

#### 3.1 `notifications` Enhancements

**Add**:
- Notification categories (System, Security, License, Device)
- Category-based filtering
- Enhanced preference management

#### 3.2 `billing` Enhancements

**Add**:
- Renewal alerts dashboard
- Usage tracking per plan limits
- Feature access control based on plan

---

## Frontend Restructuring

### Phase 1: Dashboard Navigation Structure

Update `frontend/app/dashboard/layout.tsx` to include new navigation:

```typescript
const dashboardNavigation = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: HomeIcon,
  },
  {
    name: 'Device Management',
    icon: ComputerDesktopIcon,
    children: [
      { name: 'Connected Devices', href: '/dashboard/device-management/devices' },
      { name: 'Device Health', href: '/dashboard/device-management/health' },
      { name: 'Performance Metrics', href: '/dashboard/device-management/performance' },
      { name: 'Security Status', href: '/dashboard/device-management/security' },
      { name: 'Compliance Check', href: '/dashboard/device-management/compliance' },
      { name: 'Optimization Tools', href: '/dashboard/device-management/optimization' },
    ],
  },
  {
    name: 'Cloud Integrations',
    icon: CloudIcon,
    children: [
      { name: 'Microsoft 365', href: '/dashboard/cloud-integrations/microsoft-365' },
      { name: 'Google Workspace', href: '/dashboard/cloud-integrations/google-workspace' },
      { name: 'Zoho & Others', href: '/dashboard/cloud-integrations/zoho' },
      { name: 'License Usage', href: '/dashboard/cloud-integrations/licenses' },
      { name: 'Service Health', href: '/dashboard/cloud-integrations/service-health' },
      { name: 'Sync Errors', href: '/dashboard/cloud-integrations/sync-errors' },
    ],
  },
  {
    name: 'AI Diagnostics',
    icon: CpuChipIcon,
    children: [
      { name: 'Real-Time Scan', href: '/dashboard/ai-diagnostics/real-time-scan' },
      { name: 'Detected Issues', href: '/dashboard/ai-diagnostics/issues' },
      { name: 'Recommendations', href: '/dashboard/ai-diagnostics/recommendations' },
      { name: 'System Alerts', href: '/dashboard/ai-diagnostics/alerts' },
      { name: 'Auto-Fix Actions', href: '/dashboard/ai-diagnostics/auto-fix' },
    ],
  },
  {
    name: 'Network & Security',
    icon: ShieldCheckIcon,
    children: [
      { name: 'Wi-Fi Analysis', href: '/dashboard/network-security/wifi-analysis' },
      { name: 'Threat Alerts', href: '/dashboard/network-security/threats' },
      { name: 'Patch Status', href: '/dashboard/network-security/patches' },
      { name: 'Antivirus Health', href: '/dashboard/network-security/antivirus' },
      { name: 'Password Strength', href: '/dashboard/network-security/passwords' },
    ],
  },
  {
    name: 'Support & Escalation',
    icon: LifebuoyIcon,
    children: [
      { name: 'AI Chat Support', href: '/dashboard/support/ai-chat' },
      { name: 'Open Tickets', href: '/dashboard/support/tickets' },
      { name: 'Technician Queue', href: '/dashboard/support/queue' },
      { name: 'Remote Sessions', href: '/dashboard/support/remote-sessions' },
      { name: 'Session History', href: '/dashboard/support/history' },
    ],
  },
  {
    name: 'Admin & Controls',
    icon: Cog6ToothIcon,
    children: [
      { name: 'User Management', href: '/dashboard/admin/users' },
      { name: 'Roles & Permissions', href: '/dashboard/admin/roles' },
      { name: 'Activity Logs', href: '/dashboard/admin/activity-logs' },
      { name: 'Audit Trail', href: '/dashboard/admin/audit-trail' },
      { name: 'Organization Settings', href: '/dashboard/admin/settings' },
    ],
  },
  {
    name: 'Billing & Subscriptions',
    icon: CreditCardIcon,
    children: [
      { name: 'Plans & Usage', href: '/dashboard/billing/plans' },
      { name: 'Payment History', href: '/dashboard/billing/payments' },
      { name: 'Renewal Alerts', href: '/dashboard/billing/renewals' },
    ],
  },
  {
    name: 'Notifications',
    icon: BellIcon,
    badge: unreadCount,
    children: [
      { name: 'All Notifications', href: '/dashboard/notifications' },
      { name: 'System Messages', href: '/dashboard/notifications/system' },
      { name: 'Security Alerts', href: '/dashboard/notifications/security' },
      { name: 'License Reminders', href: '/dashboard/notifications/licenses' },
      { name: 'Device Warnings', href: '/dashboard/notifications/devices' },
    ],
  },
];

// Add AI Chat to main navbar (outside dashboard)
const mainNavigation = [
  { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
  { name: 'AI Chat', href: '/ai-chat', icon: ChatBubbleLeftRightIcon },
  // ...other main nav items
];
```

### Phase 2: Create New Page Components

**Priority Order:**
1. Cloud Integrations section (highest business value)
2. AI Diagnostics section
3. Network & Security section
4. Admin & Controls section
5. Enhanced Notifications section
6. Enhanced Billing section

---

## Migration Strategy

### Database Migration Plan

1. **Create new apps** with initial migrations
2. **Rename apps** using Django's migration system
3. **Move data** from old models to new models (if splitting apps)
4. **Update foreign keys** and relationships
5. **Run migration tests** on staging environment
6. **Deploy to production** with rollback plan

### API Versioning

To maintain backward compatibility:

1. Keep `/api/v1/` endpoints working with deprecation warnings
2. Introduce `/api/v2/` with new structure
3. Document migration guide for API consumers
4. Set deprecation timeline (6 months)

### Frontend Migration

1. **Phase 1**: Add new routes alongside old ones
2. **Phase 2**: Update navigation to point to new routes
3. **Phase 3**: Redirect old routes to new ones
4. **Phase 4**: Remove old routes after transition period

---

## Implementation Plan

### Sprint 1: Backend Foundation (Week 1-2)

**Tasks:**
- [ ] Create `ai_diagnostics` app with models and basic views
- [ ] Create `network_security` app with models and basic views
- [ ] Create `admin_controls` app with models and basic views
- [ ] Write and run migrations
- [ ] Write unit tests for new models
- [ ] Update API documentation

### Sprint 2: Backend App Restructuring (Week 3-4)

**Tasks:**
- [ ] Rename `devices` to `device_management`
- [ ] Rename `integrations` to `cloud_integrations`
- [ ] Rename `tickets` to `support_escalation`
- [ ] Split `ai_engine` into `ai_chat`
- [ ] Update all foreign key references
- [ ] Update URL routing
- [ ] Run migration tests

### Sprint 3: Frontend Structure (Week 5-6)

**Tasks:**
- [ ] Create new dashboard navigation structure
- [ ] Create folder structure for all 8 sections
- [ ] Create layout components for each section
- [ ] Implement placeholder pages for all subsections
- [ ] Update routing configuration

### Sprint 4: Cloud Integrations UI (Week 7-8)

**Tasks:**
- [ ] Microsoft 365 integration pages
- [ ] Google Workspace integration pages
- [ ] Zoho integration pages
- [ ] License usage dashboard
- [ ] Service health monitoring UI

### Sprint 5: AI Diagnostics & Network Security UI (Week 9-10)

**Tasks:**
- [ ] Real-time scan interface
- [ ] Issue detection dashboard
- [ ] Recommendations UI
- [ ] Wi-Fi analysis visualizations
- [ ] Threat alerts dashboard
- [ ] Patch management UI

### Sprint 6: Admin & Enhanced Features (Week 11-12)

**Tasks:**
- [ ] User management interface
- [ ] Roles & permissions UI
- [ ] Activity logs viewer
- [ ] Audit trail interface
- [ ] Enhanced notifications center
- [ ] Enhanced billing dashboard

### Sprint 7: Testing & Documentation (Week 13-14)

**Tasks:**
- [ ] End-to-end testing
- [ ] API integration tests
- [ ] UI component tests
- [ ] Performance testing
- [ ] Update documentation
- [ ] Migration guide for users

### Sprint 8: Deployment & Monitoring (Week 15-16)

**Tasks:**
- [ ] Staging deployment
- [ ] User acceptance testing
- [ ] Production deployment
- [ ] Monitoring setup
- [ ] Rollback procedures
- [ ] Post-deployment support

---

## Success Metrics

1. **Code Organization**: 100% alignment with dashboard structure
2. **Test Coverage**: Maintain >80% code coverage
3. **API Response Time**: <2s for all endpoints
4. **Zero Downtime**: Seamless migration with no service interruption
5. **User Adoption**: >90% of users transition to new structure within 1 month

---

## Risks & Mitigation

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Database migration failures | High | Low | Comprehensive testing, rollback plan |
| API breaking changes | High | Medium | Maintain v1, introduce v2 gradually |
| Frontend routing conflicts | Medium | Low | Careful planning, redirect strategy |
| User confusion | Medium | High | Clear documentation, in-app guides |
| Performance degradation | High | Low | Load testing, optimization |

---

## Conclusion

This restructuring plan provides a clear roadmap to align ITPilot's technical architecture with the 8-section dashboard structure defined in the SRS. By following this phased approach, we can:

1. Improve code maintainability and developer experience
2. Enhance user navigation and feature discoverability
3. Enable faster feature development in the future
4. Maintain backward compatibility during transition
5. Deliver a world-class IT support platform

**Estimated Timeline**: 16 weeks (4 months)
**Team Size**: 4-6 developers (2 backend, 2 frontend, 1 full-stack, 1 QA)

---

**Document Version**: 1.0
**Last Updated**: November 22, 2025
**Status**: Ready for Review & Approval
