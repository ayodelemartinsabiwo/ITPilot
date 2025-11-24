import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios'
import { toast } from 'sonner'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'

// Redirect management - prevent infinite redirect loops
let isRedirecting = false
let lastRedirectTime = 0
const REDIRECT_COOLDOWN = 3000 // 3 seconds cooldown between redirects

// Safe redirect function with cooldown to prevent loops
const safeRedirectToLogin = () => {
  if (typeof window === 'undefined') return

  const now = Date.now()

  // Prevent multiple redirects within cooldown period
  if (isRedirecting || (now - lastRedirectTime < REDIRECT_COOLDOWN)) {
    console.log('Redirect blocked: cooldown active')
    return
  }

  isRedirecting = true
  lastRedirectTime = now

  // Use a slight delay to batch multiple simultaneous failures
  setTimeout(() => {
    console.log('Redirecting to login due to auth failure')
    window.location.href = '/login'
  }, 100)
}

// Reset redirect flag when coming back online
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Network: back online')
    isRedirecting = false
  })
}

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors and refresh token
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    // Check if error response is HTML (not JSON)
    const contentType = error.response?.headers['content-type']
    if (contentType && contentType.includes('text/html')) {
      console.error('Received HTML response instead of JSON:', {
        url: originalRequest.url,
        status: error.response?.status,
      })
      // Don't show HTML errors to user
      return Promise.reject({
        message: 'This feature is not yet available',
        status: error.response?.status,
      })
    }

    // Handle 401 errors - Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const refreshToken = localStorage.getItem('refresh_token')
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        const response = await axios.post(`${API_BASE_URL}/auth/refresh/`, {
          refresh: refreshToken,
        })

        const { access } = response.data
        localStorage.setItem('access_token', access)

        // Retry the original request
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`
        }
        return api(originalRequest)
      } catch (refreshError) {
        // Refresh token failed - logout user
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        localStorage.removeItem('user')
        safeRedirectToLogin()
        return Promise.reject(refreshError)
      }
    }

    // Handle other errors
    const errorMessage = getErrorMessage(error)

    // Don't show toast for specific routes
    const shouldShowToast = !originalRequest.url?.includes('/auth/me')

    if (shouldShowToast && error.response?.status !== 401) {
      toast.error(errorMessage)
    }

    return Promise.reject(error)
  }
)

// Helper function to extract error message
function getErrorMessage(error: AxiosError): string {
  if (error.response?.data) {
    const data = error.response.data as any

    // Handle various error response formats
    if (typeof data === 'string') {
      return data
    }

    if (data.detail) {
      return data.detail
    }

    if (data.message) {
      return data.message
    }

    if (data.error) {
      return data.error
    }

    // Handle field errors
    if (typeof data === 'object') {
      const firstKey = Object.keys(data)[0]
      if (firstKey && Array.isArray(data[firstKey])) {
        return data[firstKey][0]
      }
    }
  }

  if (error.message === 'Network Error') {
    return 'Network error. Please check your connection.'
  }

  if (error.code === 'ECONNABORTED') {
    return 'Request timeout. Please try again.'
  }

  return 'An unexpected error occurred. Please try again.'
}

// API endpoints
export const authAPI = {
  login: (credentials: { email: string; password: string }) =>
    api.post('/auth/login/', credentials),

  register: (data: { email: string; password: string; name: string; role?: string }) =>
    api.post('/auth/register/', data),

  logout: () =>
    api.post('/auth/logout/'),

  me: () =>
    api.get('/auth/me/'),

  refreshToken: (refreshToken: string) =>
    api.post('/auth/refresh/', { refresh: refreshToken }),

  requestPasswordReset: (email: string) =>
    api.post('/auth/password-reset/', { email }),

  resetPassword: (token: string, newPassword: string) =>
    api.post('/auth/password-reset/confirm/', { token, new_password: newPassword }),
}

export const devicesAPI = {
  getAll: (params?: { page?: number; search?: string; status?: string }) =>
    api.get('/devices/', { params }),

  getById: (id: string) =>
    api.get(`/devices/${id}/`),

  create: (data: any) =>
    api.post('/devices/', data),

  update: (id: string, data: any) =>
    api.put(`/devices/${id}/`, data),

  delete: (id: string) =>
    api.delete(`/devices/${id}/`),

  getMetrics: (id: string) =>
    api.get(`/devices/${id}/metrics/`),

  runDiagnostics: (id: string) =>
    api.post(`/devices/${id}/diagnostics/`),
}

export const ticketsAPI = {
  getAll: (params?: { page?: number; search?: string; status?: string; priority?: string }) =>
    api.get('/tickets/', { params }),

  getById: (id: string) =>
    api.get(`/tickets/${id}/`),

  create: (data: any) =>
    api.post('/tickets/', data),

  update: (id: string, data: any) =>
    api.put(`/tickets/${id}/`, data),

  delete: (id: string) =>
    api.delete(`/tickets/${id}/`),

  addComment: (id: string, comment: string) =>
    api.post(`/tickets/${id}/comments/`, { content: comment }),

  assignTo: (id: string, userId: string) =>
    api.post(`/tickets/${id}/assign/`, { user_id: userId }),

  updateStatus: (id: string, status: string) =>
    api.patch(`/tickets/${id}/status/`, { status }),
}

export const chatAPI = {
  sendMessage: (message: string, sessionId?: string) =>
    api.post('/ai/messages/', { message, session_id: sessionId }),

  getConversations: () =>
    api.get('/ai/sessions/'),

  getConversationById: (id: string) =>
    api.get(`/ai/sessions/${id}/`),

  deleteConversation: (id: string) =>
    api.delete(`/ai/sessions/${id}/`),

  getSessions: () =>
    api.get('/ai/sessions/'),

  getMessages: (sessionId: string) =>
    api.get(`/ai/messages/?session_id=${sessionId}`),
}

export const dashboardAPI = {
  getStats: () =>
    api.get('/auth/dashboard/'),

  getRecentActivity: () =>
    api.get('/auth/dashboard/'),

  getChartData: (type: 'tickets' | 'devices' | 'performance', period: '7d' | '30d' | '90d') =>
    api.get('/auth/dashboard/', { params: { type, period } }),
}

export const usersAPI = {
  getAll: (params?: { page?: number; search?: string; role?: string }) =>
    api.get('/organizations/members/', { params }),

  getById: (id: string) =>
    api.get(`/organizations/members/${id}/`),

  update: (id: string, data: any) =>
    api.put(`/organizations/members/${id}/`, data),

  updateProfile: (data: any) =>
    api.put('/auth/profile/', data),

  changePassword: (currentPassword: string, newPassword: string) =>
    api.post('/auth/change-password/', {
      current_password: currentPassword,
      new_password: newPassword
    }),

  inviteUser: (data: { email: string; role: string; organization?: string }) =>
    api.post('/organizations/members/', data),

  removeUser: (id: string) =>
    api.delete(`/organizations/members/${id}/`),
}

export const billingAPI = {
  getPlans: () =>
    api.get('/billing/plans/'),

  getMySubscription: () =>
    api.get('/billing/subscriptions/my-subscription/'),

  subscribe: (data: { plan_id: string; payment_method?: string }) =>
    api.post('/billing/subscribe/', data),

  cancelSubscription: (id: string) =>
    api.post(`/billing/subscriptions/${id}/cancel/`),

  getInvoices: (params?: { page?: number }) =>
    api.get('/billing/invoices/', { params }),

  getPaymentMethods: () =>
    api.get('/billing/payment-methods/'),
}

export default api
