'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, X, Zap, Building, Rocket, Crown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { AnimatedBackground } from '@/components/AnimatedBackground'
import { cn } from '@/lib/utils'

const plans = [
  {
    name: 'Starter',
    icon: Zap,
    price: { monthly: 35000, annual: 350000 },
    description: 'Perfect for small teams getting started with IT automation',
    features: [
      'Up to 50 devices',
      'AI chatbot (1,000 messages/month)',
      'Basic ticketing system',
      'Email support',
      'Real-time monitoring',
      'Mobile app access',
      '5 GB storage',
      'Basic analytics',
    ],
    limitations: [
      'No remote access',
      'No custom integrations',
      'No SLA guarantees',
      'No dedicated account manager',
    ],
    cta: 'Start Free Trial',
    popular: false,
  },
  {
    name: 'Professional',
    icon: Building,
    price: { monthly: 120000, annual: 1200000 },
    description: 'For growing teams that need advanced features and integrations',
    features: [
      'Up to 500 devices',
      'AI chatbot (10,000 messages/month)',
      'Advanced ticketing with automation',
      'Priority support (24/5)',
      'Real-time monitoring & alerts',
      'Mobile app access',
      'Remote access (RDP/SSH)',
      '50 GB storage',
      'Advanced analytics & reporting',
      'Custom workflows',
      'API access',
      'SSO integration',
      'Slack/Teams integration',
    ],
    limitations: [
      'No white-labeling',
      'No dedicated infrastructure',
    ],
    cta: 'Start Free Trial',
    popular: true,
  },
  {
    name: 'Enterprise',
    icon: Crown,
    price: { monthly: 360000, annual: 3600000 },
    description: 'For large organizations requiring enterprise-grade features',
    features: [
      'Unlimited devices',
      'AI chatbot (unlimited)',
      'Enterprise ticketing suite',
      '24/7 priority support',
      'Real-time monitoring & predictive alerts',
      'Mobile app access',
      'Remote access (RDP/SSH/VNC)',
      'Unlimited storage',
      'Custom analytics & dashboards',
      'Advanced automation & workflows',
      'Full API access',
      'SSO & SAML integration',
      'All integrations included',
      'White-labeling',
      'Dedicated infrastructure',
      '99.9% SLA guarantee',
      'Dedicated account manager',
      'Custom training sessions',
      'GDPR/HIPAA compliance tools',
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false,
  },
  {
    name: 'Custom',
    icon: Rocket,
    price: { monthly: null, annual: null },
    description: 'Tailored solutions for unique enterprise requirements',
    features: [
      'Everything in Enterprise, plus:',
      'Custom feature development',
      'On-premise deployment option',
      'Custom SLA agreements',
      'Dedicated support team',
      'Custom integrations',
      'Multi-region deployment',
      'Advanced security features',
      'Compliance certifications',
      'Custom contract terms',
    ],
    limitations: [],
    cta: 'Contact Sales',
    popular: false,
  },
]

const faqs = [
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards (Visa, Mastercard, American Express), bank transfers, and support multiple payment processors including Stripe, Paystack, and Flutterwave for global coverage.',
  },
  {
    question: 'Can I change plans later?',
    answer: 'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll have immediate access to new features. When downgrading, changes take effect at the start of your next billing cycle.',
  },
  {
    question: 'What happens after my free trial?',
    answer: 'Your 14-day free trial includes full access to all Professional plan features. No credit card required to start. After the trial, you can choose to subscribe or continue with limited free features.',
  },
  {
    question: 'Do you offer refunds?',
    answer: 'Yes, we offer a 30-day money-back guarantee. If you\'re not satisfied within the first 30 days of your paid subscription, contact us for a full refund.',
  },
  {
    question: 'Are there any setup fees?',
    answer: 'No setup fees for Starter and Professional plans. Enterprise plans may include optional onboarding services for large deployments.',
  },
  {
    question: 'What about data security and compliance?',
    answer: 'All plans include AES-256 encryption, SOC 2 Type II compliance, and GDPR compliance. Enterprise plans include additional HIPAA compliance tools and custom security features.',
  },
]

const paymentProcessors = [
  { name: 'Stripe', supported: 'Global' },
  { name: 'Paystack', supported: 'Africa' },
  { name: 'Flutterwave', supported: 'Africa' },
]

export default function PricingPage() {
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annual'>('monthly')

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
              Simple, Transparent Pricing
            </h1>
            <p className="text-xl text-gray-300 mb-8">
              Choose the plan that fits your team. All plans include a 14-day free trial.
            </p>

            {/* Billing Toggle */}
            <div className="inline-flex items-center gap-4 p-2 bg-white/10 backdrop-blur-sm rounded-full">
              <button
                onClick={() => setBillingPeriod('monthly')}
                className={cn(
                  'px-6 py-2 rounded-full text-sm font-medium transition-all',
                  billingPeriod === 'monthly'
                    ? 'bg-orange-500 text-white shadow-orange'
                    : 'text-gray-300 hover:text-white'
                )}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod('annual')}
                className={cn(
                  'px-6 py-2 rounded-full text-sm font-medium transition-all',
                  billingPeriod === 'annual'
                    ? 'bg-orange-500 text-white shadow-orange'
                    : 'text-gray-300 hover:text-white'
                )}
              >
                Annual
                <span className="ml-2 text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                  Save 17%
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative"
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-orange">
                      MOST POPULAR
                    </span>
                  </div>
                )}
                <Card
                  className={cn(
                    'p-8 h-full flex flex-col',
                    plan.popular
                      ? 'border-2 border-orange-500 shadow-orange'
                      : 'hover:shadow-lg transition-all duration-300'
                  )}
                >
                  <div className="flex-grow">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center mb-4 shadow-orange">
                      <plan.icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-bold text-black mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      {plan.description}
                    </p>

                    <div className="mb-6">
                      {plan.price.monthly ? (
                        <>
                          <div className="flex items-baseline gap-1">
                            <span className="text-4xl font-bold text-black">
                              ₦{(billingPeriod === 'monthly' ? plan.price.monthly : Math.floor(plan.price.annual / 12)).toLocaleString()}
                            </span>
                            <span className="text-gray-600">/month</span>
                          </div>
                          {billingPeriod === 'annual' && (
                            <p className="text-sm text-gray-600 mt-1">
                              ₦{plan.price.annual.toLocaleString()} billed annually
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="text-2xl font-bold text-black">
                          Custom Pricing
                        </div>
                      )}
                    </div>

                    <ul className="space-y-3 mb-6">
                      {plan.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Check className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </li>
                      ))}
                      {plan.limitations.map((limitation, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                          <X className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-500">{limitation}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <Link href={plan.cta === 'Contact Sales' ? '/contact' : '/register'}>
                    <Button
                      className="w-full"
                      variant={plan.popular ? 'primary' : 'outline'}
                      size="lg"
                    >
                      {plan.cta}
                    </Button>
                  </Link>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Payment Methods */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h3 className="text-2xl font-bold text-black mb-8">
              Flexible Payment Options
            </h3>
            <div className="flex flex-wrap justify-center items-center gap-8">
              {paymentProcessors.map((processor) => (
                <div key={processor.name} className="text-center">
                  <div className="text-lg font-semibold text-gray-700">
                    {processor.name}
                  </div>
                  <div className="text-sm text-gray-500">{processor.supported}</div>
                </div>
              ))}
            </div>
            <p className="text-gray-600 mt-6">
              All transactions are secured with industry-standard encryption
            </p>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-black mb-12 text-center">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-black mb-3">
                      {faq.question}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
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
              Ready to Get Started?
            </h2>
            <p className="text-xl text-orange-100 mb-10">
              Start your 14-day free trial today. No credit card required.
            </p>
            <Link href="/register">
              <Button
                size="lg"
                variant="outline"
                className="bg-white text-orange-600 hover:bg-gray-50 border-0"
              >
                Start Free Trial
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
