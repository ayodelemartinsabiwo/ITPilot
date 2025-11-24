'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  AlertOctagon,
  Lock,
  Unlock,
  Activity,
  Bell,
  Eye,
} from 'lucide-react';
import { networkSecurityService, ThreatDetection } from '@/lib/api/services';

export default function ThreatsPage() {
  const [loading, setLoading] = useState(true);
  const [threats, setThreats] = useState<ThreatDetection[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchThreats();
  }, []);

  const fetchThreats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await networkSecurityService.getThreats({ ordering: '-detected_at' });

      if (response.data) {
        setThreats(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err: any) {
      console.error('Error fetching threats:', err);
      setError(err.message || 'Failed to load threats');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'bg-red-500';
      case 'high':
        return 'bg-orange-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'low':
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
          <h1 className="text-3xl font-bold text-gray-900">Threat Monitoring</h1>
          <p className="text-gray-600 mt-1">Real-time security threat detection and alerts</p>
        </div>
        <Button variant="primary">
          <Shield className="w-4 h-4 mr-2" />
          Run Security Scan
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Security Status</p>
                <p className="text-2xl font-bold text-green-600">Protected</p>
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
                <p className="text-sm text-gray-600">Active Threats</p>
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
                <p className="text-sm text-gray-600">Blocked Attacks</p>
                <p className="text-3xl font-bold text-yellow-600">0</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <Lock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monitored Devices</p>
                <p className="text-3xl font-bold text-blue-600">0</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Activity className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Active Threats */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Active Security Threats</h2>
            <Badge className="bg-green-500">0 Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {threats.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <ShieldCheck className="w-16 h-16 mx-auto mb-4 text-green-500" />
              <p className="text-lg font-medium text-gray-900">No active threats detected</p>
              <p className="text-sm">Your network is secure and protected</p>
            </div>
          ) : (
            <div className="space-y-4">
              {threats.map((threat, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    <AlertOctagon className="w-5 h-5 text-red-500" />
                    <div>
                      <h3 className="font-semibold">{threat.name}</h3>
                      <p className="text-sm text-gray-600">{threat.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={getSeverityColor(threat.severity)}>
                      {threat.severity}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Recent Security Alerts</h2>
            <Button size="sm" variant="outline">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <Bell className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No recent alerts</p>
            <p className="text-sm">Security alerts will appear here when detected</p>
          </div>
        </CardContent>
      </Card>

      {/* Threat Timeline */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Threat Timeline</h2>
            <Badge className="bg-blue-500">Last 24 Hours</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <Activity className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No threat activity</p>
            <p className="text-sm">No security incidents in the last 24 hours</p>
          </div>
        </CardContent>
      </Card>

      {/* Vulnerability Summary */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Vulnerability Summary</h2>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <p className="text-3xl font-bold text-red-600">0</p>
              <p className="text-sm text-gray-600 mt-1">Critical</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <p className="text-3xl font-bold text-orange-600">0</p>
              <p className="text-sm text-gray-600 mt-1">High</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <p className="text-3xl font-bold text-yellow-600">0</p>
              <p className="text-sm text-gray-600 mt-1">Medium</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-3xl font-bold text-blue-600">0</p>
              <p className="text-sm text-gray-600 mt-1">Low</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
