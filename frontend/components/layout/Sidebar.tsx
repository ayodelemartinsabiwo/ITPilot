'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Laptop,
  Ticket,
  MessageSquare,
  Users,
  Settings,
  BarChart3,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { useUIStore } from '@/lib/store'
import { cn } from '@/lib/utils'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Devices',
    href: '/dashboard/devices',
    icon: Laptop,
  },
  {
    name: 'Tickets',
    href: '/dashboard/tickets',
    icon: Ticket,
  },
  {
    name: 'AI Chat',
    href: '/dashboard/chat',
    icon: MessageSquare,
  },
  {
    name: 'Analytics',
    href: '/dashboard/analytics',
    icon: BarChart3,
  },
  {
    name: 'Users',
    href: '/dashboard/users',
    icon: Users,
    adminOnly: true,
  },
  {
    name: 'Settings',
    href: '/dashboard/settings',
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, toggleSidebarCollapse } = useUIStore()

  const sidebarWidth = sidebarCollapsed ? 80 : 280

  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: sidebarOpen ? 0 : -sidebarWidth,
          width: sidebarWidth,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 z-50 h-screen bg-gradient-to-b from-black to-gray-900 text-white',
          'lg:translate-x-0 lg:z-30'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className={cn(
            "flex h-16 items-center border-b border-gray-800 transition-all",
            sidebarCollapsed ? "justify-center px-4" : "justify-between px-6"
          )}>
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-orange">
                <span className="text-white font-bold text-xl">IT</span>
              </div>
              {!sidebarCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-xl font-bold"
                >
                  ITPilot
                </motion.span>
              )}
            </Link>

            {!sidebarCollapsed && (
              <button
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
                aria-label="Close sidebar"
              >
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-6 px-3">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon

                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    title={sidebarCollapsed ? item.name : undefined}
                    className={cn(
                      'flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200',
                      sidebarCollapsed ? 'justify-center px-4 py-3' : 'px-4 py-3',
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    )}
                  >
                    <Icon className="w-5 h-5 flex-shrink-0" />
                    {!sidebarCollapsed && (
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-800 p-4">
            {/* Dashboard Settings Link */}
            {!sidebarCollapsed ? (
              <Link
                href="/dashboard/settings"
                className="flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors mb-3"
              >
                <Settings className="w-5 h-5 text-orange-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-white">Dashboard Settings</p>
                  <p className="text-xs text-gray-400">Manage preferences</p>
                </div>
              </Link>
            ) : (
              <Link
                href="/dashboard/settings"
                title="Dashboard Settings"
                className="flex justify-center p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors mb-3"
              >
                <Settings className="w-5 h-5 text-orange-500" />
              </Link>
            )}

            {/* Collapse Toggle - Desktop only */}
            <button
              onClick={toggleSidebarCollapse}
              className="hidden lg:flex items-center justify-center w-full p-2 rounded-lg hover:bg-gray-800 transition-colors"
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5" />
              ) : (
                <>
                  <ChevronLeft className="w-5 h-5" />
                  <span className="ml-2 text-sm">Collapse</span>
                </>
              )}
            </button>
          </div>
        </div>
      </motion.aside>

      {/* Spacer for desktop */}
      <motion.div
        initial={false}
        animate={{ width: sidebarWidth }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="hidden lg:block flex-shrink-0"
      />
    </>
  )
}
