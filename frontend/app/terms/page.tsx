'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { FileText } from 'lucide-react'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedBackground } from '@/components/AnimatedBackground'

export default function TermsPage() {
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
              <FileText className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              Terms of Service
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
              <h2>1. Agreement to Terms</h2>
              <p>
                By accessing and using ITPilot ("Service," "Platform," "we," "us," or "our"), you agree to be bound
                by these Terms of Service ("Terms"). If you do not agree to these Terms, you may not access or use
                the Service.
              </p>

              <h2>2. Description of Service</h2>
              <p>
                ITPilot is an AI-powered IT support platform that provides:
              </p>
              <ul>
                <li>Intelligent chatbot for IT support</li>
                <li>Device monitoring and management</li>
                <li>Ticket management system</li>
                <li>Remote access capabilities</li>
                <li>Real-time notifications and alerts</li>
                <li>Analytics and reporting tools</li>
              </ul>

              <h2>3. Eligibility</h2>
              <p>
                You must be at least 18 years old and have the legal capacity to enter into contracts to use the Service.
                By using the Service, you represent and warrant that you meet these requirements.
              </p>

              <h2>4. Account Registration</h2>
              <h3>4.1 Account Creation</h3>
              <ul>
                <li>You must provide accurate, current, and complete information during registration</li>
                <li>You are responsible for maintaining the confidentiality of your account credentials</li>
                <li>You are responsible for all activities that occur under your account</li>
                <li>You must notify us immediately of any unauthorized use of your account</li>
              </ul>

              <h3>4.2 Account Termination</h3>
              <p>
                We reserve the right to suspend or terminate your account if you violate these Terms or engage in
                fraudulent, abusive, or illegal activities.
              </p>

              <h2>5. Acceptable Use Policy</h2>
              <h3>You agree NOT to:</h3>
              <ul>
                <li>Use the Service for any illegal purpose or in violation of any laws</li>
                <li>Attempt to gain unauthorized access to our systems or other user accounts</li>
                <li>Interfere with or disrupt the Service or servers</li>
                <li>Upload malware, viruses, or malicious code</li>
                <li>Harass, abuse, or harm other users</li>
                <li>Use the Service to send spam or unsolicited communications</li>
                <li>Scrape, crawl, or reverse engineer the Service</li>
                <li>Resell or redistribute the Service without authorization</li>
                <li>Remove or modify any proprietary notices or labels</li>
              </ul>

              <h2>6. Subscription and Payment</h2>
              <h3>6.1 Pricing and Plans</h3>
              <p>
                We offer multiple subscription plans as described on our <Link href="/pricing" className="text-orange-500 hover:underline">Pricing page</Link>.
                Prices are subject to change with 30 days' notice for existing subscribers.
              </p>

              <h3>6.2 Billing</h3>
              <ul>
                <li>Subscriptions are billed in advance on a monthly or annual basis</li>
                <li>Payment is due at the start of each billing period</li>
                <li>We accept major credit cards and other payment methods as displayed</li>
                <li>All fees are non-refundable except as required by law or stated in our refund policy</li>
              </ul>

              <h3>6.3 Free Trial</h3>
              <p>
                We offer a 14-day free trial for new customers. No credit card is required to start the trial.
                After the trial period, you must subscribe to continue using the Service.
              </p>

              <h3>6.4 Refund Policy</h3>
              <p>
                We offer a 30-day money-back guarantee for new subscriptions. Contact support within 30 days of your
                initial purchase for a full refund. This does not apply to renewals.
              </p>

              <h2>7. Data and Privacy</h2>
              <h3>7.1 Your Data</h3>
              <ul>
                <li>You retain all rights to your data and content uploaded to the Service</li>
                <li>You grant us a license to use your data solely to provide and improve the Service</li>
                <li>We will not sell your data to third parties</li>
              </ul>

              <h3>7.2 Privacy</h3>
              <p>
                Our collection and use of personal information is governed by our{' '}
                <Link href="/privacy" className="text-orange-500 hover:underline">Privacy Policy</Link>, which is
                incorporated into these Terms by reference.
              </p>

              <h3>7.3 Security</h3>
              <p>
                We implement industry-standard security measures to protect your data. However, no method of
                transmission or storage is 100% secure. You use the Service at your own risk.
              </p>

              <h2>8. Intellectual Property</h2>
              <h3>8.1 Our Intellectual Property</h3>
              <p>
                The Service, including all content, features, functionality, software, and design, is owned by
                ITPilot and is protected by copyright, trademark, and other intellectual property laws.
              </p>

              <h3>8.2 Limited License</h3>
              <p>
                We grant you a limited, non-exclusive, non-transferable, revocable license to access and use the
                Service for your internal business purposes in accordance with these Terms.
              </p>

              <h3>8.3 Feedback</h3>
              <p>
                If you provide feedback, suggestions, or ideas about the Service, we may use them without any
                obligation to compensate you.
              </p>

              <h2>9. Third-Party Services</h2>
              <p>
                The Service may integrate with third-party services (e.g., Microsoft 365, Google Workspace, Slack).
                Your use of these services is governed by their respective terms and conditions. We are not
                responsible for third-party services.
              </p>

              <h2>10. Service Level Agreement (SLA)</h2>
              <h3>10.1 Uptime Guarantee</h3>
              <ul>
                <li><strong>Professional & Enterprise Plans:</strong> 99.5% uptime guarantee</li>
                <li><strong>Downtime Credits:</strong> Service credits for uptime below 99.5%</li>
                <li><strong>Exclusions:</strong> Scheduled maintenance, force majeure events, issues caused by user actions</li>
              </ul>

              <h3>10.2 Support</h3>
              <ul>
                <li><strong>Starter:</strong> Email support (response within 48 hours)</li>
                <li><strong>Professional:</strong> Priority support (response within 8 hours)</li>
                <li><strong>Enterprise:</strong> 24/7 priority support (response within 2 hours)</li>
              </ul>

              <h2>11. Disclaimers and Limitation of Liability</h2>
              <h3>11.1 Disclaimers</h3>
              <p className="uppercase">
                The service is provided "as is" and "as available" without warranties of any kind, either express
                or implied. We disclaim all warranties, including merchantability, fitness for a particular purpose,
                and non-infringement.
              </p>

              <h3>11.2 Limitation of Liability</h3>
              <p className="uppercase">
                To the maximum extent permitted by law, ITPilot shall not be liable for any indirect, incidental,
                special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred
                directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from:
              </p>
              <ul>
                <li>Your use or inability to use the Service</li>
                <li>Any unauthorized access to or use of our servers and/or any personal information stored therein</li>
                <li>Any interruption or cessation of transmission to or from the Service</li>
                <li>Any bugs, viruses, or the like that may be transmitted through the Service by any third party</li>
              </ul>

              <h2>12. Indemnification</h2>
              <p>
                You agree to indemnify, defend, and hold harmless ITPilot and its officers, directors, employees,
                and agents from any claims, liabilities, damages, losses, and expenses arising out of or related to
                your use of the Service or violation of these Terms.
              </p>

              <h2>13. Termination</h2>
              <h3>13.1 Termination by You</h3>
              <p>
                You may cancel your subscription at any time through your account settings. Cancellation takes effect
                at the end of your current billing period.
              </p>

              <h3>13.2 Termination by Us</h3>
              <p>
                We may suspend or terminate your access immediately, without prior notice, for any reason, including
                violation of these Terms.
              </p>

              <h3>13.3 Effect of Termination</h3>
              <ul>
                <li>You will lose access to the Service and your data</li>
                <li>We will delete your data within 90 days of termination (except as required by law)</li>
                <li>You may request a data export before termination</li>
              </ul>

              <h2>14. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify you of material changes by
                email or through the Service. Continued use after changes constitutes acceptance of the updated Terms.
              </p>

              <h2>15. Governing Law and Dispute Resolution</h2>
              <h3>15.1 Governing Law</h3>
              <p>
                These Terms are governed by the laws of the State of California, United States, without regard to
                conflict of law principles.
              </p>

              <h3>15.2 Dispute Resolution</h3>
              <p>
                Any disputes arising from these Terms or the Service will be resolved through binding arbitration in
                accordance with the American Arbitration Association rules, except that either party may seek
                injunctive relief in court.
              </p>

              <h2>16. General Provisions</h2>
              <h3>16.1 Entire Agreement</h3>
              <p>
                These Terms, together with our Privacy Policy and any other agreements referenced herein, constitute
                the entire agreement between you and ITPilot regarding the Service.
              </p>

              <h3>16.2 Severability</h3>
              <p>
                If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions
                will remain in full force and effect.
              </p>

              <h3>16.3 No Waiver</h3>
              <p>
                Our failure to enforce any right or provision of these Terms will not constitute a waiver of such
                right or provision.
              </p>

              <h3>16.4 Assignment</h3>
              <p>
                You may not assign or transfer these Terms without our prior written consent. We may assign these
                Terms without restriction.
              </p>

              <h2>17. Contact Information</h2>
              <p>If you have questions about these Terms, please contact us:</p>
              <ul>
                <li><strong>Email:</strong> <a href="mailto:legal@itpilot.com">legal@itpilot.com</a></li>
                <li><strong>Support:</strong> <a href="mailto:support@itpilot.com">support@itpilot.com</a></li>
                <li><strong>Mail:</strong> ITPilot, Inc., 123 Tech Street, San Francisco, CA 94102, USA</li>
              </ul>

              <div className="bg-orange-50 border border-orange-200 rounded-lg p-6 mt-12">
                <h3 className="text-xl font-bold text-black mb-3">Related Documents</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/privacy" className="text-orange-600 hover:underline">Privacy Policy</Link>
                  </li>
                  <li>
                    <Link href="/gdpr" className="text-orange-600 hover:underline">GDPR Compliance</Link>
                  </li>
                  <li>
                    <Link href="/cookies" className="text-orange-600 hover:underline">Cookie Policy</Link>
                  </li>
                  <li>
                    <Link href="/pricing" className="text-orange-600 hover:underline">Pricing and Plans</Link>
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
