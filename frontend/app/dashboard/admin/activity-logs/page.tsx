'use client';

import { useState } from 'react';
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
  Settings
} from 'lucide-react';

interface ActivityLog {
  id: string;
  user: string;
  action: string;
  description: string;
  timestamp: string;
  ipAddress: string;
  category: 'auth' | 'user' | 'system' | 'data';
  severity: 'info' | 'warning' | 'error' | 'success';
}

export default function ActivityLogsPage() {
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

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
                <p className="text-3xl font-bold text-gray-900">0</p>
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
                <p className="text-3xl font-bold text-green-600">0</p>
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
                <p className="text-3xl font-bold text-orange-600">0</p>
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
                <p className="text-3xl font-bold text-red-600">0</p>
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
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
              <User className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="font-semibold text-gray-900">User Actions</p>
              <p className="text-2xl font-bold text-purple-600">0</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-50 border border-orange-200">
              <Settings className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="font-semibold text-gray-900">System Changes</p>
              <p className="text-2xl font-bold text-orange-600">0</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
              <Edit className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="font-semibold text-gray-900">Data Changes</p>
              <p className="text-2xl font-bold text-green-600">0</p>
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
          {logs.length === 0 ? (
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
                    {getActionIcon(log.category)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{log.action}</h3>
                        <Badge variant={getSeverityBadgeVariant(log.severity) as any} size="sm">
                          {log.severity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{log.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {log.user}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {log.timestamp}
                        </span>
                        <span>{log.ipAddress}</span>
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
