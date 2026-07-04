import type { ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

export function Spinner({
  size = 22,
  className,
}: {
  size?: number
  className?: string
}) {
  return (
    <Loader2
      size={size}
      className={cn('animate-spin text-gold', className)}
      aria-hidden
    />
  )
}

export function LoadingScreen({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="relative flex h-16 w-16 items-center justify-center">
        <span className="absolute inset-0 rounded-full border border-gold/30 animate-pulse-ring" />
        <Spinner size={30} />
      </div>
      <p className="text-sm text-cream/70">{label}</p>
    </div>
  )
}

/** Skeleton placeholder block. */
export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-2xl bg-white/[0.06]',
        className,
      )}
    />
  )
}

interface EmptyStateProps {
  icon: ReactNode
  title: string
  description: string
  action?: ReactNode
  className?: string
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/12 bg-white/[0.02] px-6 py-12 text-center',
        className,
      )}
    >
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-forest/30 text-gold">
        {icon}
      </div>
      <h3 className="font-display text-lg font-semibold text-cloud">{title}</h3>
      <p className="mt-1.5 max-w-[15rem] text-sm leading-relaxed text-cream/65">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
