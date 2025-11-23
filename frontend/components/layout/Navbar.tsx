'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
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
  const router = useRouter()
  const { user, isAuthenticated, logout } = useAuthStore()
  const { toggleSidebar } = useUIStore()
  const [isScrolled, setIsScrolled] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)

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

  // Sample notifications - replace with real API data
  const notifications = [
    {
      id: 1,
      title: 'System Update',
      message: 'New system update available',
      time: '5 min ago',
      unread: true,
      type: 'info'
    },
    {
      id: 2,
      title: 'Security Alert',
      message: 'Unusual login detected',
      time: '1 hour ago',
      unread: true,
      type: 'warning'
    },
    {
      id: 3,
      title: 'Device Offline',
      message: 'Server-01 is offline',
      time: '2 hours ago',
      unread: false,
      type: 'error'
    }
  ]

  const unreadCount = notifications.filter(n => n.unread).length

  // Plan badge styling based on plan (for navbar - smaller size)
  const getPlanBadge = (size: 'small' | 'normal' = 'normal') => {
    const plan = planName.toLowerCase()
    const iconSize = size === 'small' ? 'w-2.5 h-2.5' : 'w-3 h-3'
    const textSize = size === 'small' ? 'text-[10px]' : 'text-xs'
    const padding = size === 'small' ? 'px-1.5 py-0.5' : 'px-2 py-1'

    if (plan === 'enterprise') {
      return (
        <Badge variant="primary" className={`gap-0.5 ${padding} ${textSize} bg-gradient-to-r from-purple-600 to-purple-700 border-0 text-white`}>
          <Crown className={iconSize} />
          Enterprise
        </Badge>
      )
    }

    if (plan === 'professional') {
      return (
        <Badge variant="primary" className={`gap-0.5 ${padding} ${textSize} bg-gradient-to-r from-orange-600 to-orange-700 border-0 text-white`}>
          <Sparkles className={iconSize} />
          Professional
        </Badge>
      )
    }

    if (plan === 'starter') {
      return (
        <Badge variant="primary" className={`gap-0.5 ${padding} ${textSize} bg-gradient-to-r from-blue-600 to-blue-700 border-0 text-white`}>
          Starter
        </Badge>
      )
    }

    return (
      <Badge variant="default" className={`gap-0.5 ${padding} ${textSize}`}>
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
                <div className="relative">
                  <button
                    onClick={() => setShowNotifications(!showNotifications)}
                    className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5 text-gray-700" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {showNotifications && (
                    <>
                      <div
                        className="fixed inset-0 z-40"
                        onClick={() => setShowNotifications(false)}
                      />
                      <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-hidden"
                      >
                        <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
                          {unreadCount > 0 && (
                            <Badge variant="primary" className="bg-orange-500">
                              {unreadCount} new
                            </Badge>
                          )}
                        </div>

                        <div className="overflow-y-auto max-h-80">
                          {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                              <Bell className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm">No notifications</p>
                            </div>
                          ) : (
                            <div className="divide-y divide-gray-100">
                              {notifications.map((notification) => (
                                <div
                                  key={notification.id}
                                  className={cn(
                                    'px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer',
                                    notification.unread && 'bg-orange-50/50'
                                  )}
                                >
                                  <div className="flex gap-3">
                                    <div className={cn(
                                      'w-2 h-2 rounded-full mt-2 flex-shrink-0',
                                      notification.type === 'error' ? 'bg-red-500' :
                                      notification.type === 'warning' ? 'bg-yellow-500' :
                                      'bg-blue-500'
                                    )} />
                                    <div className="flex-1 min-w-0">
                                      <p className="text-sm font-medium text-gray-900 truncate">
                                        {notification.title}
                                      </p>
                                      <p className="text-xs text-gray-600 mt-0.5">
                                        {notification.message}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-1">
                                        {notification.time}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
                          <Link
                            href="/dashboard/notifications"
                            onClick={() => setShowNotifications(false)}
                            className="block text-center text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
                          >
                            View all notifications →
                          </Link>
                        </div>
                      </motion.div>
                    </>
                  )}
                </div>

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
                      <div className="flex items-center gap-1.5">
                        {getPlanBadge('small')}
                        <span className="text-sm font-medium text-gray-900">
                          {user.full_name || `${user.first_name} ${user.last_name}`.trim() || user.email}
                        </span>
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
                          href="/dashboard/settings"
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
