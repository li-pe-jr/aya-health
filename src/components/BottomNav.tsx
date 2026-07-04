import { NavLink } from 'react-router-dom'
import {
  House,
  Stethoscope,
  FolderHeart,
  Pill,
  User,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/cn'

interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

const ITEMS: NavItem[] = [
  { to: '/home', label: 'Home', icon: House },
  { to: '/symptoms', label: 'Symptoms', icon: Stethoscope },
  { to: '/records', label: 'Records', icon: FolderHeart },
  { to: '/medications', label: 'Meds', icon: Pill },
  { to: '/profile', label: 'Profile', icon: User },
]

export function BottomNav() {
  return (
    <nav
      className="absolute inset-x-0 bottom-0 z-20 border-t border-white/8 bg-obsidian/85 backdrop-blur-xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Primary"
    >
      <ul className="mx-auto flex h-16 max-w-[390px] items-stretch justify-around px-2">
        {ITEMS.map(({ to, label, icon: Icon }) => (
          <li key={to} className="flex-1">
            <NavLink
              to={to}
              className={({ isActive }) =>
                cn(
                  'flex h-full flex-col items-center justify-center gap-1 text-[11px] font-medium transition-colors',
                  isActive ? 'text-gold' : 'text-cream/55 hover:text-cream',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'flex h-8 w-10 items-center justify-center rounded-xl transition-colors',
                      isActive && 'bg-gold/12',
                    )}
                  >
                    <Icon size={21} strokeWidth={isActive ? 2.4 : 1.8} />
                  </span>
                  <span>{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
