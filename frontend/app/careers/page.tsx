'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { Briefcase, Heart, Lightbulb, Users, Award, Upload, FileText, Mail, Phone, MapPin } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'

const applicationSchema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  position: z.string().min(2, 'Please select a position'),
  experience: z.string().min(1, 'Please select your experience level'),
  linkedIn: z.string().url('Please enter a valid LinkedIn URL').optional().or(z.literal('')),
  portfolio: z.string().url('Please enter a valid portfolio URL').optional().or(z.literal('')),
  coverLetter: z.string().min(50, 'Cover letter must be at least 50 characters'),
})

type ApplicationFormData = z.infer<typeof applicationSchema>

const values = [
  {
    icon: Heart,
    title: 'Empathy First',
    description: 'We understand the challenges IT professionals face and build solutions with genuine care.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We embrace cutting-edge AI and technology to solve problems in novel ways.',
  },
  {
    icon: Users,
    title: 'Collaboration',
    description: 'We believe the best ideas come from diverse teams working together.',
  },
  {
    icon: Award,
    title: 'Excellence',
    description: 'We set high standards and are committed to delivering exceptional quality.',
  },
]

const openPositions = [
  {
    title: 'Senior Full-Stack Engineer',
    department: 'Engineering',
    location: 'Lagos, Nigeria (Hybrid)',
    type: 'Full-time',
  },
  {
    title: 'AI/ML Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'Lagos, Nigeria (Hybrid)',
    type: 'Full-time',
  },
  {
    title: 'Customer Success Manager',
    department: 'Customer Success',
    location: 'Lagos, Nigeria',
    type: 'Full-time',
  },
  {
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Technical Writer',
    department: 'Product',
    location: 'Remote',
    type: 'Contract',
  },
]

const benefits = [
  'Competitive salary and equity compensation',
  'Comprehensive health insurance',
  'Flexible work arrangements (remote/hybrid)',
  'Professional development budget',
  'Latest tools and equipment',
  'Collaborative and inclusive culture',
  'Team building and social events',
  'Generous vacation policy',
]

export default function CareersPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [cvFile, setCvFile] = useState<File | null>(null)
  const [additionalDocs, setAdditionalDocs] = useState<File[]>([])

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
  })

  const handleCvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('CV file size must be less than 5MB')
        return
      }
      setCvFile(file)
      toast.success('CV uploaded successfully')
    }
  }

  const handleAdditionalDocsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    const totalSize = files.reduce((acc, file) => acc + file.size, 0)

    if (totalSize > 10 * 1024 * 1024) {
      toast.error('Total file size must be less than 10MB')
      return
    }

    setAdditionalDocs(files)
    toast.success(`${files.length} file(s) uploaded successfully`)
  }

  const onSubmit = async (data: ApplicationFormData) => {
    if (!cvFile) {
      toast.error('Please upload your CV/Resume')
      return
    }

    try {
      setIsLoading(true)

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      console.log('Application submitted:', { ...data, cvFile, additionalDocs })
      toast.success('Application submitted successfully! We\'ll review and get back to you soon.')
      reset()
      setCvFile(null)
      setAdditionalDocs([])
    } catch (error) {
      console.error('Application error:', error)
      toast.error('Failed to submit application. Please try again.')
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
            <Briefcase className="w-16 h-16 text-orange-500 mx-auto mb-6" />
            <h1 className="text-5xl sm:text-6xl font-bold text-white mb-6">
              Join Our Mission
            </h1>
            <p className="text-xl text-gray-300">
              Help us transform IT support with AI-powered innovation. Build the future with a team that cares.
            </p>
          </motion.div>
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
              What We Stand For
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our values guide everything we do at ITPilot
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
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

      {/* Open Positions */}
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
              Open Positions
            </h2>
            <p className="text-xl text-gray-600">
              Find your place in our growing team
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
            {openPositions.map((position, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
              >
                <Card className="p-6 hover:shadow-orange transition-all duration-300 hover:-translate-y-1">
                  <h3 className="text-xl font-semibold text-black mb-2">
                    {position.title}
                  </h3>
                  <div className="flex flex-wrap gap-3 text-sm text-gray-600 mb-4">
                    <span className="flex items-center gap-1">
                      <Briefcase className="w-4 h-4" />
                      {position.department}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {position.location}
                    </span>
                    <span className="px-2 py-1 bg-orange-100 text-orange-700 rounded-full text-xs font-medium">
                      {position.type}
                    </span>
                  </div>
                  <a href="#apply" className="text-orange-500 hover:text-orange-600 font-medium text-sm">
                    Apply Now →
                  </a>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl font-bold text-black mb-8 text-center">
              Benefits & Perks
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  className="flex items-start gap-3 p-4 bg-white rounded-lg"
                >
                  <div className="w-6 h-6 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <div className="w-2 h-2 rounded-full bg-orange-500" />
                  </div>
                  <p className="text-gray-700">{benefit}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-24 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-12"
            >
              <h2 className="text-4xl font-bold text-black mb-4">
                Submit Your Application
              </h2>
              <p className="text-gray-600">
                We review all applications carefully. We'll reach out if there's a fit.
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
                  {/* Personal Info */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      id="firstName"
                      type="text"
                      label="First Name"
                      placeholder="John"
                      error={errors.firstName?.message}
                      {...register('firstName')}
                      disabled={isLoading}
                      required
                    />

                    <Input
                      id="lastName"
                      type="text"
                      label="Last Name"
                      placeholder="Doe"
                      error={errors.lastName?.message}
                      {...register('lastName')}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
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

                    <Input
                      id="phone"
                      type="tel"
                      label="Phone Number"
                      placeholder="+234 XXX XXX XXXX"
                      leftIcon={<Phone className="w-5 h-5" />}
                      error={errors.phone?.message}
                      {...register('phone')}
                      disabled={isLoading}
                      required
                    />
                  </div>

                  {/* Position & Experience */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="position"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Position <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="position"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        {...register('position')}
                        disabled={isLoading}
                        required
                      >
                        <option value="">Select a position</option>
                        {openPositions.map((pos, idx) => (
                          <option key={idx} value={pos.title}>
                            {pos.title}
                          </option>
                        ))}
                        <option value="other">Other</option>
                      </select>
                      {errors.position && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.position.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label
                        htmlFor="experience"
                        className="block text-sm font-medium text-gray-700 mb-2"
                      >
                        Experience Level <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="experience"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                        {...register('experience')}
                        disabled={isLoading}
                        required
                      >
                        <option value="">Select experience level</option>
                        <option value="entry">Entry Level (0-2 years)</option>
                        <option value="mid">Mid Level (3-5 years)</option>
                        <option value="senior">Senior (6-10 years)</option>
                        <option value="lead">Lead/Principal (10+ years)</option>
                      </select>
                      {errors.experience && (
                        <p className="mt-2 text-sm text-red-600">
                          {errors.experience.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <Input
                      id="linkedIn"
                      type="url"
                      label="LinkedIn Profile"
                      placeholder="https://linkedin.com/in/yourname"
                      error={errors.linkedIn?.message}
                      {...register('linkedIn')}
                      disabled={isLoading}
                    />

                    <Input
                      id="portfolio"
                      type="url"
                      label="Portfolio/Website"
                      placeholder="https://yourportfolio.com"
                      error={errors.portfolio?.message}
                      {...register('portfolio')}
                      disabled={isLoading}
                    />
                  </div>

                  {/* File Uploads */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        CV/Resume <span className="text-red-500">*</span>
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                        <input
                          type="file"
                          id="cv-upload"
                          accept=".pdf,.doc,.docx"
                          onChange={handleCvUpload}
                          className="hidden"
                          disabled={isLoading}
                        />
                        <label htmlFor="cv-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          {cvFile ? (
                            <p className="text-sm text-green-600 font-medium">
                              <FileText className="w-4 h-4 inline mr-1" />
                              {cvFile.name}
                            </p>
                          ) : (
                            <>
                              <p className="text-sm text-gray-600">
                                Click to upload CV/Resume
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                PDF, DOC, DOCX (Max 5MB)
                              </p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Additional Documents (Optional)
                      </label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
                        <input
                          type="file"
                          id="docs-upload"
                          accept=".pdf,.doc,.docx"
                          multiple
                          onChange={handleAdditionalDocsUpload}
                          className="hidden"
                          disabled={isLoading}
                        />
                        <label htmlFor="docs-upload" className="cursor-pointer">
                          <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                          {additionalDocs.length > 0 ? (
                            <p className="text-sm text-green-600 font-medium">
                              {additionalDocs.length} file(s) uploaded
                            </p>
                          ) : (
                            <>
                              <p className="text-sm text-gray-600">
                                Click to upload additional documents
                              </p>
                              <p className="text-xs text-gray-500 mt-1">
                                Certificates, portfolio, etc. (Max 10MB total)
                              </p>
                            </>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Cover Letter */}
                  <div>
                    <label
                      htmlFor="coverLetter"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Cover Letter <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="coverLetter"
                      rows={6}
                      placeholder="Tell us why you're interested in this role and what makes you a great fit for ITPilot..."
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
                      {...register('coverLetter')}
                      disabled={isLoading}
                      required
                    />
                    {errors.coverLetter && (
                      <p className="mt-2 text-sm text-red-600">
                        {errors.coverLetter.message}
                      </p>
                    )}
                  </div>

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    isLoading={isLoading}
                  >
                    Submit Application
                  </Button>
                </form>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
