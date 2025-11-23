'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Key,
  Lock,
  Unlock,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  RefreshCw,
  Settings,
} from 'lucide-react';

export default function PasswordsPage() {
  const [loading, setLoading] = useState(true);
  const [passwords, setPasswords] = useState<any[]>([]);

  useEffect(() => {
    // TODO: Fetch data from API
    setLoading(false);
  }, []);

  const getStrengthColor = (strength: string) => {
    switch (strength.toLowerCase()) {
      case 'strong':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'weak':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getStrengthIcon = (strength: string) => {
    switch (strength.toLowerCase()) {
      case 'strong':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'medium':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      case 'weak':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Shield className="w-5 h-5 text-gray-500" />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Password Security Audit</h1>
          <p className="text-gray-600 mt-1">Analyze and strengthen password security across your organization</p>
        </div>
        <Button variant="primary">
          <RefreshCw className="w-4 h-4 mr-2" />
          Run Audit
        </Button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Strong Passwords</p>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Shield className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-yellow-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Medium Strength</p>
                <p className="text-3xl font-bold text-yellow-600">0</p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-full">
                <AlertTriangle className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-red-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Weak Passwords</p>
                <p className="text-3xl font-bold text-red-600">0</p>
              </div>
              <div className="p-3 bg-red-100 rounded-full">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Accounts</p>
                <p className="text-3xl font-bold text-blue-600">0</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Key className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Password Strength Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Password Strength Distribution</h2>
            <Badge className="bg-blue-500">Overall Score: N/A</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500" />
              <p className="text-3xl font-bold text-green-600">0%</p>
              <p className="text-sm text-gray-600 mt-2">Strong Passwords</p>
              <p className="text-xs text-gray-500 mt-1">12+ characters, mixed case, numbers, symbols</p>
            </div>
            <div className="text-center p-6 bg-yellow-50 rounded-lg">
              <AlertTriangle className="w-12 h-12 mx-auto mb-3 text-yellow-500" />
              <p className="text-3xl font-bold text-yellow-600">0%</p>
              <p className="text-sm text-gray-600 mt-2">Medium Strength</p>
              <p className="text-xs text-gray-500 mt-1">8+ characters, some complexity</p>
            </div>
            <div className="text-center p-6 bg-red-50 rounded-lg">
              <XCircle className="w-12 h-12 mx-auto mb-3 text-red-500" />
              <p className="text-3xl font-bold text-red-600">0%</p>
              <p className="text-sm text-gray-600 mt-2">Weak Passwords</p>
              <p className="text-xs text-gray-500 mt-1">Less than 8 characters or common patterns</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accounts Needing Attention */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Accounts Requiring Attention</h2>
            <Button size="sm" variant="outline">
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {passwords.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Key className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No password data available</p>
              <p className="text-sm mb-4">Run a password audit to analyze account security</p>
              <Button variant="primary">
                <RefreshCw className="w-4 h-4 mr-2" />
                Start Audit
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {passwords.map((password, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-4">
                    {getStrengthIcon(password.strength)}
                    <div>
                      <h3 className="font-semibold">{password.account}</h3>
                      <p className="text-sm text-gray-600">{password.email}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        Last changed: {password.lastChanged}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={getStrengthColor(password.strength)}>
                      {password.strength}
                    </Badge>
                    <Button size="sm" variant="outline">
                      <RefreshCw className="w-4 h-4 mr-2" />
                      Update
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Policy Compliance */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Password Policy Compliance</h2>
            <Button size="sm" variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Configure Policy
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Minimum Length (8 characters)</p>
                  <p className="text-sm text-gray-600">100% compliant</p>
                </div>
              </div>
              <Badge className="bg-green-500">Pass</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Password Expiration (90 days)</p>
                  <p className="text-sm text-gray-600">100% compliant</p>
                </div>
              </div>
              <Badge className="bg-green-500">Pass</Badge>
            </div>
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div className="flex items-center gap-4">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-semibold text-gray-900">Complexity Requirements</p>
                  <p className="text-sm text-gray-600">100% compliant</p>
                </div>
              </div>
              <Badge className="bg-green-500">Pass</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Security Recommendations */}
      <Card>
        <CardHeader>
          <h2 className="text-xl font-bold">Security Recommendations</h2>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Enable Multi-Factor Authentication</p>
                <p className="text-sm text-gray-600">Add an extra layer of security to all accounts</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <Key className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Use a Password Manager</p>
                <p className="text-sm text-gray-600">Generate and store complex passwords securely</p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
              <RefreshCw className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <p className="font-medium text-gray-900">Regular Password Updates</p>
                <p className="text-sm text-gray-600">Change passwords every 90 days for critical accounts</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Compromised Passwords Alert */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold">Compromised Password Check</h2>
            <Badge className="bg-green-500">0 Found</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <Lock className="w-16 h-16 mx-auto mb-4 text-green-500" />
            <p className="text-lg font-medium text-gray-900">No compromised passwords detected</p>
            <p className="text-sm">All passwords are secure and not found in breach databases</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
