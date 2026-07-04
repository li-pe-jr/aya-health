import { Outlet } from 'react-router-dom'
import { BottomNav } from './BottomNav'

/** Wraps the primary tab screens and pins the bottom navigation. */
export function AppLayout() {
  return (
    <div className="relative flex h-full flex-col">
      <div className="flex-1 overflow-hidden">
        <Outlet />
      </div>
      <BottomNav />
    </div>
  )
}
