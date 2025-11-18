'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Users, Target, Heart, Lightbulb, Award, Globe } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const values = [
  {
    icon: Heart,
    title: 'Empathy First',
    description: 'We understand the frustration of IT issues and design solutions that truly help.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'Leveraging AI and automation to solve problems in novel, efficient ways.',
  },
  {
    icon: Users,
    title: 'User-Centric',
    description: 'Every feature is built with end-users and IT teams in mind.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'Committed to delivering the highest quality service and support.',
  },
]

const milestones = [
  { year: 'Nov 2025', title: 'Platform Launch', description: 'ITPilot goes live with core AI-powered IT support features' },
  { year: 'Dec 2025', title: 'Beta Testing', description: 'Onboard first 20 beta teams and gather feedback' },
  { year: 'Q1 2026', title: 'Public Release', description: 'Official launch with refined features and first 100 customers' },
  { year: 'Q2 2026', title: 'AI Enhancement', description: 'Advanced NLP, predictive analytics, and automation workflows' },
  { year: 'Q3-Q4 2026', title: 'Enterprise Ready', description: 'SOC 2 certification, global infrastructure, reaching 500+ teams' },
  { year: '2027', title: 'Global Impact', description: 'Achieving 5,000+ teams milestone across 25+ countries' },
]

export default function AboutPage() {
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
              Transforming IT Support,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-orange-600">
                One Team at a Time
              </span>
            </h1>
            <p className="text-xl text-gray-300">
              Built by IT professionals who've experienced the pain firsthand
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="prose prose-lg max-w-none"
            >
              <h2 className="text-4xl font-bold text-black mb-8">Our Story</h2>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                <p className="text-xl text-gray-800">
                  It was 3 AM when Dele received yet another urgent call. As the sole IT technician
                  for a growing company, he was drowning in support tickets, struggling to keep track
                  of 200+ devices, and spending more time on password resets than actual problem-solving.
                </p>

                <p>
                  Dele's story isn't unique. Across organizations worldwide, IT teams are overwhelmed.
                  They're expected to be available 24/7, manage an ever-growing fleet of devices,
                  respond to hundreds of tickets, and somehow still find time for strategic projects.
                </p>

                <p>
                  <strong>We founded ITPilot in 2025 because we've been there.</strong> Our founding team consists
                  of former IT managers, system administrators, help desk technicians, experienced marketers with
                  vast understanding of consumer needs, and AI agents experts who saw the transformative potential
                  of artificial intelligence. We know the frustration of outdated ticketing systems, the anxiety of
                  devices failing without warning, and the exhaustion of answering the same questions repeatedly.
                </p>

                <p>
                  In 2025, as AI technology reached new heights, we asked ourselves: <em>"What if AI could handle
                  the repetitive tasks? What if devices could tell us when they're about to fail? What if IT teams
                  could focus on innovation instead of firefighting?"</em> The AI revolution made this vision not
                  just possible, but necessary.
                </p>

                <p>
                  That vision became ITPilot—an AI-powered platform that doesn't just automate IT support,
                  it transforms it. We built the tool we wish we'd had during those long, frustrating nights,
                  leveraging the latest advances in natural language processing, machine learning, and predictive
                  analytics.
                </p>

                <p className="text-xl text-gray-800 font-semibold">
                  From our launch in 2025, ITPilot aspires to serve over 5,000 IT teams across 25+ countries
                  by 2027. Dele? He will soon sleep through the night. His AI assistant will handle routine
                  requests, his dashboards will show device health at a glance, and he'll finally have time
                  to work on the infrastructure improvements he's been planning for years.
                </p>

                <p>
                  We're not just building software—we're giving IT professionals their time, sanity, and
                  passion for technology back. Join us in this AI-powered revolution.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
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
              Our Values
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we build
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-8 h-full text-center hover:shadow-orange transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-6 mx-auto shadow-orange">
                    <value.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-3">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {value.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Milestones Timeline */}
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
              Our Roadmap to 2027
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Building the future of AI-powered IT support, one milestone at a time
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-6"
                >
                  <div className="flex-shrink-0">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-orange">
                      <span className="text-white font-bold text-sm">
                        {milestone.year}
                      </span>
                    </div>
                  </div>
                  <Card className="flex-grow p-6 hover:shadow-orange transition-all duration-300">
                    <h3 className="text-xl font-semibold text-black mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-gray-600">
                      {milestone.description}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
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
              ITPilot by the Numbers
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              What we envision before 2027 — Be part of it
            </p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
              className="text-center"
            >
              <div className="text-5xl font-bold text-orange-500 mb-2">5,000+</div>
              <div className="text-gray-600">Active Teams</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="text-center"
            >
              <div className="text-5xl font-bold text-orange-500 mb-2">25+</div>
              <div className="text-gray-600">Countries</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-center"
            >
              <div className="text-5xl font-bold text-orange-500 mb-2">1M+</div>
              <div className="text-gray-600">Tickets Resolved</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="text-center"
            >
              <div className="text-5xl font-bold text-orange-500 mb-2">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
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
              Join the IT Revolution
            </h2>
            <p className="text-xl text-orange-100 mb-10">
              Be part of the movement transforming how IT teams work. Start your free trial today.
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
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  Contact Us
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
