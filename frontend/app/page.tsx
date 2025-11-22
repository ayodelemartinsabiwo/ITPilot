'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Bot, Shield, Zap, BarChart3, Clock, Users, Monitor, Mail, Activity, Settings, Lock, CheckCircle, Download } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedBackground } from '@/components/AnimatedBackground'

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Support',
    description: 'Intelligent chatbot that understands IT issues and provides instant solutions.',
  },
  {
    icon: Shield,
    title: 'Device Management',
    description: 'Comprehensive device tracking, monitoring, and management in one place.',
  },
  {
    icon: Zap,
    title: 'Fast Resolution',
    description: 'Automated ticket routing and prioritization for quick problem resolution.',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Insights',
    description: 'Real-time dashboards and reports to track IT performance metrics.',
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Round-the-clock AI support ensures your team is never left waiting.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Seamless collaboration tools for IT teams to work together efficiently.',
  },
]

const stats = [
  { label: 'Tickets Resolved', value: '10K+' },
  { label: 'Active Users', value: '5K+' },
  { label: 'Response Time', value: '<2min' },
  { label: 'Satisfaction', value: '98%' },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black pt-20 pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(249,115,22,0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(249,115,22,0.1),transparent_50%)]" />
        <AnimatedBackground opacity={0.5} />

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 mb-8"
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered IT Support Platform</span>
            </motion.div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              Transform Your IT Support with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                ITPilot
              </span>
            </h1>

            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed">
              Streamline your IT operations with intelligent automation, real-time device monitoring,
              and AI-powered support that works 24/7.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="group">
                  Get Started Free
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline">
                  Sign In
                </Button>
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-20 max-w-4xl mx-auto"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl lg:text-4xl font-bold text-orange-500 mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Main Headline Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="text-4xl mb-4">🚀</div>
            <h2 className="text-4xl sm:text-5xl font-bold text-black mb-6">
              Your All-In-One IT Support App — Fast, Easy, Affordable
            </h2>
            <p className="text-2xl font-semibold text-orange-600 mb-6">
              Stop Struggling With Tech Problems. Get Instant Help.
            </p>
            <p className="text-lg text-gray-700 mb-8 leading-relaxed">
              Whether it's your laptop, office computers, internet, software, or devices acting up — our IT Support App fixes issues fast.
            </p>
            <div className="space-y-2 mb-10 text-lg text-gray-700">
              <p>✓ No IT knowledge needed.</p>
              <p>✓ No waiting for technicians.</p>
              <p>✓ Just tap, connect, and get help instantly.</p>
            </div>
            <Link href="/register">
              <Button size="lg" className="group">
                Start Your Free Trial Today
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Thousands Trust Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-black mb-4">
              Why Thousands Trust Our IT Support App
            </h2>
            <p className="text-xl text-gray-600">
              We make IT support simple, affordable, and always available — for homes, small teams, and growing businesses.
            </p>
          </motion.div>

          {/* What You Get */}
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="mb-12"
            >
              <h3 className="text-3xl font-bold text-black mb-10 text-center">What You Get</h3>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Card className="p-8 h-full hover:shadow-orange transition-all duration-300">
                  <div className="text-4xl mb-4">🖥</div>
                  <h4 className="text-2xl font-semibold text-black mb-3">Instant Remote Fixes</h4>
                  <p className="text-gray-600 leading-relaxed">
                    A technician connects to your device and solves the problem immediately — just like they're sitting with you.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="p-8 h-full hover:shadow-orange transition-all duration-300">
                  <div className="text-4xl mb-4">📩</div>
                  <h4 className="text-2xl font-semibold text-black mb-3">Easy Helpdesk for Any Problem</h4>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Computer slow? Printer not working? Can't connect to the internet?
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Just open a ticket. We handle the rest.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="p-8 h-full hover:shadow-orange transition-all duration-300">
                  <div className="text-4xl mb-4">📊</div>
                  <h4 className="text-2xl font-semibold text-black mb-3">Keep Your Devices Healthy</h4>
                  <p className="text-gray-600 leading-relaxed">
                    Our app watches your devices 24/7 and warns you before problems happen — so you avoid downtime, data loss, or expensive repairs.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="p-8 h-full hover:shadow-orange transition-all duration-300">
                  <div className="text-4xl mb-4">⚡</div>
                  <h4 className="text-2xl font-semibold text-black mb-3">Save Time With Automation</h4>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Updates, maintenance, cleanups — done automatically in the background.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Your devices stay fast and secure.
                  </p>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="md:col-span-2"
              >
                <Card className="p-8 hover:shadow-orange transition-all duration-300">
                  <div className="text-4xl mb-4">🛡</div>
                  <h4 className="text-2xl font-semibold text-black mb-3">Strong Protection</h4>
                  <p className="text-gray-600 leading-relaxed mb-2">
                    Everything is encrypted and secure. Your data stays safe.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Only you and your technician can access your device.
                  </p>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Perfect For Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h3 className="text-3xl font-bold text-black mb-8 text-center">Perfect For:</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="flex items-start gap-3"
              >
                <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-700">Individuals who want stress-free tech support</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="flex items-start gap-3"
              >
                <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-700">Small businesses that can't afford a full IT team</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="flex items-start gap-3"
              >
                <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-700">Freelancers and remote workers</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex items-start gap-3"
              >
                <CheckCircle className="w-6 h-6 text-orange-500 flex-shrink-0 mt-1" />
                <p className="text-lg text-gray-700">Shops, schools, churches, offices — anyone who uses computers</p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h3 className="text-3xl font-bold text-black mb-12">How It Works</h3>
            <div className="grid md:grid-cols-3 gap-8 mb-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                  1
                </div>
                <h4 className="text-xl font-semibold text-black mb-2">Sign Up</h4>
                <p className="text-gray-600">Create your account in seconds</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="relative"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                  2
                </div>
                <h4 className="text-xl font-semibold text-black mb-2">Install the App</h4>
                <p className="text-gray-600">Download via browser search by clicking the app download icon</p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                  3
                </div>
                <h4 className="text-xl font-semibold text-black mb-2">Get IT Support</h4>
                <p className="text-gray-600">Access help anytime you need it</p>
              </motion.div>
            </div>
            <p className="text-lg text-gray-700 font-medium">Simple. Fast. No complications.</p>
          </motion.div>
        </div>
      </section>

      {/* Pricing Teaser Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h3 className="text-3xl font-bold text-black mb-6">Pricing That Makes Sense</h3>
            <p className="text-xl text-gray-600 mb-8">
              Get professional IT support without paying for a full technician.
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-orange-50 rounded-lg p-6"
              >
                <p className="text-lg font-semibold text-orange-600">⭐ Home users</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-orange-50 rounded-lg p-6"
              >
                <p className="text-lg font-semibold text-orange-600">⭐ Small teams</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-orange-50 rounded-lg p-6"
              >
                <p className="text-lg font-semibold text-orange-600">⭐ Growing businesses</p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="bg-orange-50 rounded-lg p-6"
              >
                <p className="text-lg font-semibold text-orange-600">⭐ IT service providers</p>
              </motion.div>
            </div>
            <p className="text-gray-600 mb-8">Affordable monthly pricing. Cancel anytime.</p>
            <Link href="/pricing">
              <Button size="lg">
                See Plans
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Pre-CTA Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-black text-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold mb-6">Don't Wait Until Something Breaks</h2>
            <p className="text-xl text-gray-300 mb-10">
              Enjoy peace of mind knowing your devices are always monitored, protected, and supported.
            </p>
            <div className="space-y-4">
              <p className="text-2xl font-semibold text-orange-400">Try It Free — No Credit Card Required</p>
              <Link href="/register">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white">
                  Get Started Now
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-black mb-4">
              Everything You Need for IT Excellence
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to make IT support seamless and efficient
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-8 h-full hover:shadow-orange transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-6 shadow-orange">
                    <feature.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center mt-12"
          >
            <Link href="/features">
              <Button size="lg" variant="outline">
                View All Features
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section Preview */}
      <section id="pricing" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-black mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Choose the plan that fits your team. Start with a 14-day free trial.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-8 text-center hover:shadow-orange transition-all duration-300">
                <h3 className="text-2xl font-bold text-black mb-2">Starter</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-black">₦35k</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6">Perfect for small teams</p>
                <Link href="/pricing">
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </Link>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="p-8 text-center border-2 border-orange-500 shadow-orange">
                <div className="bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full inline-block mb-4">
                  MOST POPULAR
                </div>
                <h3 className="text-2xl font-bold text-black mb-2">Professional</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-black">₦120k</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6">For growing teams</p>
                <Link href="/pricing">
                  <Button className="w-full">
                    Learn More
                  </Button>
                </Link>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="p-8 text-center hover:shadow-orange transition-all duration-300">
                <h3 className="text-2xl font-bold text-black mb-2">Enterprise</h3>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-black">₦360k</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-gray-600 mb-6">For large organizations</p>
                <Link href="/pricing">
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </Link>
              </Card>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="text-center mt-12"
          >
            <Link href="/pricing">
              <Button size="lg" variant="outline">
                View All Plans
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-orange-500 to-orange-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your IT Support?
            </h2>
            <p className="text-xl text-orange-100 mb-10">
              Join thousands of teams already using ITPilot to deliver exceptional IT support.
            </p>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-orange-600 hover:bg-gray-50 border-0"
              >
                Start Your Free Trial
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
