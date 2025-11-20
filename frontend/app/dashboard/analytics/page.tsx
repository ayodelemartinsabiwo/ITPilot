'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  Laptop,
  Ticket,
  Clock,
  CheckCircle2,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FeatureGate } from '@/components/FeatureGate'
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

function AnalyticsContent() {
  const [timeRange, setTimeRange] = useState('7d')

  // Mock data for charts
  const performanceData = [
    { date: '19 Nov', tickets: 12, devices: 45, responseTime: 2.3 },
    { date: '20 Nov', tickets: 19, devices: 48, responseTime: 1.8 },
    { date: '21 Nov', tickets: 15, devices: 52, responseTime: 2.1 },
    { date: '22 Nov', tickets: 22, devices: 50, responseTime: 1.5 },
    { date: '23 Nov', tickets: 18, devices: 55, responseTime: 1.9 },
    { date: '24 Nov', tickets: 25, devices: 53, responseTime: 1.6 },
    { date: '25 Nov', tickets: 20, devices: 57, responseTime: 1.4 },
  ]

  const ticketsByPriority = [
    { name: 'Critical', value: 5, color: '#ef4444' },
    { name: 'High', value: 12, color: '#f97316' },
    { name: 'Medium', value: 28, color: '#eab308' },
    { name: 'Low', value: 15, color: '#3b82f6' },
  ]

  const deviceHealth = [
    { status: 'Healthy', count: 42, percentage: 74 },
    { status: 'Warning', count: 10, percentage: 18 },
    { status: 'Critical', count: 5, percentage: 8 },
  ]

  const resolutionTime = [
    { category: '< 1 hour', count: 25 },
    { category: '1-4 hours', count: 35 },
    { category: '4-8 hours', count: 20 },
    { category: '> 8 hours', count: 10 },
  ]

  const stats = [
    {
      title: 'Avg Response Time',
      value: '1.8h',
      change: '-12%',
      trend: 'down',
      icon: Clock,
      color: 'green',
    },
    {
      title: 'Resolution Rate',
      value: '94%',
      change: '+5%',
      trend: 'up',
      icon: CheckCircle2,
      color: 'green',
    },
    {
      title: 'Active Users',
      value: '234',
      change: '+18%',
      trend: 'up',
      icon: Users,
      color: 'blue',
    },
    {
      title: 'System Uptime',
      value: '99.9%',
      change: '+0.1%',
      trend: 'up',
      icon: Activity,
      color: 'orange',
    },
  ]

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600 mt-2">
            Insights and performance metrics
          </p>
        </div>

        {/* Time Range Filter */}
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="90d">Last 90 Days</option>
        </select>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          const isPositive = stat.trend === 'up' && stat.color === 'green'
          const isNegative = stat.trend === 'up' && stat.color === 'red'

          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-12 h-12 rounded-lg bg-${stat.color}-50 flex items-center justify-center`}>
                      <Icon className={`w-6 h-6 text-${stat.color}-500`} />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${
                      isPositive ? 'text-green-600' : isNegative ? 'text-red-600' : 'text-gray-600'
                    }`}>
                      {stat.trend === 'up' ? (
                        <TrendingUp className="w-4 h-4" />
                      ) : (
                        <TrendingDown className="w-4 h-4" />
                      )}
                      {stat.change}
                    </div>
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

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Performance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={performanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="date" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="tickets"
                  stroke="#f97316"
                  strokeWidth={2}
                  name="Tickets"
                />
                <Line
                  type="monotone"
                  dataKey="devices"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  name="Devices"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Tickets by Priority */}
        <Card>
          <CardHeader>
            <CardTitle>Tickets by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ticketsByPriority}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ticketsByPriority.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Device Health Status */}
        <Card>
          <CardHeader>
            <CardTitle>Device Health Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {deviceHealth.map((item, index) => (
                <div key={item.status}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">{item.status}</span>
                    <span className="text-sm text-gray-600">{item.count} devices ({item.percentage}%)</span>
                  </div>
                  <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full transition-all ${
                        item.status === 'Healthy'
                          ? 'bg-green-500'
                          : item.status === 'Warning'
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resolution Time Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Resolution Time Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={resolutionTime}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="category" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="count" fill="#f97316" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


export default function AnalyticsPage() {
  return (
    <FeatureGate feature="canAccessAnalytics" featureName="Analytics">
      <AnalyticsContent />
    </FeatureGate>
  )
}
