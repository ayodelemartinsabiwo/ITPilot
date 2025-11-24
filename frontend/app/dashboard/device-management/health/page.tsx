'use client'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Activity, Cpu, HardDrive, Thermometer, Zap, CheckCircle, AlertTriangle, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { devicesService, Device, DeviceHealth } from '@/lib/api/services/devices.service'
import { useMemo } from 'react'

export default function DeviceHealthPage() {
  const { data: devicesData, isLoading: devicesLoading, refetch } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const response = await devicesService.getDevices()
      return response.data
    },
  })

  const devices = devicesData || []

  // Calculate health statistics
  const healthStats = useMemo(() => {
    if (!devices.length) {
      return {
        healthy: 0,
        warning: 0,
        critical: 0,
        avgHealthScore: 0,
        totalDevices: 0,
      }
    }

    const healthy = devices.filter(d => d.health_score >= 80).length
    const warning = devices.filter(d => d.health_score >= 50 && d.health_score < 80).length
    const critical = devices.filter(d => d.health_score < 50).length
    const avgHealthScore = Math.round(
      devices.reduce((sum, d) => sum + d.health_score, 0) / devices.length
    )

    return {
      healthy,
      warning,
      critical,
      avgHealthScore,
      totalDevices: devices.length,
    }
  }, [devices])

  const handleRunHealthCheck = () => {
    refetch()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Device Health</h1>
          <p className="text-gray-600 mt-1">Monitor the health status of all devices</p>
        </div>
        <Button variant="primary" onClick={handleRunHealthCheck} disabled={devicesLoading}>
          {devicesLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Activity className="w-4 h-4 mr-2" />
          )}
          Run Health Check
        </Button>
      </div>

      {/* Overall Health Score */}
      <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-lg opacity-90 mb-2">Overall Health Score</p>
            {devicesLoading ? (
              <Loader2 className="w-12 h-12 mx-auto animate-spin" />
            ) : (
              <div className="flex items-center justify-center gap-4">
                <div className="text-6xl font-bold">
                  {healthStats.totalDevices > 0 ? healthStats.avgHealthScore : '--'}
                </div>
                <div className="text-left">
                  <p className="text-sm opacity-90">
                    {healthStats.totalDevices > 0
                      ? `Based on ${healthStats.totalDevices} device${healthStats.totalDevices > 1 ? 's' : ''}`
                      : 'No data available'
                    }
                  </p>
                  <p className="text-xs opacity-75">
                    {healthStats.totalDevices > 0
                      ? 'Last updated: Just now'
                      : 'Run a health check to get started'
                    }
                  </p>
                </div>
              </div>
            )}
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
                <p className="text-3xl font-bold text-gray-900">{healthStats.healthy}</p>
                <p className="text-xs text-gray-500">
                  {healthStats.totalDevices > 0
                    ? `${Math.round((healthStats.healthy / healthStats.totalDevices) * 100)}% of total`
                    : '0% of total'
                  }
                </p>
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
                <p className="text-3xl font-bold text-gray-900">{healthStats.warning}</p>
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
                <p className="text-3xl font-bold text-gray-900">{healthStats.critical}</p>
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
              Device Types
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {devices.length > 0 ? (
              <div className="space-y-3">
                {['desktop', 'laptop', 'server', 'mobile'].map(type => {
                  const count = devices.filter(d => d.device_type === type).length
                  const percentage = (count / devices.length) * 100
                  return count > 0 ? (
                    <div key={type}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium capitalize">{type}</span>
                        <span className="text-sm text-gray-600">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-orange-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  ) : null
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No device data available</p>
                <p className="text-sm mt-2">Connect devices to monitor their types</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-orange-500" />
              Device Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {devices.length > 0 ? (
              <div className="space-y-3">
                {['online', 'offline', 'maintenance'].map(status => {
                  const count = devices.filter(d => d.status === status).length
                  const percentage = (count / devices.length) * 100
                  const colors = {
                    online: 'bg-green-500',
                    offline: 'bg-gray-500',
                    maintenance: 'bg-yellow-500',
                  }
                  return count > 0 ? (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium capitalize">{status}</span>
                        <span className="text-sm text-gray-600">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${colors[status as keyof typeof colors]} h-2 rounded-full`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  ) : null
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No status data available</p>
                <p className="text-sm mt-2">Connect devices to monitor their status</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Thermometer className="w-5 h-5 text-orange-500" />
              Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {devices.length > 0 ? (
              <div className="space-y-3">
                {['compliant', 'non_compliant', 'warning'].map(status => {
                  const count = devices.filter(d => d.compliance_status === status).length
                  const percentage = (count / devices.length) * 100
                  const colors = {
                    compliant: 'bg-green-500',
                    non_compliant: 'bg-red-500',
                    warning: 'bg-yellow-500',
                  }
                  const labels = {
                    compliant: 'Compliant',
                    non_compliant: 'Non-Compliant',
                    warning: 'Warning',
                  }
                  return count > 0 ? (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{labels[status as keyof typeof labels]}</span>
                        <span className="text-sm text-gray-600">{count}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${colors[status as keyof typeof colors]} h-2 rounded-full`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  ) : null
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No compliance data available</p>
                <p className="text-sm mt-2">Monitor device compliance in real-time</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-orange-500" />
              Operating Systems
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {devices.length > 0 ? (
              <div className="space-y-3">
                {Array.from(new Set(devices.map(d => d.operating_system)))
                  .slice(0, 5)
                  .map(os => {
                    const count = devices.filter(d => d.operating_system === os).length
                    const percentage = (count / devices.length) * 100
                    return (
                      <div key={os}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{os}</span>
                          <span className="text-sm text-gray-600">{count}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-orange-500 h-2 rounded-full"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    )
                  })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No OS data available</p>
                <p className="text-sm mt-2">Track operating systems across devices</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Health Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Health Alerts</CardTitle>
            <Badge className={healthStats.critical > 0 ? 'bg-red-500' : 'bg-green-500'}>
              {healthStats.critical + healthStats.warning} Active
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {devices.length > 0 && (healthStats.critical > 0 || healthStats.warning > 0) ? (
            <div className="space-y-3">
              {devices
                .filter(d => d.health_score < 80)
                .slice(0, 5)
                .map(device => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-3">
                      {device.health_score < 50 ? (
                        <Activity className="w-5 h-5 text-red-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{device.device_name}</p>
                        <p className="text-sm text-gray-600">
                          Health Score: {device.health_score}% • {device.status}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={
                        device.health_score < 50
                          ? 'bg-red-100 text-red-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }
                    >
                      {device.health_score < 50 ? 'Critical' : 'Warning'}
                    </Badge>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
              <p className="text-lg font-medium">
                {devices.length > 0 ? 'All systems healthy' : 'No devices connected'}
              </p>
              <p className="text-sm mt-2">
                {devices.length > 0 ? 'No health alerts detected' : 'Connect devices to monitor health'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
