'use client'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Zap, TrendingUp, HardDrive, Cpu, Settings, Sparkles, Target, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { devicesService } from '@/lib/api/services/devices.service'
import { useMemo } from 'react'

export default function OptimizationToolsPage() {
  const { data: devicesData, isLoading: devicesLoading } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const response = await devicesService.getDevices()
      return response.data
    },
  })

  const devices = devicesData?.data || []

  // Calculate optimization potential
  const optimizationStats = useMemo(() => {
    if (!devices.length) {
      return {
        overallPotential: 0,
        cpuOptimization: 0,
        storageCleanup: 0,
        performanceBoost: 0,
        devicesNeedingOptimization: 0,
      }
    }

    const avgHealth = devices.reduce((sum, d) => sum + d.health_score, 0) / devices.length
    const overallPotential = Math.round(100 - avgHealth)

    // Estimate optimization potential for different categories
    const cpuOptimization = Math.round(overallPotential * 0.3)
    const storageCleanup = Math.round((devices.length * 2.5) * (overallPotential / 100)) // GB
    const performanceBoost = Math.round(overallPotential * 0.4)
    const devicesNeedingOptimization = devices.filter(d => d.health_score < 80).length

    return {
      overallPotential,
      cpuOptimization,
      storageCleanup,
      performanceBoost,
      devicesNeedingOptimization,
    }
  }, [devices])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Optimization Tools</h1>
          <p className="text-gray-600 mt-1">Improve device performance and efficiency</p>
        </div>
        <Button variant="primary" disabled={devicesLoading || devices.length === 0}>
          <Zap className="w-4 h-4 mr-2" />
          Optimize All
        </Button>
      </div>

      {/* Optimization Score */}
      <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-lg opacity-90 mb-2">Optimization Potential</p>
            {devicesLoading ? (
              <Loader2 className="w-12 h-12 mx-auto animate-spin" />
            ) : (
              <div className="flex items-center justify-center gap-4">
                <Sparkles className="w-16 h-16 opacity-90" />
                <div>
                  <div className="text-6xl font-bold">
                    {devices.length > 0 ? `${optimizationStats.overallPotential}%` : '--'}
                  </div>
                  <p className="text-sm opacity-90">
                    {devices.length > 0
                      ? `${optimizationStats.devicesNeedingOptimization} device${optimizationStats.devicesNeedingOptimization !== 1 ? 's' : ''} can be optimized`
                      : 'No optimization data'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Optimization Categories */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Cpu className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">CPU Optimization</p>
                <p className="text-2xl font-bold text-gray-900">
                  {devices.length > 0 ? `${optimizationStats.cpuOptimization}%` : '0%'}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full" disabled={devices.length === 0}>
              Optimize CPU
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-purple-100 rounded-full">
                <HardDrive className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Storage Cleanup</p>
                <p className="text-2xl font-bold text-gray-900">
                  {devices.length > 0 ? `${optimizationStats.storageCleanup} GB` : '0 GB'}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full" disabled={devices.length === 0}>
              Clean Storage
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition cursor-pointer">
          <CardContent className="p-6">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-green-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Performance Boost</p>
                <p className="text-2xl font-bold text-gray-900">
                  {devices.length > 0 ? `${optimizationStats.performanceBoost}%` : '--'}
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full" disabled={devices.length === 0}>
              Boost Performance
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Optimization Actions</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border-2 border-gray-200 hover:border-orange-500 transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 rounded">
                  <HardDrive className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-semibold">Clear Temp Files</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Remove temporary and cache files</p>
              <Button variant="outline" size="sm" className="w-full">Run</Button>
            </div>

            <div className="p-4 rounded-lg border-2 border-gray-200 hover:border-orange-500 transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 rounded">
                  <Settings className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-semibold">Optimize Startup</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Manage startup programs</p>
              <Button variant="outline" size="sm" className="w-full">Run</Button>
            </div>

            <div className="p-4 rounded-lg border-2 border-gray-200 hover:border-orange-500 transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 rounded">
                  <Cpu className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-semibold">Defragment Disk</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Optimize disk performance</p>
              <Button variant="outline" size="sm" className="w-full">Run</Button>
            </div>

            <div className="p-4 rounded-lg border-2 border-gray-200 hover:border-orange-500 transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 rounded">
                  <Zap className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-semibold">Power Settings</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Optimize power consumption</p>
              <Button variant="outline" size="sm" className="w-full">Run</Button>
            </div>

            <div className="p-4 rounded-lg border-2 border-gray-200 hover:border-orange-500 transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 rounded">
                  <Target className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-semibold">Memory Optimizer</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Free up RAM resources</p>
              <Button variant="outline" size="sm" className="w-full">Run</Button>
            </div>

            <div className="p-4 rounded-lg border-2 border-gray-200 hover:border-orange-500 transition">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-orange-100 rounded">
                  <Sparkles className="w-5 h-5 text-orange-500" />
                </div>
                <h3 className="font-semibold">Full Optimization</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Run all optimizations</p>
              <Button variant="outline" size="sm" className="w-full">Run</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Devices Needing Optimization */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Devices Needing Optimization</CardTitle>
            <Badge className={optimizationStats.devicesNeedingOptimization > 0 ? 'bg-orange-500' : 'bg-green-500'}>
              {optimizationStats.devicesNeedingOptimization} Devices
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {devices.length > 0 && optimizationStats.devicesNeedingOptimization > 0 ? (
            <div className="space-y-3">
              {devices
                .filter(d => d.health_score < 80)
                .slice(0, 5)
                .map(device => {
                  const optimizationPotential = 100 - device.health_score
                  return (
                    <div
                      key={device.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                    >
                      <div className="flex items-center gap-4">
                        <Sparkles className="w-5 h-5 text-purple-500" />
                        <div>
                          <p className="font-medium text-gray-900">{device.device_name}</p>
                          <p className="text-sm text-gray-600">
                            {device.device_type} • {device.operating_system} • Health: {device.health_score}%
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          <p className="text-sm text-gray-600">Optimization Potential</p>
                          <p className="text-lg font-bold text-purple-600">{optimizationPotential}%</p>
                        </div>
                        <Button variant="outline" size="sm">
                          Optimize
                        </Button>
                      </div>
                    </div>
                  )
                })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <Sparkles className="w-16 h-16 mx-auto mb-4 text-green-400" />
              <p className="text-lg font-medium">
                {devices.length > 0 ? 'All devices optimized' : 'No devices to optimize'}
              </p>
              <p className="text-sm mt-2">
                {devices.length > 0
                  ? 'Your devices are running at peak performance'
                  : 'Connect devices to start optimization'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
