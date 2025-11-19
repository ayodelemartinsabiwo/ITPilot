'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Laptop, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { devicesAPI } from '@/lib/api'
import { toast } from 'sonner'

interface AddDeviceModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddDeviceModal({ isOpen, onClose }: AddDeviceModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    type: 'DESKTOP',
    ip_address: '',
    mac_address: '',
    os: '',
    description: '',
  })

  const queryClient = useQueryClient()

  const createDeviceMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await devicesAPI.create(data)
      return response.data
    },
    onSuccess: () => {
      toast.success('Device added successfully!')
      queryClient.invalidateQueries({ queryKey: ['devices'] })
      onClose()
      setFormData({
        name: '',
        type: 'DESKTOP',
        ip_address: '',
        mac_address: '',
        os: '',
        description: '',
      })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add device')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    createDeviceMutation.mutate(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          >
            {/* Modal */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center">
                    <Laptop className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Add New Device</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <Input
                  label="Device Name"
                  name="name"
                  placeholder="e.g., Office Laptop #1"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Device Type
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="DESKTOP">Desktop</option>
                    <option value="LAPTOP">Laptop</option>
                    <option value="SERVER">Server</option>
                    <option value="MOBILE">Mobile Device</option>
                    <option value="TABLET">Tablet</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                <Input
                  label="IP Address"
                  name="ip_address"
                  placeholder="e.g., 192.168.1.100"
                  value={formData.ip_address}
                  onChange={handleChange}
                />

                <Input
                  label="MAC Address (Optional)"
                  name="mac_address"
                  placeholder="e.g., 00:1B:44:11:3A:B7"
                  value={formData.mac_address}
                  onChange={handleChange}
                />

                <Input
                  label="Operating System"
                  name="os"
                  placeholder="e.g., Windows 11, macOS, Ubuntu"
                  value={formData.os}
                  onChange={handleChange}
                />

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (Optional)
                  </label>
                  <textarea
                    name="description"
                    placeholder="Additional details about this device..."
                    value={formData.description}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                    disabled={createDeviceMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={createDeviceMutation.isPending}
                  >
                    {createDeviceMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      'Add Device'
                    )}
                  </Button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
