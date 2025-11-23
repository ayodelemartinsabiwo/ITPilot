'use client'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Shield, Lock, AlertTriangle, CheckCircle, Key, Eye, FileWarning } from 'lucide-react'

export default function SecurityStatusPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Security Status</h1>
          <p className="text-gray-600 mt-1">Monitor device security compliance and threats</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Shield className="w-4 h-4 mr-2" />
          Run Security Scan
        </Button>
      </div>

      {/* Security Score */}
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardContent className="p-8">
          <div className="text-center">
            <p className="text-lg opacity-90 mb-2">Overall Security Score</p>
            <div className="flex items-center justify-center gap-4">
              <Shield className="w-16 h-16 opacity-90" />
              <div>
                <div className="text-6xl font-bold">--</div>
                <p className="text-sm opacity-90">No data available</p>
              </div>
            </div>
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
                <p className="text-3xl font-bold text-gray-900">0</p>
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
                <p className="text-3xl font-bold text-gray-900">0</p>
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
                <p className="text-3xl font-bold text-gray-900">0</p>
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
                <p className="text-3xl font-bold text-gray-900">0</p>
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
              Firewall Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8 text-gray-500">
              <p>No firewall data available</p>
              <p className="text-sm mt-2">Monitor firewall status across devices</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-orange-500" />
              Encryption Status
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8 text-gray-500">
              <p>No encryption data available</p>
              <p className="text-sm mt-2">Track device encryption compliance</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="w-5 h-5 text-orange-500" />
              Authentication Methods
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8 text-gray-500">
              <p>No authentication data available</p>
              <p className="text-sm mt-2">Monitor authentication security</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="w-5 h-5 text-orange-500" />
              Access Control
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8 text-gray-500">
              <p>No access control data available</p>
              <p className="text-sm mt-2">Track device access permissions</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Events */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Security Events</CardTitle>
            <Badge className="bg-green-500">0 Active Threats</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-400" />
            <p className="text-lg font-medium">No security events</p>
            <p className="text-sm mt-2">All devices are secure</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
