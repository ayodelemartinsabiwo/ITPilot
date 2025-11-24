'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Users, UserCheck, Clock, ArrowRight, RefreshCw, Play, Pause, CheckCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { ticketsService, Ticket } from '@/lib/api/services/tickets.service';

export default function TechnicianQueuePage() {
  const [queueItems, setQueueItems] = useState<Ticket[]>([]);
  const [isQueueActive, setIsQueueActive] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchQueue();
  }, []);

  const fetchQueue = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await ticketsService.getTechnicianQueue();
      if (response.data) {
        setQueueItems(response.data);
      }
    } catch (err: any) {
      console.error('Error fetching queue:', err);
      setError(err.message || 'Failed to load queue');
    } finally {
      setIsLoading(false);
    }
  };

  const inQueue = queueItems.length;
  const availableTechs = queueItems.filter(t => t.assigned_to).length;
  const avgWaitTime = '5m';
  const resolvedToday = queueItems.filter(t => t.status === 'resolved').length;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
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
          <Button variant="outline" onClick={fetchQueue}>
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
                <p className="text-3xl font-bold text-gray-900">{isLoading ? '...' : inQueue}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Assigned</p>
                <p className="text-3xl font-bold text-green-600">{isLoading ? '...' : availableTechs}</p>
              </div>
              <UserCheck className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Wait</p>
                <p className="text-3xl font-bold text-orange-600">{avgWaitTime}</p>
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved Today</p>
                <p className="text-3xl font-bold text-purple-600">{isLoading ? '...' : resolvedToday}</p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Queue Items */}
      <Card>
        <CardHeader>
          <CardTitle>Current Queue</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading queue...</p>
            </div>
          ) : queueItems.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-sm font-medium">Queue is empty</p>
              <p className="text-xs mt-1">No tickets waiting for assignment</p>
            </div>
          ) : (
            <div className="space-y-3">
              {queueItems.map((item, index) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
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
                      <h3 className="font-semibold text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                      <div className="flex items-center space-x-3 mt-2 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Clock className="w-3 h-3 mr-1" />
                          {new Date(item.created_at).toLocaleDateString()}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {item.category}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="primary">
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
          <div className="text-center py-8 text-gray-500">
            <UserCheck className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm font-medium">No technicians online</p>
            <p className="text-xs mt-1">Waiting for team members to come online</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
