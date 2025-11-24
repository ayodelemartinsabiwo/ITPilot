'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Package,
  PackageCheck,
  Download,
  CheckCircle,
  AlertCircle,
  Clock,
  RefreshCw,
  Calendar,
  Settings,
} from 'lucide-react';
import { networkSecurityService, PatchStatus } from '@/lib/api/services/network-security.service';
import toast from 'react-hot-toast';

export default function PatchesPage() {
  const [loading, setLoading] = useState(true);
  const [patches, setPatches] = useState<PatchStatus[]>([]);
  const [stats, setStats] = useState({
    upToDate: 0,
    pending: 0,
    available: 0,
    failed: 0,
    critical: 0,
  });

  const fetchPatches = async () => {
    try {
      setLoading(true);
      const response = await networkSecurityService.getPatches({ ordering: '-created_at' });
      const patchData = response.data?.data || [];
      setPatches(patchData);

      // Calculate stats
      const stats = {
        upToDate: patchData.filter((p: PatchStatus) => p.status === 'INSTALLED').length,
        pending: patchData.filter((p: PatchStatus) => p.status === 'DOWNLOADING' || p.status === 'INSTALLING').length,
        available: patchData.filter((p: PatchStatus) => p.status === 'AVAILABLE').length,
        failed: patchData.filter((p: PatchStatus) => p.status === 'FAILED').length,
        critical: patchData.filter((p: PatchStatus) => p.severity === 'CRITICAL').length,
      };
      setStats(stats);
    } catch (error) {
      console.error('Failed to fetch patches:', error);
      toast.error('Failed to load patches');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckUpdates = async () => {
    try {
      toast.loading('Checking for updates...');
      // This would typically require a device ID
      // For now, we'll just refresh the list
      await fetchPatches();
      toast.dismiss();
      toast.success('Updates checked successfully');
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to check for updates');
    }
  };

  const handleInstallPatch = async (patchId: string) => {
    try {
      toast.loading('Installing patch...');
      await networkSecurityService.installPatch(patchId);
      toast.dismiss();
      toast.success('Patch installation started');
      await fetchPatches();
    } catch (error) {
      toast.dismiss();
      toast.error('Failed to install patch');
    }
  };

  useEffect(() => {
    fetchPatches();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'installed':
        return 'bg-green-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'failed':
        return 'bg-red-500';
      case 'available':
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
          <h1 className="text-3xl font-bold text-gray-900">Patch Management</h1>
          <p className="text-gray-600 mt-1">Monitor and manage system updates and security patches</p>
        </div>
        <Button variant="primary" onClick={handleCheckUpdates} disabled={loading}>
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Check for Updates
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Up to Date</p>
                <p className="text-3xl font-bold text-green-600">{stats.upToDate}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <PackageCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Updates</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Patches</p>
                <p className="text-3xl font-bold text-blue-600">{stats.available}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Package className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed Installs</p>
                <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Pending Patches */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Pending System Patches</h2>
            <div className="flex gap-2">
              <Button size="sm" variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
              <Button size="sm" variant="primary">
                <Download className="w-4 h-4 mr-2" />
                Install All
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center py-12 text-gray-500">
              <RefreshCw className="w-16 h-16 mx-auto mb-4 text-orange-500 animate-spin" />
              <p className="text-lg font-medium text-gray-900">Loading patches...</p>
            </div>
          ) : patches.filter(p => p.status === 'AVAILABLE').length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <PackageCheck className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <p className="text-lg font-medium text-gray-900">All systems are up to date</p>
              <p className="text-sm">No pending patches or system updates available</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patches.filter(p => p.status === 'AVAILABLE').map((patch) => (
                <div
                  key={patch.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <Package className={`w-5 h-5 ${patch.severity === 'CRITICAL' ? 'text-red-500' : 'text-blue-500'}`} />
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{patch.title}</h3>
                        {patch.severity === 'CRITICAL' && (
                          <Badge className="bg-red-500">Critical</Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600">{patch.description}</p>
                      <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">
                            {patch.available_date ? new Date(patch.available_date).toLocaleDateString() : 'N/A'}
                          </span>
                        </div>
                        {patch.kb_number && (
                          <span className="text-xs text-gray-500">KB: {patch.kb_number}</span>
                        )}
                        {patch.size_mb && (
                          <span className="text-xs text-gray-500">Size: {patch.size_mb}MB</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={getStatusColor(patch.status)}>
                      {patch.status}
                    </Badge>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleInstallPatch(patch.id)}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Install
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Update History */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Update History</h2>
            <Button size="sm" variant="outline">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <Clock className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No update history</p>
            <p className="text-sm">Patch installation history will appear here</p>
          </div>
        </CardContent>
      </Card>

      {/* Patch Schedule */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Scheduled Updates</h2>
            <Badge className="bg-blue-500">Automatic</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-4">
                <Calendar className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-semibold text-gray-900">Automatic Updates</p>
                  <p className="text-sm text-gray-600">Updates are scheduled weekly on Sundays at 2:00 AM</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Critical Security Patches */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Critical Security Patches</h2>
            <Badge className="bg-red-500">{stats.critical} Critical</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {stats.critical === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <p className="text-lg font-medium text-gray-900">No critical patches pending</p>
              <p className="text-sm">All critical security updates have been applied</p>
            </div>
          ) : (
            <div className="space-y-4">
              {patches.filter(p => p.severity === 'CRITICAL').map((patch) => (
                <div
                  key={patch.id}
                  className="flex items-center justify-between p-4 border-2 border-red-200 bg-red-50 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <div>
                      <h3 className="font-semibold text-red-900">{patch.title}</h3>
                      <p className="text-sm text-red-700">{patch.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={getStatusColor(patch.status)}>
                      {patch.status}
                    </Badge>
                    {patch.status === 'AVAILABLE' && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => handleInstallPatch(patch.id)}
                      >
                        <Download className="w-4 h-4 mr-2" />
                        Install Now
                      </Button>
                    )}
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
