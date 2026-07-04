import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import {
  BellRing,
  Check,
  FileHeart,
  MapPin,
  Share2,
  CalendarClock,
} from 'lucide-react'
import { Screen } from '@/components/Screen'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { Toggle } from '@/components/Toggle'
import { LoadingScreen } from '@/components/Feedback'
import { cn } from '@/lib/cn'
import { useAya } from '@/lib/store'
import {
  TRIAGE_META,
  symptomById,
  triage,
  type TriageMeta,
} from '@/lib/symptoms'
import type { SymptomCheck, TriageLevel } from '@/lib/types'
import { useSymptomFlow } from './flow'

const CARE_QUERY: Record<TriageLevel, string> = {
  home: 'pharmacy near me',
  pharmacist: 'pharmacy near me',
  clinic: 'clinic near me',
  emergency: 'hospital emergency near me',
}

const FINE_META: TriageMeta = {
  level: 'home',
  title: 'All Looking Good',
  colorVar: 'var(--color-status-home)',
  headline: 'Lovely — keep it up',
  explanation:
    "Thanks for checking in with Aya. There's nothing to act on right now. Staying in tune with your body like this is exactly the right habit.",
  steps: [
    'Keep drinking water and resting well',
    'Move your body a little each day',
    'Check in again whenever something feels off',
  ],
}

export function SymptomResult() {
  const navigate = useNavigate()
  const location = useLocation()
  const isFine = Boolean((location.state as { fine?: boolean } | null)?.fine)
  const { selected, answers, reset } = useSymptomFlow()
  const { addCheck, reminder, setReminder } = useAya()

  const [loading, setLoading] = useState(true)
  const [saved, setSaved] = useState(false)

  const level: TriageLevel = useMemo(
    () => (isFine ? 'home' : triage(selected, answers)),
    [isFine, selected, answers],
  )
  const meta = isFine ? FINE_META : TRIAGE_META[level]

  // Guard against a stray refresh with no data.
  useEffect(() => {
    if (!isFine && selected.length === 0) {
      navigate('/symptoms', { replace: true })
    }
  }, [isFine, selected.length, navigate])

  // Brief "Aya is thinking" state before revealing the recommendation.
  useEffect(() => {
    const t = window.setTimeout(() => setLoading(false), 900)
    return () => window.clearTimeout(t)
  }, [])

  if (loading) return <LoadingScreen label="Aya is thinking this through…" />

  const symptomLabels = selected
    .map((id) => symptomById(id)?.label)
    .filter(Boolean) as string[]

  const save = () => {
    if (saved) return
    const check: SymptomCheck = {
      id: `chk_${Date.now()}`,
      createdAt: Date.now(),
      symptomIds: selected,
      answers,
      level,
    }
    addCheck(check)
    setSaved(true)
  }

  const findCare = () => {
    const url = `https://www.google.com/maps/search/${encodeURIComponent(
      CARE_QUERY[level],
    )}`
    window.open(url, '_blank', 'noopener,noreferrer')
  }

  const share = async () => {
    const text = `Aya health check — ${meta.title}. Symptoms: ${
      symptomLabels.join(', ') || 'general check-in'
    }.`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Aya health check', text })
      } else {
        await navigator.clipboard.writeText(text)
      }
    } catch {
      /* user dismissed the share sheet — nothing to do */
    }
  }

  const done = () => {
    reset()
    navigate('/home')
  }

  return (
    <Screen>
      {/* status indicator */}
      <div className="flex flex-col items-center pt-4 text-center animate-fade-up">
        <div className="relative flex h-28 w-28 items-center justify-center">
          <span
            className="absolute inset-0 rounded-full opacity-30 animate-pulse-ring"
            style={{ backgroundColor: meta.colorVar }}
          />
          <span
            className="flex h-24 w-24 items-center justify-center rounded-full"
            style={{ backgroundColor: meta.colorVar }}
          >
            <Check size={44} className="text-obsidian" strokeWidth={3} />
          </span>
        </div>
        <span
          className="mt-4 rounded-full px-4 py-1.5 text-sm font-bold"
          style={{
            color: meta.colorVar,
            backgroundColor: 'color-mix(in srgb, transparent 85%, currentColor)',
          }}
        >
          {meta.title}
        </span>
        <h1 className="mt-3 font-display text-[24px] font-bold leading-snug text-cloud">
          {meta.headline}
        </h1>
      </div>

      {/* Aya's explanation */}
      <p className="mt-4 text-center text-[15px] leading-relaxed text-cream/80">
        {meta.explanation}
      </p>

      {/* what to do next */}
      <section className="mt-7">
        <h2 className="mb-3 text-sm font-semibold text-cream/80">
          What to do next
        </h2>
        <ol className="space-y-2.5">
          {meta.steps.map((step, i) => (
            <li
              key={step}
              className="flex items-start gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-3.5"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-gold/15 text-sm font-bold text-gold">
                {i + 1}
              </span>
              <span className="pt-0.5 text-[15px] leading-relaxed text-cream/85">
                {step}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {/* shareable summary */}
      <section className="mt-6">
        <Card accent="gold" className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-cloud">Check summary</h3>
            <button
              type="button"
              onClick={share}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-gold hover:text-gold-soft"
            >
              <Share2 size={14} /> Share
            </button>
          </div>
          <div className="mb-3 flex items-center gap-2.5">
            <span
              className="h-8 w-8 shrink-0 rounded-full"
              style={{ backgroundColor: meta.colorVar }}
            />
            <span className="text-[15px] font-semibold text-cloud">
              {meta.title}
            </span>
          </div>
          <p className="mb-1 text-xs font-medium text-cream/55">
            Symptoms logged
          </p>
          {symptomLabels.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {symptomLabels.map((label) => (
                <span
                  key={label}
                  className="rounded-full bg-white/[0.06] px-2.5 py-1 text-xs text-cream/85"
                >
                  {label}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-sm text-cream/70">
              General check-in — no symptoms reported
            </span>
          )}
        </Card>
      </section>

      {/* actions */}
      <div className="mt-6 grid grid-cols-2 gap-3">
        <Button variant="forest" leftIcon={<MapPin size={17} />} onClick={findCare}>
          Find Care
        </Button>
        <Button
          variant={saved ? 'outline' : 'gold'}
          leftIcon={saved ? <Check size={17} /> : <FileHeart size={17} />}
          onClick={save}
          disabled={saved}
        >
          {saved ? 'Saved' : 'Save'}
        </Button>
      </div>

      {/* check-in tomorrow toggle */}
      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-4">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amethyst/40 text-gold">
          {reminder ? <BellRing size={19} /> : <CalendarClock size={19} />}
        </span>
        <div className="flex-1">
          <p className="text-[15px] font-semibold text-cloud">
            Check in tomorrow
          </p>
          <p className="text-xs text-cream/55">
            Aya will gently remind you to see how you feel.
          </p>
        </div>
        <Toggle
          checked={reminder}
          onChange={setReminder}
          label="Check in tomorrow"
        />
      </div>

      <button
        type="button"
        onClick={done}
        className={cn(
          'mx-auto mt-6 text-sm font-medium text-cream/60 hover:text-cloud',
        )}
      >
        Back to home
      </button>
    </Screen>
  )
}
