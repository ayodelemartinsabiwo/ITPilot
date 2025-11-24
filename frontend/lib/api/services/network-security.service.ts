/**
 * Network Security Service
 * Handles all network security-related API calls
 */

import { api, ApiResponse } from '../client'

// Types
export interface WiFiNetwork {
  id: string
  device: string
  device_name: string
  ssid: string
  bssid: string
  channel: number
  frequency: number
  signal_strength: number
  security_type: string
  encryption: string
  is_connected: boolean
  speed_mbps?: number
  quality_score?: number
  detected_at: string
  last_seen: string
}

export interface ThreatDetection {
  id: string
  device?: string
  device_name?: string
  threat_type: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  title: string
  description: string
  source_ip?: string
  destination_ip?: string
  port?: number
  status: 'ACTIVE' | 'INVESTIGATING' | 'BLOCKED' | 'RESOLVED'
  action_taken?: string
  detected_at: string
  resolved_at?: string
  created_at: string
}

export interface PatchStatus {
  id: string
  device: string
  device_name: string
  patch_type: 'SECURITY' | 'FEATURE' | 'BUGFIX' | 'DRIVER'
  title: string
  description: string
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  kb_number?: string
  status: 'AVAILABLE' | 'DOWNLOADING' | 'INSTALLING' | 'INSTALLED' | 'FAILED'
  install_status?: string
  size_mb?: number
  available_date?: string
  installed_at?: string
  created_at: string
}

export interface AntivirusStatus {
  id: string
  device: string
  device_name: string
  antivirus_name: string
  version: string
  is_active: boolean
  is_updated: boolean
  last_scan?: string
  last_update?: string
  threats_detected: number
  threats_quarantined: number
  real_time_protection: boolean
  auto_updates_enabled: boolean
  status: 'PROTECTED' | 'AT_RISK' | 'WARNING' | 'UPDATING'
  created_at: string
  updated_at: string
}

export interface PasswordAudit {
  id: string
  device: string
  device_name: string
  account_type: string
  account_name: string
  strength_score: number
  has_uppercase: boolean
  has_lowercase: boolean
  has_numbers: boolean
  has_special_chars: boolean
  length: number
  is_compromised: boolean
  is_reused: boolean
  last_changed?: string
  recommendations: string[]
  status: 'STRONG' | 'MEDIUM' | 'WEAK' | 'COMPROMISED'
  created_at: string
}

export interface NetworkSecurityStats {
  active_threats: number
  blocked_attacks: number
  protected_devices: number
  pending_patches: number
  critical_patches: number
  antivirus_protected: number
  antivirus_at_risk: number
  weak_passwords: number
  compromised_passwords: number
  active_networks: number
  network_health: 'GOOD' | 'WARNING' | 'CRITICAL'
}

class NetworkSecurityService {
  // WiFi Analysis
  async getWiFiNetworks(params?: {
    device?: string
    is_connected?: boolean
    ordering?: string
  }): Promise<ApiResponse<WiFiNetwork[]>> {
    return api.get<ApiResponse<WiFiNetwork[]>>('/network-security/wifi/', { params })
  }

  async getWiFiNetwork(id: string): Promise<ApiResponse<WiFiNetwork>> {
    return api.get<ApiResponse<WiFiNetwork>>(`/network-security/wifi/${id}/`)
  }

  async scanWiFiNetworks(deviceId: string): Promise<ApiResponse<WiFiNetwork[]>> {
    return api.post<ApiResponse<WiFiNetwork[]>>('/network-security/wifi/scan/', { device: deviceId })
  }

  // Threat Detection
  async getThreats(params?: {
    device?: string
    threat_type?: string
    severity?: string
    status?: string
    ordering?: string
  }): Promise<ApiResponse<ThreatDetection[]>> {
    return api.get<ApiResponse<ThreatDetection[]>>('/network-security/threats/', { params })
  }

  async getThreat(id: string): Promise<ApiResponse<ThreatDetection>> {
    return api.get<ApiResponse<ThreatDetection>>(`/network-security/threats/${id}/`)
  }

  async blockThreat(id: string): Promise<ApiResponse<ThreatDetection>> {
    return api.post<ApiResponse<ThreatDetection>>(`/network-security/threats/${id}/block/`)
  }

  async resolveThreat(id: string, actionTaken: string): Promise<ApiResponse<ThreatDetection>> {
    return api.post<ApiResponse<ThreatDetection>>(`/network-security/threats/${id}/resolve/`, {
      action_taken: actionTaken
    })
  }

  // Patch Status
  async getPatches(params?: {
    device?: string
    patch_type?: string
    severity?: string
    status?: string
    ordering?: string
  }): Promise<ApiResponse<PatchStatus[]>> {
    return api.get<ApiResponse<PatchStatus[]>>('/network-security/patches/', { params })
  }

  async getPatch(id: string): Promise<ApiResponse<PatchStatus>> {
    return api.get<ApiResponse<PatchStatus>>(`/network-security/patches/${id}/`)
  }

  async installPatch(id: string): Promise<ApiResponse<PatchStatus>> {
    return api.post<ApiResponse<PatchStatus>>(`/network-security/patches/${id}/install/`)
  }

  async checkForPatches(deviceId: string): Promise<ApiResponse<PatchStatus[]>> {
    return api.post<ApiResponse<PatchStatus[]>>('/network-security/patches/check/', { device: deviceId })
  }

  // Antivirus Status
  async getAntivirusStatuses(params?: {
    device?: string
    status?: string
    is_active?: boolean
    ordering?: string
  }): Promise<ApiResponse<AntivirusStatus[]>> {
    return api.get<ApiResponse<AntivirusStatus[]>>('/network-security/antivirus/', { params })
  }

  async getAntivirusStatus(id: string): Promise<ApiResponse<AntivirusStatus>> {
    return api.get<ApiResponse<AntivirusStatus>>(`/network-security/antivirus/${id}/`)
  }

  async runAntivirusScan(deviceId: string): Promise<ApiResponse<AntivirusStatus>> {
    return api.post<ApiResponse<AntivirusStatus>>('/network-security/antivirus/scan/', { device: deviceId })
  }

  async updateAntivirusDefinitions(deviceId: string): Promise<ApiResponse<AntivirusStatus>> {
    return api.post<ApiResponse<AntivirusStatus>>('/network-security/antivirus/update/', { device: deviceId })
  }

  // Password Audit
  async getPasswordAudits(params?: {
    device?: string
    status?: string
    ordering?: string
  }): Promise<ApiResponse<PasswordAudit[]>> {
    return api.get<ApiResponse<PasswordAudit[]>>('/network-security/passwords/', { params })
  }

  async getPasswordAudit(id: string): Promise<ApiResponse<PasswordAudit>> {
    return api.get<ApiResponse<PasswordAudit>>(`/network-security/passwords/${id}/`)
  }

  async runPasswordAudit(deviceId: string): Promise<ApiResponse<PasswordAudit[]>> {
    return api.post<ApiResponse<PasswordAudit[]>>('/network-security/passwords/audit/', { device: deviceId })
  }

  // Statistics
  async getStats(): Promise<ApiResponse<NetworkSecurityStats>> {
    return api.get<ApiResponse<NetworkSecurityStats>>('/network-security/stats/')
  }
}

export const networkSecurityService = new NetworkSecurityService()
