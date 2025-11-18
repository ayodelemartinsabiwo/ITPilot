/**
 * Dashboard Service
 * Handles all dashboard-related API calls
 */

import { api, ApiResponse } from '../client'
import { API_ENDPOINTS } from '../config'

export interface DashboardStats {
  devices: {
    total: number
    online: number
    offline: number
  }
  tickets: {
    total: number
    open: number
    in_progress: number
    resolved: number
    recent: number
    by_priority: {
      low: number
      medium: number
      high: number
      critical: number
    }
  }
  recent_activity: RecentActivity[]
  user: {
    full_name: string
    email: string
    role: string
  }
}

export interface RecentActivity {
  id: string
  ticket_number: string
  title: string
  status: string
  priority: string
  created_at: string
}

class DashboardService {
  /**
   * Get dashboard statistics
   */
  async getDashboardStats(): Promise<ApiResponse<DashboardStats>> {
    return api.get<ApiResponse<DashboardStats>>(API_ENDPOINTS.dashboard.stats)
  }
}

export const dashboardService = new DashboardService()
