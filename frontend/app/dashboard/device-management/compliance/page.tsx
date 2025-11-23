'use client'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { CheckCircle, XCircle, AlertTriangle, FileCheck, Shield, Award, FileText } from 'lucide-react'

export default function ComplianceCheckPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Compliance Check</h1>
          <p className="text-gray-600 mt-1">Ensure devices meet compliance standards</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <FileCheck className="w-4 h-4 mr-2" />
          Run Compliance Audit
        </Button>
      </div>

      {/* Compliance Score */}
      <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-lg opacity-90 mb-2">Overall Compliance Rate</p>
            <div className="flex items-center justify-center gap-4">
              <Award className="w-16 h-16 opacity-90" />
              <div>
                <div className="text-6xl font-bold">--</div>
                <p className="text-sm opacity-90">No compliance data</p>
              </div>
            </div>
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
                <p className="text-3xl font-bold text-gray-900">0</p>
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
                <p className="text-3xl font-bold text-gray-900">0</p>
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
                <p className="text-3xl font-bold text-gray-900">0</p>
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
            <Badge className="bg-green-500">0 Active Issues</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
            <p className="text-lg font-medium">No compliance issues</p>
            <p className="text-sm mt-2">All devices meet compliance standards</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
