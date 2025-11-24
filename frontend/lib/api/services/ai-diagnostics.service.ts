/**
 * AI Diagnostics Service
 * Handles all AI diagnostics-related API calls
 */

import { api, ApiResponse } from '../client'

// Types
export interface DiagnosticScan {
  id: string
  device: string
  device_name: string
  scan_type: 'QUICK' | 'FULL' | 'DEEP' | 'SCHEDULED'
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'CANCELLED'
  issues_found: number
  critical_issues: number
  high_issues: number
  medium_issues: number
  low_issues: number
  started_at?: string
  completed_at?: string
  error_message?: string
  created_at: string
  updated_at: string
}

export interface DetectedIssue {
  id: string
  device: string
  device_name: string
  scan?: string
  category: string
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  title: string
  description: string
  status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'IGNORED'
  auto_fixable: boolean
  detected_at: string
  resolved_at?: string
  created_at: string
}

export interface Recommendation {
  id: string
  device?: string
  device_name?: string
  category: string
  priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'
  title: string
  description: string
  impact: string
  steps: string[]
  status: 'ACTIVE' | 'APPLIED' | 'DISMISSED'
  applied_at?: string
  created_at: string
}

export interface SystemAlert {
  id: string
  device?: string
  device_name?: string
  alert_type: string
  severity: 'INFO' | 'WARNING' | 'ERROR' | 'CRITICAL'
  title: string
  message: string
  status: 'ACTIVE' | 'ACKNOWLEDGED' | 'RESOLVED'
  acknowledged_at?: string
  resolved_at?: string
  created_at: string
}

export interface AutoFixAction {
  id: string
  issue: string
  device: string
  device_name: string
  fix_type: string
  status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED'
  impact: 'LOW' | 'MEDIUM' | 'HIGH'
  auto_execute: boolean
  result_message?: string
  started_at?: string
  completed_at?: string
  created_at: string
}

export interface DiagnosticsStats {
  total_scans: number
  active_scans: number
  total_issues: number
  critical_issues: number
  high_issues: number
  medium_issues: number
  low_issues: number
  auto_fixable_issues: number
  resolved_issues: number
  active_alerts: number
  pending_recommendations: number
}

class AIDiagnosticsService {
  // Diagnostic Scans
  async getScans(params?: {
    device?: string
    scan_type?: string
    status?: string
    ordering?: string
  }): Promise<ApiResponse<DiagnosticScan[]>> {
    return api.get<ApiResponse<DiagnosticScan[]>>('/ai-diagnostics/scans/', { params })
  }

  async getScan(id: string): Promise<ApiResponse<DiagnosticScan>> {
    return api.get<ApiResponse<DiagnosticScan>>(`/ai-diagnostics/scans/${id}/`)
  }

  async createScan(data: {
    device: string
    scan_type: string
  }): Promise<ApiResponse<DiagnosticScan>> {
    return api.post<ApiResponse<DiagnosticScan>>('/ai-diagnostics/scans/', data)
  }

  async startScan(id: string): Promise<ApiResponse<DiagnosticScan>> {
    return api.post<ApiResponse<DiagnosticScan>>(`/ai-diagnostics/scans/${id}/start/`)
  }

  async cancelScan(id: string): Promise<ApiResponse<DiagnosticScan>> {
    return api.post<ApiResponse<DiagnosticScan>>(`/ai-diagnostics/scans/${id}/cancel/`)
  }

  // Detected Issues
  async getIssues(params?: {
    device?: string
    scan?: string
    category?: string
    severity?: string
    status?: string
    ordering?: string
  }): Promise<ApiResponse<DetectedIssue[]>> {
    return api.get<ApiResponse<DetectedIssue[]>>('/ai-diagnostics/issues/', { params })
  }

  async getIssue(id: string): Promise<ApiResponse<DetectedIssue>> {
    return api.get<ApiResponse<DetectedIssue>>(`/ai-diagnostics/issues/${id}/`)
  }

  async updateIssueStatus(id: string, status: string): Promise<ApiResponse<DetectedIssue>> {
    return api.patch<ApiResponse<DetectedIssue>>(`/ai-diagnostics/issues/${id}/`, { status })
  }

  async resolveIssue(id: string): Promise<ApiResponse<DetectedIssue>> {
    return api.post<ApiResponse<DetectedIssue>>(`/ai-diagnostics/issues/${id}/resolve/`)
  }

  // Recommendations
  async getRecommendations(params?: {
    device?: string
    category?: string
    priority?: string
    status?: string
    ordering?: string
  }): Promise<ApiResponse<Recommendation[]>> {
    return api.get<ApiResponse<Recommendation[]>>('/ai-diagnostics/recommendations/', { params })
  }

  async getRecommendation(id: string): Promise<ApiResponse<Recommendation>> {
    return api.get<ApiResponse<Recommendation>>(`/ai-diagnostics/recommendations/${id}/`)
  }

  async applyRecommendation(id: string): Promise<ApiResponse<Recommendation>> {
    return api.post<ApiResponse<Recommendation>>(`/ai-diagnostics/recommendations/${id}/apply/`)
  }

  async dismissRecommendation(id: string): Promise<ApiResponse<Recommendation>> {
    return api.post<ApiResponse<Recommendation>>(`/ai-diagnostics/recommendations/${id}/dismiss/`)
  }

  // System Alerts
  async getAlerts(params?: {
    device?: string
    alert_type?: string
    severity?: string
    status?: string
    ordering?: string
  }): Promise<ApiResponse<SystemAlert[]>> {
    return api.get<ApiResponse<SystemAlert[]>>('/ai-diagnostics/alerts/', { params })
  }

  async getAlert(id: string): Promise<ApiResponse<SystemAlert>> {
    return api.get<ApiResponse<SystemAlert>>(`/ai-diagnostics/alerts/${id}/`)
  }

  async acknowledgeAlert(id: string): Promise<ApiResponse<SystemAlert>> {
    return api.post<ApiResponse<SystemAlert>>(`/ai-diagnostics/alerts/${id}/acknowledge/`)
  }

  async resolveAlert(id: string): Promise<ApiResponse<SystemAlert>> {
    return api.post<ApiResponse<SystemAlert>>(`/ai-diagnostics/alerts/${id}/resolve/`)
  }

  // Auto-Fix Actions
  async getAutoFixActions(params?: {
    device?: string
    issue?: string
    status?: string
    ordering?: string
  }): Promise<ApiResponse<AutoFixAction[]>> {
    return api.get<ApiResponse<AutoFixAction[]>>('/ai-diagnostics/auto-fix/', { params })
  }

  async getAutoFixAction(id: string): Promise<ApiResponse<AutoFixAction>> {
    return api.get<ApiResponse<AutoFixAction>>(`/ai-diagnostics/auto-fix/${id}/`)
  }

  async executeAutoFix(id: string): Promise<ApiResponse<AutoFixAction>> {
    return api.post<ApiResponse<AutoFixAction>>(`/ai-diagnostics/auto-fix/${id}/execute/`)
  }

  // Statistics
  async getStats(): Promise<ApiResponse<DiagnosticsStats>> {
    return api.get<ApiResponse<DiagnosticsStats>>('/ai-diagnostics/stats/')
  }
}

export const aiDiagnosticsService = new AIDiagnosticsService()
