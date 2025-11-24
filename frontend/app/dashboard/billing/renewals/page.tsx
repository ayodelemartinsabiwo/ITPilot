'use client'

import { useState, useEffect } from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Bell,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Settings,
  RefreshCw,
  CreditCard,
  Clock
} from 'lucide-react'
import { billingService } from '@/lib/api/services/billing.service'

export default function RenewalsPage() {
  const [renewals, setRenewals] = useState<any[]>([])
  const [autoRenewEnabled, setAutoRenewEnabled] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchRenewals()
  }, [])

  const fetchRenewals = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await billingService.getRenewalAlerts()
      if (response.data) {
        setRenewals(response.data)
      }
    } catch (err: any) {
      console.error('Error fetching renewals:', err)
      setError(err.message || 'Failed to load renewal alerts')
    } finally {
      setIsLoading(false)
    }
  }

  const dueSoon = renewals.filter(r => r.daysUntil && r.daysUntil <= 30).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Renewal Alerts</h1>
          <p className="text-gray-600 mt-1">Manage subscription renewals and alerts</p>
        </div>
        <Button variant="primary">
          <Settings className="w-4 h-4 mr-2" />
          Renewal Settings
        </Button>
      </div>

      {/* Renewal Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Next Renewal</p>
                <p className="text-3xl font-bold text-gray-900">{isLoading ? '...' : renewals.length > 0 ? renewals[0].renewalDate || '--' : '--'}</p>
              </div>
              <Calendar className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Due Soon</p>
                <p className="text-3xl font-bold text-gray-900">{isLoading ? '...' : dueSoon}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Auto-Renewal</p>
                <p className="text-3xl font-bold text-gray-900">
                  {autoRenewEnabled ? 'On' : 'Off'}
                </p>
              </div>
              <RefreshCw className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Renewals</p>
                <p className="text-3xl font-bold text-gray-900">{isLoading ? '...' : renewals.length}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Auto-Renewal Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Auto-Renewal Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-gray-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                <RefreshCw className="w-6 h-6 text-orange-500" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Automatic Renewal</p>
                <p className="text-sm text-gray-600">
                  {autoRenewEnabled
                    ? 'Your subscription will automatically renew'
                    : 'Enable to automatically renew your subscription'}
                </p>
              </div>
            </div>
            <Button
              variant={autoRenewEnabled ? 'outline' : 'primary'}
              className={!autoRenewEnabled ? 'bg-orange-500 hover:bg-orange-600' : ''}
              onClick={() => setAutoRenewEnabled(!autoRenewEnabled)}
            >
              {autoRenewEnabled ? 'Disable' : 'Enable'}
            </Button>
          </div>

          {autoRenewEnabled && (
            <div className="mt-4 p-4 border border-green-200 bg-green-50 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <p className="font-medium text-green-900">Auto-renewal is enabled</p>
                  <p className="text-sm text-green-700 mt-1">
                    Your subscription will automatically renew on the due date using your default payment method.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Renewals */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Upcoming Renewals</CardTitle>
            <Button variant="outline" size="sm">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {renewals.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No upcoming renewals</p>
              <p className="text-sm mt-2">Your subscription renewals will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {renewals.map((renewal, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      renewal.daysUntil <= 7 ? 'bg-red-100' :
                      renewal.daysUntil <= 30 ? 'bg-yellow-100' : 'bg-green-100'
                    }`}>
                      <Calendar className={`w-5 h-5 ${
                        renewal.daysUntil <= 7 ? 'text-red-500' :
                        renewal.daysUntil <= 30 ? 'text-yellow-500' : 'text-green-500'
                      }`} />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{renewal.planName}</p>
                      <p className="text-sm text-gray-600">
                        Renews on {renewal.renewalDate}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">${renewal.amount}</p>
                    <Badge
                      variant={renewal.daysUntil <= 7 ? 'danger' : 'default'}
                      className="mt-1"
                    >
                      {renewal.daysUntil} days
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Preferences */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Preferences</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Bell className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">Get email alerts before renewal</p>
                </div>
              </div>
              <input type="checkbox" className="w-5 h-5 text-orange-500" />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Bell className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">Reminder 30 Days Before</p>
                  <p className="text-sm text-gray-600">Get notified 30 days before renewal</p>
                </div>
              </div>
              <input type="checkbox" className="w-5 h-5 text-orange-500" defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Bell className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">Reminder 7 Days Before</p>
                  <p className="text-sm text-gray-600">Get notified 7 days before renewal</p>
                </div>
              </div>
              <input type="checkbox" className="w-5 h-5 text-orange-500" defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Bell className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">Payment Confirmation</p>
                  <p className="text-sm text-gray-600">Get notified when payment is processed</p>
                </div>
              </div>
              <input type="checkbox" className="w-5 h-5 text-orange-500" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Renewal History */}
      <Card>
        <CardHeader>
          <CardTitle>Renewal History</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No renewal history</p>
            <p className="text-sm mt-2">Past renewals will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
