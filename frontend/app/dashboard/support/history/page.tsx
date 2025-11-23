'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { History, Calendar, Search, Download, Filter, Clock, CheckCircle, XCircle, TrendingUp, BarChart3, Eye, User } from 'lucide-react';

interface SessionHistory {
  id: string;
  sessionId: string;
  customerName: string;
  technician: string;
  type: 'remote-control' | 'screen-share' | 'video-call' | 'chat';
  startTime: string;
  endTime: string;
  duration: string;
  status: 'completed' | 'interrupted' | 'failed';
  resolution: string;
  rating: number | null;
}

export default function SessionHistoryPage() {
  const [history, setHistory] = useState<SessionHistory[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState('7days');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'interrupted': return 'bg-yellow-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'interrupted': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const renderStars = (rating: number | null) => {
    if (!rating) return <span className="text-xs text-gray-400">No rating</span>;
    return (
      <div className="flex items-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= rating ? 'text-yellow-500' : 'text-gray-300'}>
            ★
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Session History</h1>
          <p className="text-gray-600 mt-1">Track and analyze all support session records</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <BarChart3 className="w-4 h-4 mr-2" />
            Analytics
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Sessions</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <History className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Duration</p>
                <p className="text-3xl font-bold text-orange-600">--</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Rating</p>
                <p className="text-3xl font-bold text-purple-600">--</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Status Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Session Status Distribution</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-6 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="font-semibold text-gray-900">Completed</p>
              <p className="text-3xl font-bold text-green-600">0</p>
              <p className="text-sm text-gray-600 mt-1">100%</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-yellow-50 border border-yellow-200">
              <Clock className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p className="font-semibold text-gray-900">Interrupted</p>
              <p className="text-3xl font-bold text-yellow-600">0</p>
              <p className="text-sm text-gray-600 mt-1">0%</p>
            </div>
            <div className="text-center p-6 rounded-lg bg-red-50 border border-red-200">
              <XCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <p className="font-semibold text-gray-900">Failed</p>
              <p className="text-3xl font-bold text-red-600">0</p>
              <p className="text-sm text-gray-600 mt-1">0%</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer, technician, or session ID..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
            <div className="flex gap-2">
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="today">Today</option>
                <option value="7days">Last 7 Days</option>
                <option value="30days">Last 30 Days</option>
                <option value="90days">Last 90 Days</option>
                <option value="all">All Time</option>
              </select>
              <Button variant="outline">
                <Filter className="w-4 h-4 mr-2" />
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* History List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Session Records</CardTitle>
            <Badge className="bg-blue-500 text-white">
              {history.length} sessions
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {history.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <History className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No session history yet</p>
              <p className="text-sm mt-2">Session records will appear here after support sessions are completed</p>
              <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md mx-auto">
                <Calendar className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <p className="text-sm text-blue-700 font-medium">Start tracking your sessions</p>
                <p className="text-xs text-blue-600 mt-1">All remote sessions, chats, and support calls will be recorded here</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {history.map((session) => (
                <div
                  key={session.id}
                  className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4 flex-1">
                      {getStatusIcon(session.status)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{session.customerName}</h3>
                          <Badge className={`${getStatusColor(session.status)} text-white text-xs`}>
                            {session.status}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {session.type.replace('-', ' ')}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{session.resolution}</p>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <User className="w-3 h-3 mr-1" />
                            Technician: {session.technician}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            {session.startTime}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            Duration: {session.duration}
                          </span>
                          <span className="flex items-center">
                            Session ID: #{session.sessionId}
                          </span>
                        </div>
                        <div className="mt-2">
                          <span className="text-xs text-gray-600 mr-2">Customer Rating:</span>
                          {renderStars(session.rating)}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-4 h-4 mr-2" />
                        Details
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Best Performance Day</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-2xl font-bold text-gray-900">--</p>
            <p className="text-sm text-gray-600 mt-2">No data available yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Most Active Technician</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-2xl font-bold text-gray-900">--</p>
            <p className="text-sm text-gray-600 mt-2">No data available yet</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Peak Support Hours</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-2xl font-bold text-gray-900">--</p>
            <p className="text-sm text-gray-600 mt-2">No data available yet</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
