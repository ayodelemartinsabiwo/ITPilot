/**
 * API Client with Axios
 */

import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { API_CONFIG } from './config'

// Token management
const TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

// Redirect management - prevent infinite redirect loops
let isRedirecting = false
let lastRedirectTime = 0
const REDIRECT_COOLDOWN = 3000 // 3 seconds cooldown between redirects

// Network status tracking
let isOnline = typeof window !== 'undefined' ? window.navigator.onLine : true

export const getAccessToken = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export const getRefreshToken = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(REFRESH_TOKEN_KEY)
}

export const setTokens = (accessToken: string, refreshToken: string) => {
  if (typeof window === 'undefined') return
  localStorage.setItem(TOKEN_KEY, accessToken)
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken)
}

export const clearTokens = () => {
  if (typeof window === 'undefined') return
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}

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

// Create axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: API_CONFIG.headers,
})

// Setup online/offline listeners
if (typeof window !== 'undefined') {
  window.addEventListener('online', () => {
    console.log('Network: back online')
    isOnline = true
    // Reset redirect flag when coming back online
    isRedirecting = false
  })

  window.addEventListener('offline', () => {
    console.log('Network: offline')
    isOnline = false
  })
}

// Request interceptor - Add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors and token refresh
let isRefreshing = false
let failedQueue: any[] = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config

    // If error is 401 and we haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue the request while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`
            return apiClient(originalRequest)
          })
          .catch((err) => Promise.reject(err))
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = getRefreshToken()

      if (!refreshToken) {
        clearTokens()
        safeRedirectToLogin()
        return Promise.reject(error)
      }

      try {
        const response = await axios.post(`${API_CONFIG.baseURL}/auth/token/refresh/`, {
          refresh: refreshToken,
        })

        const { access } = response.data
        setTokens(access, refreshToken)

        apiClient.defaults.headers.common.Authorization = `Bearer ${access}`
        originalRequest.headers.Authorization = `Bearer ${access}`

        processQueue(null, access)
        isRefreshing = false

        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        isRefreshing = false
        clearTokens()
        safeRedirectToLogin()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

// API Response types
export interface ApiResponse<T = any> {
  success: boolean
  message?: string
  data?: T
  errors?: any
  status_code?: number
}

// API Methods
export const api = {
  get: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.get(url, config).then((res) => res.data)
  },

  post: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.post(url, data, config).then((res) => res.data)
  },

  put: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.put(url, data, config).then((res) => res.data)
  },

  patch: <T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.patch(url, data, config).then((res) => res.data)
  },

  delete: <T = any>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    return apiClient.delete(url, config).then((res) => res.data)
  },
}

export default apiClient
