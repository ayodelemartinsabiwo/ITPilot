'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Laptop,
  Search,
  Filter,
  Plus,
  MoreVertical,
  Edit,
  Trash2,
  Activity,
} from 'lucide-react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { AddDeviceModal } from '@/components/modals/AddDeviceModal'
import { EditDeviceModal } from '@/components/modals/EditDeviceModal'
import { devicesAPI } from '@/lib/api'
import { formatRelativeTime } from '@/lib/utils'
import { toast } from 'sonner'

export default function DevicesPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [deviceToEdit, setDeviceToEdit] = useState<any>(null)
  const [deviceToDelete, setDeviceToDelete] = useState<any>(null)
  const queryClient = useQueryClient()

  const { data: devicesData, isLoading } = useQuery({
    queryKey: ['devices', searchQuery, statusFilter],
    queryFn: async () => {
      const params: any = {}
      if (searchQuery) params.search = searchQuery
      if (statusFilter !== 'all') params.status = statusFilter

      const response = await devicesAPI.getAll(params)
      return response.data
    },
  })

  const deleteDeviceMutation = useMutation({
    mutationFn: (deviceId: string) => devicesAPI.delete(deviceId),
    onSuccess: () => {
      toast.success('Device deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['devices'] })
      setDeviceToDelete(null)
    },
    onError: () => {
      toast.error('Failed to delete device')
    },
  })

  const devices = devicesData?.results || []

  const handleEditDevice = (device: any) => {
    setDeviceToEdit(device)
    setShowEditModal(true)
  }

  const handleDeleteDevice = (device: any) => {
    setDeviceToDelete(device)
  }

  const confirmDelete = () => {
    if (deviceToDelete) {
      deleteDeviceMutation.mutate(deviceToDelete.id)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Devices</h1>
          <p className="text-gray-600 mt-2">
            Manage and monitor all your IT devices
          </p>
        </div>
        <Button
          leftIcon={<Plus className="w-5 h-5" />}
          onClick={() => setShowAddModal(true)}
        >
          Add Device
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search devices..."
                leftIcon={<Search className="w-5 h-5" />}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
              >
                <option value="all">All Status</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
                <option value="maintenance">Maintenance</option>
              </select>

              <Button variant="outline" leftIcon={<Filter className="w-5 h-5" />}>
                More Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Devices Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-40 bg-gray-200 rounded-lg" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : devices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.map((device: any, index: number) => (
            <motion.div
              key={device.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.05 }}
            >
              <Card className="hover:shadow-lg transition-all duration-300 cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-orange">
                      <Laptop className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge
                        status={device.status || 'offline'}
                        size="sm"
                      />
                      <button className="p-2 rounded-lg hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {device.name || 'Unknown Device'}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">
                    {device.type || 'Computer'} • {device.ip_address || 'No IP'}
                  </p>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">CPU Usage</span>
                      <span className="font-medium text-gray-900">
                        {device.cpu_usage || 0}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-orange-500 to-orange-600 transition-all duration-300"
                        style={{ width: `${device.cpu_usage || 0}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Memory Usage</span>
                      <span className="font-medium text-gray-900">
                        {device.memory_usage || 0}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300"
                        style={{ width: `${device.memory_usage || 0}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Last seen {formatRelativeTime(device.last_seen || new Date())}
                    </span>
                    <div className="flex gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleEditDevice(device)
                        }}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <Edit className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDeleteDevice(device)
                        }}
                        className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
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
              <Laptop className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No devices found
            </h3>
            <p className="text-gray-600 mb-6">
              Get started by adding your first device
            </p>
            <Button
              leftIcon={<Plus className="w-5 h-5" />}
              onClick={() => setShowAddModal(true)}
            >
              Add Device
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Add Device Modal */}
      <AddDeviceModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {/* Edit Device Modal */}
      {deviceToEdit && (
        <EditDeviceModal
          isOpen={showEditModal}
          onClose={() => {
            setShowEditModal(false)
            setDeviceToEdit(null)
          }}
          device={deviceToEdit}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deviceToDelete && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Delete Device
            </h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{deviceToDelete.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setDeviceToDelete(null)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={confirmDelete}
                className="flex-1"
                disabled={deleteDeviceMutation.isPending}
              >
                {deleteDeviceMutation.isPending ? 'Deleting...' : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
