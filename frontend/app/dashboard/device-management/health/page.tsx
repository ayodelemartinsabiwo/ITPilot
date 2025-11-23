'use client'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Activity, Cpu, HardDrive, Thermometer, Zap, CheckCircle, AlertTriangle } from 'lucide-react'

export default function DeviceHealthPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Device Health</h1>
          <p className="text-gray-600 mt-1">Monitor the health status of all devices</p>
        </div>
        <Button variant="primary">
          <Activity className="w-4 h-4 mr-2" />
          Run Health Check
        </Button>
      </div>

      {/* Overall Health Score */}
      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-lg opacity-90 mb-2">Overall Health Score</p>
            <div className="flex items-center justify-center gap-4">
              <div className="text-6xl font-bold">--</div>
              <div className="text-left">
                <p className="text-sm opacity-90">No data available</p>
                <p className="text-xs opacity-75">Run a health check to get started</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Health Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Healthy Devices</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500">0% of total</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Warning</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500">Needs attention</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <Activity className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Critical</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
                <p className="text-xs text-gray-500">Requires immediate action</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Health Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5 text-orange-500" />
              CPU Health
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8 text-gray-500">
              <p>No CPU health data available</p>
              <p className="text-sm mt-2">Connect devices to monitor CPU performance</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-orange-500" />
              Storage Health
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8 text-gray-500">
              <p>No storage health data available</p>
              <p className="text-sm mt-2">Connect devices to monitor storage status</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-orange-500" />
              Temperature Monitoring
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8 text-gray-500">
              <p>No temperature data available</p>
              <p className="text-sm mt-2">Monitor device temperatures in real-time</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-500" />
              Battery Health
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8 text-gray-500">
              <p>No battery health data available</p>
              <p className="text-sm mt-2">Track battery status for portable devices</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Health Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Health Alerts</CardTitle>
            <Badge className="bg-green-500">0 Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
            <p className="text-lg font-medium">All systems healthy</p>
            <p className="text-sm mt-2">No health alerts detected</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
