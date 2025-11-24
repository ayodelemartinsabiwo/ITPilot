'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { aiDiagnosticsService, DiagnosticScan, DetectedIssue, DiagnosticsStats } from '@/lib/api/services';

export default function AIDiagnosticsPage() {
  const [scans, setScans] = useState<DiagnosticScan[]>([]);
  const [issues, setIssues] = useState<DetectedIssue[]>([]);
  const [stats, setStats] = useState<DiagnosticsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch scans, issues, and stats in parallel
      const [scansRes, issuesRes, statsRes] = await Promise.all([
        aiDiagnosticsService.getScans({ ordering: '-created_at' }),
        aiDiagnosticsService.getIssues({ severity: 'CRITICAL', status: 'OPEN' }),
        aiDiagnosticsService.getStats()
      ]);

      if (scansRes.data) {
        setScans(Array.isArray(scansRes.data) ? scansRes.data : []);
      }

      if (issuesRes.data) {
        setIssues(Array.isArray(issuesRes.data) ? issuesRes.data : []);
      }

      if (statsRes.data) {
        setStats(statsRes.data);
      }
    } catch (err: any) {
      console.error('Error fetching diagnostics data:', err);
      setError(err.message || 'Failed to load diagnostics data');
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return 'bg-red-500';
      case 'HIGH':
        return 'bg-orange-500';
      case 'MEDIUM':
        return 'bg-yellow-500';
      case 'LOW':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'COMPLETED':
      case 'RESOLVED':
        return 'bg-green-500';
      case 'RUNNING':
      case 'IN_PROGRESS':
        return 'bg-blue-500';
      case 'PENDING':
        return 'bg-yellow-500';
      case 'FAILED':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Diagnostics</h1>
          <p className="text-gray-600 mt-1">Automated system diagnostics and issue detection</p>
        </div>
        <Button variant="primary">
          <span className="mr-2">⚡</span>
          Run Full Scan
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Scans</p>
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? '...' : stats?.total_scans || 0}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-full">
                <span className="text-2xl">🔍</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Issues</p>
                <p className="text-3xl font-bold text-red-600">
                  {loading ? '...' : stats?.critical_issues || 0}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <span className="text-2xl">🚨</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Auto-Fixable</p>
                <p className="text-3xl font-bold text-yellow-600">
                  {loading ? '...' : stats?.auto_fixable_issues || 0}
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <span className="text-2xl">🔧</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-3xl font-bold text-green-600">
                  {loading ? '...' : stats?.resolved_issues || 0}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <span className="text-2xl">✅</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Quick Actions</h2>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-2">🔄</span>
              <span>Real-Time Scan</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-2">📊</span>
              <span>View Reports</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
              <span className="text-2xl mb-2">⚙️</span>
              <span>Schedule Scans</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Scans */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Recent Diagnostic Scans</h2>
        </CardHeader>
        <CardContent className="p-6">
          {scans.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <span className="text-4xl block mb-4">🔍</span>
              <p>No diagnostic scans yet</p>
              <p className="text-sm">Run your first scan to see results here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {scans.map((scan) => (
                <div
                  key={scan.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <h3 className="font-semibold text-gray-900">{scan.device_name}</h3>
                      <Badge className={getStatusColor(scan.status)}>
                        {scan.status}
                      </Badge>
                      <Badge variant="outline">{scan.scan_type}</Badge>
                    </div>
                    <div className="mt-2 flex space-x-6 text-sm">
                      <span className="text-red-600">🔴 {scan.critical_issues} Critical</span>
                      <span className="text-orange-600">🟠 {scan.high_issues} High</span>
                      <span className="text-yellow-600">🟡 {scan.medium_issues} Medium</span>
                      <span className="text-blue-600">🔵 {scan.low_issues} Low</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">{scan.created_at}</p>
                    <Button size="sm" className="mt-2">View Details</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Critical Issues */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Critical Issues Requiring Attention</h2>
            <Badge className="bg-red-500">{issues.length} Active</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {issues.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <span className="text-4xl block mb-4">✅</span>
              <p>No critical issues detected</p>
              <p className="text-sm">Your systems are running smoothly</p>
            </div>
          ) : (
            <div className="space-y-4">
              {issues.filter(i => i.severity === 'CRITICAL').map((issue) => (
                <div
                  key={issue.id}
                  className="p-4 border-l-4 border-l-red-500 bg-red-50 rounded-lg"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <Badge className={getSeverityColor(issue.severity)}>
                          {issue.severity}
                        </Badge>
                        <Badge variant="outline">{issue.category}</Badge>
                        {issue.auto_fixable && (
                          <Badge className="bg-green-500">Auto-Fixable</Badge>
                        )}
                      </div>
                      <h3 className="font-semibold text-gray-900">{issue.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{issue.description}</p>
                      <p className="text-xs text-gray-500 mt-2">Device: {issue.device_name}</p>
                    </div>
                    <div className="flex space-x-2">
                      {issue.auto_fixable && (
                        <Button size="sm" className="bg-green-500 hover:bg-green-600">
                          Auto-Fix
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        View Details
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
