'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Activity, Play, Pause, RefreshCw, CheckCircle, AlertTriangle, XCircle, Clock } from 'lucide-react';
import { aiDiagnosticsService, DiagnosticScan } from '@/lib/api/services';

interface ScanProgress {
  currentDevice: string;
  totalDevices: number;
  scannedDevices: number;
  issuesFound: number;
  percentage: number;
}

export default function RealTimeScanPage() {
  const [scanning, setScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState<ScanProgress | null>(null);
  const [recentScans, setRecentScans] = useState<DiagnosticScan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRecentScans();
  }, []);

  const fetchRecentScans = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await aiDiagnosticsService.getScans({ ordering: '-created_at' });

      if (response.data) {
        setRecentScans(Array.isArray(response.data) ? response.data.slice(0, 5) : []);
      }
    } catch (err: any) {
      console.error('Error fetching recent scans:', err);
      setError(err.message || 'Failed to load recent scans');
    } finally {
      setLoading(false);
    }
  };

  const startScan = async () => {
    try {
      setScanning(true);
      setError(null);
      // This would typically create a scan and start it
      // For now, we'll just set the scanning state
      // In a real implementation, you'd create a scan for each device
      // await aiDiagnosticsService.createScan({ device: deviceId, scan_type: 'FULL' });
    } catch (err: any) {
      console.error('Error starting scan:', err);
      setError(err.message || 'Failed to start scan');
      setScanning(false);
    }
  };

  const pauseScan = () => {
    setScanning(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Real-Time Diagnostic Scan</h1>
          <p className="text-gray-600 mt-1">Monitor live diagnostic scans across your infrastructure</p>
        </div>
        <div className="flex gap-2">
          {scanning ? (
            <Button onClick={pauseScan} variant="outline">
              <Pause className="w-4 h-4 mr-2" />
              Pause Scan
            </Button>
          ) : (
            <Button onClick={startScan} variant="primary">
              <Play className="w-4 h-4 mr-2" />
              Start New Scan
            </Button>
          )}
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Devices Scanned</p>
                <p className="text-3xl font-bold text-gray-900">
                  {scanProgress?.scannedDevices || 0}/{scanProgress?.totalDevices || 0}
                </p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scan Progress</p>
                <p className="text-3xl font-bold text-orange-600">
                  {scanProgress?.percentage || 0}%
                </p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Issues Found</p>
                <p className="text-3xl font-bold text-red-600">
                  {scanProgress?.issuesFound || 0}
                </p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Status</p>
                <p className="text-lg font-bold text-gray-900">
                  {scanning ? 'Running' : 'Idle'}
                </p>
              </div>
              {scanning ? (
                <Activity className="w-8 h-8 text-green-500 animate-pulse" />
              ) : (
                <CheckCircle className="w-8 h-8 text-gray-400" />
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Current Scan Status */}
      {scanning && scanProgress && (
        <Card className="border-l-4 border-l-orange-500">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Activity className="w-5 h-5 mr-2 text-orange-500 animate-pulse" />
              Scan in Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-600">Currently scanning: {scanProgress.currentDevice}</span>
                  <span className="font-semibold text-orange-600">{scanProgress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-orange-500 to-orange-600 h-3 rounded-full transition-all duration-500"
                    style={{ width: `${scanProgress.percentage}%` }}
                  />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{scanProgress.scannedDevices}</p>
                  <p className="text-sm text-gray-600">Devices Scanned</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-gray-900">{scanProgress.totalDevices - scanProgress.scannedDevices}</p>
                  <p className="text-sm text-gray-600">Remaining</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{scanProgress.issuesFound}</p>
                  <p className="text-sm text-gray-600">Issues Found</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Scan Options */}
      <Card>
        <CardHeader>
          <CardTitle>Scan Configuration</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-orange-500 transition cursor-pointer">
              <div className="flex items-center mb-2">
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <h3 className="font-semibold">Quick Scan</h3>
              </div>
              <p className="text-sm text-gray-600">Fast scan for common issues (5-10 min)</p>
            </div>
            <div className="p-4 border border-orange-500 bg-orange-50 rounded-lg cursor-pointer">
              <div className="flex items-center mb-2">
                <Activity className="w-5 h-5 text-orange-500 mr-2" />
                <h3 className="font-semibold">Full Scan</h3>
                <Badge className="ml-2 bg-orange-500 text-white text-xs">Recommended</Badge>
              </div>
              <p className="text-sm text-gray-600">Comprehensive scan (20-30 min)</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:border-orange-500 transition cursor-pointer">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-5 h-5 text-purple-500 mr-2" />
                <h3 className="font-semibold">Deep Scan</h3>
              </div>
              <p className="text-sm text-gray-600">Thorough analysis (1-2 hours)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Scans */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Scans</CardTitle>
            <Button variant="outline" size="sm">View All</Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {recentScans.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No scans performed yet</p>
              <p className="text-sm mt-2">Start your first diagnostic scan to see results here</p>
              <Button onClick={startScan} variant="primary" className="mt-4">
                <Play className="w-4 h-4 mr-2" />
                Start Your First Scan
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentScans.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                >
                  <div className="flex items-center space-x-4">
                    {scan.status === 'COMPLETED' ? (
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    ) : scan.status === 'RUNNING' ? (
                      <Activity className="w-8 h-8 text-orange-500 animate-pulse" />
                    ) : (
                      <XCircle className="w-8 h-8 text-red-500" />
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">{scan.device_name} - {scan.scan_type}</h3>
                      <p className="text-sm text-gray-600">{new Date(scan.created_at).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Badge variant={scan.status === 'COMPLETED' ? 'success' : 'warning'}>
                      {scan.status}
                    </Badge>
                    <Button size="sm" variant="outline">View Report</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
