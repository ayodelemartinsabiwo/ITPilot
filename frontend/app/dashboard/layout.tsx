'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar-New'
import { Navbar } from '@/components/layout/Navbar'
import { useAuthStore } from '@/lib/store'
import { authService } from '@/lib/api/services/auth.service'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { isAuthenticated, isLoading, loadUser } = useAuthStore()
  const [isHydrated, setIsHydrated] = useState(false)

  useEffect(() => {
    // Mark as hydrated after mount (Zustand persist rehydration)
    setIsHydrated(true)

    // If we have tokens but no auth state, load user
    if (authService.isAuthenticated() && !isAuthenticated) {
      loadUser()
    }
  }, [])

  useEffect(() => {
    // Only redirect if hydrated, not loading, and not authenticated
    if (isHydrated && !isLoading && !isAuthenticated && !authService.isAuthenticated()) {
      router.push('/login')
    }
  }, [isAuthenticated, isLoading, isHydrated, router])

  // Show loading while hydrating or loading user
  if (!isHydrated || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-orange animate-pulse">
            <span className="text-white font-bold text-2xl">IT</span>
          </div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Show nothing while redirecting
  if (!isAuthenticated && !authService.isAuthenticated()) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex pt-16 overflow-x-hidden">
        <Sidebar />
        <main className="flex-1 overflow-x-hidden overflow-y-auto min-w-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
