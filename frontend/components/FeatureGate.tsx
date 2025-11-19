'use client'

import { ReactNode } from 'react'
import Link from 'next/link'
import { Lock, Crown, ArrowRight } from 'lucide-react'
import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { useQuery } from '@tanstack/react-query'
import { billingAPI } from '@/lib/api'
import { canAccessFeature, getUpgradeMessage, PlanFeatures } from '@/lib/features'

interface FeatureGateProps {
  children: ReactNode
  feature: keyof PlanFeatures
  fallback?: ReactNode
  featureName?: string
}

export function FeatureGate({ children, feature, fallback, featureName }: FeatureGateProps) {
  const { data: subscriptionData, isLoading } = useQuery({
    queryKey: ['my-subscription'],
    queryFn: async () => {
      const response = await billingAPI.getMySubscription()
      return response.data
    },
    retry: false,
  })

  const planName = subscriptionData?.subscription?.plan?.name || null
  const hasAccess = canAccessFeature(planName, feature)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-pulse flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-full bg-gray-200" />
          <div className="h-4 w-32 bg-gray-200 rounded" />
        </div>
      </div>
    )
  }

  if (hasAccess) {
    return <>{children}</>
  }

  if (fallback) {
    return <>{fallback}</>
  }

  // Default locked state
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center justify-center min-h-[60vh] p-4"
    >
      <Card className="max-w-md w-full">
        <CardContent className="p-12 text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center">
            <Lock className="w-10 h-10 text-orange-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            {featureName || 'This Feature'} is Locked
          </h2>

          <p className="text-gray-600 mb-6">
            {getUpgradeMessage(
              featureName || 'This feature',
              planName || 'Free'
            )}
          </p>

          <div className="space-y-3">
            <Link href="/pricing">
              <Button className="w-full" leftIcon={<Crown className="w-5 h-5" />}>
                View Plans & Upgrade
              </Button>
            </Link>

            <Link href="/dashboard">
              <Button variant="outline" className="w-full">
                Back to Dashboard
              </Button>
            </Link>
          </div>

          <div className="mt-8 p-4 bg-orange-50 rounded-lg border border-orange-100">
            <p className="text-sm text-orange-800 font-medium mb-2">
              ✨ Available on Professional & Enterprise plans
            </p>
            <ul className="text-sm text-orange-700 space-y-1 text-left">
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
                Unlimited access to all features
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
                Priority support & SLA guarantee
              </li>
              <li className="flex items-center gap-2">
                <ArrowRight className="w-4 h-4 flex-shrink-0" />
                Advanced analytics & reporting
              </li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
