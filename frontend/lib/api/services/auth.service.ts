/**
 * Authentication Service
 */

import { api, ApiResponse, setTokens, clearTokens } from '../client'
import { API_ENDPOINTS } from '../config'

export interface User {
  id: string
  email: string
  phone: string | null
  first_name: string
  last_name: string
  full_name: string
  role: 'USER' | 'TECHNICIAN' | 'ADMIN' | 'SUPERADMIN'
  is_active: boolean
  is_email_verified: boolean
  is_phone_verified: boolean
  profile_picture: string | null
  timezone: string
  language: string
  created_at: string
  updated_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface LoginResponse extends ApiResponse {
  data: {
    user: User
    tokens: {
      access: string
      refresh: string
    }
  }
}

export interface RegisterRequest {
  email: string
  first_name: string
  last_name: string
  password: string
  password_confirm: string
  phone?: string
}

export interface RegisterResponse extends ApiResponse {
  data: User
}

export interface PasswordResetRequest {
  email: string
}

export interface PasswordResetConfirmRequest {
  email: string
  otp_code: string
  new_password: string
}

export interface ChangePasswordRequest {
  old_password: string
  new_password: string
}

export interface VerifyOTPRequest {
  otp_type: 'EMAIL' | 'PHONE' | 'PASSWORD_RESET' | 'TWO_FACTOR'
  otp_code: string
}

class AuthService {
  /**
   * Register a new user
   */
  async register(data: RegisterRequest): Promise<RegisterResponse> {
    const response = await api.post<RegisterResponse>(API_ENDPOINTS.auth.register, data)
    return response
  }

  /**
   * Login user
   */
  async login(data: LoginRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(API_ENDPOINTS.auth.login, data)

    if (response.success && response.data) {
      // Store tokens
      setTokens(response.data.tokens.access, response.data.tokens.refresh)
    }

    return response
  }

  /**
   * Logout user
   */
  async logout(): Promise<void> {
    try {
      await api.post(API_ENDPOINTS.auth.logout)
    } catch (error) {
      // Continue with logout even if API call fails
      console.error('Logout error:', error)
    } finally {
      clearTokens()
    }
  }

  /**
   * Get current user profile
   */
  async getProfile(): Promise<ApiResponse<User>> {
    return api.get<ApiResponse<User>>(API_ENDPOINTS.auth.profile)
  }

  /**
   * Change password
   */
  async changePassword(data: ChangePasswordRequest): Promise<ApiResponse> {
    return api.post<ApiResponse>(API_ENDPOINTS.auth.changePassword, data)
  }

  /**
   * Request password reset
   */
  async requestPasswordReset(data: PasswordResetRequest): Promise<ApiResponse> {
    return api.post<ApiResponse>(API_ENDPOINTS.auth.resetPassword, data)
  }

  /**
   * Confirm password reset with OTP
   */
  async confirmPasswordReset(data: PasswordResetConfirmRequest): Promise<ApiResponse> {
    return api.post<ApiResponse>(API_ENDPOINTS.auth.resetPasswordConfirm, data)
  }

  /**
   * Verify OTP code
   */
  async verifyOTP(data: VerifyOTPRequest): Promise<ApiResponse> {
    return api.post<ApiResponse>(API_ENDPOINTS.auth.verifyOTP, data)
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    if (typeof window === 'undefined') return false
    const token = localStorage.getItem('access_token')
    return !!token
  }
}

export const authService = new AuthService()
export default authService
