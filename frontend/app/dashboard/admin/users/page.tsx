'use client';

import { useState, useMemo } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  MoreVertical,
  Shield,
  Mail,
  Calendar,
  CheckCircle,
  XCircle,
  Clock,
  Loader2
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { adminService, AdminUser } from '@/lib/api/services/admin.service';

export default function UserManagementPage() {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => {
      const response = await adminService.getUsers()
      return response.data
    },
  })

  const adminUsers = usersData || []

  // Calculate user statistics
  const userStats = useMemo(() => {
    if (!adminUsers.length) {
      return {
        total: 0,
        active: 0,
        pending: 0,
        inactive: 0,
        byRole: {
          admin: 0,
          manager: 0,
          technician: 0,
          user: 0,
        },
      }
    }

    const active = adminUsers.filter(u => u.is_active).length
    const inactive = adminUsers.filter(u => !u.is_active).length

    const byRole = adminUsers.reduce((acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1
      return acc
    }, {} as Record<string, number>)

    return {
      total: adminUsers.length,
      active,
      pending: 0,
      inactive,
      byRole: {
        admin: byRole.admin || 0,
        manager: byRole.manager || 0,
        technician: byRole.technician || 0,
        user: byRole.user || 0,
      },
    }
  }, [adminUsers])

  // Filter users based on search
  const filteredUsers = useMemo(() => {
    if (!searchQuery) return adminUsers

    const query = searchQuery.toLowerCase()
    return adminUsers.filter(user =>
      user.full_name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      user.role.toLowerCase().includes(query)
    )
  }, [adminUsers, searchQuery])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'inactive': return <XCircle className="w-5 h-5 text-gray-500" />;
      case 'pending': return <Clock className="w-5 h-5 text-orange-500" />;
      default: return <XCircle className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'success';
      case 'inactive': return 'default';
      case 'pending': return 'warning';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
          <p className="text-gray-600 mt-1">Manage user accounts and permissions</p>
        </div>
        <Button variant="primary">
          <UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Users</p>
                {usersLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                ) : (
                  <p className="text-3xl font-bold text-gray-900">{userStats.total}</p>
                )}
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                {usersLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                ) : (
                  <p className="text-3xl font-bold text-green-600">{userStats.active}</p>
                )}
              </div>
              <CheckCircle className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending Invites</p>
                {usersLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                ) : (
                  <p className="text-3xl font-bold text-orange-600">{userStats.pending}</p>
                )}
              </div>
              <Clock className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-gray-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Inactive Users</p>
                {usersLoading ? (
                  <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
                ) : (
                  <p className="text-3xl font-bold text-gray-600">{userStats.inactive}</p>
                )}
              </div>
              <XCircle className="w-8 h-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Distribution */}
      <Card>
        <CardHeader>
          <CardTitle>Users by Role</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-orange-50 border border-orange-200">
              <Shield className="w-8 h-8 mx-auto mb-2 text-orange-500" />
              <p className="font-semibold text-gray-900">Admin</p>
              <p className="text-2xl font-bold text-orange-600">{userStats.byRole.admin}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-blue-50 border border-blue-200">
              <Shield className="w-8 h-8 mx-auto mb-2 text-blue-500" />
              <p className="font-semibold text-gray-900">Manager</p>
              <p className="text-2xl font-bold text-blue-600">{userStats.byRole.manager}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-green-50 border border-green-200">
              <Shield className="w-8 h-8 mx-auto mb-2 text-green-500" />
              <p className="font-semibold text-gray-900">Technician</p>
              <p className="text-2xl font-bold text-green-600">{userStats.byRole.technician}</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-purple-50 border border-purple-200">
              <Shield className="w-8 h-8 mx-auto mb-2 text-purple-500" />
              <p className="font-semibold text-gray-900">User</p>
              <p className="text-2xl font-bold text-purple-600">{userStats.byRole.user}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>All Users</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 text-sm"
                />
              </div>
              <Button variant="outline" size="sm">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button variant="outline" size="sm">Export</Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {usersLoading ? (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-gray-400" />
              <p className="text-gray-600">Loading users...</p>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium">
                {searchQuery ? 'No users found' : 'No users yet'}
              </p>
              <p className="text-sm mt-2">
                {searchQuery ? 'Try a different search query' : 'Add your first user to get started'}
              </p>
              {!searchQuery && (
                <Button variant="primary" className="mt-4">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add Your First User
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredUsers.map((user) => {
                const status = user.is_active ? 'active' : 'inactive'
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:shadow-md transition"
                  >
                    <div className="flex items-start space-x-4 flex-1">
                      {getStatusIcon(status)}
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-gray-900">{user.full_name}</h3>
                          <Badge variant="primary" size="sm">
                            {user.role}
                          </Badge>
                          {user.is_staff && (
                            <Badge variant="outline" size="sm">
                              Staff
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <span className="flex items-center">
                            <Mail className="w-3 h-3 mr-1" />
                            {user.email}
                          </span>
                          <span className="flex items-center">
                            <Calendar className="w-3 h-3 mr-1" />
                            Joined {new Date(user.date_joined).toLocaleDateString()}
                          </span>
                          {user.last_login && (
                            <span className="flex items-center">
                              <Clock className="w-3 h-3 mr-1" />
                              Last: {new Date(user.last_login).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant={getStatusBadgeVariant(status) as any}>
                        {status}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
