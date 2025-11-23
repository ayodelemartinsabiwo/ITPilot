'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

export default function NetworkSecurityPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    // TODO: Fetch data from API
    setLoading(false);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Network & Security</h1>
          <p className="text-gray-600 mt-1">Monitor network performance and security threats</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <span className="mr-2">🔍</span>
          Run Security Scan
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Network Health</p>
                <p className="text-3xl font-bold text-blue-600">Good</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <span className="text-2xl">📡</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Threats</p>
                <p className="text-3xl font-bold text-red-600">0</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <span className="text-2xl">⚠️</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Patches</p>
                <p className="text-3xl font-bold text-yellow-600">0</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">📦</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Protected Devices</p>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">🛡️</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Access */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="hover:shadow-lg transition cursor-pointer">
          <CardContent className="p-6 text-center">
            <span className="text-3xl block mb-2">📶</span>
            <h3 className="font-semibold">Wi-Fi Analysis</h3>
            <p className="text-sm text-gray-600 mt-1">Network performance</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition cursor-pointer">
          <CardContent className="p-6 text-center">
            <span className="text-3xl block mb-2">🚨</span>
            <h3 className="font-semibold">Threat Alerts</h3>
            <p className="text-sm text-gray-600 mt-1">Security warnings</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition cursor-pointer">
          <CardContent className="p-6 text-center">
            <span className="text-3xl block mb-2">🔄</span>
            <h3 className="font-semibold">Patch Status</h3>
            <p className="text-sm text-gray-600 mt-1">System updates</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition cursor-pointer">
          <CardContent className="p-6 text-center">
            <span className="text-3xl block mb-2">🛡️</span>
            <h3 className="font-semibold">Antivirus</h3>
            <p className="text-sm text-gray-600 mt-1">Protection status</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition cursor-pointer">
          <CardContent className="p-6 text-center">
            <span className="text-3xl block mb-2">🔐</span>
            <h3 className="font-semibold">Passwords</h3>
            <p className="text-sm text-gray-600 mt-1">Security audit</p>
          </CardContent>
        </Card>
      </div>

      {/* WiFi Analysis */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Wi-Fi Network Analysis</h2>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <span className="text-4xl block mb-4">📶</span>
            <p>No WiFi analysis data available</p>
            <p className="text-sm">Connect devices to start monitoring network performance</p>
          </div>
        </CardContent>
      </Card>

      {/* Security Threats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Active Security Threats</h2>
            <Badge className="bg-green-500">0 Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <span className="text-4xl block mb-4">✅</span>
            <p>No active threats detected</p>
            <p className="text-sm">Your network is secure</p>
          </div>
        </CardContent>
      </Card>

      {/* Pending Updates */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Pending System Updates</h2>
            <Button size="sm" variant="outline">View All</Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <span className="text-4xl block mb-4">✅</span>
            <p>All systems are up to date</p>
            <p className="text-sm">No pending updates or patches</p>
          </div>
        </CardContent>
      </Card>

      {/* Antivirus Status */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Antivirus Protection Status</h2>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <span className="text-4xl block mb-4">🛡️</span>
            <p>No devices registered</p>
            <p className="text-sm">Add devices to monitor antivirus status</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
