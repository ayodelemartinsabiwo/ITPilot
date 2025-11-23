'use client'

import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Mail, Calendar, Users, Cloud, HardDrive, Video, Settings, CheckCircle } from 'lucide-react'

export default function GoogleWorkspacePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Google Workspace Integration</h1>
          <p className="text-gray-600 mt-1">Manage your Google Workspace services and connections</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Settings className="w-4 h-4 mr-2" />
          Configure Integration
        </Button>
      </div>

      {/* Connection Status */}
      <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-lg opacity-90 mb-2">Connection Status</p>
              <div className="flex items-center gap-2">
                <div className="text-3xl font-bold">Not Connected</div>
              </div>
              <p className="text-sm opacity-75 mt-2">Configure your Google Workspace integration to get started</p>
            </div>
            <Cloud className="w-20 h-20 opacity-20" />
          </div>
        </CardContent>
      </Card>

      {/* Service Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Gmail Users</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Mail className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Calendar Users</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Calendar className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Drive Storage</p>
                <p className="text-3xl font-bold text-gray-900">0 GB</p>
              </div>
              <HardDrive className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Licenses</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Google Workspace Services */}
      <Card>
        <CardHeader>
          <CardTitle>Google Workspace Services</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-gray-200 hover:border-orange-300 transition">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-8 h-8 text-red-500" />
                <h3 className="font-semibold">Gmail</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Business email services</p>
              <Badge className="bg-gray-200 text-gray-700">Not Connected</Badge>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 hover:border-orange-300 transition">
              <div className="flex items-center gap-3 mb-3">
                <HardDrive className="w-8 h-8 text-blue-500" />
                <h3 className="font-semibold">Google Drive</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Cloud storage and file sharing</p>
              <Badge className="bg-gray-200 text-gray-700">Not Connected</Badge>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 hover:border-orange-300 transition">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-8 h-8 text-yellow-500" />
                <h3 className="font-semibold">Google Calendar</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Scheduling and calendar</p>
              <Badge className="bg-gray-200 text-gray-700">Not Connected</Badge>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 hover:border-orange-300 transition">
              <div className="flex items-center gap-3 mb-3">
                <Video className="w-8 h-8 text-green-500" />
                <h3 className="font-semibold">Google Meet</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Video conferencing</p>
              <Badge className="bg-gray-200 text-gray-700">Not Connected</Badge>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 hover:border-orange-300 transition">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-8 h-8 text-purple-500" />
                <h3 className="font-semibold">Google Chat</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Team messaging and collaboration</p>
              <Badge className="bg-gray-200 text-gray-700">Not Connected</Badge>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 hover:border-orange-300 transition">
              <div className="flex items-center gap-3 mb-3">
                <Settings className="w-8 h-8 text-gray-500" />
                <h3 className="font-semibold">Admin Console</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">User and organization management</p>
              <Badge className="bg-gray-200 text-gray-700">Not Connected</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Sync Activity</CardTitle>
            <Badge className="bg-green-500">0 Events</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <Cloud className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No activity yet</p>
            <p className="text-sm mt-2">Connect your Google Workspace account to start syncing data</p>
            <Button className="mt-4 bg-orange-500 hover:bg-orange-600">
              <Settings className="w-4 h-4 mr-2" />
              Configure Integration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
