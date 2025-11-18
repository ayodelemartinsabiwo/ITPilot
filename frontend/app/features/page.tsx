'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Bot, Shield, Zap, BarChart3, Clock, Users,
  MessageSquare, Monitor, Ticket, Server, Bell, CreditCard,
  Lock, Cloud, Smartphone, Workflow, Database, Radio
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedBackground } from '@/components/AnimatedBackground'

const coreFeatures = [
  {
    icon: Bot,
    title: 'AI-Powered Chatbot',
    description: 'Natural language processing that understands IT issues in context',
    features: [
      'Multi-language support (English, French, Spanish, German, Chinese)',
      'Contextual understanding with conversation history',
      'Automated ticket creation from chat interactions',
      'Real-time escalation to human technicians',
      'Knowledge base integration with instant answers',
      'Sentiment analysis for priority detection'
    ]
  },
  {
    icon: Monitor,
    title: 'Device Management',
    description: 'Comprehensive device monitoring and management across your entire infrastructure',
    features: [
      'Real-time hardware metrics (CPU, RAM, disk, network)',
      'Automated software inventory and updates',
      'Remote configuration management',
      'Device health monitoring with predictive alerts',
      'Multi-platform support (Windows, macOS, Linux, mobile)',
      'Asset lifecycle tracking'
    ]
  },
  {
    icon: Ticket,
    title: 'Intelligent Ticketing',
    description: 'Smart ticket management that learns from your organization',
    features: [
      'Auto-categorization using machine learning',
      'Priority-based routing and assignment',
      'SLA tracking and enforcement',
      'Custom workflows and approval chains',
      'Email integration for ticket creation',
      'Bulk operations for efficiency'
    ]
  },
  {
    icon: Server,
    title: 'Remote Access',
    description: 'Secure remote support with enterprise-grade encryption',
    features: [
      'One-click remote desktop access',
      'SSH/RDP integration for server management',
      'Session recording for audit compliance',
      'File transfer with virus scanning',
      'Multi-monitor support',
      'Unattended access for critical systems'
    ]
  },
  {
    icon: Bell,
    title: 'Real-Time Notifications',
    description: 'Stay informed with intelligent multi-channel alerts',
    features: [
      'Push notifications for mobile and desktop',
      'Email and SMS alerts for critical issues',
      'Slack/Teams integration',
      'Customizable notification rules',
      'Digest summaries for non-urgent items',
      'Do-not-disturb scheduling'
    ]
  },
  {
    icon: BarChart3,
    title: 'Advanced Analytics',
    description: 'Data-driven insights to optimize IT operations',
    features: [
      'Real-time performance dashboards',
      'MTTR (Mean Time To Resolution) tracking',
      'Technician performance metrics',
      'Cost analysis and budget forecasting',
      'Custom report builder',
      'Export to Excel, PDF, and CSV'
    ]
  }
]

const securityFeatures = [
  {
    icon: Lock,
    title: 'Enterprise Security',
    description: 'Bank-level security for your IT infrastructure'
  },
  {
    icon: Shield,
    title: 'Compliance Ready',
    description: 'GDPR, HIPAA, SOC 2, and ISO 27001 compliant'
  },
  {
    icon: Database,
    title: 'Data Encryption',
    description: 'AES-256 encryption at rest and in transit'
  },
  {
    icon: Radio,
    title: 'Audit Logging',
    description: 'Complete activity tracking for compliance'
  }
]

const integrations = [
  { name: 'Microsoft 365', logo: '🔷' },
  { name: 'Google Workspace', logo: '🔶' },
  { name: 'Slack', logo: '💬' },
  { name: 'Microsoft Teams', logo: '👥' },
  { name: 'Jira', logo: '📋' },
  { name: 'ServiceNow', logo: '🔧' },
  { name: 'Stripe', logo: '💳' },
  { name: 'Paystack', logo: '💰' },
  { name: 'Active Directory', logo: '🔐' },
  { name: 'Okta', logo: '🎫' },
  { name: 'Zapier', logo: '⚡' },
  { name: 'Webhooks', logo: '🔗' }
]

export default function FeaturesPage() {
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
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              Features Built for Modern IT Teams
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Everything you need to deliver exceptional IT support, from AI-powered automation
              to enterprise-grade security.
            </p>
            <Link href="/register">
              <Button size="lg">
                Start Free Trial
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Core Features */}
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
              Comprehensive Feature Set
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful capabilities designed to transform your IT operations
            </p>
          </motion.div>

          <div className="space-y-16">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-8 lg:p-12 hover:shadow-orange transition-all duration-300">
                  <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-orange">
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-black mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-lg text-gray-600 mb-6">
                        {feature.description}
                      </p>
                      <ul className="grid md:grid-cols-2 gap-3">
                        {feature.features.map((item, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <Zap className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                            <span className="text-gray-700">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-black mb-4">
              Enterprise-Grade Security
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your data security and compliance are our top priorities
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {securityFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full text-center hover:shadow-orange transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 mx-auto shadow-orange">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
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
              Seamless Integrations
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Connect with the tools your team already uses
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.name}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="p-6 text-center hover:shadow-orange transition-all duration-300 hover:-translate-y-1">
                  <div className="text-4xl mb-3">{integration.logo}</div>
                  <p className="text-sm font-medium text-gray-700">
                    {integration.name}
                  </p>
                </Card>
              </motion.div>
            ))}
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
              Ready to Experience These Features?
            </h2>
            <p className="text-xl text-orange-100 mb-10">
              Start your free 14-day trial. No credit card required.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-orange-600 hover:bg-gray-50 border-0"
                >
                  Start Free Trial
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  View Pricing
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
