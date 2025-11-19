'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { Menu, X, Bell, User, LogOut, Settings, Crown, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useAuthStore, useUIStore } from '@/lib/store'
import { useQuery } from '@tanstack/react-query'
import { billingAPI } from '@/lib/api'
import { cn } from '@/lib/utils'

export function Navbar() {
  const pathname = usePathname()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { toggleSidebar } = useUIStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  // Fetch user subscription
  const { data: subscriptionData } = useQuery({
    queryKey: ['my-subscription'],
    queryFn: async () => {
      const response = await billingAPI.getMySubscription()
      return response.data
    },
    enabled: isAuthenticated,
    retry: false,
  })

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const isDashboard = pathname?.startsWith('/dashboard')
  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/register')

  const subscription = subscriptionData?.subscription
  const planName = subscription?.plan?.name || 'Free'

  // Plan badge styling based on plan
  const getPlanBadge = () => {
    const plan = planName.toLowerCase()

    if (plan === 'enterprise') {
      return (
        <Badge variant="primary" className="gap-1 bg-gradient-to-r from-purple-600 to-purple-700 border-0 text-white">
          <Crown className="w-3 h-3" />
          Enterprise
        </Badge>
      )
    }

    if (plan === 'professional') {
      return (
        <Badge variant="primary" className="gap-1 bg-gradient-to-r from-orange-600 to-orange-700 border-0 text-white">
          <Sparkles className="w-3 h-3" />
          Professional
        </Badge>
      )
    }

    if (plan === 'starter') {
      return (
        <Badge variant="primary" className="gap-1 bg-gradient-to-r from-blue-600 to-blue-700 border-0 text-white">
          Starter
        </Badge>
      )
    }

    return (
      <Badge variant="default" className="gap-1">
        Free
      </Badge>
    )
  }

  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled || isAuthPage
          ? 'bg-white/95 backdrop-blur-md shadow-md'
          : 'bg-transparent',
        isDashboard && 'bg-white border-b border-gray-200'
      )}
    >
      <div className={cn(
        isDashboard ? 'px-6' : 'container mx-auto px-4 sm:px-6 lg:px-8'
      )}>
        <div className="flex items-center justify-between h-16">
          {/* Left Section - Logo */}
          <div className="flex items-center gap-4">
            {isDashboard && (
              <button
                onClick={toggleSidebar}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Toggle sidebar"
              >
                <Menu className="w-6 h-6" />
              </button>
            )}

            {/* Logo - aligned left in dashboard */}
            <Link href={isDashboard ? '/dashboard' : '/'} className="flex items-center gap-2 group">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-orange">
                <span className="text-white font-bold text-xl">IT</span>
              </div>
              <span
                className={cn(
                  'text-xl font-bold transition-colors',
                  isScrolled || isDashboard || isAuthPage ? 'text-black' : 'text-white'
                )}
              >
                ITPilot
              </span>
            </Link>
          </div>

          {/* Center - Navigation Links (non-dashboard only) */}
          {!isDashboard && (
            <div className="hidden md:flex items-center gap-8">
              <Link
                href="/features"
                className={cn(
                  'text-sm font-medium transition-colors hover:text-orange-500',
                  isScrolled || isAuthPage ? 'text-gray-700' : 'text-white'
                )}
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className={cn(
                  'text-sm font-medium transition-colors hover:text-orange-500',
                  isScrolled || isAuthPage ? 'text-gray-700' : 'text-white'
                )}
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className={cn(
                  'text-sm font-medium transition-colors hover:text-orange-500',
                  isScrolled || isAuthPage ? 'text-gray-700' : 'text-white'
                )}
              >
                About
              </Link>
            </div>
          )}

          {/* Right Section - User Menu and Notifications */}
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                {/* Notifications */}
                <button
                  className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 text-gray-700" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                </button>

                {/* User Menu with Plan Badge */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-3 p-2 pr-4 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-medium text-sm shadow-md">
                      {(user.full_name || user.first_name || user.email).charAt(0).toUpperCase()}
                    </div>
                    <div className="hidden lg:flex flex-col items-start">
                      <span className="text-sm font-medium text-gray-900">
                        {user.full_name || `${user.first_name} ${user.last_name}`.trim() || user.email}
                      </span>
                      <div className="flex items-center gap-1 -mt-0.5">
                        {getPlanBadge()}
                      </div>
                    </div>
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowUserMenu(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 z-50"
                      >
                        <div className="px-4 py-3 border-b border-gray-100">
                          <p className="text-sm font-medium text-gray-900">
                            {user.full_name || `${user.first_name} ${user.last_name}`.trim() || user.email}
                          </p>
                          <p className="text-xs text-gray-500 mb-2">{user.email}</p>
                          <div className="flex items-center gap-2">
                            {getPlanBadge()}
                            <span className="text-xs text-gray-500">
                              {subscription?.status || 'Active'}
                            </span>
                          </div>
                        </div>

                        <Link
                          href="/dashboard"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          Dashboard
                        </Link>

                        <Link
                          href="/settings"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </Link>

                        <Link
                          href="/pricing"
                          onClick={() => setShowUserMenu(false)}
                          className="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <Crown className="w-4 h-4" />
                          Upgrade Plan
                        </Link>

                        <div className="border-t border-gray-100 mt-2 pt-2">
                          <button
                            onClick={() => {
                              logout()
                              setShowUserMenu(false)
                            }}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors w-full"
                          >
                            <LogOut className="w-4 h-4" />
                            Logout
                          </button>
                        </div>
                      </motion.div>
                    </>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
