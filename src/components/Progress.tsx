import { cn } from '@/lib/cn'

interface StepDotsProps {
  total: number
  current: number
  className?: string
}

/** Segmented progress indicator (onboarding). current is 1-based. */
export function StepDots({ total, current, className }: StepDotsProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      {Array.from({ length: total }, (_, i) => {
        const active = i < current
        return (
          <span
            key={i}
            className={cn(
              'h-1.5 flex-1 rounded-full transition-all duration-300',
              active ? 'bg-gold' : 'bg-white/12',
            )}
          />
        )
      })}
    </div>
  )
}

interface ProgressBarProps {
  value: number
  max: number
  className?: string
}

export function ProgressBar({ value, max, className }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100))
  return (
    <div
      className={cn('h-1.5 w-full rounded-full bg-white/10', className)}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className="h-full rounded-full bg-gold transition-all duration-300"
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}
