'use client'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Key, Users, TrendingUp, AlertTriangle, DollarSign, CheckCircle, XCircle } from 'lucide-react'

export default function LicensesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">License Usage Monitoring</h1>
          <p className="text-gray-600 mt-1">Track and optimize your cloud service licenses</p>
        </div>
        <Button variant="primary">
          <Key className="w-4 h-4 mr-2" />
          Add License
        </Button>
      </div>

      {/* License Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Licenses</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Key className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Assigned</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <CheckCircle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Cost</p>
                <p className="text-3xl font-bold text-gray-900">$0</p>
              </div>
              <DollarSign className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* License Utilization */}
      <Card>
        <CardHeader>
          <CardTitle>License Utilization</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-5 h-5 text-blue-500" />
                <span className="font-medium">Overall Utilization</span>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900">0%</p>
                <p className="text-xs text-gray-500">No licenses tracked</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* License by Service */}
      <Card>
        <CardHeader>
          <CardTitle>Licenses by Service</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-semibold">Microsoft 365</p>
                <p className="text-sm text-gray-600">E3, E5 licenses</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">0 / 0</p>
                <p className="text-xs text-gray-500">Used / Total</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-semibold">Google Workspace</p>
                <p className="text-sm text-gray-600">Business licenses</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">0 / 0</p>
                <p className="text-xs text-gray-500">Used / Total</p>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div>
                <p className="font-semibold">Zoho</p>
                <p className="text-sm text-gray-600">Professional licenses</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900">0 / 0</p>
                <p className="text-xs text-gray-500">Used / Total</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Cost Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-orange-500" />
              Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8 text-gray-500">
              <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p>No cost data available</p>
              <p className="text-sm mt-2">Add licenses to track spending</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-500" />
              License Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="text-center py-8 text-gray-500">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-400" />
              <p>No alerts</p>
              <p className="text-sm mt-2">All licenses are properly managed</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Optimization Recommendations */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Optimization Recommendations</CardTitle>
            <Badge className="bg-orange-500">0 Suggestions</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <TrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No recommendations yet</p>
            <p className="text-sm mt-2">We'll analyze your license usage and suggest optimizations</p>
            <Button variant="primary" className="mt-4">
              <Key className="w-4 h-4 mr-2" />
              Add Your First License
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
