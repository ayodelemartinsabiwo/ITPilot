/**
 * Tickets Service
 * Handles all ticket-related API calls for Support & Escalation
 */

import { api, ApiResponse } from '../client'
import { API_ENDPOINTS } from '../config'

export interface Ticket {
  id: string
  ticket_number: string
  title: string
  description: string
  status: 'open' | 'in_progress' | 'resolved' | 'closed'
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: string
  device_id?: string
  device_name?: string
  assigned_to?: {
    id: string
    name: string
    email: string
  }
  created_by: {
    id: string
    name: string
    email: string
  }
  created_at: string
  updated_at: string
  resolved_at?: string
  sla_breach_at?: string
  is_sla_breached: boolean
}

export interface TicketMessage {
  id: string
  ticket_id: string
  user: {
    id: string
    name: string
    email: string
  }
  message: string
  attachments?: string[]
  created_at: string
  is_internal: boolean
}

export interface CreateTicketData {
  title: string
  description: string
  priority: 'low' | 'medium' | 'high' | 'critical'
  category: string
  device_id?: string
}

export interface TicketListParams {
  status?: string
  priority?: string
  category?: string
  assigned_to?: string
  search?: string
  page?: number
  page_size?: number
}

export interface TicketStats {
  total: number
  open: number
  in_progress: number
  resolved: number
  closed: number
  by_priority: {
    low: number
    medium: number
    high: number
    critical: number
  }
  sla_breached: number
  avg_resolution_time: number
}

class TicketsService {
  /**
   * Get all tickets with optional filtering
   */
  async getTickets(params?: TicketListParams): Promise<ApiResponse<Ticket[]>> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    return api.get<ApiResponse<Ticket[]>>(`${API_ENDPOINTS.tickets.list}${queryString}`)
  }

  /**
   * Get single ticket by ID
   */
  async getTicket(id: string): Promise<ApiResponse<Ticket>> {
    return api.get<ApiResponse<Ticket>>(API_ENDPOINTS.tickets.detail(id))
  }

  /**
   * Create new ticket
   */
  async createTicket(data: CreateTicketData): Promise<ApiResponse<Ticket>> {
    return api.post<ApiResponse<Ticket>>(API_ENDPOINTS.tickets.create, data)
  }

  /**
   * Update ticket
   */
  async updateTicket(id: string, data: Partial<Ticket>): Promise<ApiResponse<Ticket>> {
    return api.patch<ApiResponse<Ticket>>(API_ENDPOINTS.tickets.detail(id), data)
  }

  /**
   * Close ticket
   */
  async closeTicket(id: string): Promise<ApiResponse<Ticket>> {
    return api.patch<ApiResponse<Ticket>>(API_ENDPOINTS.tickets.detail(id), {
      status: 'closed',
    })
  }

  /**
   * Assign ticket to technician
   */
  async assignTicket(id: string, technicianId: string): Promise<ApiResponse<Ticket>> {
    return api.patch<ApiResponse<Ticket>>(API_ENDPOINTS.tickets.detail(id), {
      assigned_to: technicianId,
    })
  }

  /**
   * Escalate ticket
   */
  async escalateTicket(id: string, reason: string): Promise<ApiResponse<Ticket>> {
    return api.post<ApiResponse<Ticket>>(API_ENDPOINTS.tickets.escalate(id), {
      reason,
    })
  }

  /**
   * Get ticket messages
   */
  async getTicketMessages(ticketId: string): Promise<ApiResponse<TicketMessage[]>> {
    return api.get<ApiResponse<TicketMessage[]>>(API_ENDPOINTS.tickets.messages(ticketId))
  }

  /**
   * Add message to ticket
   */
  async addTicketMessage(
    ticketId: string,
    message: string,
    isInternal: boolean = false
  ): Promise<ApiResponse<TicketMessage>> {
    return api.post<ApiResponse<TicketMessage>>(API_ENDPOINTS.tickets.messages(ticketId), {
      message,
      is_internal: isInternal,
    })
  }

  /**
   * Get ticket statistics
   */
  async getTicketStats(): Promise<ApiResponse<TicketStats>> {
    return api.get<ApiResponse<TicketStats>>('/tickets/stats/')
  }

  /**
   * Get technician queue (assigned tickets)
   */
  async getTechnicianQueue(): Promise<ApiResponse<Ticket[]>> {
    return api.get<ApiResponse<Ticket[]>>('/tickets/queue/')
  }
}

export const ticketsService = new TicketsService()
