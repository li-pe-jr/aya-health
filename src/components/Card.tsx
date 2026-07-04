import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

type Accent = 'none' | 'gold' | 'green'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  accent?: Accent
}

export function Card({ accent = 'gold', className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-3xl bg-obsidian-soft/80 p-5 backdrop-blur',
        accent === 'gold' && 'border border-gold/20',
        accent === 'green' &&
          'border-l-4 border-forest-bright border-y border-r border-y-white/5 border-r-white/5',
        accent === 'none' && 'border border-white/5',
        className,
      )}
      {...props}
    />
  )
}
