import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/cn'

interface ChipProps {
  label: string
  selected?: boolean
  onClick?: () => void
  icon?: ReactNode
  showCheck?: boolean
}

export function Chip({ label, selected, onClick, icon, showCheck }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-[15px] font-medium transition-all',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold/70',
        selected
          ? 'border-gold bg-gold/15 text-cloud'
          : 'border-white/12 bg-white/[0.03] text-cream/85 hover:border-gold/40 hover:text-cloud',
      )}
    >
      {icon}
      <span>{label}</span>
      {showCheck && selected && <Check size={16} className="text-gold" />}
    </button>
  )
}
