'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard,
  Laptop,
  Cloud,
  Cpu,
  Shield,
  LifeBuoy,
  Settings,
  Bell,
  CreditCard,
  MessageSquare,
  X,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Server,
  Activity,
  Lock,
  CheckCircle,
  Zap,
  Globe,
  AlertTriangle,
  Wifi,
  Users,
  FileText,
  History,
  UserCog,
  DollarSign,
} from 'lucide-react'
import { useUIStore } from '@/lib/store'
import { cn } from '@/lib/utils'
import { useState } from 'react'

interface NavigationChild {
  name: string
  href: string
  icon?: any
}

interface NavigationItem {
  name: string
  href?: string
  icon: any
  children?: NavigationChild[]
  badge?: number
  adminOnly?: boolean
}

const navigation: NavigationItem[] = [
  {
    name: 'Overview',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Device Management',
    icon: Laptop,
    children: [
      { name: 'Connected Devices', href: '/dashboard/device-management/devices', icon: Server },
      { name: 'Device Health', href: '/dashboard/device-management/health', icon: Activity },
      { name: 'Performance Metrics', href: '/dashboard/device-management/performance', icon: LayoutDashboard },
      { name: 'Security Status', href: '/dashboard/device-management/security', icon: Lock },
      { name: 'Compliance Check', href: '/dashboard/device-management/compliance', icon: CheckCircle },
      { name: 'Optimization Tools', href: '/dashboard/device-management/optimization', icon: Zap },
    ],
  },
  {
    name: 'Cloud Integrations',
    icon: Cloud,
    children: [
      { name: 'Microsoft 365', href: '/dashboard/cloud-integrations/microsoft-365', icon: Globe },
      { name: 'Google Workspace', href: '/dashboard/cloud-integrations/google-workspace', icon: Globe },
      { name: 'Zoho & Others', href: '/dashboard/cloud-integrations/zoho', icon: Globe },
      { name: 'License Usage', href: '/dashboard/cloud-integrations/licenses', icon: FileText },
      { name: 'Service Health', href: '/dashboard/cloud-integrations/service-health', icon: Activity },
      { name: 'Sync Errors', href: '/dashboard/cloud-integrations/sync-errors', icon: AlertTriangle },
    ],
  },
  {
    name: 'AI Diagnostics',
    icon: Cpu,
    children: [
      { name: 'Real-Time Scan', href: '/dashboard/ai-diagnostics/real-time-scan', icon: Activity },
      { name: 'Detected Issues', href: '/dashboard/ai-diagnostics/issues', icon: AlertTriangle },
      { name: 'Recommendations', href: '/dashboard/ai-diagnostics/recommendations', icon: FileText },
      { name: 'System Alerts', href: '/dashboard/ai-diagnostics/alerts', icon: Bell },
      { name: 'Auto-Fix Actions', href: '/dashboard/ai-diagnostics/auto-fix', icon: Zap },
    ],
  },
  {
    name: 'Network & Security',
    icon: Shield,
    children: [
      { name: 'Wi-Fi Analysis', href: '/dashboard/network-security/wifi-analysis', icon: Wifi },
      { name: 'Threat Alerts', href: '/dashboard/network-security/threats', icon: AlertTriangle },
      { name: 'Patch Status', href: '/dashboard/network-security/patches', icon: CheckCircle },
      { name: 'Antivirus Health', href: '/dashboard/network-security/antivirus', icon: Shield },
      { name: 'Password Strength', href: '/dashboard/network-security/passwords', icon: Lock },
    ],
  },
  {
    name: 'Support & Escalation',
    icon: LifeBuoy,
    children: [
      { name: 'AI Chat Support', href: '/dashboard/support/ai-chat', icon: MessageSquare },
      { name: 'Open Tickets', href: '/dashboard/support/tickets', icon: FileText },
      { name: 'Technician Queue', href: '/dashboard/support/queue', icon: Users },
      { name: 'Remote Sessions', href: '/dashboard/support/remote-sessions', icon: Server },
      { name: 'Session History', href: '/dashboard/support/history', icon: History },
    ],
  },
  {
    name: 'Admin & Controls',
    icon: Settings,
    adminOnly: true,
    children: [
      { name: 'User Management', href: '/dashboard/admin/users', icon: Users },
      { name: 'Roles & Permissions', href: '/dashboard/admin/roles', icon: UserCog },
      { name: 'Activity Logs', href: '/dashboard/admin/activity-logs', icon: FileText },
      { name: 'Audit Trail', href: '/dashboard/admin/audit-trail', icon: History },
      { name: 'Organization Settings', href: '/dashboard/admin/settings', icon: Settings },
    ],
  },
  {
    name: 'Billing & Subscriptions',
    icon: CreditCard,
    children: [
      { name: 'Plans & Usage', href: '/dashboard/billing/plans', icon: DollarSign },
      { name: 'Payment History', href: '/dashboard/billing/payments', icon: FileText },
      { name: 'Renewal Alerts', href: '/dashboard/billing/renewals', icon: Bell },
    ],
  },
  {
    name: 'Notifications',
    icon: Bell,
    badge: 0, // This will be dynamically updated
    children: [
      { name: 'All Notifications', href: '/dashboard/notifications' },
      { name: 'System Messages', href: '/dashboard/notifications/system', icon: FileText },
      { name: 'Security Alerts', href: '/dashboard/notifications/security', icon: Shield },
      { name: 'License Reminders', href: '/dashboard/notifications/licenses', icon: Bell },
      { name: 'Device Warnings', href: '/dashboard/notifications/devices', icon: Laptop },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen, sidebarCollapsed, toggleSidebarCollapse } = useUIStore()
  const [expandedSections, setExpandedSections] = useState<string[]>([])

  const sidebarWidth = sidebarCollapsed ? 80 : 280

  const toggleSection = (sectionName: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionName)
        ? prev.filter((name) => name !== sectionName)
        : [...prev, sectionName]
    )
  }

  const isItemActive = (item: NavigationItem) => {
    if (item.href) {
      return pathname === item.href
    }
    if (item.children) {
      return item.children.some((child) => pathname === child.href || pathname?.startsWith(child.href))
    }
    return false
  }

  const isSectionExpanded = (item: NavigationItem) => {
    // Auto-expand if current route is under this section
    if (item.children) {
      const isActive = item.children.some((child) => pathname === child.href || pathname?.startsWith(child.href))
      if (isActive) {
        return true
      }
    }
    return expandedSections.includes(item.name)
  }

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
          <nav className="flex-1 overflow-y-auto py-6 px-3 custom-scrollbar">
            <div className="space-y-1">
              {navigation.map((item) => {
                const isActive = isItemActive(item)
                const isExpanded = isSectionExpanded(item)
                const Icon = item.icon

                // Direct link (no children)
                if (!item.children) {
                  return (
                    <Link
                      key={item.name}
                      href={item.href!}
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
                          className="flex-1"
                        >
                          {item.name}
                        </motion.span>
                      )}
                      {!sidebarCollapsed && item.badge !== undefined && item.badge > 0 && (
                        <span className="ml-auto bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  )
                }

                // Parent with children
                return (
                  <div key={item.name} className="space-y-1">
                    <button
                      onClick={() => !sidebarCollapsed && toggleSection(item.name)}
                      title={sidebarCollapsed ? item.name : undefined}
                      className={cn(
                        'w-full flex items-center gap-3 rounded-lg text-sm font-medium transition-all duration-200',
                        sidebarCollapsed ? 'justify-center px-4 py-3' : 'px-4 py-3',
                        isActive
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                      )}
                    >
                      <Icon className="w-5 h-5 flex-shrink-0" />
                      {!sidebarCollapsed && (
                        <>
                          <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="flex-1 text-left"
                          >
                            {item.name}
                          </motion.span>
                          {item.badge !== undefined && item.badge > 0 && (
                            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                              {item.badge}
                            </span>
                          )}
                          <ChevronDown
                            className={cn(
                              'w-4 h-4 flex-shrink-0 transition-transform duration-200',
                              isExpanded && 'transform rotate-180'
                            )}
                          />
                        </>
                      )}
                    </button>

                    {/* Submenu */}
                    {!sidebarCollapsed && (
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden"
                          >
                            <div className="pl-4 space-y-1 py-1">
                              {item.children.map((child) => {
                                const isChildActive = pathname === child.href || pathname?.startsWith(child.href)
                                const ChildIcon = child.icon

                                return (
                                  <Link
                                    key={child.name}
                                    href={child.href}
                                    className={cn(
                                      'flex items-center gap-3 rounded-lg px-4 py-2 text-sm transition-all duration-200',
                                      isChildActive
                                        ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-orange font-medium'
                                        : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                    )}
                                  >
                                    {ChildIcon && <ChildIcon className="w-4 h-4 flex-shrink-0" />}
                                    <span>{child.name}</span>
                                  </Link>
                                )
                              })}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    )}
                  </div>
                )
              })}
            </div>
          </nav>

          {/* Footer */}
          <div className="border-t border-gray-800 p-4">
            {!sidebarCollapsed ? (
              <div className="rounded-lg bg-gradient-to-r from-orange-500/10 to-orange-600/10 border border-orange-500/20 p-4">
                <p className="text-sm font-medium text-white mb-1">
                  Need Help?
                </p>
                <p className="text-xs text-gray-400 mb-3">
                  Contact our support team
                </p>
                <Link
                  href="/ai-chat"
                  className="block text-center text-sm font-medium text-orange-500 hover:text-orange-400 transition-colors"
                >
                  Start Chat →
                </Link>
              </div>
            ) : (
              <Link
                href="/ai-chat"
                title="Need Help?"
                className="flex justify-center p-3 rounded-lg bg-orange-500/10 hover:bg-orange-500/20 border border-orange-500/20 transition-colors"
              >
                <MessageSquare className="w-5 h-5 text-orange-500" />
              </Link>
            )}

            {/* Collapse Toggle - Desktop only */}
            <button
              onClick={toggleSidebarCollapse}
              className="hidden lg:flex items-center justify-center w-full mt-4 p-2 rounded-lg hover:bg-gray-800 transition-colors"
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
