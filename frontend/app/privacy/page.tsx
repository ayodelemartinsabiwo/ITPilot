'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Shield } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

export default function PrivacyPage() {
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
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-8 mx-auto shadow-orange">
              <Shield className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-gray-300">
              Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2>Introduction</h2>
              <p>
                ITPilot ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains
                how we collect, use, disclose, and safeguard your information when you use our IT support platform and services.
              </p>
              <p>
                Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy,
                please do not access the platform.
              </p>

              <h2>Information We Collect</h2>

              <h3>Personal Information</h3>
              <p>We collect information that you provide directly to us, including:</p>
              <ul>
                <li><strong>Account Information:</strong> Name, email address, phone number, company name, and password</li>
                <li><strong>Profile Information:</strong> Job title, department, and profile photo</li>
                <li><strong>Payment Information:</strong> Billing address and payment details (processed securely by third-party payment processors)</li>
                <li><strong>Communications:</strong> Information you provide when contacting support or communicating with us</li>
              </ul>

              <h3>Device and Usage Information</h3>
              <p>When you use our platform, we automatically collect:</p>
              <ul>
                <li><strong>Device Information:</strong> Hardware model, operating system, unique device identifiers, IP address</li>
                <li><strong>Performance Data:</strong> CPU usage, memory usage, disk space, network statistics</li>
                <li><strong>Usage Data:</strong> Pages visited, features used, time spent, click patterns</li>
                <li><strong>Log Data:</strong> System logs, error reports, and diagnostic information</li>
              </ul>

              <h3>Ticket and Support Information</h3>
              <ul>
                <li>Support ticket content and attachments</li>
                <li>Chat conversations with our AI assistant</li>
                <li>Remote session recordings (when explicitly authorized)</li>
              </ul>

              <h2>How We Use Your Information</h2>
              <p>We use the collected information for the following purposes:</p>
              <ul>
                <li><strong>Service Delivery:</strong> To provide, maintain, and improve our IT support services</li>
                <li><strong>Device Monitoring:</strong> To monitor device health and provide proactive support</li>
                <li><strong>AI Assistant:</strong> To train and improve our AI chatbot responses</li>
                <li><strong>Analytics:</strong> To understand usage patterns and optimize our platform</li>
                <li><strong>Communication:</strong> To send service updates, security alerts, and support messages</li>
                <li><strong>Billing:</strong> To process payments and maintain billing records</li>
                <li><strong>Security:</strong> To detect, prevent, and address security issues and fraudulent activity</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
              </ul>

              <h2>Data Sharing and Disclosure</h2>

              <h3>We Share Your Information With:</h3>
              <ul>
                <li><strong>Service Providers:</strong> Third-party vendors who perform services on our behalf (cloud hosting, payment processing, analytics)</li>
                <li><strong>Your Organization:</strong> Information is accessible to administrators and authorized users within your organization</li>
                <li><strong>Legal Requirements:</strong> When required by law, court order, or governmental request</li>
                <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or sale of assets</li>
              </ul>

              <h3>We Do NOT:</h3>
              <ul>
                <li>Sell your personal information to third parties</li>
                <li>Share your data for marketing purposes without explicit consent</li>
                <li>Use your data to train AI models that benefit other organizations</li>
              </ul>

              <h2>Data Security</h2>
              <p>We implement industry-standard security measures to protect your information:</p>
              <ul>
                <li><strong>Encryption:</strong> AES-256 encryption for data at rest and TLS 1.3 for data in transit</li>
                <li><strong>Access Controls:</strong> Role-based access control (RBAC) and multi-factor authentication (MFA)</li>
                <li><strong>Infrastructure:</strong> Secure cloud infrastructure with regular security audits</li>
                <li><strong>Monitoring:</strong> 24/7 security monitoring and intrusion detection</li>
                <li><strong>Compliance:</strong> SOC 2 Type II, ISO 27001, GDPR, and HIPAA compliance</li>
              </ul>

              <h2>Data Retention</h2>
              <p>We retain your information for as long as necessary to provide services and fulfill the purposes outlined in this policy:</p>
              <ul>
                <li><strong>Account Data:</strong> Retained while your account is active and up to 90 days after deletion</li>
                <li><strong>Ticket History:</strong> Retained for 7 years for support quality and legal compliance</li>
                <li><strong>Device Metrics:</strong> Aggregated metrics retained indefinitely; detailed logs retained for 90 days</li>
                <li><strong>Audit Logs:</strong> Retained for 7 years for security and compliance purposes</li>
              </ul>

              <h2>Your Rights and Choices</h2>
              <p>Depending on your location, you may have certain rights regarding your personal information:</p>
              <ul>
                <li><strong>Access:</strong> Request a copy of your personal information</li>
                <li><strong>Correction:</strong> Update or correct inaccurate information</li>
                <li><strong>Deletion:</strong> Request deletion of your personal information</li>
                <li><strong>Restriction:</strong> Request limitation of processing</li>
                <li><strong>Portability:</strong> Receive your data in a portable format</li>
                <li><strong>Objection:</strong> Object to certain types of processing</li>
                <li><strong>Opt-out:</strong> Unsubscribe from marketing communications</li>
              </ul>
              <p>
                To exercise these rights, please contact our Data Protection Officer at <a href="mailto:privacy@itpilot.com">privacy@itpilot.com</a>.
              </p>

              <h2>Cookies and Tracking Technologies</h2>
              <p>We use cookies and similar tracking technologies to:</p>
              <ul>
                <li>Maintain your session and keep you logged in</li>
                <li>Remember your preferences and settings</li>
                <li>Analyze usage patterns and improve our services</li>
                <li>Provide personalized content and recommendations</li>
              </ul>
              <p>
                You can control cookies through your browser settings. However, disabling cookies may limit your ability to use certain features.
                For more information, see our <Link href="/cookies" className="text-orange-500 hover:underline">Cookie Policy</Link>.
              </p>

              <h2>International Data Transfers</h2>
              <p>
                Your information may be transferred to and processed in countries other than your country of residence.
                We ensure appropriate safeguards are in place, including Standard Contractual Clauses (SCCs) and
                adequacy decisions by relevant authorities.
              </p>

              <h2>Children's Privacy</h2>
              <p>
                Our services are not directed to children under 16. We do not knowingly collect personal information
                from children. If you believe we have collected information from a child, please contact us immediately.
              </p>

              <h2>Changes to This Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of material changes by posting
                the new policy on this page and updating the "Last updated" date. Continued use of our services after
                changes constitutes acceptance of the updated policy.
              </p>

              <h2>Contact Us</h2>
              <p>If you have questions or concerns about this Privacy Policy, please contact us:</p>
              <ul>
                <li><strong>Email:</strong> <a href="mailto:privacy@itpilot.com">privacy@itpilot.com</a></li>
                <li><strong>Data Protection Officer:</strong> <a href="mailto:dpo@itpilot.com">dpo@itpilot.com</a></li>
                <li><strong>Mail:</strong> ITPilot, Inc., 123 Tech Street, San Francisco, CA 94102, USA</li>
              </ul>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mt-12">
                <h3 className="text-xl font-bold text-black mb-3">Related Resources</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/gdpr" className="text-orange-600 hover:underline">GDPR Compliance Information</Link>
                  </li>
                  <li>
                    <Link href="/terms" className="text-orange-600 hover:underline">Terms of Service</Link>
                  </li>
                  <li>
                    <Link href="/cookies" className="text-orange-600 hover:underline">Cookie Policy</Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-orange-600 hover:underline">Contact Us</Link>
                  </li>
                </ul>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
