'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Mail, Lock, User, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { authService } from '@/lib/api/services/auth.service'
import { useAuthStore } from '@/lib/store/auth'

const registerSchema = z.object({
  first_name: z.string().min(2, 'First name must be at least 2 characters'),
  last_name: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  password_confirm: z.string(),
}).refine((data) => data.password === data.password_confirm, {
  message: "Passwords don't match",
  path: ['password_confirm'],
})

type RegisterFormData = z.infer<typeof registerSchema>

export default function RegisterPage() {
  const router = useRouter()
  const { register: registerUser } = useAuthStore()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const password = watch('password', '')

  const passwordRequirements = [
    { text: 'At least 12 characters', met: password.length >= 12 },
    { text: 'One uppercase letter', met: /[A-Z]/.test(password) },
    { text: 'One lowercase letter', met: /[a-z]/.test(password) },
    { text: 'One number', met: /[0-9]/.test(password) },
  ]

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true)
      setError('')
      setSuccess(false)

      await registerUser(data)

      setSuccess(true)
      toast.success('Account created successfully! Please check your email to verify your account.')

      // Redirect to login after a short delay
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err: any) {
      console.error('Registration error:', err)
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.email?.[0] ||
        err.response?.data?.password?.[0] ||
        err.response?.data?.detail ||
        'Failed to create account'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl">
          <CardHeader className="space-y-1 text-center">
            <CardTitle className="text-3xl font-bold">Create Account</CardTitle>
            <CardDescription>
              Get started with ITPilot and transform your IT support
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
              {error && (
                <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <AlertCircle className="w-5 h-5 flex-shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
                  <p>Account created! Redirecting to login...</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <Input
                  id="first_name"
                  type="text"
                  label="First Name"
                  placeholder="John"
                  leftIcon={<User className="w-5 h-5" />}
                  error={errors.first_name?.message}
                  {...register('first_name')}
                  disabled={isLoading}
                  required
                />

                <Input
                  id="last_name"
                  type="text"
                  label="Last Name"
                  placeholder="Doe"
                  leftIcon={<User className="w-5 h-5" />}
                  error={errors.last_name?.message}
                  {...register('last_name')}
                  disabled={isLoading}
                  required
                />
              </div>

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
                id="password"
                type="password"
                label="Password"
                placeholder="Create a strong password"
                leftIcon={<Lock className="w-5 h-5" />}
                error={errors.password?.message}
                {...register('password')}
                disabled={isLoading}
                required
              />

              {password && (
                <div className="p-3 bg-gray-50 rounded-lg space-y-2">
                  <p className="text-xs font-medium text-gray-700 mb-2">
                    Password requirements:
                  </p>
                  {passwordRequirements.map((req, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-xs"
                    >
                      <CheckCircle2
                        className={`w-4 h-4 ${
                          req.met ? 'text-green-500' : 'text-gray-300'
                        }`}
                      />
                      <span className={req.met ? 'text-green-700' : 'text-gray-500'}>
                        {req.text}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <Input
                id="password_confirm"
                type="password"
                label="Confirm Password"
                placeholder="Re-enter your password"
                leftIcon={<Lock className="w-5 h-5" />}
                error={errors.password_confirm?.message}
                {...register('password_confirm')}
                disabled={isLoading}
                required
              />

              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 mt-0.5 rounded border-gray-300 text-orange-500 focus:ring-orange-500"
                  required
                />
                <span className="text-sm text-gray-600">
                  I agree to the{' '}
                  <Link href="/terms" className="text-orange-500 hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link href="/privacy" className="text-orange-500 hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={isLoading}
              >
                Create Account
              </Button>
            </form>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  Or sign up with
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="w-full" disabled={isLoading}>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                  />
                </svg>
                Google
              </Button>
              <Button variant="outline" className="w-full" disabled={isLoading}>
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
                GitHub
              </Button>
            </div>

            <p className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link
                href="/login"
                className="font-medium text-orange-500 hover:text-orange-600 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
