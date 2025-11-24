'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Mail, Cloud, Users, Briefcase, Settings, CheckCircle, FileText, DollarSign, Loader2 } from 'lucide-react'
import { integrationsAPI } from '@/lib/api'
import { toast } from 'sonner'

export default function ZohoPage() {
  const { data: integrationsData, isLoading } = useQuery({
    queryKey: ['integrations'],
    queryFn: async () => {
      try {
        const response = await integrationsAPI.getAll()
        return response.data
      } catch (error) {
        console.error('Failed to fetch integrations:', error)
        return { results: [] }
      }
    },
  })

  const integrations = integrationsData?.results || []
  const hasAnyIntegration = integrations.length > 0

  const handleAddIntegration = () => {
    toast.info('Integration configuration coming soon!')
  }
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Zoho & Other Cloud Services</h1>
          <p className="text-gray-600 mt-1">Manage integrations with Zoho and other cloud platforms</p>
        </div>
        <Button variant="primary" onClick={handleAddIntegration}>
          <Settings className="w-4 h-4 mr-2" />
          Add Integration
        </Button>
      </div>

      {/* Active Integrations */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Integrations</p>
                <p className="text-3xl font-bold text-gray-900">
                  {isLoading ? '...' : integrations.length}
                </p>
              </div>
              <Cloud className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Connected Users</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <Users className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Synced Records</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <FileText className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-orange-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Licenses</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <CheckCircle className="w-8 h-8 text-orange-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Zoho Services */}
      <Card>
        <CardHeader>
          <CardTitle>Zoho Services</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-gray-200 hover:border-orange-300 transition">
              <div className="flex items-center gap-3 mb-3">
                <Briefcase className="w-8 h-8 text-blue-500" />
                <h3 className="font-semibold">Zoho CRM</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Customer relationship management</p>
              <Badge className="bg-gray-200 text-gray-700">Not Connected</Badge>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 hover:border-orange-300 transition">
              <div className="flex items-center gap-3 mb-3">
                <Mail className="w-8 h-8 text-red-500" />
                <h3 className="font-semibold">Zoho Mail</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Business email service</p>
              <Badge className="bg-gray-200 text-gray-700">Not Connected</Badge>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 hover:border-orange-300 transition">
              <div className="flex items-center gap-3 mb-3">
                <FileText className="w-8 h-8 text-green-500" />
                <h3 className="font-semibold">Zoho Docs</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Document management</p>
              <Badge className="bg-gray-200 text-gray-700">Not Connected</Badge>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 hover:border-orange-300 transition">
              <div className="flex items-center gap-3 mb-3">
                <Users className="w-8 h-8 text-purple-500" />
                <h3 className="font-semibold">Zoho People</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">HR management system</p>
              <Badge className="bg-gray-200 text-gray-700">Not Connected</Badge>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 hover:border-orange-300 transition">
              <div className="flex items-center gap-3 mb-3">
                <DollarSign className="w-8 h-8 text-yellow-500" />
                <h3 className="font-semibold">Zoho Books</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Accounting and finance</p>
              <Badge className="bg-gray-200 text-gray-700">Not Connected</Badge>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 hover:border-orange-300 transition">
              <div className="flex items-center gap-3 mb-3">
                <Briefcase className="w-8 h-8 text-orange-500" />
                <h3 className="font-semibold">Zoho Desk</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Customer support platform</p>
              <Badge className="bg-gray-200 text-gray-700">Not Connected</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other Cloud Services */}
      <Card>
        <CardHeader>
          <CardTitle>Other Cloud Platforms</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-gray-200 hover:border-orange-300 transition">
              <div className="flex items-center gap-3 mb-3">
                <Cloud className="w-8 h-8 text-blue-500" />
                <h3 className="font-semibold">Salesforce</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">CRM and cloud computing</p>
              <Badge className="bg-gray-200 text-gray-700">Not Connected</Badge>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 hover:border-orange-300 transition">
              <div className="flex items-center gap-3 mb-3">
                <Cloud className="w-8 h-8 text-purple-500" />
                <h3 className="font-semibold">Slack</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Team collaboration platform</p>
              <Badge className="bg-gray-200 text-gray-700">Not Connected</Badge>
            </div>

            <div className="p-4 rounded-lg border border-gray-200 hover:border-orange-300 transition">
              <div className="flex items-center gap-3 mb-3">
                <Cloud className="w-8 h-8 text-green-500" />
                <h3 className="font-semibold">Dropbox</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">Cloud storage and file sync</p>
              <Badge className="bg-gray-200 text-gray-700">Not Connected</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Integration Activity</CardTitle>
            <Badge className="bg-blue-500">0 Events</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="text-center py-12 text-gray-500">
            <Cloud className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <p className="text-lg font-medium">No integrations configured</p>
            <p className="text-sm mt-2">
              {hasAnyIntegration
                ? 'Integration activity will appear here once available'
                : 'Add your first cloud service integration to get started'}
            </p>
            <Button variant="primary" className="mt-4" onClick={handleAddIntegration}>
              <Settings className="w-4 h-4 mr-2" />
              Add Integration
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
