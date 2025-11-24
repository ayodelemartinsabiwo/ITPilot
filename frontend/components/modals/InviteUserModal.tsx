'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, UserPlus, Loader2, Mail } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { usersAPI } from '@/lib/api'
import { toast } from 'sonner'

interface InviteUserModalProps {
  isOpen: boolean
  onClose: () => void
}

export function InviteUserModal({ isOpen, onClose }: InviteUserModalProps) {
  const [formData, setFormData] = useState({
    email: '',
    role: 'USER',
    first_name: '',
    last_name: '',
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const queryClient = useQueryClient()

  const inviteUserMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const response = await usersAPI.inviteUser(data)
      return response.data
    },
    onSuccess: () => {
      toast.success('User invitation sent successfully!')
      queryClient.invalidateQueries({ queryKey: ['users'] })
      onClose()
      setFormData({
        email: '',
        role: 'USER',
        first_name: '',
        last_name: '',
      })
      setErrors({})
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Failed to send invitation'
      toast.error(errorMessage)

      // Handle field-specific errors
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors)
      }
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.first_name) {
      newErrors.first_name = 'First name is required'
    }

    if (!formData.last_name) {
      newErrors.last_name = 'Last name is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors({})
    inviteUserMutation.mutate(formData)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })

    // Clear error for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: '',
      })
    }
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
                    <UserPlus className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Invite User</h2>
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
                <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex gap-2">
                    <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-blue-900">
                      An invitation email will be sent to the user with instructions to join your organization.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      label="First Name"
                      name="first_name"
                      placeholder="John"
                      value={formData.first_name}
                      onChange={handleChange}
                      required
                      error={errors.first_name}
                    />
                  </div>

                  <div>
                    <Input
                      label="Last Name"
                      name="last_name"
                      placeholder="Doe"
                      value={formData.last_name}
                      onChange={handleChange}
                      required
                      error={errors.last_name}
                    />
                  </div>
                </div>

                <div>
                  <Input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="john@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    error={errors.email}
                    helperText="The user will receive an invitation at this email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="USER">User</option>
                    <option value="TECHNICIAN">Technician</option>
                    <option value="ADMIN">Admin</option>
                  </select>
                  <p className="text-xs text-gray-500 mt-1">
                    Select the role and permissions for this user
                  </p>
                </div>

                {/* Role Descriptions */}
                <div className="space-y-2 p-4 bg-gray-50 rounded-lg text-sm">
                  <div>
                    <span className="font-medium text-gray-900">User:</span>
                    <span className="text-gray-600"> Can view and create tickets</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Technician:</span>
                    <span className="text-gray-600"> Can manage tickets and devices</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-900">Admin:</span>
                    <span className="text-gray-600"> Full access to all features</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="flex-1"
                    disabled={inviteUserMutation.isPending}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={inviteUserMutation.isPending}
                  >
                    {inviteUserMutation.isPending ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Send Invitation
                      </>
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
