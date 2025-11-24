import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  text?: string
  className?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
}

export function LoadingSpinner({ size = 'md', text, className }: LoadingSpinnerProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center py-12', className)}>
      <Loader2 className={cn('animate-spin text-orange-500', sizeClasses[size])} />
      {text && <p className="mt-4 text-gray-600">{text}</p>}
    </div>
  )
}

interface LoadingStateProps {
  text?: string
  fullPage?: boolean
}

export function LoadingState({ text = 'Loading...', fullPage = false }: LoadingStateProps) {
  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-orange-500 to-orange-600 flex items-center justify-center shadow-orange animate-pulse">
            <span className="text-white font-bold text-2xl">IT</span>
          </div>
          <p className="text-gray-600">{text}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center py-12">
      <div className="text-center">
        <Loader2 className="w-12 h-12 mx-auto mb-4 text-orange-500 animate-spin" />
        <p className="text-gray-600">{text}</p>
      </div>
    </div>
  )
}

interface LoadingCardProps {
  text?: string
}

export function LoadingCard({ text = 'Loading...' }: LoadingCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
      <div className="flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin mr-3" />
        <span className="text-gray-600">{text}</span>
      </div>
    </div>
  )
}
