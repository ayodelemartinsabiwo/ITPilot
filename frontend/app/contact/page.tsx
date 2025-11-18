'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, Phone, MapPin, Send, MessageSquare } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedBackground } from '@/components/AnimatedBackground'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  company: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

type ContactFormData = z.infer<typeof contactSchema>

const contactMethods = [
  {
    icon: Mail,
    title: 'Email Us',
    description: 'Our support team is here to help',
    value: 'support@itpilot.com',
  },
  {
    icon: Phone,
    title: 'Call Us',
    description: 'Available during business hours',
    value: '+234 902 507 3903 | +234 813 274 0250',
  },
  {
    icon: MapPin,
    title: 'Visit Us',
    description: 'Come say hello at our office',
    value: '5, Otigba Street, Computer Village, Ikeja, Lagos, Nigeria',
  },
]

export default function ContactPage() {
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  })

  const onSubmit = async (data: ContactFormData) => {
    try {
      setIsLoading(true)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))

      console.log('Contact form submitted:', data)
      toast.success('Message sent successfully! We\'ll get back to you soon.')
      reset()
    } catch (error) {
      console.error('Contact form error:', error)
      toast.error('Failed to send message. Please try again.')
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
        <AnimatedBackground opacity={0.3} showParticles={true} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-300">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Methods */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {contactMethods.map((method, index) => (
              <motion.div
                key={method.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 text-center hover:shadow-orange transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 mx-auto shadow-orange">
                    <method.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-black mb-2">
                    {method.title}
                  </h3>
                  <p className="text-sm text-gray-600 mb-3">
                    {method.description}
                  </p>
                  <p className="text-sm font-medium text-orange-600">
                    {method.value}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-black mb-4">
                Send Us a Message
              </h2>
              <p className="text-xl text-gray-600">
                Fill out the form below and we'll get back to you within 24 hours
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

                  <Input
                    id="company"
                    type="text"
                    label="Company Name (Optional)"
                    placeholder="Your Company"
                    error={errors.company?.message}
                    {...register('company')}
                    disabled={isLoading}
                  />

                  <Input
                    id="subject"
                    type="text"
                    label="Subject"
                    placeholder="How can we help?"
                    error={errors.subject?.message}
                    {...register('subject')}
                    disabled={isLoading}
                    required
                  />

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
                      placeholder="Tell us more about your needs..."
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
                    Send Message
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Quick Links */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold text-black mb-6">
              Looking for something specific?
            </h2>
            <p className="text-gray-600 mb-8">
              You might find what you need in these resources
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <a
                href="/help"
                className="p-6 border border-gray-200 rounded-lg hover:border-orange-500 hover:shadow-orange transition-all duration-300"
              >
                <MessageSquare className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-black mb-2">
                  Help Center
                </h3>
                <p className="text-sm text-gray-600">
                  Browse articles and guides
                </p>
              </a>
              <a
                href="/privacy"
                className="p-6 border border-gray-200 rounded-lg hover:border-orange-500 hover:shadow-orange transition-all duration-300"
              >
                <Mail className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-black mb-2">
                  Privacy Policy
                </h3>
                <p className="text-sm text-gray-600">
                  Learn about data protection
                </p>
              </a>
              <a
                href="/gdpr"
                className="p-6 border border-gray-200 rounded-lg hover:border-orange-500 hover:shadow-orange transition-all duration-300"
              >
                <MessageSquare className="w-8 h-8 text-orange-500 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-black mb-2">
                  GDPR Compliance
                </h3>
                <p className="text-sm text-gray-600">
                  Data protection info
                </p>
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
