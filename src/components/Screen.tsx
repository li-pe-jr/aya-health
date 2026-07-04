import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface ScreenProps {
  children: ReactNode
  /** leaves room for the bottom navigation bar */
  withNav?: boolean
  className?: string
  contentClassName?: string
}

/**
 * A full-height, vertically scrolling screen that fits the device column.
 * Adds top/bottom safe-area padding and optional room for the bottom nav.
 */
export function Screen({
  children,
  withNav,
  className,
  contentClassName,
}: ScreenProps) {
  return (
    <div
      className={cn(
        'no-scrollbar flex h-full flex-col overflow-y-auto animate-fade-up',
        className,
      )}
      style={{ paddingTop: 'env(safe-area-inset-top)' }}
    >
      <div
        className={cn(
          'flex min-h-full flex-col px-5 pt-5',
          withNav ? 'pb-24' : 'pb-8',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
}
