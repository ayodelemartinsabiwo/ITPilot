'use client'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { AlertTriangle, XCircle, CheckCircle, RefreshCw, AlertCircle, Clock, TrendingDown } from 'lucide-react'

export default function SyncErrorsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Sync Errors Tracking</h1>
          <p className="text-gray-600 mt-1">Monitor and resolve synchronization errors across cloud services</p>
        </div>
        <Button variant="primary">
          <RefreshCw className="w-4 h-4 mr-2" />
          Retry Failed Syncs
        </Button>
      </div>

      {/* Error Overview */}
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg opacity-90 mb-2">Sync Status</p>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-8 h-8" />
                <div className="text-3xl font-bold">No Errors Detected</div>
              </div>
              <p className="text-sm opacity-75 mt-2">All synchronization operations are running smoothly</p>
            </div>
            <CheckCircle className="w-20 h-20 opacity-20" />
          </div>
        </CardContent>
      </Card>

      {/* Error Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Errors</p>
                <p className="text-3xl font-bold text-red-600">0</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Warnings</p>
                <p className="text-3xl font-bold text-yellow-600">0</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Retries</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved Today</p>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Errors by Service */}
      <Card>
        <CardHeader>
          <CardTitle>Sync Errors by Service</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-semibold">Microsoft 365</p>
                  <p className="text-sm text-gray-600">Exchange, Teams, SharePoint</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-green-100 text-green-700">0 Errors</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-semibold">Google Workspace</p>
                  <p className="text-sm text-gray-600">Gmail, Drive, Calendar</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-green-100 text-green-700">0 Errors</Badge>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="font-semibold">Zoho Services</p>
                  <p className="text-sm text-gray-600">CRM, Mail, Docs</p>
                </div>
              </div>
              <div className="text-right">
                <Badge className="bg-green-100 text-green-700">0 Errors</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-orange-500" />
              Common Error Types
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Authentication Failures</span>
                <Badge className="bg-gray-200 text-gray-700">0</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Network Timeouts</span>
                <Badge className="bg-gray-200 text-gray-700">0</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Permission Errors</span>
                <Badge className="bg-gray-200 text-gray-700">0</Badge>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm">Data Conflicts</span>
                <Badge className="bg-gray-200 text-gray-700">0</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-orange-500" />
              Error Trends
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8 text-gray-500">
              <TrendingDown className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No trend data available</p>
              <p className="text-sm mt-2">Error trends will appear here once data is collected</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Sync Errors */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Sync Errors</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Filter</Button>
              <Button variant="outline" size="sm">Export</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
            <p className="text-lg font-medium">No sync errors detected</p>
            <p className="text-sm mt-2">All synchronization operations are completing successfully</p>
          </div>
        </CardContent>
      </Card>

      {/* Auto-Retry Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <RefreshCw className="w-5 h-5 text-orange-500" />
            Auto-Retry Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Automatic Retry Enabled</p>
                <p className="text-sm text-gray-600">Failed syncs will be automatically retried</p>
              </div>
              <Badge className="bg-green-500">Active</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Maximum Retry Attempts</p>
                <p className="text-sm text-gray-600">Number of times to retry failed operations</p>
              </div>
              <span className="font-semibold">3 attempts</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium">Retry Interval</p>
                <p className="text-sm text-gray-600">Time between retry attempts</p>
              </div>
              <span className="font-semibold">5 minutes</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
