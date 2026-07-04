import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/cn'

type Variant = 'gold' | 'forest' | 'outline' | 'ghost'
type Size = 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  fullWidth?: boolean
  leftIcon?: ReactNode
  rightIcon?: ReactNode
}

const VARIANTS: Record<Variant, string> = {
  gold: 'bg-gold text-obsidian font-bold shadow-lg shadow-gold/20 hover:bg-gold-soft active:brightness-95',
  forest:
    'bg-forest text-cloud font-semibold border border-forest-bright/60 hover:bg-forest-bright active:brightness-95',
  outline:
    'bg-transparent text-cream font-semibold border border-cream/25 hover:border-gold/60 hover:text-cloud',
  ghost: 'bg-transparent text-cream/80 font-medium hover:text-cloud',
}

const SIZES: Record<Size, string> = {
  md: 'h-12 px-5 text-[15px]',
  lg: 'h-14 px-6 text-base',
}

export function Button({
  variant = 'gold',
  size = 'lg',
  fullWidth,
  leftIcon,
  rightIcon,
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex select-none items-center justify-center gap-2 rounded-2xl transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70 focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian',
        'disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none',
        VARIANTS[variant],
        SIZES[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  )
}
