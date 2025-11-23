'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Search,
  Shield,
  Download,
  Filter,
  FileText,
  User,
  Calendar,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Lock,
  Unlock,
  Database
} from 'lucide-react';

interface AuditEntry {
  id: string;
  user: string;
  action: string;
  resource: string;
  resourceType: string;
  changeType: 'create' | 'update' | 'delete' | 'access';
  oldValue?: string;
  newValue?: string;
  timestamp: string;
  ipAddress: string;
  status: 'success' | 'failed' | 'pending';
  complianceLevel: 'high' | 'medium' | 'low';
}

export default function AuditTrailPage() {
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const getChangeTypeIcon = (changeType: string) => {
    switch (changeType) {
      case 'create': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'update': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'delete': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'access': return <Lock className="w-5 h-5 text-blue-500" />;
      default: return <FileText className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'failed': return 'danger';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  const getComplianceBadgeVariant = (level: string) => {
    switch (level) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Audit Trail</h1>
          <p className="text-gray-600 mt-1">Compliance and security audit monitoring</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="w-4 h-4 mr-2" />
            Advanced Filter
          </Button>
          <Button className="bg-orange-500 hover:bg-orange-600">
            <Download className="w-4 h-4 mr-2" />
            Export Audit
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Entries</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Successful</p>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Failed Actions</p>
                <p className="text-3xl font-bold text-red-600">0</p>
              </div>
              <XCircle className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">High Risk</p>
                <p className="text-3xl font-bold text-orange-600">0</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Change Types */}
      <Card>
        <CardHeader>
          <CardTitle>Changes by Type</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
              <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="font-semibold text-gray-900">Created</p>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-50 border border-orange-200">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="font-semibold text-gray-900">Updated</p>
              <p className="text-2xl font-bold text-orange-600">0</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-red-50 border border-red-200">
              <XCircle className="w-8 h-8 mx-auto mb-2 text-red-500" />
              <p className="font-semibold text-gray-900">Deleted</p>
              <p className="text-2xl font-bold text-red-600">0</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
              <Lock className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="font-semibold text-gray-900">Accessed</p>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Audit Entries List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Audit Entries</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search audit trail..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Date Range
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {auditEntries.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No audit entries yet</p>
              <p className="text-sm mt-2">Compliance records will appear here</p>
            </div>
          ) : (
            <div className="space-y-3">
              {auditEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-start space-x-4 flex-1">
                    {getChangeTypeIcon(entry.changeType)}
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{entry.action}</h3>
                        <Badge variant={getStatusBadgeVariant(entry.status) as any} size="sm">
                          {entry.status}
                        </Badge>
                        <Badge variant={getComplianceBadgeVariant(entry.complianceLevel) as any} size="sm">
                          {entry.complianceLevel} risk
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">
                        {entry.resourceType}: {entry.resource}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span className="flex items-center">
                          <User className="w-3 h-3 mr-1" />
                          {entry.user}
                        </span>
                        <span className="flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {entry.timestamp}
                        </span>
                        <span>{entry.ipAddress}</span>
                      </div>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">Details</Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Compliance Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Compliance Score</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-green-600">--</p>
                <p className="text-sm text-gray-600 mt-2">No violations detected</p>
              </div>
              <Shield className="w-12 h-12 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Data Retention</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-3xl font-bold text-blue-600">90</p>
                <p className="text-sm text-gray-600 mt-2">days of audit history</p>
              </div>
              <Database className="w-12 h-12 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Last Audit Export</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold text-orange-600">--</p>
                <p className="text-sm text-gray-600 mt-2">No exports yet</p>
              </div>
              <Download className="w-12 h-12 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
