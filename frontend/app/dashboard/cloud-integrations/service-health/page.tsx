'use client'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Activity, CheckCircle, AlertTriangle, XCircle, Clock, TrendingUp, RefreshCw } from 'lucide-react'

export default function ServiceHealthPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Service Health Monitoring</h1>
          <p className="text-gray-600 mt-1">Monitor the status and uptime of all cloud services</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh Status
        </Button>
      </div>

      {/* Overall Health Status */}
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg opacity-90 mb-2">Overall Service Health</p>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-8 h-8" />
                <div className="text-3xl font-bold">All Systems Operational</div>
              </div>
              <p className="text-sm opacity-75 mt-2">Last checked: Never</p>
            </div>
            <Activity className="w-20 h-20 opacity-20" />
          </div>
        </CardContent>
      </Card>

      {/* Service Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Operational</p>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Degraded</p>
                <p className="text-3xl font-bold text-yellow-600">0</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Down</p>
                <p className="text-3xl font-bold text-red-600">0</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Uptime</p>
                <p className="text-3xl font-bold text-gray-900">--%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Service Status by Platform */}
      <Card>
        <CardHeader>
          <CardTitle>Service Status by Platform</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {/* Microsoft 365 */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-gray-400" />
                  <h3 className="font-semibold">Microsoft 365</h3>
                </div>
                <Badge className="bg-gray-200 text-gray-700">Not Monitored</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Exchange Online</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Teams</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>SharePoint</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>OneDrive</span>
                </div>
              </div>
            </div>

            {/* Google Workspace */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-gray-400" />
                  <h3 className="font-semibold">Google Workspace</h3>
                </div>
                <Badge className="bg-gray-200 text-gray-700">Not Monitored</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Gmail</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Drive</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Calendar</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Meet</span>
                </div>
              </div>
            </div>

            {/* Zoho */}
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-gray-400" />
                  <h3 className="font-semibold">Zoho Services</h3>
                </div>
                <Badge className="bg-gray-200 text-gray-700">Not Monitored</Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Zoho CRM</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Zoho Mail</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Zoho Docs</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  <span>Zoho People</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uptime Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-500" />
              Recent Incidents
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
              <p>No recent incidents</p>
              <p className="text-sm mt-2">All services running smoothly</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-500" />
              Uptime History
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8 text-gray-500">
              <Activity className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No uptime data available</p>
              <p className="text-sm mt-2">Connect services to track uptime</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Incidents */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Service Incidents</CardTitle>
            <Badge className="bg-green-500">0 Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
            <p className="text-lg font-medium">No active incidents</p>
            <p className="text-sm mt-2">All cloud services are operating normally</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
