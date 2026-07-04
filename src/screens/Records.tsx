import { useNavigate } from 'react-router-dom'
import {
  ClipboardPlus,
  Stethoscope,
  ChevronRight,
} from 'lucide-react'
import { Screen } from '@/components/Screen'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { EmptyState } from '@/components/Feedback'
import { useAya } from '@/lib/store'
import { symptomById, TRIAGE_META } from '@/lib/symptoms'
import { relativeDay, timeOfDay } from '@/lib/format'

export function Records() {
  const navigate = useNavigate()
  const { checks } = useAya()

  return (
    <Screen withNav>
      <header className="mb-6">
        <h1 className="font-display text-[26px] font-bold text-cloud">
          Health Record
        </h1>
        <p className="mt-1 text-[15px] text-cream/70">
          Every check-in you've shared with Aya.
        </p>
      </header>

      {checks.length === 0 ? (
        <EmptyState
          className="mt-6"
          icon={<ClipboardPlus size={26} />}
          title="No records yet"
          description="When you run a symptom check and save it, it'll show up here for you to look back on."
          action={
            <Button size="md" onClick={() => navigate('/symptoms')}>
              Start a check-in
            </Button>
          }
        />
      ) : (
        <ul className="space-y-3">
          {checks.map((check) => {
            const meta = TRIAGE_META[check.level]
            const labels = check.symptomIds
              .map((id) => symptomById(id)?.label)
              .filter(Boolean) as string[]
            return (
              <li key={check.id}>
                <Card accent="green" className="py-4">
                  <div className="flex items-center gap-3">
                    <span
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-obsidian"
                      style={{ backgroundColor: meta.colorVar }}
                    >
                      <Stethoscope size={20} />
                    </span>
                    <div className="flex-1">
                      <p className="text-[15px] font-semibold text-cloud">
                        {meta.title}
                      </p>
                      <p className="text-xs text-cream/55">
                        {relativeDay(check.createdAt)} ·{' '}
                        {timeOfDay(check.createdAt)}
                      </p>
                    </div>
                    <ChevronRight size={18} className="text-cream/35" />
                  </div>
                  {labels.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {labels.map((label) => (
                        <span
                          key={label}
                          className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs text-cream/80"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </Card>
              </li>
            )
          })}
        </ul>
      )}
    </Screen>
  )
}
