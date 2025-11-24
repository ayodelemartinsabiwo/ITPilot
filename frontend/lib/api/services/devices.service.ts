/**
 * Devices Service
 * Handles all device-related API calls for Device Management
 */

import { api, ApiResponse } from '../client'
import { API_ENDPOINTS } from '../config'

export interface Device {
  id: string
  device_name: string
  device_type: 'desktop' | 'laptop' | 'server' | 'mobile'
  operating_system: string
  os_version: string
  ip_address: string
  mac_address: string
  status: 'online' | 'offline' | 'maintenance'
  last_seen: string
  organization: string
  agent_version: string
  created_at: string
  updated_at: string
  health_score: number
  compliance_status: 'compliant' | 'non_compliant' | 'warning'
}

export interface DeviceHealth {
  device_id: string
  cpu_usage: number
  ram_usage: number
  disk_usage: number
  battery_level?: number
  temperature?: number
  health_score: number
  status: 'healthy' | 'warning' | 'critical'
  issues: string[]
  timestamp: string
}

export interface DeviceMetrics {
  device_id: string
  cpu_history: MetricPoint[]
  ram_history: MetricPoint[]
  disk_history: MetricPoint[]
  network_usage: {
    upload: number
    download: number
  }
  uptime: number
  processes_count: number
}

export interface MetricPoint {
  timestamp: string
  value: number
}

export interface DeviceSecurity {
  device_id: string
  encryption_enabled: boolean
  firewall_enabled: boolean
  antivirus_active: boolean
  last_scan: string
  threats_detected: number
  password_protected: boolean
  auto_updates_enabled: boolean
  compliance_issues: string[]
}

export interface DeviceCompliance {
  device_id: string
  is_compliant: boolean
  compliance_score: number
  policies_met: number
  policies_total: number
  violations: ComplianceViolation[]
  last_checked: string
}

export interface ComplianceViolation {
  id: string
  policy_name: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  remediation_steps: string[]
}

export interface DeviceOptimization {
  device_id: string
  recommendations: OptimizationRecommendation[]
  potential_improvement: number
  last_optimized: string
}

export interface OptimizationRecommendation {
  id: string
  type: 'storage' | 'performance' | 'security' | 'updates'
  title: string
  description: string
  impact: 'low' | 'medium' | 'high'
  auto_fixable: boolean
}

class DevicesService {
  /**
   * Get all devices
   */
  async getDevices(): Promise<ApiResponse<Device[]>> {
    return api.get<ApiResponse<Device[]>>(API_ENDPOINTS.devices.list)
  }

  /**
   * Get single device by ID
   */
  async getDevice(id: string): Promise<ApiResponse<Device>> {
    return api.get<ApiResponse<Device>>(API_ENDPOINTS.devices.detail(id))
  }

  /**
   * Get device health metrics
   */
  async getDeviceHealth(id: string): Promise<ApiResponse<DeviceHealth>> {
    return api.get<ApiResponse<DeviceHealth>>(API_ENDPOINTS.devices.health(id))
  }

  /**
   * Get device performance metrics
   */
  async getDeviceMetrics(id: string): Promise<ApiResponse<DeviceMetrics>> {
    return api.get<ApiResponse<DeviceMetrics>>(API_ENDPOINTS.devices.metrics(id))
  }

  /**
   * Get device health history
   */
  async getDeviceHealthHistory(id: string, hours: number = 24): Promise<ApiResponse<DeviceHealth[]>> {
    return api.get<ApiResponse<DeviceHealth[]>>(`/devices/${id}/health_history/?hours=${hours}`)
  }

  /**
   * Get device security status
   */
  async getDeviceSecurity(id: string): Promise<ApiResponse<DeviceSecurity>> {
    return api.get<ApiResponse<DeviceSecurity>>(`/devices/${id}/security/`)
  }

  /**
   * Get device compliance status
   */
  async getDeviceCompliance(id: string): Promise<ApiResponse<DeviceCompliance>> {
    return api.get<ApiResponse<DeviceCompliance>>(`/devices/${id}/compliance/`)
  }

  /**
   * Get device optimization recommendations
   */
  async getDeviceOptimizations(id: string): Promise<ApiResponse<DeviceOptimization>> {
    return api.get<ApiResponse<DeviceOptimization>>(`/devices/${id}/optimizations/`)
  }

  /**
   * Apply optimization
   */
  async applyOptimization(deviceId: string, recommendationId: string): Promise<ApiResponse<any>> {
    return api.post<ApiResponse<any>>(`/devices/${deviceId}/optimizations/${recommendationId}/apply/`)
  }

  /**
   * Update device
   */
  async updateDevice(id: string, data: Partial<Device>): Promise<ApiResponse<Device>> {
    return api.patch<ApiResponse<Device>>(API_ENDPOINTS.devices.detail(id), data)
  }

  /**
   * Delete device
   */
  async deleteDevice(id: string): Promise<ApiResponse<void>> {
    return api.delete<ApiResponse<void>>(API_ENDPOINTS.devices.detail(id))
  }

  /**
   * Get device statistics
   */
  async getDeviceStats(): Promise<ApiResponse<any>> {
    return api.get<ApiResponse<any>>('/devices/stats/')
  }
}

export const devicesService = new DevicesService()
