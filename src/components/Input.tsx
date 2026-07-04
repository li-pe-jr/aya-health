import type { InputHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  hint?: string
  leftIcon?: ReactNode
}

export function Input({
  label,
  hint,
  leftIcon,
  className,
  id,
  ...props
}: InputProps) {
  return (
    <label htmlFor={id} className="block">
      {label && (
        <span className="mb-2 block text-sm font-medium text-cream/80">
          {label}
        </span>
      )}
      <div className="relative">
        {leftIcon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cream/50">
            {leftIcon}
          </span>
        )}
        <input
          id={id}
          className={cn(
            'h-14 w-full rounded-2xl border border-white/12 bg-white/[0.04] px-4 text-base text-cloud placeholder:text-cream/35',
            'transition-colors focus:border-gold/70 focus:bg-white/[0.06] focus:outline-none',
            leftIcon ? 'pl-11' : '',
            className,
          )}
          {...props}
        />
      </div>
      {hint && <span className="mt-2 block text-xs text-cream/50">{hint}</span>}
    </label>
  )
}
