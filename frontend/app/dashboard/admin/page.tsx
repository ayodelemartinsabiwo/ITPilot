'use client';

import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

export default function AdminControlsPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Admin & Controls</h1>
        <p className="text-gray-600 mt-1">Manage users, roles, and organization settings</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="hover:shadow-lg transition cursor-pointer">
          <CardContent className="p-6 text-center">
            <span className="text-3xl block mb-2">👥</span>
            <h3 className="font-semibold">User Management</h3>
            <p className="text-sm text-gray-600 mt-1">Add and manage users</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition cursor-pointer">
          <CardContent className="p-6 text-center">
            <span className="text-3xl block mb-2">🔑</span>
            <h3 className="font-semibold">Roles & Permissions</h3>
            <p className="text-sm text-gray-600 mt-1">Configure access control</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition cursor-pointer">
          <CardContent className="p-6 text-center">
            <span className="text-3xl block mb-2">📋</span>
            <h3 className="font-semibold">Activity Logs</h3>
            <p className="text-sm text-gray-600 mt-1">Track user actions</p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition cursor-pointer">
          <CardContent className="p-6 text-center">
            <span className="text-3xl block mb-2">🔍</span>
            <h3 className="font-semibold">Audit Trail</h3>
            <p className="text-sm text-gray-600 mt-1">Compliance records</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
