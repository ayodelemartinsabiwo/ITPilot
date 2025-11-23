'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Bell,
  BellOff,
  CheckCheck,
  Trash2,
  Settings,
  Shield,
  Server,
  CreditCard,
  AlertTriangle,
  Info,
  Check
} from 'lucide-react'

export default function NotificationsPage() {
  const [notifications] = useState<any[]>([])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Notifications</h1>
          <p className="text-gray-600 mt-1">Manage and view all your notifications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <CheckCheck className="w-4 h-4 mr-2" />
            Mark All Read
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Notification Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Bell className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Unread</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <BellOff className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Info className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notification Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition cursor-pointer">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-3">
                <Server className="w-6 h-6 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-900">System</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">0</p>
              <p className="text-xs text-gray-600 mt-1">System messages</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition cursor-pointer">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                <Shield className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-semibold text-gray-900">Security</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">0</p>
              <p className="text-xs text-gray-600 mt-1">Security alerts</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition cursor-pointer">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
                <CreditCard className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-900">Licenses</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">0</p>
              <p className="text-xs text-gray-600 mt-1">License reminders</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition cursor-pointer">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="font-semibold text-gray-900">Devices</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">0</p>
              <p className="text-xs text-gray-600 mt-1">Device warnings</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Options */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="default" size="sm" className="bg-orange-500 hover:bg-orange-600">
              All
            </Button>
            <Button variant="outline" size="sm">
              Unread
            </Button>
            <Button variant="outline" size="sm">
              Critical
            </Button>
            <Button variant="outline" size="sm">
              System
            </Button>
            <Button variant="outline" size="sm">
              Security
            </Button>
            <Button variant="outline" size="sm">
              Licenses
            </Button>
            <Button variant="outline" size="sm">
              Devices
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Notifications</CardTitle>
            <Button variant="outline" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No notifications</p>
              <p className="text-sm mt-2">You're all caught up! Check back later for updates.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${
                    notification.unread ? 'bg-orange-50 border-orange-200' : 'bg-white'
                  } hover:shadow-md transition`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notification.type === 'critical' ? 'bg-red-100' :
                    notification.type === 'warning' ? 'bg-yellow-100' :
                    notification.type === 'info' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {notification.type === 'critical' ? (
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                    ) : notification.type === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    ) : notification.type === 'info' ? (
                      <Info className="w-5 h-5 text-blue-500" />
                    ) : (
                      <Check className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{notification.time}</p>
                      </div>
                      <Badge variant={notification.type === 'critical' ? 'destructive' : 'default'}>
                        {notification.category}
                      </Badge>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
