'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Key,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  Settings,
  RefreshCw,
  CreditCard,
  FileText,
  Bell
} from 'lucide-react'

export default function LicenseNotificationsPage() {
  const [notifications] = useState<any[]>([])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">License Reminders</h1>
          <p className="text-gray-600 mt-1">Manage software license notifications and renewals</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="primary">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* License Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Licenses</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expiring Soon</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Expired</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Renewal</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* License Overview */}
      <Card>
        <CardHeader>
          <CardTitle>License Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-6 border rounded-lg hover:shadow-md transition">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Key className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Licenses</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>

            <div className="text-center p-6 border rounded-lg hover:shadow-md transition">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Total Cost/Month</p>
              <p className="text-3xl font-bold text-gray-900">$0</p>
            </div>

            <div className="text-center p-6 border rounded-lg hover:shadow-md transition">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-sm text-gray-600 mb-1">Software Products</p>
              <p className="text-3xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* License Reminders */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>License Reminders</CardTitle>
            <Button variant="outline" size="sm">
              View All Licenses
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Key className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No license reminders</p>
              <p className="text-sm mt-2">License renewal notifications will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${
                    notification.daysUntilExpiry <= 7 ? 'border-red-200 bg-red-50' :
                    notification.daysUntilExpiry <= 30 ? 'border-yellow-200 bg-yellow-50' :
                    'border-blue-200 bg-blue-50'
                  } hover:shadow-md transition`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notification.daysUntilExpiry <= 7 ? 'bg-red-100' :
                    notification.daysUntilExpiry <= 30 ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    <Key className={`w-5 h-5 ${
                      notification.daysUntilExpiry <= 7 ? 'text-red-500' :
                      notification.daysUntilExpiry <= 30 ? 'text-yellow-500' : 'text-blue-500'
                    }`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{notification.software}</p>
                          <Badge variant={
                            notification.daysUntilExpiry <= 7 ? 'danger' :
                            notification.daysUntilExpiry <= 30 ? 'warning' : 'default'
                          }>
                            {notification.daysUntilExpiry} days left
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">
                          License expires on {notification.expiryDate}
                        </p>
                        <div className="flex items-center gap-4 mt-2">
                          <p className="text-xs text-gray-500">Licenses: {notification.count}</p>
                          <p className="text-xs text-gray-500">Cost: ${notification.cost}/month</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="primary">
                        Renew Now
                      </Button>
                      <Button size="sm" variant="outline">
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Bell className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">60 Days Before Expiry</p>
                  <p className="text-sm text-gray-600">Get notified 60 days before license expires</p>
                </div>
              </div>
              <input type="checkbox" className="w-5 h-5 text-orange-500" defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Bell className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">30 Days Before Expiry</p>
                  <p className="text-sm text-gray-600">Get notified 30 days before license expires</p>
                </div>
              </div>
              <input type="checkbox" className="w-5 h-5 text-orange-500" defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Bell className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">7 Days Before Expiry</p>
                  <p className="text-sm text-gray-600">Get notified 7 days before license expires</p>
                </div>
              </div>
              <input type="checkbox" className="w-5 h-5 text-orange-500" defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Bell className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">On Expiry Date</p>
                  <p className="text-sm text-gray-600">Get notified on the day of expiry</p>
                </div>
              </div>
              <input type="checkbox" className="w-5 h-5 text-orange-500" defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Bell className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">Email Notifications</p>
                  <p className="text-sm text-gray-600">Receive license alerts via email</p>
                </div>
              </div>
              <input type="checkbox" className="w-5 h-5 text-orange-500" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent License Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            <Calendar className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No recent activity</p>
            <p className="text-sm mt-2">License renewals and updates will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
