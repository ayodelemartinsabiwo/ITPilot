'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import {
  Laptop,
  AlertTriangle,
  HardDrive,
  Cpu,
  Battery,
  Wifi,
  WifiOff,
  Thermometer,
  Settings,
  RefreshCw,
  CheckCircle2,
  XCircle,
  TrendingUp,
  Activity
} from 'lucide-react'

export default function DeviceNotificationsPage() {
  const [warnings] = useState<any[]>([])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Device Warnings</h1>
          <p className="text-gray-600 mt-1">Monitor device health and performance alerts</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Device Warning Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Warnings</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Minor Warnings</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Activity className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Offline Devices</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <WifiOff className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Healthy Devices</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warning Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="hover:shadow-lg transition">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-3">
                <HardDrive className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="font-semibold text-gray-900">Low Storage</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">0</p>
              <p className="text-xs text-gray-600 mt-1">Devices with low storage</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-3">
                <Cpu className="w-6 h-6 text-yellow-500" />
              </div>
              <h3 className="font-semibold text-gray-900">High CPU</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">0</p>
              <p className="text-xs text-gray-600 mt-1">CPU usage warnings</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mx-auto mb-3">
                <Battery className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="font-semibold text-gray-900">Low Battery</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">0</p>
              <p className="text-xs text-gray-600 mt-1">Battery warnings</p>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mx-auto mb-3">
                <Thermometer className="w-6 h-6 text-purple-500" />
              </div>
              <h3 className="font-semibold text-gray-900">Overheating</h3>
              <p className="text-2xl font-bold text-gray-900 mt-2">0</p>
              <p className="text-xs text-gray-600 mt-1">Temperature alerts</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filter Options */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-2">
            <Button variant="primary" size="sm" className="bg-orange-500 hover:bg-orange-600">
              All Warnings
            </Button>
            <Button variant="outline" size="sm">
              Critical
            </Button>
            <Button variant="outline" size="sm">
              Storage
            </Button>
            <Button variant="outline" size="sm">
              Performance
            </Button>
            <Button variant="outline" size="sm">
              Battery
            </Button>
            <Button variant="outline" size="sm">
              Network
            </Button>
            <Button variant="outline" size="sm">
              Temperature
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Device Warnings List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Active Warnings</CardTitle>
            <Button variant="outline" size="sm">
              Resolve All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {warnings.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No device warnings</p>
              <p className="text-sm mt-2">All devices are running smoothly. Warnings will appear here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {warnings.map((warning, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 p-4 rounded-lg border ${
                    warning.severity === 'critical' ? 'border-red-200 bg-red-50' :
                    warning.severity === 'high' ? 'border-orange-200 bg-orange-50' :
                    warning.severity === 'medium' ? 'border-yellow-200 bg-yellow-50' :
                    'border-blue-200 bg-blue-50'
                  } hover:shadow-md transition`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    warning.severity === 'critical' ? 'bg-red-100' :
                    warning.severity === 'high' ? 'bg-orange-100' :
                    warning.severity === 'medium' ? 'bg-yellow-100' : 'bg-blue-100'
                  }`}>
                    {warning.type === 'storage' ? (
                      <HardDrive className={`w-5 h-5 ${
                        warning.severity === 'critical' ? 'text-red-500' :
                        warning.severity === 'high' ? 'text-orange-500' :
                        warning.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                    ) : warning.type === 'cpu' ? (
                      <Cpu className={`w-5 h-5 ${
                        warning.severity === 'critical' ? 'text-red-500' :
                        warning.severity === 'high' ? 'text-orange-500' :
                        warning.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                    ) : warning.type === 'battery' ? (
                      <Battery className={`w-5 h-5 ${
                        warning.severity === 'critical' ? 'text-red-500' :
                        warning.severity === 'high' ? 'text-orange-500' :
                        warning.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                    ) : warning.type === 'network' ? (
                      <WifiOff className={`w-5 h-5 ${
                        warning.severity === 'critical' ? 'text-red-500' :
                        warning.severity === 'high' ? 'text-orange-500' :
                        warning.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                    ) : (
                      <AlertTriangle className={`w-5 h-5 ${
                        warning.severity === 'critical' ? 'text-red-500' :
                        warning.severity === 'high' ? 'text-orange-500' :
                        warning.severity === 'medium' ? 'text-yellow-500' : 'text-blue-500'
                      }`} />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <Laptop className="w-4 h-4 text-gray-500" />
                          <p className="font-medium text-gray-900">{warning.deviceName}</p>
                          <Badge variant={
                            warning.severity === 'critical' ? 'danger' :
                            warning.severity === 'high' ? 'warning' : 'default'
                          }>
                            {warning.severity}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{warning.message}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <p className="text-xs text-gray-500">{warning.timestamp}</p>
                          {warning.value && (
                            <p className="text-xs text-gray-500">Current: {warning.value}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                        View Device
                      </Button>
                      <Button size="sm" variant="outline">
                        Dismiss
                      </Button>
                      {warning.canResolve && (
                        <Button size="sm" variant="outline">
                          Auto-Resolve
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Alert Thresholds */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Thresholds</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <HardDrive className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">Low Storage Alert</p>
                  <p className="text-sm text-gray-600">Alert when storage is below 10%</p>
                </div>
              </div>
              <input type="checkbox" className="w-5 h-5 text-orange-500" defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Cpu className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">High CPU Alert</p>
                  <p className="text-sm text-gray-600">Alert when CPU usage exceeds 80%</p>
                </div>
              </div>
              <input type="checkbox" className="w-5 h-5 text-orange-500" defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Battery className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">Low Battery Alert</p>
                  <p className="text-sm text-gray-600">Alert when battery is below 20%</p>
                </div>
              </div>
              <input type="checkbox" className="w-5 h-5 text-orange-500" defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <Thermometer className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">Temperature Alert</p>
                  <p className="text-sm text-gray-600">Alert when temperature exceeds safe limits</p>
                </div>
              </div>
              <input type="checkbox" className="w-5 h-5 text-orange-500" defaultChecked />
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <WifiOff className="w-5 h-5 text-orange-500" />
                <div>
                  <p className="font-medium text-gray-900">Network Disconnection</p>
                  <p className="text-sm text-gray-600">Alert when device goes offline</p>
                </div>
              </div>
              <input type="checkbox" className="w-5 h-5 text-orange-500" defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Trends */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Trends</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No trend data available</p>
            <p className="text-sm mt-2">Device performance trends will appear here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
