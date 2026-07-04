import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'

interface SheetProps {
  open: boolean
  onClose: () => void
  title: string
  children: ReactNode
}

/** A bottom sheet constrained to the device column. */
export function Sheet({ open, onClose, title, children }: SheetProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-fade-up"
      />
      <div className="relative z-10 max-h-[88%] overflow-y-auto rounded-t-3xl border-t border-white/10 bg-obsidian-soft px-5 pb-8 pt-4 shadow-2xl shadow-black/60 animate-fade-up">
        <div className="mx-auto mb-4 h-1.5 w-12 rounded-full bg-white/15" />
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-cloud">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-cream/70 hover:text-cloud"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
