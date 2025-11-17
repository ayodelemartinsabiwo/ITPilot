import { jwtDecode } from 'jwt-decode'

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'technician' | 'user'
  avatar?: string
  created_at: string
  updated_at: string
}

export interface TokenPayload {
  user_id: string
  email: string
  role: string
  exp: number
  iat: number
}

export interface AuthTokens {
  access: string
  refresh: string
}

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const USER_KEY = 'user'

export class AuthService {
  static setTokens(tokens: AuthTokens): void {
    localStorage.setItem(ACCESS_TOKEN_KEY, tokens.access)
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh)
  }

  static getAccessToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(ACCESS_TOKEN_KEY)
  }

  static getRefreshToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  }

  static removeTokens(): void {
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    localStorage.removeItem(USER_KEY)
  }

  static setUser(user: User): void {
    localStorage.setItem(USER_KEY, JSON.stringify(user))
  }

  static getUser(): User | null {
    if (typeof window === 'undefined') return null

    const userStr = localStorage.getItem(USER_KEY)
    if (!userStr) return null

    try {
      return JSON.parse(userStr)
    } catch (error) {
      console.error('Failed to parse user data:', error)
      return null
    }
  }

  static removeUser(): void {
    localStorage.removeItem(USER_KEY)
  }

  static isAuthenticated(): boolean {
    const token = this.getAccessToken()
    if (!token) return false

    try {
      const decoded = jwtDecode<TokenPayload>(token)
      const currentTime = Date.now() / 1000

      // Check if token is expired
      if (decoded.exp < currentTime) {
        return false
      }

      return true
    } catch (error) {
      console.error('Failed to decode token:', error)
      return false
    }
  }

  static getTokenPayload(): TokenPayload | null {
    const token = this.getAccessToken()
    if (!token) return null

    try {
      return jwtDecode<TokenPayload>(token)
    } catch (error) {
      console.error('Failed to decode token:', error)
      return null
    }
  }

  static isTokenExpired(token?: string): boolean {
    const tokenToCheck = token || this.getAccessToken()
    if (!tokenToCheck) return true

    try {
      const decoded = jwtDecode<TokenPayload>(tokenToCheck)
      const currentTime = Date.now() / 1000

      return decoded.exp < currentTime
    } catch (error) {
      return true
    }
  }

  static getTokenExpirationTime(): Date | null {
    const token = this.getAccessToken()
    if (!token) return null

    try {
      const decoded = jwtDecode<TokenPayload>(token)
      return new Date(decoded.exp * 1000)
    } catch (error) {
      return null
    }
  }

  static hasRole(role: string | string[]): boolean {
    const user = this.getUser()
    if (!user) return false

    if (Array.isArray(role)) {
      return role.includes(user.role)
    }

    return user.role === role
  }

  static isAdmin(): boolean {
    return this.hasRole('admin')
  }

  static isTechnician(): boolean {
    return this.hasRole(['admin', 'technician'])
  }

  static clearAuth(): void {
    this.removeTokens()
    this.removeUser()
  }
}

// Permission checks
export const checkPermission = (requiredRole: string | string[]): boolean => {
  return AuthService.hasRole(requiredRole)
}

export const requireAuth = (): boolean => {
  return AuthService.isAuthenticated()
}

export const requireRole = (role: string | string[]): boolean => {
  return AuthService.isAuthenticated() && AuthService.hasRole(role)
}

// Token refresh utilities
export const shouldRefreshToken = (): boolean => {
  const expirationTime = AuthService.getTokenExpirationTime()
  if (!expirationTime) return false

  const now = Date.now()
  const expiresIn = expirationTime.getTime() - now

  // Refresh if token expires in less than 5 minutes
  return expiresIn < 5 * 60 * 1000
}

export default AuthService
