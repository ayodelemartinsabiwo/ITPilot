'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Server,
  RefreshCw,
  CloudOff,
  Database,
  Activity,
  CheckCircle2,
  AlertTriangle,
  Info,
  Settings,
  Trash2
} from 'lucide-react'

export default function SystemNotificationsPage() {
  const [notifications] = useState<any[]>([])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Messages</h1>
          <p className="text-gray-600 mt-1">System updates and maintenance notifications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Settings className="w-4 h-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* System Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Server className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Healthy</p>
                <p className="text-3xl font-bold text-gray-900">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Updates Available</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <RefreshCw className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Maintenance</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Database className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle>System Status</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">API Services</p>
                  <p className="text-sm text-gray-600">All systems operational</p>
                </div>
              </div>
              <Badge variant="success">Healthy</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">Database</p>
                  <p className="text-sm text-gray-600">Running smoothly</p>
                </div>
              </div>
              <Badge variant="success">Healthy</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">Cloud Services</p>
                  <p className="text-sm text-gray-600">All integrations active</p>
                </div>
              </div>
              <Badge variant="success">Healthy</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">Backup Systems</p>
                  <p className="text-sm text-gray-600">Last backup: 2 hours ago</p>
                </div>
              </div>
              <Badge variant="success">Healthy</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Messages */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent System Messages</CardTitle>
            <Button variant="outline" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {notifications.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Server className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No system messages</p>
              <p className="text-sm mt-2">System notifications will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {notifications.map((notification, index) => (
                <div
                  key={index}
                  className="flex items-start gap-4 p-4 rounded-lg border hover:shadow-md transition"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    notification.severity === 'error' ? 'bg-red-100' :
                    notification.severity === 'warning' ? 'bg-yellow-100' :
                    notification.severity === 'info' ? 'bg-blue-100' : 'bg-green-100'
                  }`}>
                    {notification.severity === 'error' ? (
                      <CloudOff className="w-5 h-5 text-red-500" />
                    ) : notification.severity === 'warning' ? (
                      <AlertTriangle className="w-5 h-5 text-yellow-500" />
                    ) : notification.severity === 'info' ? (
                      <Info className="w-5 h-5 text-blue-500" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{notification.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-500 mt-2">{notification.timestamp}</p>
                      </div>
                      <Badge variant={notification.severity === 'error' ? 'destructive' : 'default'}>
                        {notification.severity}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Scheduled Maintenance */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Maintenance</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            <Database className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No scheduled maintenance</p>
            <p className="text-sm mt-2">Maintenance windows will be announced here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
