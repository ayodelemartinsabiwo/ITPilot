'use client'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CheckCircle, XCircle, AlertTriangle, FileCheck, Shield, Award, FileText, Loader2 } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { devicesService } from '@/lib/api/services/devices.service'
import { useMemo } from 'react'

export default function ComplianceCheckPage() {
  const { data: devicesData, isLoading: devicesLoading, refetch } = useQuery({
    queryKey: ['devices'],
    queryFn: async () => {
      const response = await devicesService.getDevices()
      return response.data
    },
  })

  const devices = devicesData || []

  // Calculate compliance statistics
  const complianceStats = useMemo(() => {
    if (!devices.length) {
      return {
        compliant: 0,
        nonCompliant: 0,
        warning: 0,
        notChecked: 0,
        complianceRate: 0,
        totalDevices: 0,
      }
    }

    const compliant = devices.filter(d => d.compliance_status === 'compliant').length
    const nonCompliant = devices.filter(d => d.compliance_status === 'non_compliant').length
    const warning = devices.filter(d => d.compliance_status === 'warning').length
    const notChecked = 0 // Assuming all devices are checked
    const complianceRate = Math.round((compliant / devices.length) * 100)

    return {
      compliant,
      nonCompliant,
      warning,
      notChecked,
      complianceRate,
      totalDevices: devices.length,
    }
  }, [devices])

  const handleRunAudit = () => {
    refetch()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compliance Check</h1>
          <p className="text-gray-600 mt-1">Ensure devices meet compliance standards</p>
        </div>
        <Button variant="primary" onClick={handleRunAudit} disabled={devicesLoading}>
          {devicesLoading ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <FileCheck className="w-4 h-4 mr-2" />
          )}
          Run Compliance Audit
        </Button>
      </div>

      {/* Compliance Score */}
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-lg opacity-90 mb-2">Overall Compliance Rate</p>
            {devicesLoading ? (
              <Loader2 className="w-12 h-12 mx-auto animate-spin" />
            ) : (
              <div className="flex items-center justify-center gap-4">
                <Award className="w-16 h-16 opacity-90" />
                <div>
                  <div className="text-6xl font-bold">
                    {complianceStats.totalDevices > 0 ? `${complianceStats.complianceRate}%` : '--'}
                  </div>
                  <p className="text-sm opacity-90">
                    {complianceStats.totalDevices > 0
                      ? `${complianceStats.compliant} of ${complianceStats.totalDevices} devices compliant`
                      : 'No compliance data'
                    }
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Compliance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-green-100 rounded-full">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Compliant</p>
                <p className="text-3xl font-bold text-gray-900">{complianceStats.compliant}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Non-Compliant</p>
                <p className="text-3xl font-bold text-gray-900">{complianceStats.nonCompliant}</p>
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
                <p className="text-3xl font-bold text-gray-900">{complianceStats.warning}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gray-100 rounded-full">
                <FileText className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Not Checked</p>
                <p className="text-3xl font-bold text-gray-900">{complianceStats.notChecked}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Compliance Standards */}
      <Card>
        <CardHeader>
          <CardTitle>Compliance Standards</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 rounded-lg border-2 border-gray-200 hover:border-orange-500 transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">GDPR</h3>
                <Badge variant="outline">--</Badge>
              </div>
              <p className="text-sm text-gray-600">General Data Protection Regulation compliance</p>
            </div>

            <div className="p-6 rounded-lg border-2 border-gray-200 hover:border-orange-500 transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">HIPAA</h3>
                <Badge variant="outline">--</Badge>
              </div>
              <p className="text-sm text-gray-600">Health Insurance Portability standards</p>
            </div>

            <div className="p-6 rounded-lg border-2 border-gray-200 hover:border-orange-500 transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">ISO 27001</h3>
                <Badge variant="outline">--</Badge>
              </div>
              <p className="text-sm text-gray-600">Information security management</p>
            </div>

            <div className="p-6 rounded-lg border-2 border-gray-200 hover:border-orange-500 transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">SOC 2</h3>
                <Badge variant="outline">--</Badge>
              </div>
              <p className="text-sm text-gray-600">Service Organization Control compliance</p>
            </div>

            <div className="p-6 rounded-lg border-2 border-gray-200 hover:border-orange-500 transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">PCI DSS</h3>
                <Badge variant="outline">--</Badge>
              </div>
              <p className="text-sm text-gray-600">Payment Card Industry standards</p>
            </div>

            <div className="p-6 rounded-lg border-2 border-gray-200 hover:border-orange-500 transition">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-lg">NIST</h3>
                <Badge variant="outline">--</Badge>
              </div>
              <p className="text-sm text-gray-600">National Institute standards</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compliance Issues */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Compliance Issues</CardTitle>
            <Badge className={complianceStats.nonCompliant > 0 ? 'bg-red-500' : 'bg-green-500'}>
              {complianceStats.nonCompliant + complianceStats.warning} Active Issues
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {devices.length > 0 && (complianceStats.nonCompliant > 0 || complianceStats.warning > 0) ? (
            <div className="space-y-3">
              {devices
                .filter(d => d.compliance_status !== 'compliant')
                .slice(0, 10)
                .map(device => (
                  <div
                    key={device.id}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center gap-4">
                      {device.compliance_status === 'non_compliant' ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-yellow-500" />
                      )}
                      <div>
                        <p className="font-medium text-gray-900">{device.device_name}</p>
                        <p className="text-sm text-gray-600">
                          {device.device_type} • {device.operating_system} • Last seen: {new Date(device.last_seen).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge
                        className={
                          device.compliance_status === 'non_compliant'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }
                      >
                        {device.compliance_status === 'non_compliant' ? 'Non-Compliant' : 'Warning'}
                      </Badge>
                      <Button variant="outline" size="sm">
                        Review
                      </Button>
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
              <p className="text-lg font-medium">
                {devices.length > 0 ? 'No compliance issues' : 'No devices to check'}
              </p>
              <p className="text-sm mt-2">
                {devices.length > 0 ? 'All devices meet compliance standards' : 'Connect devices to monitor compliance'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
