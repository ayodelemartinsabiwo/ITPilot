'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Wifi,
  WifiOff,
  Signal,
  Activity,
  TrendingUp,
  TrendingDown,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';

export default function WiFiAnalysisPage() {
  const [loading, setLoading] = useState(true);
  const [networks, setNetworks] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Fetch data from API
    setLoading(false);
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">WiFi Network Analysis</h1>
          <p className="text-gray-600 mt-1">Monitor wireless network performance and connected devices</p>
        </div>
        <Button variant="primary">
          <RefreshCw className="w-4 h-4 mr-2" />
          Scan Networks
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Networks</p>
                <p className="text-3xl font-bold text-blue-600">0</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Wifi className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Signal Strength</p>
                <p className="text-3xl font-bold text-green-600">N/A</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Signal className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Speed</p>
                <p className="text-3xl font-bold text-orange-600">0 Mbps</p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <Activity className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Connected Devices</p>
                <p className="text-3xl font-bold text-purple-600">0</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Network Performance Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Network Performance</h2>
            <Badge className="bg-blue-500">Real-time</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No performance data available</p>
            <p className="text-sm">Start monitoring to see network performance metrics</p>
          </div>
        </CardContent>
      </Card>

      {/* Detected Networks */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Detected Networks</h2>
            <Button size="sm" variant="outline">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {networks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <WifiOff className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No networks detected</p>
              <p className="text-sm mb-4">Click "Scan Networks" to discover available WiFi networks</p>
              <Button variant="primary">
                <RefreshCw className="w-4 h-4 mr-2" />
                Scan Now
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {networks.map((network, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <Wifi className="w-5 h-5 text-blue-500" />
                    <div>
                      <h3 className="font-semibold">{network.name}</h3>
                      <p className="text-sm text-gray-600">{network.bssid}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className="bg-green-500">{network.signal}%</Badge>
                    <span className="text-sm text-gray-600">{network.channel}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Network Issues */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Network Issues</h2>
            <Badge className="bg-green-500">0 Issues</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No issues detected</p>
            <p className="text-sm">Your WiFi network is performing optimally</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
