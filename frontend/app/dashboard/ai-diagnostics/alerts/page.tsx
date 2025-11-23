'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Bell, BellOff, AlertTriangle, Info, CheckCircle, XCircle, Settings, Filter } from 'lucide-react';

interface Alert {
  id: string;
  type: 'critical' | 'warning' | 'info' | 'success';
  title: string;
  message: string;
  source: string;
  timestamp: string;
  status: 'active' | 'acknowledged' | 'resolved';
  actionRequired: boolean;
}

export default function AlertsPage() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [muteAlerts, setMuteAlerts] = useState(false);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'critical':
        return <AlertTriangle className="w-6 h-6 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="w-6 h-6 text-yellow-500" />;
      case 'info':
        return <Info className="w-6 h-6 text-blue-500" />;
      case 'success':
        return <CheckCircle className="w-6 h-6 text-green-500" />;
      default:
        return <Bell className="w-6 h-6 text-gray-500" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'critical':
        return 'border-l-red-500 bg-red-50';
      case 'warning':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'info':
        return 'border-l-blue-500 bg-blue-50';
      case 'success':
        return 'border-l-green-500 bg-green-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const acknowledgeAlert = (id: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, status: 'acknowledged' as const } : alert
    ));
  };

  const resolveAlert = (id: string) => {
    setAlerts(alerts.map(alert =>
      alert.id === id ? { ...alert, status: 'resolved' as const } : alert
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">System Alerts</h1>
          <p className="text-gray-600 mt-1">Monitor and manage real-time system notifications</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setMuteAlerts(!muteAlerts)}
          >
            {muteAlerts ? (
              <>
                <BellOff className="w-4 h-4 mr-2" />
                Unmute Alerts
              </>
            ) : (
              <>
                <Bell className="w-4 h-4 mr-2" />
                Mute Alerts
              </>
            )}
          </Button>
          <Button variant="primary">
            <Settings className="w-4 h-4 mr-2" />
            Alert Settings
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Alerts</p>
                <p className="text-3xl font-bold text-red-600">0</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Warnings</p>
                <p className="text-3xl font-bold text-yellow-600">0</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Info</p>
                <p className="text-3xl font-bold text-blue-600">0</p>
              </div>
              <Info className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Active</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Bell className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-700">Filter by:</span>
            </div>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filterType === 'all' ? 'primary' : 'outline'}
                onClick={() => setFilterType('all')}
              >
                All Types
              </Button>
              <Button
                size="sm"
                variant={filterType === 'critical' ? 'danger' : 'outline'}
                onClick={() => setFilterType('critical')}
              >
                Critical
              </Button>
              <Button
                size="sm"
                variant={filterType === 'warning' ? 'outline' : 'outline'}
                onClick={() => setFilterType('warning')}
                className={filterType === 'warning' ? 'bg-yellow-500 text-white' : ''}
              >
                Warning
              </Button>
              <Button
                size="sm"
                variant={filterType === 'info' ? 'outline' : 'outline'}
                onClick={() => setFilterType('info')}
                className={filterType === 'info' ? 'bg-blue-500 text-white' : ''}
              >
                Info
              </Button>
            </div>
            <div className="h-6 w-px bg-gray-300" />
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={filterStatus === 'all' ? 'primary' : 'outline'}
                onClick={() => setFilterStatus('all')}
              >
                All Status
              </Button>
              <Button
                size="sm"
                variant={filterStatus === 'active' ? 'outline' : 'outline'}
                onClick={() => setFilterStatus('active')}
                className={filterStatus === 'active' ? 'bg-red-500 text-white' : ''}
              >
                Active
              </Button>
              <Button
                size="sm"
                variant={filterStatus === 'acknowledged' ? 'outline' : 'outline'}
                onClick={() => setFilterStatus('acknowledged')}
                className={filterStatus === 'acknowledged' ? 'bg-yellow-500 text-white' : ''}
              >
                Acknowledged
              </Button>
              <Button
                size="sm"
                variant={filterStatus === 'resolved' ? 'success' : 'outline'}
                onClick={() => setFilterStatus('resolved')}
              >
                Resolved
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alert Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Alert Rules</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg hover:border-orange-500 transition">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">CPU Usage</h3>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-sm text-gray-600">Alert when CPU exceeds 80%</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:border-orange-500 transition">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Disk Space</h3>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-sm text-gray-600">Alert when disk space below 10%</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg hover:border-orange-500 transition">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Security Events</h3>
                <Badge variant="success">Active</Badge>
              </div>
              <p className="text-sm text-gray-600">Alert on security anomalies</p>
            </div>
          </div>
          <div className="mt-4">
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Manage Alert Rules
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Alerts List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Alerts</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">Clear All Resolved</Button>
              <Button variant="outline" size="sm">Mark All as Read</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {alerts.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No active alerts</p>
              <p className="text-sm mt-2">All systems are operating normally</p>
              <Button variant="primary" className="mt-4">
                <Settings className="w-4 h-4 mr-2" />
                Configure Alert Rules
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 border-l-4 rounded-lg ${getAlertColor(alert.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {getAlertIcon(alert.type)}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{alert.title}</h3>
                          <Badge variant={alert.type === 'critical' ? 'danger' : alert.type === 'warning' ? 'warning' : alert.type === 'info' ? 'info' : 'success'}>
                            {alert.type.toUpperCase()}
                          </Badge>
                          <Badge variant={alert.status === 'active' ? 'danger' : alert.status === 'acknowledged' ? 'warning' : 'success'}>
                            {alert.status.toUpperCase()}
                          </Badge>
                          {alert.actionRequired && (
                            <Badge variant="danger">Action Required</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-700 mb-2">{alert.message}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>Source: {alert.source}</span>
                          <span>Time: {alert.timestamp}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {alert.status === 'active' && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => acknowledgeAlert(alert.id)}>
                            Acknowledge
                          </Button>
                          <Button size="sm" variant="success" onClick={() => resolveAlert(alert.id)}>
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Resolve
                          </Button>
                        </>
                      )}
                      {alert.status === 'acknowledged' && (
                        <Button size="sm" variant="success" onClick={() => resolveAlert(alert.id)}>
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Resolve
                        </Button>
                      )}
                      <Button size="sm" variant="ghost">
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
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
