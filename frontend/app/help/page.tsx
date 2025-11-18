'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Search, Book, MessageSquare, Mail, ExternalLink, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const helpSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
  priority: z.enum(['low', 'medium', 'high']),
})

type HelpFormData = z.infer<typeof helpSchema>

const integrationGuides = [
  {
    name: 'Microsoft 365',
    description: 'Setup and troubleshooting guides for Microsoft 365 integration',
    links: [
      { title: 'Microsoft 365 Admin Center', url: 'https://admin.microsoft.com' },
      { title: 'Microsoft Support', url: 'https://support.microsoft.com' },
      { title: 'Azure AD Setup', url: 'https://docs.microsoft.com/en-us/azure/active-directory' },
    ],
  },
  {
    name: 'Google Workspace',
    description: 'Integration guides for Google Workspace services',
    links: [
      { title: 'Google Workspace Admin', url: 'https://admin.google.com' },
      { title: 'Google Workspace Support', url: 'https://support.google.com/a' },
      { title: 'Google API Console', url: 'https://console.developers.google.com' },
    ],
  },
  {
    name: 'Slack',
    description: 'Connect ITPilot with your Slack workspace',
    links: [
      { title: 'Slack API Documentation', url: 'https://api.slack.com' },
      { title: 'Slack App Directory', url: 'https://slack.com/apps' },
      { title: 'Slack Support', url: 'https://slack.com/help' },
    ],
  },
  {
    name: 'Microsoft Teams',
    description: 'Integrate ITPilot with Microsoft Teams',
    links: [
      { title: 'Teams Admin Center', url: 'https://admin.teams.microsoft.com' },
      { title: 'Teams App Development', url: 'https://docs.microsoft.com/en-us/microsoftteams/platform' },
      { title: 'Teams Support', url: 'https://support.microsoft.com/en-us/teams' },
    ],
  },
]

const commonTopics = [
  { title: 'Getting Started with ITPilot', href: '/docs/getting-started' },
  { title: 'Setting Up Device Monitoring', href: '/docs/device-monitoring' },
  { title: 'Configuring AI Chatbot', href: '/docs/ai-chatbot' },
  { title: 'Managing Tickets', href: '/docs/tickets' },
  { title: 'Remote Access Setup', href: '/docs/remote-access' },
  { title: 'User Roles & Permissions', href: '/docs/roles-permissions' },
  { title: 'Billing & Subscriptions', href: '/docs/billing' },
  { title: 'API Integration Guide', href: '/api-docs' },
]

export default function HelpCenterPage() {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<HelpFormData>({
    resolver: zodResolver(helpSchema),
  })

  const onSubmit = async (data: HelpFormData) => {
    try {
      setIsLoading(true)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      console.log('Help request submitted:', data)
      toast.success('Your request has been submitted! We\'ll respond within 24 hours.')
      reset()
    } catch (error) {
      console.error('Help request error:', error)
      toast.error('Failed to submit request. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.1),transparent_50%)]" />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              How Can We Help You?
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Find answers, guides, and get support from our team
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for help articles..."
                className="w-full pl-12 pr-4 py-4 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Common Topics */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-black mb-4">
              Popular Help Topics
            </h2>
            <p className="text-gray-600">Quick access to frequently asked questions</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {commonTopics.map((topic, index) => (
              <motion.div
                key={topic.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Link href={topic.href}>
                  <Card className="p-6 h-full hover:shadow-orange transition-all duration-300 hover:-translate-y-1 cursor-pointer">
                    <div className="flex items-start gap-3">
                      <Book className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                      <p className="text-sm font-medium text-gray-800 hover:text-orange-500 transition-colors">
                        {topic.title}
                      </p>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Integration Guides */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-black mb-4">
              Integration Guides & Resources
            </h2>
            <p className="text-gray-600">
              External documentation for third-party services we integrate with
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {integrationGuides.map((guide, index) => (
              <motion.div
                key={guide.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-orange transition-all duration-300">
                  <h3 className="text-xl font-semibold text-black mb-2">
                    {guide.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {guide.description}
                  </p>
                  <ul className="space-y-2">
                    {guide.links.map((link, idx) => (
                      <li key={idx}>
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-orange-600 hover:text-orange-700 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          {link.title}
                        </a>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Request Form */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <MessageSquare className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-3xl font-bold text-black mb-4">
                Submit a Help Request
              </h2>
              <p className="text-gray-600">
                Can't find what you're looking for? Send us a detailed message and we'll assist you.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <Card className="p-8">
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      id="name"
                      type="text"
                      label="Full Name"
                      placeholder="John Doe"
                      error={errors.name?.message}
                      {...register('name')}
                      disabled={isLoading}
                      required
                    />

                    <Input
                      id="email"
                      type="email"
                      label="Email Address"
                      placeholder="you@example.com"
                      leftIcon={<Mail className="w-5 h-5" />}
                      error={errors.email?.message}
                      {...register('email')}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      id="subject"
                      type="text"
                      label="Subject"
                      placeholder="Brief description of your issue"
                      error={errors.subject?.message}
                      {...register('subject')}
                      disabled={isLoading}
                      required
                    />

                    <div>
                      <label
                        htmlFor="priority"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Priority <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="priority"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        {...register('priority')}
                        disabled={isLoading}
                        required
                      >
                        <option value="low">Low - General inquiry</option>
                        <option value="medium">Medium - Issue affecting work</option>
                        <option value="high">High - Critical issue</option>
                      </select>
                      {errors.priority && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.priority.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      placeholder="Describe your issue in detail. Include steps to reproduce if applicable."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                      {...register('message')}
                      disabled={isLoading}
                      required
                    />
                    {errors.message && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    isLoading={isLoading}
                  >
                    <Send className="w-5 h-5 mr-2" />
                    Submit Request
                  </Button>
                </form>

                <p className="mt-6 text-sm text-gray-600 text-center">
                  We typically respond within 24 hours during business days.
                  For urgent issues, please call us at{' '}
                  <a href="tel:+2349025073903" className="text-orange-500 hover:underline">
                    +234 902 507 3903
                  </a>
                </p>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
