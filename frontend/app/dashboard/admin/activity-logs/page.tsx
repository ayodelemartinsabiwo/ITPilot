'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  FileText,
  Search,
  Filter,
  Download,
  User,
  Calendar,
  Activity,
  LogIn,
  LogOut,
  Edit,
  Trash2,
  Plus,
  Settings,
  XCircle
} from 'lucide-react';
import { adminService, ActivityLog } from '@/lib/api/services/admin.service';

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActivityLogs();
  }, []);

  const fetchActivityLogs = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await adminService.getActivityLogs();
      if (response.data) {
        setLogs(response.data);
      }
    } catch (err: any) {
      console.error('Error fetching activity logs:', err);
      setError(err.message || 'Failed to load activity logs');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate stats from logs data
  const totalActivities = logs.length;
  const todayLogs = logs.filter(log => {
    const logDate = new Date(log.timestamp).toDateString();
    const today = new Date().toDateString();
    return logDate === today;
  }).length;
  const loginEvents = logs.filter(log => log.action.toLowerCase().includes('login')).length;
  const failedAttempts = logs.filter(log => log.action.toLowerCase().includes('failed')).length;

  // Count by category
  const authLogs = logs.filter(log => log.resource_type === 'authentication').length;
  const userLogs = logs.filter(log => log.resource_type === 'user').length;
  const systemLogs = logs.filter(log => log.resource_type === 'system').length;
  const dataLogs = logs.filter(log => log.resource_type === 'data').length;

  const getCategoryName = (resourceType: string): string => {
    const categoryMap: Record<string, string> = {
      'authentication': 'auth',
      'user': 'user',
      'system': 'system',
      'data': 'data'
    };
    return categoryMap[resourceType] || 'system';
  };

  const getActionIcon = (category: string) => {
    switch (category) {
      case 'auth': return <LogIn className="w-5 h-5 text-blue-500" />;
      case 'user': return <User className="w-5 h-5 text-purple-500" />;
      case 'system': return <Settings className="w-5 h-5 text-orange-500" />;
      case 'data': return <Edit className="w-5 h-5 text-green-500" />;
      default: return <Activity className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'error': return 'danger';
      case 'info': return 'info';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Activity Logs</h1>
          <p className="text-gray-600 mt-1">Track user actions and system events</p>
        </div>
        <Button variant="primary">
          <Download className="w-4 h-4 mr-2" />
          Export Logs
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Activities</p>
                <p className="text-3xl font-bold text-gray-900">{isLoading ? '...' : totalActivities}</p>
              </div>
              <Activity className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Today</p>
                <p className="text-3xl font-bold text-green-600">{isLoading ? '...' : todayLogs}</p>
              </div>
              <Calendar className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Login Events</p>
                <p className="text-3xl font-bold text-orange-600">{isLoading ? '...' : loginEvents}</p>
              </div>
              <LogIn className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed Attempts</p>
                <p className="text-3xl font-bold text-red-600">{isLoading ? '...' : failedAttempts}</p>
              </div>
              <Activity className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Activity by Category</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
              <LogIn className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="font-semibold text-gray-900">Authentication</p>
              <p className="text-2xl font-bold text-blue-600">{isLoading ? '...' : authLogs}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
              <User className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="font-semibold text-gray-900">User Actions</p>
              <p className="text-2xl font-bold text-purple-600">{isLoading ? '...' : userLogs}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-50 border border-orange-200">
              <Settings className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="font-semibold text-gray-900">System Changes</p>
              <p className="text-2xl font-bold text-orange-600">{isLoading ? '...' : systemLogs}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
              <Edit className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="font-semibold text-gray-900">Data Changes</p>
              <p className="text-2xl font-bold text-green-600">{isLoading ? '...' : dataLogs}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Activity Logs List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Activity</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-12 text-gray-500">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p>Loading activity logs...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12 text-red-500">
              <XCircle className="w-16 h-16 mx-auto mb-4" />
              <p className="text-lg font-medium">Error loading activity logs</p>
              <p className="text-sm mt-2">{error}</p>
              <Button variant="primary" className="mt-4" onClick={fetchActivityLogs}>
                Try Again
              </Button>
            </div>
          ) : logs.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <FileText className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No activity logs yet</p>
              <p className="text-sm mt-2">User activities will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    {getActionIcon(getCategoryName(log.resource_type))}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{log.action}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{log.resource_type}: {log.resource_id || 'N/A'}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {log.user.name}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                        <span>{log.ip_address}</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">View</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Most Active User</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-2xl font-bold text-orange-600">--</p>
            <p className="text-sm text-gray-600 mt-2">No data available yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Peak Activity Time</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-2xl font-bold text-blue-600">--</p>
            <p className="text-sm text-gray-600 mt-2">No data available yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Avg Daily Activities</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-2xl font-bold text-green-600">--</p>
            <p className="text-sm text-gray-600 mt-2">No data available yet</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
