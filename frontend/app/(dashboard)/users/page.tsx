'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Users as UsersIcon,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Mail,
  Shield,
  UserCheck,
  UserX,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { usersAPI } from '@/lib/api'
import { formatRelativeTime } from '@/lib/utils'
import { useAuthStore } from '@/lib/store'

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const { user: currentUser } = useAuthStore()

  const { data: usersData, isLoading } = useQuery({
    queryKey: ['users', searchQuery, roleFilter],
    queryFn: async () => {
      const params: any = {}
      if (searchQuery) params.search = searchQuery
      if (roleFilter !== 'all') params.role = roleFilter

      const response = await usersAPI.getAll(params)
      return response.data
    },
  })

  const users = usersData?.results || []

  const getRoleBadgeVariant = (role: string) => {
    switch (role.toLowerCase()) {
      case 'superadmin':
      case 'admin':
        return 'danger'
      case 'technician':
        return 'warning'
      case 'user':
      default:
        return 'default'
    }
  }

  // Check if current user is admin
  const isAdmin = currentUser?.role === 'ADMIN' || currentUser?.role === 'SUPERADMIN'

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Card className="max-w-md">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
              <Shield className="w-8 h-8 text-red-500" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Access Denied
            </h3>
            <p className="text-gray-600">
              You need administrator privileges to access this page.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-2">
            Manage team members and permissions
          </p>
        </div>
        <Button leftIcon={<Plus className="w-5 h-5" />}>
          Invite User
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search users..."
                leftIcon={<Search className="w-5 h-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Roles</option>
                <option value="user">Users</option>
                <option value="technician">Technicians</option>
                <option value="admin">Admins</option>
              </select>

              <Button variant="outline" leftIcon={<Filter className="w-5 h-5" />}>
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-32 bg-gray-200 rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : users.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map((user: any, index: number) => (
            <motion.div
              key={user.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white font-medium text-lg shadow-md">
                      {(user.full_name || user.first_name || user.email).charAt(0).toUpperCase()}
                    </div>
                    <div className="flex items-center gap-2">
                      <div title={user.is_active ? 'Active' : 'Inactive'}>
                        {user.is_active ? (
                          <UserCheck className="w-5 h-5 text-green-500" />
                        ) : (
                          <UserX className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                      <button className="p-2 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {user.full_name || `${user.first_name} ${user.last_name}`.trim() || 'No Name'}
                  </h3>

                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                    <Mail className="w-4 h-4" />
                    <span className="truncate">{user.email}</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <Badge variant={getRoleBadgeVariant(user.role)} size="sm">
                      {user.role || 'USER'}
                    </Badge>
                    {user.is_email_verified && (
                      <Badge variant="success" size="sm">
                        Verified
                      </Badge>
                    )}
                  </div>

                  <div className="text-xs text-gray-500 mb-4">
                    Joined {formatRelativeTime(user.created_at || new Date())}
                  </div>

                  <div className="flex gap-2 pt-4 border-t border-gray-100">
                    <button className="flex-1 p-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2 text-sm">
                      <Edit className="w-4 h-4" />
                      Edit
                    </button>
                    <button className="flex-1 p-2 rounded-lg hover:bg-red-50 transition-colors flex items-center justify-center gap-2 text-sm text-red-600">
                      <Trash2 className="w-4 h-4" />
                      Remove
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
              <UsersIcon className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No users found
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by inviting team members
            </p>
            <Button leftIcon={<Plus className="w-5 h-5" />}>
              Invite User
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
