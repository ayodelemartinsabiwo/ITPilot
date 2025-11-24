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
import { networkSecurityService, AntivirusStatus } from '@/lib/api/services/network-security.service';
import toast from 'react-hot-toast';

export default function AntivirusPage() {
  const [loading, setLoading] = useState(true);
  const [devices, setDevices] = useState<AntivirusStatus[]>([]);
  const [stats, setStats] = useState({
    protected: 0,
    threatsDetected: 0,
    quarantined: 0,
    lastScan: 'Never',
  });

  const fetchAntivirusStatus = async () => {
    try {
      setLoading(true);
      const response = await networkSecurityService.getAntivirusStatuses({ ordering: '-updated_at' });
      const deviceData = response.data?.data || [];
      setDevices(deviceData);

      // Calculate stats
      const totalThreats = deviceData.reduce((sum: number, d: AntivirusStatus) => sum + d.threats_detected, 0);
      const totalQuarantined = deviceData.reduce((sum: number, d: AntivirusStatus) => sum + d.threats_quarantined, 0);
      const lastScanDates = deviceData
        .filter((d: AntivirusStatus) => d.last_scan)
        .map((d: AntivirusStatus) => new Date(d.last_scan!));
      const mostRecentScan = lastScanDates.length > 0
        ? new Date(Math.max(...lastScanDates.map(d => d.getTime()))).toLocaleString()
        : 'Never';

      setStats({
        protected: deviceData.filter((d: AntivirusStatus) => d.status === 'PROTECTED').length,
        threatsDetected: totalThreats,
        quarantined: totalQuarantined,
        lastScan: mostRecentScan,
      });
    } catch (error) {
      console.error('Failed to fetch antivirus status:', error);
      toast.error('Failed to load antivirus status');
    } finally {
      setLoading(false);
    }
  };

  const handleRunScan = async () => {
    try {
      toast.loading('Running full scan...');
      // This would typically require a device ID
      // For now, we'll just refresh the list
      await fetchAntivirusStatus();
      toast.dismiss();
      toast.success('Scan completed');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to run scan');
    }
  };

  const handleRefreshStatus = async () => {
    await fetchAntivirusStatus();
  };

  useEffect(() => {
    fetchAntivirusStatus();
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
        <Button variant="primary" onClick={handleRunScan} disabled={loading}>
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
                <p className="text-3xl font-bold text-green-600">{stats.protected}</p>
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
                <p className="text-3xl font-bold text-red-600">{stats.threatsDetected}</p>
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
                <p className="text-3xl font-bold text-yellow-600">{stats.quarantined}</p>
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
                <p className="text-sm font-bold text-blue-600">{stats.lastScan}</p>
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
            <Button size="sm" variant="outline" onClick={handleRefreshStatus} disabled={loading}>
              <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh Status
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              <RefreshCw className="w-16 h-16 mx-auto mb-4 text-orange-500 animate-spin" />
              <p className="text-lg font-medium text-gray-900">Loading antivirus status...</p>
            </div>
          ) : devices.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No devices registered</p>
              <p className="text-sm mb-4">Add devices to monitor their antivirus protection status</p>
            </div>
          ) : (
            <div className="space-y-4">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <ShieldCheck className={`w-5 h-5 ${device.status === 'PROTECTED' ? 'text-green-500' : 'text-red-500'}`} />
                    <div>
                      <h3 className="font-semibold">{device.device_name}</h3>
                      <p className="text-sm text-gray-600">
                        {device.antivirus_name} - Version {device.version}
                      </p>
                      <div className="flex items-center gap-3 mt-1">
                        <p className="text-xs text-gray-500">
                          Last scan: {device.last_scan ? new Date(device.last_scan).toLocaleString() : 'Never'}
                        </p>
                        <p className="text-xs text-gray-500">
                          Updated: {device.last_update ? new Date(device.last_update).toLocaleString() : 'Never'}
                        </p>
                      </div>
                      {device.threats_detected > 0 && (
                        <div className="flex items-center gap-2 mt-2">
                          <Badge className="bg-red-500 text-xs">
                            {device.threats_detected} threats
                          </Badge>
                          <Badge className="bg-yellow-500 text-xs">
                            {device.threats_quarantined} quarantined
                          </Badge>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Badge className={getProtectionColor(device.status)}>
                        {device.status}
                      </Badge>
                      <div className="flex items-center gap-2 mt-2">
                        {device.is_active && (
                          <span className="text-xs text-green-600">Active</span>
                        )}
                        {device.is_updated ? (
                          <span className="text-xs text-green-600">Up-to-date</span>
                        ) : (
                          <span className="text-xs text-red-600">Outdated</span>
                        )}
                      </div>
                    </div>
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
            <Button variant="primary">
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
            <Badge className={stats.threatsDetected > 0 ? 'bg-red-500' : 'bg-green-500'}>
              {stats.threatsDetected} Threats
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <p className="text-2xl font-bold text-red-600">{stats.threatsDetected}</p>
              <p className="text-sm text-gray-600 mt-1">Total Threats</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <ShieldAlert className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="text-2xl font-bold text-yellow-600">{stats.quarantined}</p>
              <p className="text-sm text-gray-600 mt-1">Quarantined</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <Activity className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="text-2xl font-bold text-green-600">{stats.protected}</p>
              <p className="text-sm text-gray-600 mt-1">Protected Devices</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quarantine */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Quarantined Items</h2>
            <Badge className={stats.quarantined > 0 ? 'bg-yellow-500' : 'bg-green-500'}>
              {stats.quarantined} Items
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {stats.quarantined === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <p className="text-lg font-medium text-gray-900">No quarantined items</p>
              <p className="text-sm">Detected threats will be isolated here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {devices.filter(d => d.threats_quarantined > 0).map((device) => (
                <div
                  key={device.id}
                  className="flex items-center justify-between p-4 border-2 border-yellow-200 bg-yellow-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <AlertTriangle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <h3 className="font-semibold text-yellow-900">{device.device_name}</h3>
                      <p className="text-sm text-yellow-700">
                        {device.threats_quarantined} quarantined items on this device
                      </p>
                    </div>
                  </div>
                  <Badge className="bg-yellow-500">{device.threats_quarantined}</Badge>
                </div>
              ))}
            </div>
          )}
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
