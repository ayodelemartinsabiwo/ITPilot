'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield, Lock, Eye, Download, Trash2, FileText, CheckCircle2, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedBackground } from '@/components/AnimatedBackground'

const gdprPrinciples = [
  {
    icon: Lock,
    title: 'Lawfulness, Fairness, and Transparency',
    description: 'We process your data lawfully, fairly, and in a transparent manner. You always know what data we collect and why.',
  },
  {
    icon: Shield,
    title: 'Purpose Limitation',
    description: 'We collect data for specific, explicit, and legitimate purposes and don\'t process it further in incompatible ways.',
  },
  {
    icon: FileText,
    title: 'Data Minimization',
    description: 'We only collect data that is adequate, relevant, and limited to what is necessary for our purposes.',
  },
  {
    icon: CheckCircle2,
    title: 'Accuracy',
    description: 'We take reasonable steps to ensure personal data is accurate and kept up to date.',
  },
  {
    icon: Trash2,
    title: 'Storage Limitation',
    description: 'We don\'t keep personal data longer than necessary for the purposes for which it is processed.',
  },
  {
    icon: Eye,
    title: 'Integrity and Confidentiality',
    description: 'We process data securely with appropriate technical and organizational measures.',
  },
]

const yourRights = [
  {
    title: 'Right to Access',
    description: 'You have the right to request copies of your personal data.',
    icon: FileText,
  },
  {
    title: 'Right to Rectification',
    description: 'You have the right to request correction of inaccurate personal data.',
    icon: CheckCircle2,
  },
  {
    title: 'Right to Erasure',
    description: 'You have the right to request deletion of your personal data ("right to be forgotten").',
    icon: Trash2,
  },
  {
    title: 'Right to Restrict Processing',
    description: 'You have the right to request restriction of processing your personal data.',
    icon: AlertCircle,
  },
  {
    title: 'Right to Data Portability',
    description: 'You have the right to request transfer of your data to another organization.',
    icon: Download,
  },
  {
    title: 'Right to Object',
    description: 'You have the right to object to processing of your personal data.',
    icon: Shield,
  },
]

const dataWeCollect = [
  {
    category: 'Account Information',
    items: ['Name, email address, phone number', 'Company name and role', 'Password (encrypted)'],
  },
  {
    category: 'Device Information',
    items: ['Device name, model, and operating system', 'Hardware specifications', 'Software inventory', 'Performance metrics'],
  },
  {
    category: 'Usage Data',
    items: ['Support ticket history', 'Chat conversations with AI assistant', 'Login history and session data', 'Feature usage analytics'],
  },
  {
    category: 'Payment Information',
    items: ['Billing address', 'Payment method (via secure processors)', 'Transaction history'],
  },
]

export default function GDPRPage() {
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
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-8 mx-auto shadow-orange">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              GDPR Compliance
            </h1>
            <p className="text-xl text-gray-300">
              Your privacy is our priority. Learn how ITPilot complies with the General Data Protection Regulation.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
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
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mb-12">
                <h3 className="text-2xl font-bold text-black mb-4">
                  Our Commitment to GDPR
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  ITPilot is fully committed to complying with the General Data Protection Regulation (GDPR)
                  and protecting the privacy rights of all individuals in the European Union. We have implemented
                  comprehensive technical and organizational measures to ensure your data is processed lawfully,
                  fairly, and transparently.
                </p>
              </div>

              <div className="space-y-6 text-gray-700 leading-relaxed">
                <h2 className="text-3xl font-bold text-black mb-6">What is GDPR?</h2>
                <p>
                  The General Data Protection Regulation (GDPR) is a comprehensive data protection law that came
                  into effect on May 25, 2018. It applies to all organizations that process personal data of
                  individuals in the EU, regardless of where the organization is located.
                </p>
                <p>
                  GDPR gives individuals greater control over their personal data and requires organizations
                  to be transparent about how they collect, use, and protect this information.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* GDPR Principles */}
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
              GDPR Principles We Follow
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our data processing adheres to all six GDPR principles
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gdprPrinciples.map((principle, index) => (
              <motion.div
                key={principle.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-8 h-full hover:shadow-orange transition-all duration-300 hover:-translate-y-1">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-6 shadow-orange">
                    <principle.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold text-black mb-3">
                    {principle.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {principle.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Your Rights */}
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
              Your Data Rights
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Under GDPR, you have the following rights regarding your personal data
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {yourRights.map((right, index) => (
              <motion.div
                key={right.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-6 h-full hover:shadow-orange transition-all duration-300">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-10 h-10 rounded-lg bg-orange-100 flex items-center justify-center">
                        <right.icon className="w-5 h-5 text-orange-600" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-black mb-2">
                        {right.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {right.description}
                      </p>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 text-center"
          >
            <p className="text-gray-700 mb-6">
              To exercise any of these rights, please contact our Data Protection Officer
            </p>
            <Link href="/contact">
              <Button size="lg">
                Contact DPO
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Data We Collect */}
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
              Data We Collect
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Transparency about what data we collect and why
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {dataWeCollect.map((data, index) => (
              <motion.div
                key={data.category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="p-8 h-full hover:shadow-orange transition-all duration-300">
                  <h3 className="text-xl font-semibold text-black mb-4">
                    {data.category}
                  </h3>
                  <ul className="space-y-3">
                    {data.items.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-orange-500 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Measures */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-black mb-8 text-center">
                How We Protect Your Data
              </h2>

              <Card className="p-8 mb-8">
                <h3 className="text-2xl font-semibold text-black mb-6">
                  Technical Measures
                </h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>AES-256 Encryption:</strong> All data is encrypted at rest and in transit</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Regular Security Audits:</strong> Third-party penetration testing and vulnerability assessments</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Access Controls:</strong> Role-based access control (RBAC) and principle of least privilege</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Audit Logging:</strong> Comprehensive logging of all data access and modifications</span>
                  </li>
                </ul>
              </Card>

              <Card className="p-8">
                <h3 className="text-2xl font-semibold text-black mb-6">
                  Organizational Measures
                </h3>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Data Protection Officer:</strong> Dedicated DPO overseeing GDPR compliance</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Employee Training:</strong> Regular GDPR and security awareness training</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Data Processing Agreements:</strong> Contracts with all third-party processors</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Incident Response Plan:</strong> Documented procedures for data breach notification</span>
                  </li>
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* International Transfers */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-black mb-8 text-center">
                International Data Transfers
              </h2>

              <Card className="p-8">
                <p className="text-gray-700 leading-relaxed mb-6">
                  ITPilot uses servers located in multiple regions to ensure optimal performance and reliability.
                  When we transfer data outside the European Economic Area (EEA), we ensure appropriate safeguards
                  are in place:
                </p>
                <ul className="space-y-4 text-gray-700">
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Standard Contractual Clauses (SCCs):</strong> EU-approved data transfer agreements</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Data Localization:</strong> Option to store data exclusively in EU data centers</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Privacy Shield Successor:</strong> Compliance with updated data transfer frameworks</span>
                  </li>
                </ul>
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
              Questions About GDPR?
            </h2>
            <p className="text-xl text-orange-100 mb-10">
              Our Data Protection Officer is here to help. Contact us for more information.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white text-orange-600 hover:bg-gray-50 border-0"
                >
                  Contact DPO
                </Button>
              </Link>
              <Link href="/privacy">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10"
                >
                  View Privacy Policy
                </Button>
              </Link>
            </div>
            <p className="text-sm text-orange-100 mt-8">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
