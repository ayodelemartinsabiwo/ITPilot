'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Code, Key, Globe, Lock, Zap, Database } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedBackground } from '@/components/AnimatedBackground'

const apiEndpoints = [
  {
    category: 'Authentication',
    icon: Lock,
    description: 'Secure API authentication and token management',
    endpoints: [
      { method: 'POST', path: '/api/v1/auth/login', description: 'Authenticate and get access token' },
      { method: 'POST', path: '/api/v1/auth/refresh', description: 'Refresh access token' },
      { method: 'POST', path: '/api/v1/auth/logout', description: 'Invalidate session' },
    ],
  },
  {
    category: 'Devices',
    icon: Database,
    description: 'Manage devices and retrieve device information',
    endpoints: [
      { method: 'GET', path: '/api/v1/devices', description: 'List all devices' },
      { method: 'POST', path: '/api/v1/devices', description: 'Register new device' },
      { method: 'GET', path: '/api/v1/devices/{id}', description: 'Get device details' },
      { method: 'PATCH', path: '/api/v1/devices/{id}', description: 'Update device info' },
      { method: 'DELETE', path: '/api/v1/devices/{id}', description: 'Remove device' },
      { method: 'GET', path: '/api/v1/devices/{id}/metrics', description: 'Get device metrics' },
    ],
  },
  {
    category: 'Tickets',
    icon: Zap,
    description: 'Create and manage support tickets',
    endpoints: [
      { method: 'GET', path: '/api/v1/tickets', description: 'List tickets' },
      { method: 'POST', path: '/api/v1/tickets', description: 'Create new ticket' },
      { method: 'GET', path: '/api/v1/tickets/{id}', description: 'Get ticket details' },
      { method: 'PATCH', path: '/api/v1/tickets/{id}', description: 'Update ticket' },
      { method: 'POST', path: '/api/v1/tickets/{id}/comments', description: 'Add comment' },
      { method: 'PUT', path: '/api/v1/tickets/{id}/assign', description: 'Assign ticket' },
    ],
  },
  {
    category: 'Users',
    icon: Globe,
    description: 'User and team management',
    endpoints: [
      { method: 'GET', path: '/api/v1/users', description: 'List organization users' },
      { method: 'POST', path: '/api/v1/users', description: 'Invite new user' },
      { method: 'GET', path: '/api/v1/users/{id}', description: 'Get user details' },
      { method: 'PATCH', path: '/api/v1/users/{id}', description: 'Update user' },
      { method: 'DELETE', path: '/api/v1/users/{id}', description: 'Remove user' },
    ],
  },
]

const features = [
  {
    icon: Key,
    title: 'API Keys',
    description: 'Secure authentication using API keys with role-based permissions',
  },
  {
    icon: Zap,
    title: 'Rate Limiting',
    description: '1000 requests per hour on Pro, unlimited on Enterprise',
  },
  {
    icon: Database,
    title: 'Webhooks',
    description: 'Real-time event notifications for device changes and tickets',
  },
  {
    icon: Globe,
    title: 'RESTful API',
    description: 'Clean, intuitive REST endpoints with JSON responses',
  },
]

const codeExample = `// Initialize ITPilot API Client
const apiKey = 'your_api_key_here';
const baseURL = 'https://api.itpilot.com/v1';

// Create a new ticket
const createTicket = async () => {
  const response = await fetch(\`\${baseURL}/tickets\`, {
    method: 'POST',
    headers: {
      'Authorization': \`Bearer \${apiKey}\`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: 'Network connectivity issue',
      description: 'Users unable to access shared drive',
      priority: 'high',
      deviceId: 'dev_123456',
    }),
  });

  const ticket = await response.json();
  console.log('Ticket created:', ticket.id);
  return ticket;
};

// Get device metrics
const getDeviceMetrics = async (deviceId) => {
  const response = await fetch(
    \`\${baseURL}/devices/\${deviceId}/metrics\`,
    {
      headers: {
        'Authorization': \`Bearer \${apiKey}\`,
      },
    }
  );

  const metrics = await response.json();
  return metrics;
};`

export default function APIDocsPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.1),transparent_50%)]" />
        <AnimatedBackground opacity={0.3} showParticles={true} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <Code className="w-16 h-16 text-orange-500 mx-auto mb-6" />
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              API Reference
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Integrate ITPilot with your existing systems using our RESTful API
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg">
                Get API Key
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                View Docs
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 text-center hover:shadow-orange transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 mx-auto shadow-orange">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* API Endpoints */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-black mb-4">
              API Endpoints
            </h2>
            <p className="text-xl text-gray-600">
              RESTful endpoints for all ITPilot features
            </p>
          </motion.div>

          <div className="space-y-8 max-w-5xl mx-auto">
            {apiEndpoints.map((category, index) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-8 hover:shadow-orange transition-all duration-300">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-orange flex-shrink-0">
                      <category.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-semibold text-black mb-2">
                        {category.category}
                      </h3>
                      <p className="text-gray-600">
                        {category.description}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {category.endpoints.map((endpoint, idx) => (
                      <div
                        key={idx}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span
                          className={`px-3 py-1 rounded font-mono text-xs font-semibold flex-shrink-0 w-fit ${
                            endpoint.method === 'GET'
                              ? 'bg-blue-100 text-blue-700'
                              : endpoint.method === 'POST'
                              ? 'bg-green-100 text-green-700'
                              : endpoint.method === 'PATCH'
                              ? 'bg-yellow-100 text-yellow-700'
                              : endpoint.method === 'PUT'
                              ? 'bg-purple-100 text-purple-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {endpoint.method}
                        </span>
                        <code className="text-sm text-gray-800 font-mono flex-grow">
                          {endpoint.path}
                        </code>
                        <span className="text-sm text-gray-600">
                          {endpoint.description}
                        </span>
                      </div>
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Code Example */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-black mb-4">
                Quick Start Example
              </h2>
              <p className="text-gray-600">
                Get started with ITPilot API in minutes
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-6 bg-gray-900">
                <pre className="text-sm text-gray-300 overflow-x-auto">
                  <code>{codeExample}</code>
                </pre>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-orange-500 to-orange-600">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Build with ITPilot?
            </h2>
            <p className="text-xl text-orange-100 mb-10">
              Get your API key and start integrating today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-orange-600 hover:bg-gray-50 border-0"
                >
                  Get Started Free
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Contact Sales
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
