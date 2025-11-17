// Common types used across the application

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'technician' | 'user'
  avatar?: string
  created_at: string
  updated_at: string
}

export interface Device {
  id: string
  name: string
  type: string
  ip_address: string
  mac_address?: string
  status: 'online' | 'offline' | 'maintenance'
  cpu_usage: number
  memory_usage: number
  disk_usage: number
  last_seen: string
  created_at: string
  updated_at: string
}

export interface Ticket {
  id: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  category?: string
  created_by: User
  assigned_to?: User
  device?: Device
  comments_count: number
  created_at: string
  updated_at: string
  resolved_at?: string
}

export interface Comment {
  id: string
  ticket_id: string
  user: User
  content: string
  created_at: string
}

export interface Conversation {
  id: string
  title: string
  user_id: string
  last_message?: string
  last_message_at: string
  created_at: string
  updated_at: string
}

export interface Message {
  id: string
  conversation_id: string
  content: string
  sender: 'user' | 'ai'
  timestamp: string
  metadata?: Record<string, any>
}

export interface DashboardStats {
  totalDevices: number
  onlineDevices: number
  offlineDevices: number
  totalTickets: number
  openTickets: number
  closedTickets: number
  avgResponseTime: number
  satisfactionRate: number
}

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
}

export interface PaginatedResponse<T> {
  count: number
  next: string | null
  previous: string | null
  results: T[]
}

export interface ApiError {
  detail?: string
  message?: string
  errors?: Record<string, string[]>
}
