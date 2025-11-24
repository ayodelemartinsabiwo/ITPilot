/**
 * Billing Service
 * Handles all billing and subscription-related API calls
 */

import { api, ApiResponse } from '../client'
import { API_ENDPOINTS } from '../config'

export interface SubscriptionPlan {
  id: string
  name: string
  slug: 'personal' | 'business_lite' | 'enterprise'
  description: string
  price_monthly: number
  price_yearly: number
  currency: string
  features: PlanFeature[]
  limits: PlanLimits
  is_popular: boolean
}

export interface PlanFeature {
  name: string
  included: boolean
  description?: string
}

export interface PlanLimits {
  max_devices: number
  max_users: number
  max_storage_gb: number
  max_tickets_per_month: number
  has_api_access: boolean
  has_sla: boolean
  support_level: 'basic' | 'priority' | '24/7'
}

export interface Subscription {
  id: string
  organization: string
  plan: SubscriptionPlan
  status: 'active' | 'canceled' | 'past_due' | 'trial'
  current_period_start: string
  current_period_end: string
  trial_end?: string
  cancel_at_period_end: boolean
  created_at: string
  updated_at: string
}

export interface Usage {
  subscription_id: string
  period: {
    start: string
    end: string
  }
  devices: {
    current: number
    limit: number
    percentage: number
  }
  users: {
    current: number
    limit: number
    percentage: number
  }
  storage: {
    current_gb: number
    limit_gb: number
    percentage: number
  }
  tickets: {
    current_month: number
    limit: number
    percentage: number
  }
}

export interface Payment {
  id: string
  amount: number
  currency: string
  status: 'pending' | 'completed' | 'failed' | 'refunded'
  payment_method: string
  description: string
  invoice_id?: string
  created_at: string
  updated_at: string
}

export interface Invoice {
  id: string
  invoice_number: string
  amount: number
  currency: string
  status: 'draft' | 'open' | 'paid' | 'void' | 'uncollectible'
  due_date: string
  paid_at?: string
  invoice_pdf_url?: string
  created_at: string
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'bank_transfer'
  last4?: string
  brand?: string
  exp_month?: number
  exp_year?: number
  is_default: boolean
}

export interface SubscriptionChangePreview {
  new_plan: string
  proration_amount: number
  next_invoice_amount: number
  next_invoice_date: string
}

class BillingService {
  /**
   * Get all available plans
   */
  async getPlans(): Promise<ApiResponse<SubscriptionPlan[]>> {
    return api.get<ApiResponse<SubscriptionPlan[]>>(API_ENDPOINTS.billing.plans)
  }

  /**
   * Get current subscription
   */
  async getCurrentSubscription(): Promise<ApiResponse<Subscription>> {
    return api.get<ApiResponse<Subscription>>('/billing/subscriptions/current/')
  }

  /**
   * Get usage statistics
   */
  async getUsage(): Promise<ApiResponse<Usage>> {
    return api.get<ApiResponse<Usage>>('/billing/usage/')
  }

  /**
   * Subscribe to a plan
   */
  async subscribe(planId: string, billingCycle: 'monthly' | 'yearly'): Promise<ApiResponse<Subscription>> {
    return api.post<ApiResponse<Subscription>>(API_ENDPOINTS.billing.subscribe, {
      plan_id: planId,
      billing_cycle: billingCycle,
    })
  }

  /**
   * Preview plan change
   */
  async previewPlanChange(newPlanId: string): Promise<ApiResponse<SubscriptionChangePreview>> {
    return api.post<ApiResponse<SubscriptionChangePreview>>('/billing/subscriptions/preview-change/', {
      new_plan_id: newPlanId,
    })
  }

  /**
   * Change subscription plan
   */
  async changePlan(newPlanId: string): Promise<ApiResponse<Subscription>> {
    return api.post<ApiResponse<Subscription>>('/billing/subscriptions/change-plan/', {
      new_plan_id: newPlanId,
    })
  }

  /**
   * Cancel subscription
   */
  async cancelSubscription(cancelAtPeriodEnd: boolean = true): Promise<ApiResponse<Subscription>> {
    return api.post<ApiResponse<Subscription>>('/billing/subscriptions/cancel/', {
      cancel_at_period_end: cancelAtPeriodEnd,
    })
  }

  /**
   * Reactivate canceled subscription
   */
  async reactivateSubscription(): Promise<ApiResponse<Subscription>> {
    return api.post<ApiResponse<Subscription>>('/billing/subscriptions/reactivate/')
  }

  /**
   * Get payment history
   */
  async getPayments(params?: { page?: number; page_size?: number }): Promise<ApiResponse<Payment[]>> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    return api.get<ApiResponse<Payment[]>>(`${API_ENDPOINTS.billing.payments}${queryString}`)
  }

  /**
   * Get invoices
   */
  async getInvoices(params?: { page?: number; page_size?: number }): Promise<ApiResponse<Invoice[]>> {
    const queryString = params ? `?${new URLSearchParams(params as any).toString()}` : ''
    return api.get<ApiResponse<Invoice[]>>(`${API_ENDPOINTS.billing.invoices}${queryString}`)
  }

  /**
   * Download invoice PDF
   */
  async downloadInvoice(invoiceId: string): Promise<Blob> {
    return api.get<Blob>(`/billing/invoices/${invoiceId}/download/`, {
      responseType: 'blob',
    })
  }

  /**
   * Get payment methods
   */
  async getPaymentMethods(): Promise<ApiResponse<PaymentMethod[]>> {
    return api.get<ApiResponse<PaymentMethod[]>>('/billing/payment-methods/')
  }

  /**
   * Add payment method
   */
  async addPaymentMethod(paymentMethodId: string): Promise<ApiResponse<PaymentMethod>> {
    return api.post<ApiResponse<PaymentMethod>>('/billing/payment-methods/', {
      payment_method_id: paymentMethodId,
    })
  }

  /**
   * Set default payment method
   */
  async setDefaultPaymentMethod(paymentMethodId: string): Promise<ApiResponse<PaymentMethod>> {
    return api.post<ApiResponse<PaymentMethod>>(`/billing/payment-methods/${paymentMethodId}/set-default/`)
  }

  /**
   * Delete payment method
   */
  async deletePaymentMethod(paymentMethodId: string): Promise<ApiResponse<void>> {
    return api.delete<ApiResponse<void>>(`/billing/payment-methods/${paymentMethodId}/`)
  }

  /**
   * Get renewal alerts
   */
  async getRenewalAlerts(): Promise<ApiResponse<any[]>> {
    return api.get<ApiResponse<any[]>>('/billing/renewal-alerts/')
  }
}

export const billingService = new BillingService()
