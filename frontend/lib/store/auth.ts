/**
 * Authentication Store (Zustand)
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authService, User, LoginRequest, RegisterRequest } from '../api/services/auth.service'
import { clearTokens } from '../api/client'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null

  // Actions
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => Promise<void>
  loadUser: () => Promise<void>
  initAuth: () => Promise<void>
  clearError: () => void
  setUser: (user: User | null) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (data: LoginRequest) => {
        try {
          set({ isLoading: true, error: null })

          const response = await authService.login(data)

          if (response.success && response.data) {
            set({
              user: response.data.user,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } else {
            throw new Error(response.message || 'Login failed')
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Login failed'
          set({
            error: errorMessage,
            isLoading: false,
            isAuthenticated: false,
            user: null,
          })
          throw error
        }
      },

      register: async (data: RegisterRequest) => {
        try {
          set({ isLoading: true, error: null })

          const response = await authService.register(data)

          if (response.success && response.data) {
            // After registration, user needs to verify email
            // We don't log them in automatically
            set({
              isLoading: false,
              error: null,
            })
          } else {
            throw new Error(response.message || 'Registration failed')
          }
        } catch (error: any) {
          const errorMessage =
            error.response?.data?.message || error.message || 'Registration failed'
          set({
            error: errorMessage,
            isLoading: false,
          })
          throw error
        }
      },

      logout: async () => {
        try {
          await authService.logout()
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          clearTokens()
          set({
            user: null,
            isAuthenticated: false,
            error: null,
          })
        }
      },

      loadUser: async () => {
        try {
          if (!authService.isAuthenticated()) {
            set({ isAuthenticated: false, user: null })
            return
          }

          set({ isLoading: true })

          const response = await authService.getProfile()

          if (response.success && response.data) {
            set({
              user: response.data,
              isAuthenticated: true,
              isLoading: false,
              error: null,
            })
          } else {
            throw new Error('Failed to load user profile')
          }
        } catch (error) {
          console.error('Load user error:', error)
          // Don't clear tokens or auth state on profile load error
          // User might just have network issues
          // Only clear if it's an auth error (401)
          if (error?.response?.status === 401) {
            clearTokens()
            set({
              user: null,
              isAuthenticated: false,
              isLoading: false,
              error: null,
            })
          } else {
            // Keep user logged in, just set loading to false
            set({
              isLoading: false,
            })
          }
        }
      },

      initAuth: async () => {
        // Initialize auth state on app load
        // Only load user if tokens exist and we don't already have user data
        const currentState = get()
        if (authService.isAuthenticated() && !currentState.user) {
          await get().loadUser()
        }
      },

      clearError: () => set({ error: null }),

      setUser: (user: User | null) => {
        set({
          user,
          isAuthenticated: !!user,
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore
