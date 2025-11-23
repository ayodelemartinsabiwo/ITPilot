'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Activity,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  RefreshCw,
  FileSearch,
} from 'lucide-react';

export default function AntivirusPage() {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Fetch data from API
    setLoading(false);
  }, []);

  const getProtectionColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'protected':
        return 'bg-green-500';
      case 'at risk':
        return 'bg-red-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'updating':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Antivirus Protection</h1>
          <p className="text-gray-600 mt-1">Monitor antivirus status across all devices</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Search className="w-4 h-4 mr-2" />
          Run Full Scan
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Protected Devices</p>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <ShieldCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Threats Detected</p>
                <p className="text-3xl font-bold text-red-600">0</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <ShieldAlert className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Quarantined Items</p>
                <p className="text-3xl font-bold text-yellow-600">0</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Last Scan</p>
                <p className="text-lg font-bold text-blue-600">Never</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Device Protection Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Device Protection Status</h2>
            <Button size="sm" variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh Status
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {devices.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No devices registered</p>
              <p className="text-sm mb-4">Add devices to monitor their antivirus protection status</p>
              <Button className="bg-orange-500 hover:bg-orange-600">
                Add Device
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {devices.map((device, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <ShieldCheck className="w-5 h-5 text-green-500" />
                    <div>
                      <h3 className="font-semibold">{device.name}</h3>
                      <p className="text-sm text-gray-600">
                        {device.antivirusName} - Version {device.version}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Last updated: {device.lastUpdate}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={getProtectionColor(device.status)}>
                      {device.status}
                    </Badge>
                    <Button size="sm" variant="outline">
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Scans */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Scans</h2>
            <Button size="sm" variant="outline">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <FileSearch className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No scan history</p>
            <p className="text-sm mb-4">Run your first antivirus scan to see results here</p>
            <Button className="bg-orange-500 hover:bg-orange-600">
              <Search className="w-4 h-4 mr-2" />
              Start Scan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Threat Detection Summary */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Threat Detection Summary</h2>
            <Badge className="bg-green-500">0 Threats</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <p className="text-2xl font-bold text-red-600">0</p>
              <p className="text-sm text-gray-600 mt-1">Viruses Found</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold text-yellow-600">0</p>
              <p className="text-sm text-gray-600 mt-1">Malware Detected</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <Activity className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-600 mt-1">Suspicious Files</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quarantine */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Quarantined Items</h2>
            <Badge className="bg-yellow-500">0 Items</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <p className="text-lg font-medium text-gray-900">No quarantined items</p>
            <p className="text-sm">Detected threats will be isolated here</p>
          </div>
        </CardContent>
      </Card>

      {/* Real-time Protection */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Real-time Protection Settings</h2>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Real-time Protection</p>
                  <p className="text-sm text-gray-600">Continuously monitors for threats</p>
                </div>
              </div>
              <Badge className="bg-green-500">Enabled</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Automatic Updates</p>
                  <p className="text-sm text-gray-600">Virus definitions auto-update daily</p>
                </div>
              </div>
              <Badge className="bg-green-500">Enabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
