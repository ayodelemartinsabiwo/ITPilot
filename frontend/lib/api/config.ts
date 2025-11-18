/**
 * API Configuration
 */

export const API_CONFIG = {
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
}

export const API_ENDPOINTS = {
  auth: {
    register: '/auth/register/',
    login: '/auth/login/',
    logout: '/auth/logout/',
    refresh: '/auth/token/refresh/',
    profile: '/auth/profile/',
    changePassword: '/auth/change-password/',
    resetPassword: '/auth/password-reset/',
    resetPasswordConfirm: '/auth/password-reset/confirm/',
    verifyOTP: '/auth/verify-otp/',
  },
  users: {
    me: '/users/me/',
    list: '/users/',
    detail: (id: string) => `/users/${id}/`,
  },
  organizations: {
    list: '/organizations/',
    detail: (id: string) => `/organizations/${id}/`,
    members: (id: string) => `/organizations/${id}/members/`,
  },
  devices: {
    list: '/devices/',
    detail: (id: string) => `/devices/${id}/`,
    metrics: (id: string) => `/devices/${id}/metrics/`,
    health: (id: string) => `/devices/${id}/health/`,
  },
  tickets: {
    list: '/tickets/',
    detail: (id: string) => `/tickets/${id}/`,
    create: '/tickets/create/',
    messages: (id: string) => `/tickets/${id}/messages/`,
    escalate: (id: string) => `/tickets/${id}/escalate/`,
  },
  billing: {
    plans: '/billing/plans/',
    subscriptions: '/billing/subscriptions/',
    subscribe: '/billing/subscribe/',
    payments: '/billing/payments/',
    invoices: '/billing/invoices/',
  },
  dashboard: {
    stats: '/dashboard/stats/',
    recentActivity: '/dashboard/recent-activity/',
    alerts: '/dashboard/alerts/',
  },
}
