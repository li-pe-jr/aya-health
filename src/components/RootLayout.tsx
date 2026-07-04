import { Outlet } from 'react-router-dom'

/**
 * Centres the mobile-first app column (max 390px) on larger screens and paints
 * the ambient obsidian + amethyst/green/gold background around it.
 */
export function RootLayout() {
  return (
    <div className="aya-bg flex min-h-dvh w-full justify-center sm:items-center sm:py-6">
      <div className="relative flex h-dvh w-full max-w-[390px] flex-col overflow-hidden bg-transparent sm:h-[844px] sm:rounded-[2.25rem] sm:border sm:border-white/10 sm:shadow-2xl sm:shadow-black/60">
        {/* amethyst depth glow anchored to the bottom of the frame */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-amethyst/40 via-amethyst/10 to-transparent"
        />
        <div className="relative z-10 flex h-full flex-col">
          <Outlet />
        </div>
      </div>
    </div>
  )
}
