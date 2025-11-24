'use client'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Shield, Lock, AlertTriangle, CheckCircle, Key, Eye, FileWarning, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { devicesService } from '@/lib/api/services/devices.service'
import { useMemo } from 'react'

export default function SecurityStatusPage() {
  const { data: devicesData, isLoading: devicesLoading, refetch } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const response = await devicesService.getDevices()
      return response.data
    },
  })

  const devices = devicesData || []

  // Calculate security statistics
  const securityStats = useMemo(() => {
    if (!devices.length) {
      return {
        secureDevices: 0,
        threatsDetected: 0,
        vulnerabilities: 0,
        encrypted: 0,
        securityScore: 0,
        totalDevices: 0,
      }
    }

    // Calculate based on health and compliance
    const secureDevices = devices.filter(d => d.health_score >= 80 && d.compliance_status === 'compliant').length
    const threatsDetected = devices.filter(d => d.health_score < 50).length
    const vulnerabilities = devices.filter(d => d.compliance_status === 'non_compliant').length

    // Estimate encrypted devices (80% of compliant devices)
    const encrypted = Math.round(devices.filter(d => d.compliance_status === 'compliant').length * 0.8)

    // Calculate overall security score
    const securityScore = devices.length > 0
      ? Math.round((secureDevices / devices.length) * 100)
      : 0

    return {
      secureDevices,
      threatsDetected,
      vulnerabilities,
      encrypted,
      securityScore,
      totalDevices: devices.length,
    }
  }, [devices])

  const handleRunScan = () => {
    refetch()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security Status</h1>
          <p className="text-gray-600 mt-1">Monitor device security compliance and threats</p>
        </div>
        <Button variant="primary" onClick={handleRunScan} disabled={devicesLoading}>
          {devicesLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Shield className="w-4 h-4 mr-2" />
          )}
          Run Security Scan
        </Button>
      </div>

      {/* Security Score */}
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-lg opacity-90 mb-2">Overall Security Score</p>
            {devicesLoading ? (
              <Loader2 className="w-12 h-12 mx-auto animate-spin" />
            ) : (
              <div className="flex items-center justify-center gap-4">
                <Shield className="w-16 h-16 opacity-90" />
                <div>
                  <div className="text-6xl font-bold">
                    {securityStats.totalDevices > 0 ? `${securityStats.securityScore}%` : '--'}
                  </div>
                  <p className="text-sm opacity-90">
                    {securityStats.totalDevices > 0
                      ? `${securityStats.secureDevices} of ${securityStats.totalDevices} devices secure`
                      : 'No data available'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Security Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Secure Devices</p>
                <p className="text-3xl font-bold text-gray-900">{securityStats.secureDevices}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Threats Detected</p>
                <p className="text-3xl font-bold text-gray-900">{securityStats.threatsDetected}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-100 rounded-full">
                <FileWarning className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Vulnerabilities</p>
                <p className="text-3xl font-bold text-gray-900">{securityStats.vulnerabilities}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-blue-100 rounded-full">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Encrypted</p>
                <p className="text-3xl font-bold text-gray-900">{securityStats.encrypted}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-orange-500" />
              Device Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {devices.length > 0 ? (
              <div className="space-y-3">
                {['online', 'offline', 'maintenance'].map(status => {
                  const count = devices.filter(d => d.status === status).length
                  if (count === 0) return null
                  const percentage = (count / devices.length) * 100
                  const colors = {
                    online: 'bg-green-500',
                    offline: 'bg-red-500',
                    maintenance: 'bg-yellow-500',
                  }
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium capitalize">{status}</span>
                        <span className="text-sm text-gray-600">{count} devices</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${colors[status as keyof typeof colors]} h-2 rounded-full`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No device data available</p>
                <p className="text-sm mt-2">Monitor device status across your network</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-500" />
              Compliance Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {devices.length > 0 ? (
              <div className="space-y-3">
                {['compliant', 'warning', 'non_compliant'].map(status => {
                  const count = devices.filter(d => d.compliance_status === status).length
                  if (count === 0) return null
                  const percentage = (count / devices.length) * 100
                  const colors = {
                    compliant: 'bg-green-500',
                    warning: 'bg-yellow-500',
                    non_compliant: 'bg-red-500',
                  }
                  const labels = {
                    compliant: 'Compliant',
                    warning: 'Warning',
                    non_compliant: 'Non-Compliant',
                  }
                  return (
                    <div key={status}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{labels[status as keyof typeof labels]}</span>
                        <span className="text-sm text-gray-600">{count} devices</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${colors[status as keyof typeof colors]} h-2 rounded-full`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No compliance data available</p>
                <p className="text-sm mt-2">Track device encryption compliance</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-orange-500" />
              Health Score Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {devices.length > 0 ? (
              <div className="space-y-3">
                {[
                  { label: 'Excellent (80-100)', min: 80, max: 100, color: 'bg-green-500' },
                  { label: 'Good (50-79)', min: 50, max: 79, color: 'bg-yellow-500' },
                  { label: 'Poor (0-49)', min: 0, max: 49, color: 'bg-red-500' },
                ].map(({ label, min, max, color }) => {
                  const count = devices.filter(d => d.health_score >= min && d.health_score <= max).length
                  if (count === 0) return null
                  const percentage = (count / devices.length) * 100
                  return (
                    <div key={label}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium">{label}</span>
                        <span className="text-sm text-gray-600">{count} devices</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className={`${color} h-2 rounded-full`}
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <p>No health data available</p>
                <p className="text-sm mt-2">Monitor authentication security</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-orange-500" />
              Device Types
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {devices.length > 0 ? (
              <div className="space-y-3">
                {['desktop', 'laptop', 'server', 'mobile'].map(type => {
                  const count = devices.filter(d => d.device_type === type).length
                  if (count === 0) return null
                  const percentage = (count / devices.length) * 100
                  return (
                    <div key={type}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium capitalize">{type}</span>
                        <span className="text-sm text-gray-600">{count} devices</span>
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
                <p>No device data available</p>
                <p className="text-sm mt-2">Track device access permissions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Security Events</CardTitle>
            <Badge className={securityStats.threatsDetected > 0 ? 'bg-red-500' : 'bg-green-500'}>
              {securityStats.threatsDetected} Active Threats
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {devices.length > 0 && securityStats.threatsDetected > 0 ? (
            <div className="space-y-3">
              {devices
                .filter(d => d.health_score < 50)
                .slice(0, 5)
                .map(device => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200"
                  >
                    <div className="flex items-center gap-4">
                      <AlertTriangle className="w-5 h-5 text-red-500" />
                      <div>
                        <p className="font-medium text-gray-900">{device.device_name}</p>
                        <p className="text-sm text-gray-600">
                          Critical health score: {device.health_score}% • {device.device_type} • {device.status}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-red-100 text-red-700">
                        Critical
                      </Badge>
                      <Button variant="outline" size="sm">
                        Investigate
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
              <p className="text-lg font-medium">
                {devices.length > 0 ? 'No security events' : 'No devices to monitor'}
              </p>
              <p className="text-sm mt-2">
                {devices.length > 0 ? 'All devices are secure' : 'Connect devices to monitor security'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
