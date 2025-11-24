'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Wrench, PlayCircle, CheckCircle, XCircle, Clock, AlertTriangle, History, Settings } from 'lucide-react';
import { aiDiagnosticsService, AutoFixAction } from '@/lib/api/services';

export default function AutoFixPage() {
  const [actions, setActions] = useState<AutoFixAction[]>([]);
  const [autoFixEnabled, setAutoFixEnabled] = useState(true);
  const [selectedActions, setSelectedActions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchActions();
  }, []);

  const fetchActions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await aiDiagnosticsService.getAutoFixActions({ ordering: '-created_at' });

      if (response.data) {
        setActions(Array.isArray(response.data) ? response.data : []);
      }
    } catch (err: any) {
      console.error('Error fetching auto-fix actions:', err);
      setError(err.message || 'Failed to load auto-fix actions');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'running':
        return <Clock className="w-5 h-5 text-blue-500 animate-spin" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'border-l-green-500 bg-green-50';
      case 'running':
        return 'border-l-blue-500 bg-blue-50';
      case 'failed':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-yellow-500 bg-yellow-50';
    }
  };

  const executeAutoFix = async (id: string) => {
    try {
      setActions(actions.map(action =>
        action.id === id ? { ...action, status: 'RUNNING' as const } : action
      ));

      await aiDiagnosticsService.executeAutoFix(id);
      await fetchActions(); // Refresh the list
    } catch (err: any) {
      console.error('Error executing auto-fix:', err);
      setError(err.message || 'Failed to execute auto-fix');
    }
  };

  const executeSelectedFixes = async () => {
    try {
      await Promise.all(selectedActions.map(id => aiDiagnosticsService.executeAutoFix(id)));
      setSelectedActions([]);
      await fetchActions(); // Refresh the list
    } catch (err: any) {
      console.error('Error executing selected fixes:', err);
      setError(err.message || 'Failed to execute selected fixes');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Auto-Fix Actions</h1>
          <p className="text-gray-600 mt-1">Automated remediation of detected issues</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <History className="w-4 h-4 mr-2" />
            View History
          </Button>
          <Button variant="primary">
            <Settings className="w-4 h-4 mr-2" />
            Configure Auto-Fix
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Available Fixes</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : actions.filter(a => a.status === 'PENDING').length}
                </p>
              </div>
              <Wrench className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-blue-600">
                  {loading ? '...' : actions.filter(a => a.status === 'RUNNING').length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">
                  {loading ? '...' : actions.filter(a => a.status === 'COMPLETED').length}
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-3xl font-bold text-red-600">
                  {loading ? '...' : actions.filter(a => a.status === 'FAILED').length}
                </p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Auto-Fix Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Auto-Fix Settings</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-4">
              <Wrench className="w-6 h-6 text-orange-500" />
              <div>
                <h3 className="font-semibold text-gray-900">Automatic Execution</h3>
                <p className="text-sm text-gray-600">
                  {autoFixEnabled
                    ? 'Auto-fixes are automatically executed for low-impact issues'
                    : 'All auto-fixes require manual approval before execution'}
                </p>
              </div>
            </div>
            <Button
              variant={autoFixEnabled ? 'success' : 'outline'}
              onClick={() => setAutoFixEnabled(!autoFixEnabled)}
            >
              {autoFixEnabled ? 'Enabled' : 'Disabled'}
            </Button>
          </div>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <h4 className="font-semibold">Low Impact</h4>
              </div>
              <p className="text-sm text-gray-600">Auto-execute without approval</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-500" />
                <h4 className="font-semibold">Medium Impact</h4>
              </div>
              <p className="text-sm text-gray-600">Require approval before execution</p>
            </div>
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <XCircle className="w-5 h-5 text-red-500" />
                <h4 className="font-semibold">High Impact</h4>
              </div>
              <p className="text-sm text-gray-600">Manual intervention required</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Available Auto-Fix Actions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Available Auto-Fix Actions</CardTitle>
            <div className="flex gap-2">
              {selectedActions.length > 0 && (
                <Button variant="primary" onClick={executeSelectedFixes}>
                  <PlayCircle className="w-4 h-4 mr-2" />
                  Execute Selected ({selectedActions.length})
                </Button>
              )}
              <Button variant="outline" size="sm">Filter</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {actions.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No auto-fix actions available</p>
              <p className="text-sm mt-2">Run a diagnostic scan to identify issues that can be automatically fixed</p>
              <Button variant="primary" className="mt-4">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Run Diagnostic Scan
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {actions.map((action) => (
                <div
                  key={action.id}
                  className={`p-4 border-l-4 rounded-lg ${getStatusColor(action.status)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <input
                        type="checkbox"
                        className="mt-1 w-4 h-4 text-orange-500 rounded"
                        checked={selectedActions.includes(action.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedActions([...selectedActions, action.id]);
                          } else {
                            setSelectedActions(selectedActions.filter(id => id !== action.id));
                          }
                        }}
                        disabled={action.status !== 'PENDING'}
                      />
                      {getStatusIcon(action.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{action.issueTitle}</h3>
                          <Badge variant={action.status === 'COMPLETED' ? 'success' : action.status === 'FAILED' ? 'danger' : action.status === 'RUNNING' ? 'info' : 'warning'}>
                            {action.status}
                          </Badge>
                          <Badge variant="outline">{action.fixType}</Badge>
                          <Badge variant={action.impact === 'HIGH' ? 'danger' : action.impact === 'MEDIUM' ? 'warning' : 'info'}>
                            {action.impact} IMPACT
                          </Badge>
                          {action.autoExecute && (
                            <Badge variant="success">Auto-Execute</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <span>Device: {action.device}</span>
                          <span>Created: {action.createdAt}</span>
                          {action.completedAt && (
                            <span>Completed: {action.completedAt}</span>
                          )}
                        </div>
                        {action.result && (
                          <div className={`mt-2 p-3 rounded-lg ${action.status === 'COMPLETED' ? 'bg-green-100' : 'bg-red-100'}`}>
                            <p className="text-sm font-medium">Result:</p>
                            <p className="text-sm">{action.result}</p>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {action.status === 'PENDING' && (
                        <>
                          <Button size="sm" variant="primary" onClick={() => executeAutoFix(action.id)}>
                            <PlayCircle className="w-4 h-4 mr-1" />
                            Execute
                          </Button>
                          <Button size="sm" variant="outline">View Details</Button>
                        </>
                      )}
                      {action.status === 'RUNNING' && (
                        <Button size="sm" variant="outline" disabled>
                          <Clock className="w-4 h-4 mr-1 animate-spin" />
                          Running...
                        </Button>
                      )}
                      {(action.status === 'COMPLETED' || action.status === 'FAILED') && (
                        <Button size="sm" variant="outline">View Report</Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Auto-Fix Activity</CardTitle>
            <Button variant="outline" size="sm">
              <History className="w-4 h-4 mr-2" />
              View Full History
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-8 text-gray-500">
            <History className="w-12 h-12 mx-auto mb-3 text-gray-400" />
            <p className="text-sm">No recent activity</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
