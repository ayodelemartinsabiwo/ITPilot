# ITPilot Restructuring Implementation Guide

**Date:** November 22, 2025
**Status:** In Progress

---

## Summary of Changes

This document tracks the implementation of the ITPilot restructuring plan to align with the new 8-section dashboard architecture.

---

## Backend Changes

### ✅ New Apps Created

#### 1. **ai_diagnostics**
**Location:** `/backend/ai_diagnostics/`
**Purpose:** Automated diagnostics, issue detection, recommendations, auto-fix actions

**Models:**
- `DiagnosticScan` - Tracks diagnostic scans (FULL, QUICK, TARGETED, SCHEDULED)
- `DetectedIssue` - Issues found during scans (HARDWARE, SOFTWARE, NETWORK, SECURITY)
- `Recommendation` - Fix recommendations with steps and risk levels
- `SystemAlert` - System alerts from diagnostics (CRITICAL, WARNING, INFO)
- `AutoFixAction` - Automated fix actions with rollback capability

**API Endpoints** (to be implemented):
```
POST   /api/v1/ai-diagnostics/scans/
GET    /api/v1/ai-diagnostics/scans/
GET    /api/v1/ai-diagnostics/scans/{id}/
POST   /api/v1/ai-diagnostics/scans/{id}/start/
GET    /api/v1/ai-diagnostics/issues/
GET    /api/v1/ai-diagnostics/recommendations/
POST   /api/v1/ai-diagnostics/auto-fix/
```

**Status:** ✅ Models created, Admin configured

---

#### 2. **network_security** (To be created)
**Location:** `/backend/network_security/`
**Purpose:** Wi-Fi analysis, threat detection, patch management, antivirus monitoring

**Models to create:**
- `WiFiAnalysis` - Wi-Fi network analysis (signal, speed, latency, interference)
- `ThreatDetection` - Security threats (malware, unauthorized access, risky apps)
- `PatchStatus` - Missing patches and updates
- `AntivirusStatus` - Antivirus health monitoring
- `PasswordAudit` - Password strength and compliance

**API Endpoints:**
```
GET    /api/v1/network-security/wifi/
POST   /api/v1/network-security/wifi/analyze/
GET    /api/v1/network-security/threats/
POST   /api/v1/network-security/threats/{id}/mitigate/
GET    /api/v1/network-security/patches/
GET    /api/v1/network-security/passwords/
```

**Status:** ⏳ Pending

---

#### 3. **admin_controls** (To be created)
**Location:** `/backend/admin_controls/`
**Purpose:** User management, RBAC, activity logging, audit trail

**Models to create:**
- `ActivityLog` - User activity tracking
- `AuditRecord` - Immutable audit records
- `CustomRole` - Custom role definitions
- `Permission` - Granular permissions

**API Endpoints:**
```
GET    /api/v1/admin/activity-logs/
GET    /api/v1/admin/audit-trail/
GET    /api/v1/admin/users/
POST   /api/v1/admin/users/
GET    /api/v1/admin/roles/
```

**Status:** ⏳ Pending

---

### 🔄 App Renaming/Restructuring (To be done)

#### 1. **devices** → **device_management**
**Changes needed:**
- Rename app directory
- Update `apps.py` to `DeviceManagementConfig`
- Add models: `DeviceCompliance`, `OptimizationAction`
- Add endpoints for compliance and optimization
- Update all URL references
- Update foreign key imports in other apps

#### 2. **integrations** → **cloud_integrations**
**Changes needed:**
- Rename app directory
- Update `apps.py` to `CloudIntegrationsConfig`
- Add models: `Microsoft365Account`, `GoogleWorkspaceAccount`, `ZohoAccount`, `LicenseTracking`
- Add platform-specific views
- Update URL routing

#### 3. **tickets** → **support_escalation**
**Changes needed:**
- Rename app directory
- Update `apps.py` to `SupportEscalationConfig`
- Add model: `TechnicianQueue`
- Add queue management views
- Update URL routing to `/api/v1/support/`

#### 4. **ai_engine** → Split into **ai_chat** + integrate with **ai_diagnostics**
**Changes needed:**
- Create `ai_chat` app
- Move chat models to `ai_chat`
- Keep diagnostic features in `ai_diagnostics`
- Update URL routing

---

### 📦 Apps to Keep As-Is

- ✅ **authentication** - No changes needed
- ✅ **organizations** - No changes needed
- ✅ **remote_access** - No changes needed
- ✅ **billing** - Minor enhancements only
- ✅ **notifications** - Add notification categories

---

## Frontend Changes

### New Dashboard Structure

```
frontend/app/dashboard/
├── layout.tsx                      # Updated with new navigation
├── page.tsx                        # Dashboard overview
│
├── device-management/              # SECTION 1 ✅ Partial (renamed from devices)
│   ├── devices/                    # ✅ Exists
│   ├── health/                     # 🆕 New
│   ├── performance/                # 🆕 New
│   ├── security/                   # 🆕 New
│   ├── compliance/                 # 🆕 New
│   └── optimization/               # 🆕 New
│
├── cloud-integrations/             # SECTION 2 🆕 All New
│   ├── microsoft-365/
│   ├── google-workspace/
│   ├── zoho/
│   ├── licenses/
│   ├── service-health/
│   └── sync-errors/
│
├── ai-diagnostics/                 # SECTION 3 🆕 All New
│   ├── real-time-scan/
│   ├── issues/
│   ├── recommendations/
│   ├── alerts/
│   └── auto-fix/
│
├── network-security/               # SECTION 4 🆕 All New
│   ├── wifi-analysis/
│   ├── threats/
│   ├── patches/
│   ├── antivirus/
│   └── passwords/
│
├── support/                        # SECTION 5 🔄 Renamed from tickets
│   ├── ai-chat/                    # 🔄 Moved from dashboard/chat
│   ├── tickets/                    # ✅ Exists
│   ├── queue/                      # 🆕 New
│   ├── remote-sessions/            # 🆕 New
│   └── history/                    # 🆕 New
│
├── admin/                          # SECTION 6 🔄 Enhanced from users
│   ├── users/                      # ✅ Exists (from dashboard/users)
│   ├── roles/                      # 🆕 New
│   ├── activity-logs/              # 🆕 New
│   ├── audit-trail/                # 🆕 New
│   └── settings/                   # 🔄 Moved from dashboard/settings
│
├── billing/                        # SECTION 7 🆕 New
│   ├── plans/
│   ├── payments/
│   └── renewals/
│
└── notifications/                  # SECTION 8 🆕 All New
    ├── system/
    ├── security/
    ├── licenses/
    └── devices/
```

### Standalone AI Chat
```
frontend/app/ai-chat/page.tsx       # 🆕 New - Quick access from main nav
```

---

## Implementation Status

### Completed ✅
1. ✅ SRS Document created with PURPOSE, ACHIEVEMENT, DASHBOARD STRUCTURE
2. ✅ Restructuring Plan document created
3. ✅ Implementation Guide created (this document)
4. ✅ Backend Analysis completed
5. ✅ `ai_diagnostics` app created (models + admin)

### In Progress ⏳
6. ⏳ Creating `network_security` app
7. ⏳ Creating `admin_controls` app
8. ⏳ Creating remaining views/serializers/URLs for new apps

### Pending 📋
9. 📋 Rename existing backend apps
10. 📋 Update all foreign key references
11. 📋 Create database migrations
12. 📋 Update `core/settings.py` to register new apps
13. 📋 Update `core/urls.py` with new routing
14. 📋 Create frontend dashboard structure
15. 📋 Update navigation components
16. 📋 Create placeholder pages for all sections
17. 📋 Implement API integration for new sections
18. 📋 Testing and validation
19. 📋 Documentation updates
20. 📋 Commit and push changes

---

## Next Steps

### Immediate Actions (Current Sprint)

1. **Complete Backend Apps Creation:**
   - ✅ `ai_diagnostics` - DONE
   - Create `network_security`
   - Create `admin_controls`

2. **Create Views & Serializers:**
   - AI Diagnostics views & serializers
   - Network Security views & serializers
   - Admin Controls views & serializers

3. **Update Django Configuration:**
   - Register new apps in `settings.py`
   - Create URL routing in `core/urls.py`
   - Run `makemigrations` and `migrate`

4. **Frontend Dashboard Restructuring:**
   - Update dashboard layout with new navigation
   - Create folder structure for all 8 sections
   - Create placeholder pages for each subsection
   - Implement API hooks for data fetching

5. **Testing:**
   - Backend API endpoint testing
   - Frontend routing testing
   - Integration testing

6. **Commit & Push:**
   - Commit all changes with descriptive messages
   - Push to branch `claude/analyze-codebase-01FUSHervPJwA32f3V4vmqr7`

---

## Database Migration Notes

### New Tables to be Created:

**ai_diagnostics:**
- `ai_diagnostics_diagnosticscan`
- `ai_diagnostics_detectedissue`
- `ai_diagnostics_recommendation`
- `ai_diagnostics_systemalert`
- `ai_diagnostics_autofixaction`

**network_security:**
- `network_security_wifianalysis`
- `network_security_threatdetection`
- `network_security_patchstatus`
- `network_security_antivirusstatus`
- `network_security_passwordaudit`

**admin_controls:**
- `admin_controls_activitylog`
- `admin_controls_auditrecord`
- `admin_controls_customrole`
- `admin_controls_permission`

### Tables to be Renamed:

- `devices_*` → `device_management_*`
- `integrations_*` → `cloud_integrations_*`
- `tickets_*` → `support_escalation_*`
- Split `ai_engine_*` into `ai_chat_*` tables

---

## URL Routing Changes

### New API Routes:

```python
# core/urls.py

urlpatterns = [
    # Existing routes
    path('api/v1/auth/', include('authentication.urls')),
    path('api/v1/organizations/', include('organizations.urls')),
    path('api/v1/billing/', include('billing.urls')),
    path('api/v1/remote-access/', include('remote_access.urls')),
    path('api/v1/notifications/', include('notifications.urls')),

    # Renamed routes
    path('api/v1/device-management/', include('device_management.urls')),  # was devices
    path('api/v1/cloud-integrations/', include('cloud_integrations.urls')),  # was integrations
    path('api/v1/support/', include('support_escalation.urls')),  # was tickets
    path('api/v1/ai-chat/', include('ai_chat.urls')),  # split from ai_engine

    # New routes
    path('api/v1/ai-diagnostics/', include('ai_diagnostics.urls')),
    path('api/v1/network-security/', include('network_security.urls')),
    path('api/v1/admin/', include('admin_controls.urls')),
]
```

---

## Configuration Updates

### settings.py Changes

```python
INSTALLED_APPS = [
    # Django apps
    'django.contrib.admin',
    'django.contrib.auth',
    # ... other Django apps

    # Third-party apps
    'rest_framework',
    'channels',
    # ... other third-party apps

    # ITPilot apps
    'common',
    'authentication',
    'organizations',
    'device_management',  # renamed from devices
    'cloud_integrations',  # renamed from integrations
    'ai_diagnostics',  # NEW
    'ai_chat',  # NEW (split from ai_engine)
    'network_security',  # NEW
    'support_escalation',  # renamed from tickets
    'remote_access',
    'admin_controls',  # NEW
    'billing',
    'notifications',
]
```

---

## Testing Checklist

### Backend Tests
- [ ] All new models can be created
- [ ] Database migrations run successfully
- [ ] API endpoints return correct responses
- [ ] Authentication/authorization works
- [ ] Foreign key relationships are correct
- [ ] Admin interface works for all models

### Frontend Tests
- [ ] All routes are accessible
- [ ] Navigation works correctly
- [ ] API calls succeed
- [ ] Data displays correctly
- [ ] Responsive design works
- [ ] No console errors

### Integration Tests
- [ ] End-to-end user workflows
- [ ] Cross-module functionality
- [ ] Real-time updates via WebSocket
- [ ] Notification delivery
- [ ] Permission-based access control

---

## Rollback Plan

If issues arise during deployment:

1. **Database:** Revert migrations using `python manage.py migrate <app> <previous_migration>`
2. **Code:** Revert git commit using `git revert <commit_hash>`
3. **Frontend:** Redeploy previous frontend build
4. **Backend:** Redeploy previous backend version

---

## Documentation Updates Required

1. ✅ **SRS.md** - Created
2. ✅ **RESTRUCTURING_PLAN.md** - Created
3. ✅ **IMPLEMENTATION_GUIDE.md** - This document
4. 📋 **API_DOCUMENTATION.md** - Update with new endpoints
5. 📋 **README.md** - Update with new structure
6. 📋 **DEPLOYMENT.md** - Update deployment steps
7. 📋 Create migration guide for existing users

---

## Success Criteria

✅ **Backend:**
- All new apps created and registered
- Database migrations successful
- API endpoints functional
- Admin interface working
- Tests passing (>80% coverage)

✅ **Frontend:**
- All 8 dashboard sections accessible
- Navigation working correctly
- Placeholder pages for all subsections
- API integration working
- Responsive design maintained

✅ **Integration:**
- End-to-end workflows functional
- No breaking changes for existing users
- Performance maintained (<2s API response)
- Zero downtime deployment

---

**Last Updated:** November 22, 2025 22:45 UTC
**Updated By:** Claude AI Assistant
**Next Review:** After backend apps completion
