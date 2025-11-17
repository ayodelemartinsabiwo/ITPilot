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
  const { sidebarOpen, setSidebarOpen } = useUIStore()

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
          x: sidebarOpen ? 0 : -280,
        }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className={cn(
          'fixed left-0 top-0 z-50 h-screen w-[280px] bg-gradient-to-b from-black to-gray-900 text-white',
          'lg:translate-x-0 lg:z-30'
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-800">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-orange">
                <span className="text-white font-bold text-xl">IT</span>
              </div>
              <span className="text-xl font-bold">ITPilot</span>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-800 transition-colors"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5" />
            </button>
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
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange'
                        : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-800 p-4">
            <div className="rounded-lg bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 p-4">
              <p className="text-sm font-medium text-white mb-1">
                Need Help?
              </p>
              <p className="text-xs text-gray-400 mb-3">
                Contact our support team
              </p>
              <Link
                href="/dashboard/chat"
                className="block text-center text-sm font-medium text-orange-500 hover:text-orange-400 transition-colors"
              >
                Start Chat →
              </Link>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Spacer for desktop */}
      <div className="hidden lg:block w-[280px] flex-shrink-0" />
    </>
  )
}
