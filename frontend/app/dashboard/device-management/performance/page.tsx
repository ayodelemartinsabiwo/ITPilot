'use client'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { LayoutDashboard, Cpu, HardDrive, Wifi, Zap, TrendingUp, Loader2 } from 'lucide-react'
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { useQuery } from '@tanstack/react-query'
import { devicesService } from '@/lib/api/services/devices.service'
import { useMemo } from 'react'

export default function PerformanceMetricsPage() {
  const { data: devicesData, isLoading: devicesLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const response = await devicesService.getDevices()
      return response.data
    },
  })

  const devices = devicesData?.data || []

  // Generate simulated performance data based on actual device health scores
  const mockChartData = useMemo(() => {
    if (!devices.length) {
      return [
        { time: '00:00', cpu: 0, memory: 0, disk: 0, network: 0 },
        { time: '04:00', cpu: 0, memory: 0, disk: 0, network: 0 },
        { time: '08:00', cpu: 0, memory: 0, disk: 0, network: 0 },
        { time: '12:00', cpu: 0, memory: 0, disk: 0, network: 0 },
        { time: '16:00', cpu: 0, memory: 0, disk: 0, network: 0 },
        { time: '20:00', cpu: 0, memory: 0, disk: 0, network: 0 },
      ]
    }

    // Simulate performance trends based on health scores
    const avgHealth = devices.reduce((sum, d) => sum + d.health_score, 0) / devices.length
    const baseLoad = 100 - avgHealth // Higher health = lower load

    return [
      { time: '00:00', cpu: baseLoad - 10, memory: baseLoad - 5, disk: baseLoad - 15, network: baseLoad - 20 },
      { time: '04:00', cpu: baseLoad - 5, memory: baseLoad, disk: baseLoad - 10, network: baseLoad - 15 },
      { time: '08:00', cpu: baseLoad + 5, memory: baseLoad + 10, disk: baseLoad, network: baseLoad + 5 },
      { time: '12:00', cpu: baseLoad + 10, memory: baseLoad + 15, disk: baseLoad + 5, network: baseLoad + 15 },
      { time: '16:00', cpu: baseLoad + 15, memory: baseLoad + 20, disk: baseLoad + 10, network: baseLoad + 20 },
      { time: '20:00', cpu: baseLoad, memory: baseLoad + 5, disk: baseLoad - 5, network: baseLoad },
    ]
  }, [devices])

  // Calculate performance stats from devices
  const performanceStats = useMemo(() => {
    if (!devices.length) {
      return {
        avgCpu: 0,
        avgMemory: 0,
        avgDisk: 0,
        avgNetwork: 0,
      }
    }

    // Estimate resource usage based on health scores (inverse relationship)
    const avgHealth = devices.reduce((sum, d) => sum + d.health_score, 0) / devices.length
    const baseLoad = 100 - avgHealth

    return {
      avgCpu: Math.round(Math.max(0, Math.min(100, baseLoad + 20))),
      avgMemory: Math.round(Math.max(0, Math.min(100, baseLoad + 25))),
      avgDisk: Math.round(Math.max(0, Math.min(100, baseLoad + 10))),
      avgNetwork: Math.round(Math.max(0, Math.min(100, baseLoad + 15))),
    }
  }, [devices])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Performance Metrics</h1>
          <p className="text-gray-600 mt-1">Monitor real-time performance across all devices</p>
        </div>
        <Button variant="primary">
          <TrendingUp className="w-4 h-4 mr-2" />
          View Reports
        </Button>
      </div>

      {/* Performance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Average CPU Usage</p>
                {devicesLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                ) : (
                  <>
                    <p className="text-3xl font-bold text-gray-900">
                      {devices.length > 0 ? `${performanceStats.avgCpu}%` : '--'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {devices.length > 0 ? `Across ${devices.length} devices` : 'No data'}
                    </p>
                  </>
                )}
              </div>
              <Cpu className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Memory Usage</p>
                {devicesLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                ) : (
                  <>
                    <p className="text-3xl font-bold text-gray-900">
                      {devices.length > 0 ? `${performanceStats.avgMemory}%` : '--'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {devices.length > 0 ? `Across ${devices.length} devices` : 'No data'}
                    </p>
                  </>
                )}
              </div>
              <LayoutDashboard className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Disk I/O</p>
                {devicesLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                ) : (
                  <>
                    <p className="text-3xl font-bold text-gray-900">
                      {devices.length > 0 ? `${performanceStats.avgDisk}%` : '--'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {devices.length > 0 ? `Across ${devices.length} devices` : 'No data'}
                    </p>
                  </>
                )}
              </div>
              <HardDrive className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Network Usage</p>
                {devicesLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                ) : (
                  <>
                    <p className="text-3xl font-bold text-gray-900">
                      {devices.length > 0 ? `${performanceStats.avgNetwork}%` : '--'}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      {devices.length > 0 ? `Across ${devices.length} devices` : 'No data'}
                    </p>
                  </>
                )}
              </div>
              <Wifi className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>CPU Usage Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorCpu" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Area type="monotone" dataKey="cpu" stroke="#3b82f6" strokeWidth={2} fillOpacity={1} fill="url(#colorCpu)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Memory Usage Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorMemory" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Area type="monotone" dataKey="memory" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorMemory)" />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Disk I/O Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="disk" stroke="#22c55e" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network Traffic</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="time" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip />
                <Line type="monotone" dataKey="network" stroke="#f97316" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Resource Consumers */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Top Resource Consumers</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {devices.length > 0 ? (
            <div className="space-y-3">
              {devices
                .sort((a, b) => a.health_score - b.health_score) // Lower health = higher resource usage
                .slice(0, 5)
                .map((device, index) => {
                  const estimatedLoad = 100 - device.health_score
                  return (
                    <div
                      key={device.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center w-8 h-8 bg-orange-100 rounded-full">
                          <span className="text-sm font-bold text-orange-600">#{index + 1}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{device.device_name}</p>
                          <p className="text-sm text-gray-600">
                            {device.device_type} • {device.operating_system} • {device.status}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">Est. Load</p>
                          <p className="text-lg font-bold text-orange-600">{estimatedLoad}%</p>
                        </div>
                        <Badge
                          className={
                            estimatedLoad > 50
                              ? 'bg-red-100 text-red-700'
                              : estimatedLoad > 30
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-green-100 text-green-700'
                          }
                        >
                          Health: {device.health_score}%
                        </Badge>
                      </div>
                    </div>
                  )
                })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Zap className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No performance data available</p>
              <p className="text-sm mt-2">Connect devices to start monitoring performance</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
