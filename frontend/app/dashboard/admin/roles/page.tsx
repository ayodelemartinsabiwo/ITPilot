'use client';

import { useState } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Shield,
  Plus,
  Search,
  Edit,
  Trash2,
  Users,
  Lock,
  Unlock,
  Check,
  X
} from 'lucide-react';

interface Role {
  id: string;
  name: string;
  description: string;
  userCount: number;
  permissions: string[];
  isSystem: boolean;
  createdAt: string;
}

export default function RolesPermissionsPage() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Roles & Permissions</h1>
          <p className="text-gray-600 mt-1">Configure access control and user permissions</p>
        </div>
        <Button className="bg-orange-500 hover:bg-orange-600">
          <Plus className="w-4 h-4 mr-2" />
          Create Role
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Roles</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Shield className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Custom Roles</p>
                <p className="text-3xl font-bold text-orange-600">0</p>
              </div>
              <Edit className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">System Roles</p>
                <p className="text-3xl font-bold text-green-600">0</p>
              </div>
              <Lock className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Permissions</p>
                <p className="text-3xl font-bold text-purple-600">0</p>
              </div>
              <Unlock className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Permission Categories */}
      <Card>
        <CardHeader>
          <CardTitle>Permission Categories</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
              <Users className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="font-semibold text-gray-900">User Management</p>
              <p className="text-2xl font-bold text-blue-600">0</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-orange-50 border border-orange-200">
              <Shield className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="font-semibold text-gray-900">Device Access</p>
              <p className="text-2xl font-bold text-orange-600">0</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
              <Lock className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="font-semibold text-gray-900">Security</p>
              <p className="text-2xl font-bold text-green-600">0</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
              <Unlock className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="font-semibold text-gray-900">Reports</p>
              <p className="text-2xl font-bold text-purple-600">0</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Roles List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Roles</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search roles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
              <Button variant="outline" size="sm">Export</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {roles.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Shield className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">No custom roles yet</p>
              <p className="text-sm mt-2">Create your first role to manage permissions</p>
              <Button className="mt-4 bg-orange-500 hover:bg-orange-600">
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Role
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {roles.map((role) => (
                <Card key={role.id} className="border hover:shadow-md transition">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 rounded-lg bg-orange-100 flex items-center justify-center">
                          <Shield className="w-6 h-6 text-orange-500" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                            {role.name}
                            {role.isSystem && (
                              <Badge variant="default" size="sm">System</Badge>
                            )}
                          </h3>
                          <p className="text-sm text-gray-600">{role.description}</p>
                        </div>
                      </div>
                      {!role.isSystem && (
                        <div className="flex gap-2">
                          <Button size="sm" variant="ghost">
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost">
                            <Trash2 className="w-4 h-4 text-red-500" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-1" />
                        {role.userCount} users
                      </span>
                      <span className="text-gray-600">
                        {role.permissions.length} permissions
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
