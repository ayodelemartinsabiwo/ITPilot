'use client'

import { useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Laptop,
  Ticket,
  Clock,
  CheckCircle2,
  TrendingUp,
  TrendingDown,
  Users,
  Activity,
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge, StatusBadge } from '@/components/ui/Badge'
import { dashboardAPI } from '@/lib/api'
import { formatRelativeTime } from '@/lib/utils'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'

export default function DashboardPage() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: async () => {
      const response = await dashboardAPI.getStats()
      return response.data
    },
  })

  const { data: activity, isLoading: activityLoading } = useQuery({
    queryKey: ['dashboard-activity'],
    queryFn: async () => {
      const response = await dashboardAPI.getRecentActivity()
      return response.data
    },
  })

  const { data: chartData, isLoading: chartLoading } = useQuery({
    queryKey: ['dashboard-charts'],
    queryFn: async () => {
      const response = await dashboardAPI.getChartData('tickets', '7d')
      return response.data
    },
  })

  const statCards = [
    {
      title: 'Total Devices',
      value: stats?.totalDevices || 0,
      change: '+12%',
      trend: 'up',
      icon: Laptop,
      color: 'orange',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-500',
    },
    {
      title: 'Open Tickets',
      value: stats?.openTickets || 0,
      change: '-8%',
      trend: 'down',
      icon: Ticket,
      color: 'blue',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-500',
    },
    {
      title: 'Avg. Response Time',
      value: `${stats?.avgResponseTime || 0}m`,
      change: '-15%',
      trend: 'down',
      icon: Clock,
      color: 'green',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-500',
    },
    {
      title: 'Satisfaction Rate',
      value: `${stats?.satisfactionRate || 0}%`,
      change: '+5%',
      trend: 'up',
      icon: CheckCircle2,
      color: 'purple',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-500',
    },
  ]

  const mockChartData = [
    { name: 'Mon', tickets: 12, devices: 45, resolved: 8 },
    { name: 'Tue', tickets: 19, devices: 48, resolved: 15 },
    { name: 'Wed', tickets: 15, devices: 52, resolved: 12 },
    { name: 'Thu', tickets: 22, devices: 50, resolved: 18 },
    { name: 'Fri', tickets: 18, devices: 55, resolved: 16 },
    { name: 'Sat', tickets: 8, devices: 48, resolved: 7 },
    { name: 'Sun', tickets: 6, devices: 46, resolved: 5 },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Welcome back! Here's what's happening with your IT infrastructure.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => {
          const Icon = stat.icon
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 ${stat.iconColor}`} />
                    </div>
                    <Badge
                      variant={stat.trend === 'up' ? 'success' : 'info'}
                      className="gap-1"
                    >
                      <TrendIcon className="w-3 h-3" />
                      {stat.change}
                    </Badge>
                  </div>
                  <h3 className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </h3>
                  <p className="text-3xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={mockChartData}>
                <defs>
                  <linearGradient id="colorTickets" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="tickets"
                  stroke="#f97316"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorTickets)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Device Status */}
        <Card>
          <CardHeader>
            <CardTitle>Device Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="devices" fill="#f97316" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activityLoading ? (
              <div className="text-center py-8 text-gray-500">Loading...</div>
            ) : activity && activity.length > 0 ? (
              activity.slice(0, 5).map((item: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                    <Activity className="w-5 h-5 text-orange-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.description}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      {formatRelativeTime(item.timestamp)}
                    </p>
                    {item.status && (
                      <StatusBadge status={item.status} size="sm" className="mt-1" />
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500">
                No recent activity
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
