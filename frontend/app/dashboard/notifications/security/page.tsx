'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  Lock,
  Unlock,
  Key,
  AlertTriangle,
  CheckCircle2,
  Settings,
  Eye,
  Trash2,
  UserX,
  FileWarning
} from 'lucide-react'

export default function SecurityNotificationsPage() {
  const [alerts] = useState<any[]>([])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security Alerts</h1>
          <p className="text-gray-600 mt-1">Monitor and manage security notifications</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            View All
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Settings className="w-4 h-4 mr-2" />
            Security Settings
          </Button>
        </div>
      </div>

      {/* Security Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Alerts</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <ShieldAlert className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Warnings</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Security Status</p>
                <p className="text-xl font-bold text-green-600">Good</p>
              </div>
              <ShieldCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed Logins</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Lock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Security Overview</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">Firewall</p>
                  <p className="text-sm text-gray-600">Active and protected</p>
                </div>
              </div>
              <Badge variant="success">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">Encryption</p>
                  <p className="text-sm text-gray-600">All data encrypted</p>
                </div>
              </div>
              <Badge variant="success">Enabled</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
              <div className="flex items-center gap-3">
                <Key className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">2FA</p>
                  <p className="text-sm text-gray-600">Two-factor enabled</p>
                </div>
              </div>
              <Badge variant="success">Active</Badge>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg bg-green-50">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium text-gray-900">Antivirus</p>
                  <p className="text-sm text-gray-600">Last scan: 1 hour ago</p>
                </div>
              </div>
              <Badge variant="success">Protected</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Security Alerts</CardTitle>
            <Button variant="outline" size="sm">
              <Trash2 className="w-4 h-4 mr-2" />
              Clear Resolved
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No security alerts</p>
              <p className="text-sm mt-2">Your system is secure. Security alerts will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${
                    alert.severity === 'critical' ? 'border-red-200 bg-red-50' :
                    alert.severity === 'high' ? 'border-orange-200 bg-orange-50' :
                    alert.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                    'border-blue-200 bg-blue-50'
                  } hover:shadow-md transition`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    alert.severity === 'critical' ? 'bg-red-100' :
                    alert.severity === 'high' ? 'bg-orange-100' :
                    alert.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    {alert.type === 'unauthorized_access' ? (
                      <UserX className={`w-5 h-5 ${
                        alert.severity === 'critical' ? 'text-red-500' :
                        alert.severity === 'high' ? 'text-orange-500' :
                        alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                    ) : alert.type === 'failed_login' ? (
                      <Lock className={`w-5 h-5 ${
                        alert.severity === 'critical' ? 'text-red-500' :
                        alert.severity === 'high' ? 'text-orange-500' :
                        alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                    ) : (
                      <ShieldAlert className={`w-5 h-5 ${
                        alert.severity === 'critical' ? 'text-red-500' :
                        alert.severity === 'high' ? 'text-orange-500' :
                        alert.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-900">{alert.title}</p>
                          <Badge variant={
                            alert.severity === 'critical' ? 'destructive' :
                            alert.severity === 'high' ? 'warning' : 'default'
                          }>
                            {alert.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{alert.message}</p>
                        <div className="flex items-center gap-4 mt-3">
                          <p className="text-xs text-gray-500">{alert.timestamp}</p>
                          {alert.location && (
                            <p className="text-xs text-gray-500">Location: {alert.location}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    {alert.action && (
                      <div className="mt-3">
                        <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                          {alert.action}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Security Recommendations</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-4 p-4 border rounded-lg bg-blue-50">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Enable Two-Factor Authentication</p>
                <p className="text-sm text-gray-600 mt-1">
                  Add an extra layer of security to your account
                </p>
                <Button size="sm" variant="outline" className="mt-3">
                  Set Up 2FA
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg bg-blue-50">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Regular Password Updates</p>
                <p className="text-sm text-gray-600 mt-1">
                  Change your password regularly for better security
                </p>
                <Button size="sm" variant="outline" className="mt-3">
                  Update Password
                </Button>
              </div>
            </div>

            <div className="flex items-start gap-4 p-4 border rounded-lg bg-blue-50">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                <CheckCircle2 className="w-5 h-5 text-blue-500" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-gray-900">Review Login Activity</p>
                <p className="text-sm text-gray-600 mt-1">
                  Monitor your recent login activity for suspicious behavior
                </p>
                <Button size="sm" variant="outline" className="mt-3">
                  View Activity
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
