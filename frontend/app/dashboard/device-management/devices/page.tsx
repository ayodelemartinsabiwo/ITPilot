'use client'

import { useState } from 'react'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Server, Laptop, Smartphone, Monitor, HardDrive, Cpu, Activity } from 'lucide-react'

export default function ConnectedDevicesPage() {
  const [devices, setDevices] = useState<any[]>([])

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Connected Devices</h1>
          <p className="text-gray-600 mt-1">Monitor and manage all connected devices</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <span className="mr-2">+</span>
          Add Device
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Devices</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Server className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Online</p>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <Activity className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Offline</p>
                <p className="text-3xl font-bold text-red-600">0</p>
              </div>
              <Activity className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Needs Attention</p>
                <p className="text-3xl font-bold text-yellow-600">0</p>
              </div>
              <Activity className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Types */}
      <Card>
        <CardHeader>
          <CardTitle>Device Types</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
              <Laptop className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="font-semibold">Laptops</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
              <Monitor className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="font-semibold">Desktops</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
              <Smartphone className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="font-semibold">Mobile</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition">
              <Server className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="font-semibold">Servers</p>
              <p className="text-2xl font-bold text-gray-900">0</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Devices List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Devices</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Filter</Button>
              <Button variant="outline" size="sm">Export</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {devices.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Server className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No devices connected yet</p>
              <p className="text-sm mt-2">Start by adding your first device to monitor</p>
              <Button className="mt-4 bg-orange-500 hover:bg-orange-600">
                Add Your First Device
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Device list will be populated here */}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
