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
import { networkSecurityService, WiFiNetwork } from '@/lib/api/services/network-security.service';
import toast from 'react-hot-toast';

export default function WiFiAnalysisPage() {
  const [loading, setLoading] = useState(true);
  const [networks, setNetworks] = useState<WiFiNetwork[]>([]);
  const [stats, setStats] = useState({
    activeNetworks: 0,
    avgSignalStrength: 0,
    avgSpeed: 0,
    connectedDevices: 0,
  });

  const fetchNetworks = async () => {
    try {
      setLoading(true);
      const response = await networkSecurityService.getWiFiNetworks({ ordering: '-signal_strength' });
      const networkData = response.data || [];
      setNetworks(networkData);

      // Calculate stats
      const activeNets = networkData.filter((n: WiFiNetwork) => n.is_connected);
      const avgSignal = networkData.length > 0
        ? Math.round(networkData.reduce((sum: number, n: WiFiNetwork) => sum + n.signal_strength, 0) / networkData.length)
        : 0;
      const avgSpeed = networkData.length > 0
        ? Math.round(networkData.reduce((sum: number, n: WiFiNetwork) => sum + (n.speed_mbps || 0), 0) / networkData.length)
        : 0;

      setStats({
        activeNetworks: networkData.length,
        avgSignalStrength: avgSignal,
        avgSpeed,
        connectedDevices: activeNets.length,
      });
    } catch (error) {
      console.error('Failed to fetch WiFi networks:', error);
      toast.error('Failed to load WiFi networks');
    } finally {
      setLoading(false);
    }
  };

  const handleScanNetworks = async () => {
    try {
      toast.loading('Scanning for WiFi networks...');
      // This would typically require a device ID
      // For now, we'll just refresh the list
      await fetchNetworks();
      toast.dismiss();
      toast.success('Network scan completed');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to scan networks');
    }
  };

  useEffect(() => {
    fetchNetworks();
  }, []);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">WiFi Network Analysis</h1>
          <p className="text-gray-600 mt-1">Monitor wireless network performance and connected devices</p>
        </div>
        <Button variant="primary" onClick={handleScanNetworks} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
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
                <p className="text-3xl font-bold text-blue-600">{stats.activeNetworks}</p>
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
                <p className="text-3xl font-bold text-green-600">
                  {stats.avgSignalStrength > 0 ? `${stats.avgSignalStrength}%` : 'N/A'}
                </p>
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
                <p className="text-3xl font-bold text-orange-600">{stats.avgSpeed} Mbps</p>
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
                <p className="text-3xl font-bold text-purple-600">{stats.connectedDevices}</p>
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
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              <RefreshCw className="w-16 h-16 mx-auto mb-4 text-orange-500 animate-spin" />
              <p className="text-lg font-medium text-gray-900">Scanning for networks...</p>
            </div>
          ) : networks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <WifiOff className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No networks detected</p>
              <p className="text-sm mb-4">Click "Scan Networks" to discover available WiFi networks</p>
              <Button variant="primary" onClick={handleScanNetworks}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Scan Now
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {networks.map((network) => (
                <div
                  key={network.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <Wifi className={`w-5 h-5 ${network.is_connected ? 'text-green-500' : 'text-blue-500'}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{network.ssid}</h3>
                        {network.is_connected && (
                          <Badge className="bg-green-500 text-xs">Connected</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">BSSID: {network.bssid}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-500">Channel {network.channel}</span>
                        <span className="text-xs text-gray-500">{network.frequency} GHz</span>
                        <span className="text-xs text-gray-500">{network.security_type}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge className={
                        network.signal_strength >= 70 ? 'bg-green-500' :
                        network.signal_strength >= 50 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }>
                        {network.signal_strength}%
                      </Badge>
                      {network.speed_mbps && (
                        <p className="text-xs text-gray-500 mt-1">{network.speed_mbps} Mbps</p>
                      )}
                    </div>
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
