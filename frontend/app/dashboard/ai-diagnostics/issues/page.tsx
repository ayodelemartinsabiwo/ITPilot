'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { AlertTriangle, AlertCircle, Info, CheckCircle, Filter, Search, Download } from 'lucide-react';

interface DetectedIssue {
  id: string;
  device: string;
  category: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'resolved';
  autoFixable: boolean;
  detectedAt: string;
}

export default function IssuesPage() {
  const [issues, setIssues] = useState<DetectedIssue[]>([]);
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'high':
        return <AlertCircle className="w-5 h-5 text-orange-500" />;
      case 'medium':
        return <Info className="w-5 h-5 text-yellow-500" />;
      case 'low':
        return <Info className="w-5 h-5 text-blue-500" />;
      default:
        return <Info className="w-5 h-5 text-gray-500" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'border-l-red-500 bg-red-50';
      case 'high':
        return 'border-l-orange-500 bg-orange-50';
      case 'medium':
        return 'border-l-yellow-500 bg-yellow-50';
      case 'low':
        return 'border-l-blue-500 bg-blue-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Detected Issues</h1>
          <p className="text-gray-600 mt-1">Manage and resolve system issues identified by AI diagnostics</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="primary">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Run New Scan
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Critical Issues</p>
                <p className="text-3xl font-bold text-red-600">0</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Priority</p>
                <p className="text-3xl font-bold text-orange-600">0</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Medium Priority</p>
                <p className="text-3xl font-bold text-yellow-600">0</p>
              </div>
              <Info className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Resolved</p>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
                variant={filterSeverity === 'all' ? 'primary' : 'outline'}
                onClick={() => setFilterSeverity('all')}
              >
                All
              </Button>
              <Button
                size="sm"
                variant={filterSeverity === 'critical' ? 'danger' : 'outline'}
                onClick={() => setFilterSeverity('critical')}
              >
                Critical
              </Button>
              <Button
                size="sm"
                variant={filterSeverity === 'high' ? 'outline' : 'outline'}
                onClick={() => setFilterSeverity('high')}
                className={filterSeverity === 'high' ? 'bg-orange-500 text-white' : ''}
              >
                High
              </Button>
              <Button
                size="sm"
                variant={filterSeverity === 'medium' ? 'outline' : 'outline'}
                onClick={() => setFilterSeverity('medium')}
                className={filterSeverity === 'medium' ? 'bg-yellow-500 text-white' : ''}
              >
                Medium
              </Button>
              <Button
                size="sm"
                variant={filterSeverity === 'low' ? 'outline' : 'outline'}
                onClick={() => setFilterSeverity('low')}
                className={filterSeverity === 'low' ? 'bg-blue-500 text-white' : ''}
              >
                Low
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
                variant={filterStatus === 'open' ? 'outline' : 'outline'}
                onClick={() => setFilterStatus('open')}
                className={filterStatus === 'open' ? 'bg-red-500 text-white' : ''}
              >
                Open
              </Button>
              <Button
                size="sm"
                variant={filterStatus === 'in_progress' ? 'outline' : 'outline'}
                onClick={() => setFilterStatus('in_progress')}
                className={filterStatus === 'in_progress' ? 'bg-yellow-500 text-white' : ''}
              >
                In Progress
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

      {/* Issues List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Issues</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search issues..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {issues.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <CheckCircle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No issues detected</p>
              <p className="text-sm mt-2">Your systems are running smoothly. Great job!</p>
              <Button variant="primary" className="mt-4">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Run Diagnostic Scan
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {issues.map((issue) => (
                <div
                  key={issue.id}
                  className={`p-4 border-l-4 rounded-lg ${getSeverityColor(issue.severity)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getSeverityIcon(issue.severity)}
                        <h3 className="font-semibold text-gray-900">{issue.title}</h3>
                        <Badge variant={issue.severity === 'critical' ? 'danger' : issue.severity === 'high' ? 'warning' : 'default'}>
                          {issue.severity.toUpperCase()}
                        </Badge>
                        <Badge variant="outline">{issue.category}</Badge>
                        {issue.autoFixable && (
                          <Badge variant="success">Auto-Fixable</Badge>
                        )}
                        <Badge variant={issue.status === 'resolved' ? 'success' : issue.status === 'in_progress' ? 'warning' : 'danger'}>
                          {issue.status.replace('_', ' ').toUpperCase()}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-700 mb-2">{issue.description}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>Device: {issue.device}</span>
                        <span>Detected: {issue.detectedAt}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      {issue.autoFixable && issue.status !== 'resolved' && (
                        <Button size="sm" variant="success">
                          Auto-Fix
                        </Button>
                      )}
                      <Button size="sm" variant="outline">
                        View Details
                      </Button>
                      {issue.status !== 'resolved' && (
                        <Button size="sm" variant="outline">
                          Mark Resolved
                        </Button>
                      )}
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
