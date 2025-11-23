'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Monitor, Video, Phone, Share2, User, Clock, CheckCircle, XCircle, PlayCircle, StopCircle, Settings, Shield } from 'lucide-react';

interface RemoteSession {
  id: string;
  customerName: string;
  deviceName: string;
  status: 'active' | 'pending' | 'completed' | 'failed';
  startTime: string;
  duration: string;
  technician: string;
  sessionType: 'screen-share' | 'remote-control' | 'video-call';
}

export default function RemoteSessionsPage() {
  const [sessions, setSessions] = useState<RemoteSession[]>([]);
  const [activeSessions, setActiveSessions] = useState(0);

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'screen-share': return <Share2 className="w-5 h-5 text-blue-500" />;
      case 'remote-control': return <Monitor className="w-5 h-5 text-orange-500" />;
      case 'video-call': return <Video className="w-5 h-5 text-purple-500" />;
      default: return <Monitor className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'completed': return 'bg-blue-500';
      case 'failed': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <PlayCircle className="w-5 h-5 text-green-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-blue-500" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Remote Sessions</h1>
          <p className="text-gray-600 mt-1">Manage and monitor remote support sessions</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <PlayCircle className="w-4 h-4 mr-2" />
          Start New Session
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Sessions</p>
                <p className="text-3xl font-bold text-green-600">{activeSessions}</p>
              </div>
              <PlayCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sessions Today</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Monitor className="w-8 h-8 text-blue-500" />
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
                <p className="text-sm text-gray-600">Success Rate</p>
                <p className="text-3xl font-bold text-purple-600">--</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Session Types */}
      <Card>
        <CardHeader>
          <CardTitle>Session Types</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-6 border-2 border-orange-500 bg-orange-50 rounded-lg cursor-pointer hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <Monitor className="w-8 h-8 text-orange-500" />
                <Badge className="bg-orange-500 text-white">Recommended</Badge>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Remote Control</h3>
              <p className="text-sm text-gray-600">Take full control of the user's device for troubleshooting</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-500 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <Share2 className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Screen Share</h3>
              <p className="text-sm text-gray-600">View the user's screen without taking control</p>
            </div>
            <div className="p-6 border border-gray-200 rounded-lg cursor-pointer hover:border-orange-500 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <Video className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Video Call</h3>
              <p className="text-sm text-gray-600">Face-to-face support with screen sharing option</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Active Sessions */}
      {activeSessions > 0 && (
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <PlayCircle className="w-5 h-5 text-green-500 animate-pulse" />
                <CardTitle>Active Sessions</CardTitle>
              </div>
              <Badge className="bg-green-500 text-white">
                {activeSessions} active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            <p className="text-center text-gray-600">Active sessions will appear here</p>
          </CardContent>
        </Card>
      )}

      {/* All Sessions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Sessions</CardTitle>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
              <Button variant="outline" size="sm">Export</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {sessions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Monitor className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No remote sessions yet</p>
              <p className="text-sm mt-2">Start your first remote session to provide hands-on support</p>
              <Button className="mt-4 bg-orange-500 hover:bg-orange-600">
                <PlayCircle className="w-4 h-4 mr-2" />
                Start Your First Session
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {sessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                >
                  <div className="flex items-center space-x-4 flex-1">
                    {getSessionTypeIcon(session.sessionType)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{session.customerName}</h3>
                        <Badge className={`${getStatusColor(session.status)} text-white text-xs`}>
                          {session.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{session.deviceName}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {session.technician}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {session.duration}
                        </span>
                        <Badge variant="outline" className="text-xs capitalize">
                          {session.sessionType.replace('-', ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {session.status === 'active' ? (
                      <>
                        <Button size="sm" variant="outline">
                          <Monitor className="w-4 h-4 mr-2" />
                          Join
                        </Button>
                        <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50">
                          <StopCircle className="w-4 h-4 mr-2" />
                          End
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="outline">View Details</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security & Compliance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-500" />
            Security & Compliance
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">End-to-End Encryption</p>
                <p className="text-sm text-gray-600 mt-1">All sessions are secured with 256-bit encryption</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">Session Recording</p>
                <p className="text-sm text-gray-600 mt-1">Automatic recording for compliance and training</p>
              </div>
            </div>
            <div className="flex items-start space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="font-semibold text-gray-900">User Consent</p>
                <p className="text-sm text-gray-600 mt-1">Explicit permission required before session starts</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
