'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  CreditCard,
  Package,
  TrendingUp,
  Users,
  Database,
  Zap,
  CheckCircle2,
  XCircle
} from 'lucide-react'
import { billingService, SubscriptionPlan, Subscription, Usage } from '@/lib/api/services/billing.service'

export default function PlansPage() {
  const [currentPlan, setCurrentPlan] = useState<Subscription | null>(null)
  const [plans, setPlans] = useState<SubscriptionPlan[]>([])
  const [usage, setUsage] = useState<Usage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const [plansRes, subscriptionRes, usageRes] = await Promise.all([
        billingService.getPlans(),
        billingService.getCurrentSubscription().catch(() => ({ data: null })),
        billingService.getUsage().catch(() => ({ data: null }))
      ])
      if (plansRes.data) setPlans(plansRes.data)
      if (subscriptionRes.data) setCurrentPlan(subscriptionRes.data)
      if (usageRes.data) setUsage(usageRes.data)
    } catch (err: any) {
      console.error('Error fetching plans data:', err)
      setError(err.message || 'Failed to load plans data')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Plans & Usage</h1>
          <p className="text-gray-600 mt-1">Manage your subscription and monitor usage</p>
        </div>
        <Button variant="primary">
          Upgrade Plan
        </Button>
      </div>

      {/* Current Usage Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Devices Used</p>
                <p className="text-3xl font-bold text-gray-900">
                  {isLoading ? '...' : usage ? `${usage.devices.current} / ${usage.devices.limit}` : '0 / 0'}
                </p>
              </div>
              <Package className="w-8 h-8 text-orange-500" />
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${usage?.devices.percentage || 0}%` }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Storage Used</p>
                <p className="text-3xl font-bold text-gray-900">
                  {isLoading ? '...' : usage ? `${usage.storage.current_gb} GB` : '0 GB'}
                </p>
              </div>
              <Database className="w-8 h-8 text-blue-500" />
            </div>
            <div className="mt-4">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${usage?.storage.percentage || 0}%` }}></div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-3xl font-bold text-gray-900">
                  {isLoading ? '...' : usage ? `${usage.users.current}` : '0'}
                </p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Tickets</p>
                <p className="text-3xl font-bold text-gray-900">
                  {isLoading ? '...' : usage ? `${usage.tickets.current_month}` : '0'}
                </p>
              </div>
              <Zap className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Plan */}
      <Card>
        <CardHeader>
          <CardTitle>Current Plan</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            </div>
          ) : !currentPlan ? (
            <div className="text-center py-8 text-gray-500">
              <CreditCard className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No active subscription</p>
              <p className="text-sm mt-2">Choose a plan below to get started</p>
            </div>
          ) : (
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">{currentPlan.plan.name}</h3>
                <p className="text-gray-600 mt-1">
                  ${currentPlan.plan.price_monthly} / month
                </p>
              </div>
              <div className="text-right">
                <Badge variant={currentPlan.status === 'active' ? 'success' : 'default'}>{currentPlan.status}</Badge>
                <p className="text-sm text-gray-600 mt-2">Renews on {new Date(currentPlan.current_period_end).toLocaleDateString()}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Available Plans */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Available Plans</h2>
        {isLoading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading plans...</p>
          </div>
        ) : plans.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <Package className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No plans available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan) => (
              <Card
                key={plan.id}
                className={`relative ${plan.is_popular ? 'border-2 border-orange-500 shadow-lg' : ''}`}
              >
                {plan.is_popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-orange-500 text-white">Recommended</Badge>
                  </div>
                )}
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-gray-900">${plan.price_monthly}</span>
                      <span className="text-gray-600">/month</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        {feature.included ? (
                          <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                        )}
                        <span className={`text-sm ${feature.included ? 'text-gray-900' : 'text-gray-400'}`}>
                          {feature.name}
                        </span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className={`w-full ${plan.is_popular ? 'bg-orange-500 hover:bg-orange-600' : 'bg-gray-900 hover:bg-gray-800'}`}
                  >
                    {plan.is_popular ? 'Choose Plan' : 'Select'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Usage History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Usage History</CardTitle>
            <Button variant="outline" size="sm">
              View Details
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No usage data available</p>
            <p className="text-sm mt-2">Usage statistics will appear here once you start using the service</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
