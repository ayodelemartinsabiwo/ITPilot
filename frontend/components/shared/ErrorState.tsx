import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

interface ErrorStateProps {
  title?: string
  message?: string
  error?: Error | string
  onRetry?: () => void
  showHomeButton?: boolean
  className?: string
  fullPage?: boolean
}

export function ErrorState({
  title = 'Something went wrong',
  message = 'We encountered an error while loading this content.',
  error,
  onRetry,
  showHomeButton = false,
  className,
  fullPage = false,
}: ErrorStateProps) {
  const errorMessage = error instanceof Error ? error.message : error

  const content = (
    <div className={cn('text-center', className)}>
      <div className="mx-auto w-16 h-16 mb-4 rounded-full bg-red-100 flex items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-600" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-4 max-w-md mx-auto">{message}</p>
      {errorMessage && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4 max-w-md mx-auto">
          <p className="text-sm text-red-800 font-mono">{errorMessage}</p>
        </div>
      )}
      <div className="flex gap-3 justify-center">
        {onRetry && (
          <Button variant="primary" onClick={onRetry}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        )}
        {showHomeButton && (
          <Button variant="outline" onClick={() => window.location.href = '/dashboard'}>
            <Home className="w-4 h-4 mr-2" />
            Go Home
          </Button>
        )}
      </div>
    </div>
  )

  if (fullPage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        {content}
      </div>
    )
  }

  return <div className="py-12">{content}</div>
}

interface ErrorCardProps {
  title?: string
  message?: string
  onRetry?: () => void
}

export function ErrorCard({ title, message, onRetry }: ErrorCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-red-200 p-8">
      <ErrorState title={title} message={message} onRetry={onRetry} />
    </div>
  )
}

interface ErrorBannerProps {
  message: string
  onDismiss?: () => void
  className?: string
}

export function ErrorBanner({ message, onDismiss, className }: ErrorBannerProps) {
  return (
    <div className={cn('bg-red-50 border border-red-200 rounded-lg p-4 mb-6', className)}>
      <div className="flex items-start">
        <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
        <div className="flex-1">
          <p className="text-sm text-red-800">{message}</p>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="text-red-600 hover:text-red-800 ml-3 flex-shrink-0"
          >
            <span className="sr-only">Dismiss</span>
            ×
          </button>
        )}
      </div>
    </div>
  )
}
