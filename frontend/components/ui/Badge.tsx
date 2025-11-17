import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-all duration-200',
  {
    variants: {
      variant: {
        default: 'bg-gray-100 text-gray-800',
        primary: 'bg-orange-100 text-orange-800',
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        danger: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
        outline: 'border border-gray-300 text-gray-700',
      },
      size: {
        sm: 'text-xs px-2 py-0.5',
        md: 'text-sm px-2.5 py-0.5',
        lg: 'text-base px-3 py-1',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
  icon?: React.ReactNode
}

export const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant, size, dot, icon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(badgeVariants({ variant, size }), className)}
        {...props}
      >
        {dot && (
          <span
            className={cn(
              'mr-1.5 h-2 w-2 rounded-full',
              variant === 'primary' && 'bg-orange-500',
              variant === 'success' && 'bg-green-500',
              variant === 'warning' && 'bg-yellow-500',
              variant === 'danger' && 'bg-red-500',
              variant === 'info' && 'bg-blue-500',
              variant === 'default' && 'bg-gray-500',
              variant === 'outline' && 'bg-gray-500'
            )}
          />
        )}
        {icon && <span className="mr-1">{icon}</span>}
        {children}
      </div>
    )
  }
)

Badge.displayName = 'Badge'

// Status Badge Helper
export interface StatusBadgeProps extends Omit<BadgeProps, 'variant'> {
  status:
    | 'online'
    | 'offline'
    | 'pending'
    | 'active'
    | 'inactive'
    | 'open'
    | 'closed'
    | 'in_progress'
    | 'resolved'
    | 'low'
    | 'medium'
    | 'high'
    | 'critical'
}

const statusVariantMap: Record<StatusBadgeProps['status'], BadgeProps['variant']> = {
  online: 'success',
  offline: 'default',
  pending: 'warning',
  active: 'success',
  inactive: 'default',
  open: 'info',
  closed: 'default',
  in_progress: 'warning',
  resolved: 'success',
  low: 'info',
  medium: 'warning',
  high: 'danger',
  critical: 'danger',
}

const statusLabelMap: Record<StatusBadgeProps['status'], string> = {
  online: 'Online',
  offline: 'Offline',
  pending: 'Pending',
  active: 'Active',
  inactive: 'Inactive',
  open: 'Open',
  closed: 'Closed',
  in_progress: 'In Progress',
  resolved: 'Resolved',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  children,
  ...props
}) => {
  const variant = statusVariantMap[status]
  const label = children || statusLabelMap[status]

  return (
    <Badge variant={variant} dot {...props}>
      {label}
    </Badge>
  )
}

StatusBadge.displayName = 'StatusBadge'
