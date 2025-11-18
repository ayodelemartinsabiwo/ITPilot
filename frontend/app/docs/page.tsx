'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Book, ArrowRight, Rocket, Settings, MessageSquare, Monitor, Ticket, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedBackground } from '@/components/AnimatedBackground'

const documentationSections = [
  {
    icon: Rocket,
    title: 'Getting Started',
    description: 'Quick setup guide to get ITPilot running in minutes',
    articles: [
      { title: 'Installation & Setup', href: '/docs/getting-started#install' },
      { title: 'Creating Your Account', href: '/docs/getting-started#account' },
      { title: 'Inviting Team Members', href: '/docs/getting-started#team' },
      { title: 'Basic Configuration', href: '/docs/getting-started#config' },
    ],
  },
  {
    icon: MessageSquare,
    title: 'AI Chatbot',
    description: 'Configure and customize the AI-powered support assistant',
    articles: [
      { title: 'Training the AI', href: '/docs/ai-chatbot#training' },
      { title: 'Custom Responses', href: '/docs/ai-chatbot#responses' },
      { title: 'Language Settings', href: '/docs/ai-chatbot#language' },
      { title: 'Escalation Rules', href: '/docs/ai-chatbot#escalation' },
    ],
  },
  {
    icon: Monitor,
    title: 'Device Management',
    description: 'Monitor and manage devices across your organization',
    articles: [
      { title: 'Adding Devices', href: '/docs/devices#add' },
      { title: 'Device Monitoring', href: '/docs/devices#monitoring' },
      { title: 'Remote Configuration', href: '/docs/devices#config' },
      { title: 'Health Alerts', href: '/docs/devices#alerts' },
    ],
  },
  {
    icon: Ticket,
    title: 'Ticket Management',
    description: 'Streamline your IT support workflow with smart ticketing',
    articles: [
      { title: 'Creating Tickets', href: '/docs/tickets#create' },
      { title: 'Auto-Assignment', href: '/docs/tickets#assignment' },
      { title: 'SLA Management', href: '/docs/tickets#sla' },
      { title: 'Ticket Workflows', href: '/docs/tickets#workflows' },
    ],
  },
  {
    icon: Settings,
    title: 'Integrations',
    description: 'Connect ITPilot with your favorite tools',
    articles: [
      { title: 'Microsoft 365 Setup', href: '/docs/integrations#microsoft' },
      { title: 'Google Workspace', href: '/docs/integrations#google' },
      { title: 'Slack Integration', href: '/docs/integrations#slack' },
      { title: 'Custom Webhooks', href: '/docs/integrations#webhooks' },
    ],
  },
  {
    icon: Shield,
    title: 'Security & Compliance',
    description: 'Best practices for secure IT operations',
    articles: [
      { title: 'Access Control', href: '/docs/security#access' },
      { title: 'Data Encryption', href: '/docs/security#encryption' },
      { title: 'Audit Logging', href: '/docs/security#audit' },
      { title: 'GDPR Compliance', href: '/docs/security#gdpr' },
    ],
  },
]

const quickLinks = [
  { title: 'API Reference', href: '/api-docs', description: 'Integrate ITPilot with your systems' },
  { title: 'Help Center', href: '/help', description: 'Get support from our team' },
  { title: 'Video Tutorials', href: '/docs/videos', description: 'Watch step-by-step guides' },
  { title: 'Release Notes', href: '/docs/changelog', description: 'Latest features and updates' },
]

export default function DocsPage() {
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
            <Book className="w-16 h-16 text-orange-500 mx-auto mb-6" />
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              Documentation
            </h1>
            <p className="text-xl text-gray-300">
              Everything you need to know about using ITPilot effectively
            </p>
          </motion.div>
        </div>
      </section>

      {/* Documentation Sections */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {documentationSections.map((section, index) => (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="p-6 h-full hover:shadow-orange transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 shadow-orange">
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-2">
                    {section.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {section.description}
                  </p>
                  <ul className="space-y-2">
                    {section.articles.map((article, idx) => (
                      <li key={idx}>
                        <Link
                          href={article.href}
                          className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 transition-colors group"
                        >
                          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                          {article.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-black mb-4">
              Additional Resources
            </h2>
            <p className="text-gray-600">
              Explore more ways to learn and get help
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {quickLinks.map((link, index) => (
              <motion.div
                key={link.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link href={link.href}>
                  <Card className="p-6 h-full hover:shadow-orange transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <h3 className="text-lg font-semibold text-black mb-2">
                      {link.title}
                    </h3>
                    <p className="text-sm text-gray-600 mb-3">
                      {link.description}
                    </p>
                    <span className="text-sm text-orange-500 font-medium">
                      Learn more →
                    </span>
                  </Card>
                </Link>
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
              Can't Find What You're Looking For?
            </h2>
            <p className="text-xl text-orange-100 mb-10">
              Our support team is here to help you succeed
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/help">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-orange-600 hover:bg-gray-50 border-0"
                >
                  Contact Support
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Get in Touch
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
