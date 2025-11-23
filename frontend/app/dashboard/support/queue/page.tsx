'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Users, UserCheck, Clock, ArrowRight, RefreshCw, Play, Pause, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';

interface QueueItem {
  id: string;
  customerName: string;
  issue: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  waitTime: string;
  assignedTo: string | null;
  category: string;
}

interface Technician {
  id: string;
  name: string;
  status: 'available' | 'busy' | 'offline';
  currentTickets: number;
  resolvedToday: number;
  avgResponseTime: string;
}

export default function TechnicianQueuePage() {
  const [queueItems, setQueueItems] = useState<QueueItem[]>([]);
  const [technicians, setTechnicians] = useState<Technician[]>([]);
  const [isQueueActive, setIsQueueActive] = useState(true);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-500';
      case 'busy': return 'bg-orange-500';
      case 'offline': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Technician Queue</h1>
          <p className="text-gray-600 mt-1">Manage support queue and technician assignments</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setIsQueueActive(!isQueueActive)}
            variant={isQueueActive ? 'outline' : 'primary'}
            className={!isQueueActive ? 'bg-orange-500 hover:bg-orange-600' : ''}
          >
            {isQueueActive ? (
              <>
                <Pause className="w-4 h-4 mr-2" />
                Pause Queue
              </>
            ) : (
              <>
                <Play className="w-4 h-4 mr-2" />
                Resume Queue
              </>
            )}
          </Button>
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
                <p className="text-sm text-gray-600">In Queue</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Techs</p>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Wait Time</p>
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
                <p className="text-sm text-gray-600">Served Today</p>
                <p className="text-3xl font-bold text-purple-600">0</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Queue Status Banner */}
      {!isQueueActive && (
        <Card className="border-l-4 border-l-orange-500 bg-orange-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Pause className="w-6 h-6 text-orange-500" />
                <div>
                  <p className="font-semibold text-gray-900">Queue is Paused</p>
                  <p className="text-sm text-gray-600">New assignments are on hold. Click "Resume Queue" to continue.</p>
                </div>
              </div>
              <Button
                onClick={() => setIsQueueActive(true)}
                className="bg-orange-500 hover:bg-orange-600"
              >
                <Play className="w-4 h-4 mr-2" />
                Resume Queue
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Queue List */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Support Queue</CardTitle>
              <div className="flex items-center space-x-2">
                <Badge className="bg-blue-500 text-white">
                  {queueItems.length} in queue
                </Badge>
                <Button variant="outline" size="sm">Sort By Priority</Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-6">
            {queueItems.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">Queue is empty</p>
                <p className="text-sm mt-2">No customers waiting for support at the moment</p>
                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200 max-w-md mx-auto">
                  <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-green-700 font-medium">All caught up!</p>
                  <p className="text-xs text-green-600 mt-1">Great job handling all support requests</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {queueItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                  >
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-700">
                          {index + 1}
                        </div>
                        <Badge className={`${getPriorityColor(item.priority)} text-white text-xs mt-2`}>
                          {item.priority}
                        </Badge>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.customerName}</h3>
                        <p className="text-sm text-gray-600">{item.issue}</p>
                        <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            Waiting: {item.waitTime}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {item.category}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <Button size="sm" className="bg-orange-500 hover:bg-orange-600">
                      <ArrowRight className="w-4 h-4 mr-2" />
                      Assign
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Technicians Status */}
        <Card>
          <CardHeader>
            <CardTitle>Technician Status</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            {technicians.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <UserCheck className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-sm font-medium">No technicians online</p>
                <p className="text-xs mt-1">Waiting for team members to come online</p>
              </div>
            ) : (
              <div className="space-y-3">
                {technicians.map((tech) => (
                  <div
                    key={tech.id}
                    className="p-4 border border-gray-200 rounded-lg"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center space-x-2">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(tech.status)}`}></div>
                        <span className="font-semibold text-gray-900">{tech.name}</span>
                      </div>
                      <Badge variant="outline" className="text-xs capitalize">
                        {tech.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                      <div>
                        <p className="text-gray-500">Current</p>
                        <p className="font-semibold text-gray-900">{tech.currentTickets} tickets</p>
                      </div>
                      <div>
                        <p className="text-gray-500">Resolved</p>
                        <p className="font-semibold text-green-600">{tech.resolvedToday} today</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Queue Performance */}
      <Card>
        <CardHeader>
          <CardTitle>Queue Performance</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Peak Wait Time</p>
              <p className="text-2xl font-bold text-gray-900">--</p>
              <p className="text-xs text-gray-500 mt-1">No data yet</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Avg Handle Time</p>
              <p className="text-2xl font-bold text-gray-900">--</p>
              <p className="text-xs text-gray-500 mt-1">No data yet</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">Abandonment Rate</p>
              <p className="text-2xl font-bold text-gray-900">--</p>
              <p className="text-xs text-gray-500 mt-1">No data yet</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-2">First Call Resolution</p>
              <p className="text-2xl font-bold text-gray-900">--</p>
              <p className="text-xs text-gray-500 mt-1">No data yet</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
