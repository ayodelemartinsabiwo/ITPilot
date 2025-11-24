/**
 * Admin Service
 * Handles all admin and organization-related API calls
 */

import { api, ApiResponse } from '../client'
import { API_ENDPOINTS } from '../config'

export interface AdminUser {
  id: string
  email: string
  first_name: string
  last_name: string
  full_name: string
  role: 'admin' | 'manager' | 'technician' | 'user'
  is_active: boolean
  is_staff: boolean
  date_joined: string
  last_login?: string
  organization: string
}

export interface Role {
  id: string
  name: string
  description: string
  permissions: Permission[]
  is_custom: boolean
  created_at: string
  updated_at: string
}

export interface Permission {
  id: string
  name: string
  codename: string
  description: string
}

export interface ActivityLog {
  id: string
  user: {
    id: string
    name: string
    email: string
  }
  action: string
  resource_type: string
  resource_id?: string
  details: Record<string, any>
  ip_address: string
  user_agent: string
  timestamp: string
}

export interface AuditRecord {
  id: string
  organization: string
  event_type: string
  actor: {
    id: string
    name: string
    email: string
  }
  target_user?: {
    id: string
    name: string
    email: string
  }
  action: string
  before_state?: Record<string, any>
  after_state?: Record<string, any>
  timestamp: string
  is_sensitive: boolean
}

export interface Organization {
  id: string
  name: string
  domain: string
  subscription_plan: 'personal' | 'business_lite' | 'enterprise'
  created_at: string
  updated_at: string
  settings: OrganizationSettings
  members_count: number
  devices_count: number
}

export interface OrganizationSettings {
  allow_device_auto_registration: boolean
  require_mfa: boolean
  session_timeout: number
  allowed_ip_ranges?: string[]
  data_retention_days: number
  enable_audit_logs: boolean
}

export interface CreateUserData {
  email: string
  first_name: string
  last_name: string
  role: string
  send_invite_email?: boolean
}

export interface UpdateUserData {
  first_name?: string
  last_name?: string
  role?: string
  is_active?: boolean
}

class AdminService {
  /**
   * Get all users in organization
   */
  async getUsers(): Promise<ApiResponse<AdminUser[]>> {
    return api.get<ApiResponse<AdminUser[]>>(API_ENDPOINTS.users.list)
  }

  /**
   * Get single user by ID
   */
  async getUser(id: string): Promise<ApiResponse<AdminUser>> {
    return api.get<ApiResponse<AdminUser>>(API_ENDPOINTS.users.detail(id))
  }

  /**
   * Create new user
   */
  async createUser(data: CreateUserData): Promise<ApiResponse<AdminUser>> {
    return api.post<ApiResponse<AdminUser>>(API_ENDPOINTS.users.list, data)
  }

  /**
   * Update user
   */
  async updateUser(id: string, data: UpdateUserData): Promise<ApiResponse<AdminUser>> {
    return api.patch<ApiResponse<AdminUser>>(API_ENDPOINTS.users.detail(id), data)
  }

  /**
   * Delete user
   */
  async deleteUser(id: string): Promise<ApiResponse<void>> {
    return api.delete<ApiResponse<void>>(API_ENDPOINTS.users.detail(id))
  }

  /**
   * Get all roles
   */
  async getRoles(): Promise<ApiResponse<Role[]>> {
    return api.get<ApiResponse<Role[]>>('/roles/')
  }

  /**
   * Get single role by ID
   */
  async getRole(id: string): Promise<ApiResponse<Role>> {
    return api.get<ApiResponse<Role>>(`/roles/${id}/`)
  }

  /**
   * Create custom role
   */
  async createRole(data: Partial<Role>): Promise<ApiResponse<Role>> {
    return api.post<ApiResponse<Role>>('/roles/', data)
  }

  /**
   * Update role
   */
  async updateRole(id: string, data: Partial<Role>): Promise<ApiResponse<Role>> {
    return api.patch<ApiResponse<Role>>(`/roles/${id}/`, data)
  }

  /**
   * Delete role
   */
  async deleteRole(id: string): Promise<ApiResponse<void>> {
    return api.delete<ApiResponse<void>>(`/roles/${id}/`)
  }

  /**
   * Get all permissions
   */
  async getPermissions(): Promise<ApiResponse<Permission[]>> {
    return api.get<ApiResponse<Permission[]>>('/permissions/')
  }

  /**
   * Get activity logs
   */
  async getActivityLogs(params?: {
    user_id?: string
    action?: string
    start_date?: string
    end_date?: string
    page?: number
  }): Promise<ApiResponse<ActivityLog[]>> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    return api.get<ApiResponse<ActivityLog[]>>(`/activity-logs/${queryString}`)
  }

  /**
   * Export activity logs
   */
  async exportActivityLogs(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    return api.get<Blob>(`/activity-logs/export/?format=${format}`, {
      responseType: 'blob',
    })
  }

  /**
   * Get audit trail
   */
  async getAuditTrail(params?: {
    event_type?: string
    actor_id?: string
    start_date?: string
    end_date?: string
    page?: number
  }): Promise<ApiResponse<AuditRecord[]>> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    return api.get<ApiResponse<AuditRecord[]>>(`/audit-trail/${queryString}`)
  }

  /**
   * Export audit trail
   */
  async exportAuditTrail(format: 'csv' | 'json' = 'csv'): Promise<Blob> {
    return api.get<Blob>(`/audit-trail/export/?format=${format}`, {
      responseType: 'blob',
    })
  }

  /**
   * Get organization details
   */
  async getOrganization(): Promise<ApiResponse<Organization>> {
    return api.get<ApiResponse<Organization>>('/organizations/me/')
  }

  /**
   * Update organization settings
   */
  async updateOrganizationSettings(settings: Partial<OrganizationSettings>): Promise<ApiResponse<Organization>> {
    return api.patch<ApiResponse<Organization>>('/organizations/me/settings/', settings)
  }

  /**
   * Get organization members
   */
  async getOrganizationMembers(): Promise<ApiResponse<AdminUser[]>> {
    return api.get<ApiResponse<AdminUser[]>>('/organizations/me/members/')
  }

  /**
   * Invite user to organization
   */
  async inviteUser(email: string, role: string): Promise<ApiResponse<any>> {
    return api.post<ApiResponse<any>>('/organizations/me/invite/', {
      email,
      role,
    })
  }
}

export const adminService = new AdminService()
