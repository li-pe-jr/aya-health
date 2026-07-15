import { useNavigate } from 'react-router-dom'
import {
  MapPin,
  PersonStanding,
  Pill,
  FolderHeart,
  Navigation,
  ArrowRight,
  Sparkles,
  Smile,
  type LucideIcon,
} from 'lucide-react'
import { Screen } from '@/components/Screen'
import { Button } from '@/components/Button'
import { Card } from '@/components/Card'
import { useAya } from '@/lib/store'
import { greeting, longDate, relativeDay } from '@/lib/format'
import { TRIAGE_META } from '@/lib/symptoms'
import { cn } from '@/lib/cn'

export function Home() {
  const navigate = useNavigate()
  const { profile, checks, addWellnessCheckin } = useAya()
  const name = profile.name || 'Friend'
  const lastCheck = checks[0]

  const handleFeelingGood = () => {
    addWellnessCheckin()
    navigate('/symptoms/result', { state: { fine: true } })
  }

  return (
    <Screen withNav>
      {/* greeting */}
      <header className="mb-6">
        <h1 className="font-display text-[26px] font-bold leading-tight text-cream">
          {greeting()},{' '}
          <span className="text-cloud">{name}</span>
        </h1>
        <div className="mt-1 flex items-center gap-2 text-[13px] text-cream/55">
          <span>{longDate()}</span>
          <span className="text-cream/25">·</span>
          <span className="inline-flex items-center gap-1">
            <MapPin size={13} /> Accra, Ghana
          </span>
        </div>
      </header>

      {/* primary symptom card */}
      <Card
        accent="none"
        className="relative overflow-hidden border-forest-bright/40 bg-gradient-to-br from-forest to-forest-deep p-6"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute -right-6 -top-8 opacity-15"
        >
          <PersonStanding size={140} strokeWidth={1.4} className="text-cloud" />
        </div>
        <div className="relative">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-obsidian/30 px-3 py-1 text-[11px] font-medium text-gold-soft">
            <Sparkles size={12} /> Aya check-in
          </span>
          <h2 className="mt-3 max-w-[13rem] font-display text-[22px] font-bold leading-snug text-cloud">
            How are you feeling today?
          </h2>
          <p className="mt-1.5 max-w-[15rem] text-sm text-cream/75">
            Tell Aya what's going on and get calm, clear guidance.
          </p>
          <Button
            className="mt-5"
            rightIcon={<ArrowRight size={18} />}
            onClick={() => navigate('/symptoms')}
          >
            Check my symptoms
          </Button>
          <button
            type="button"
            onClick={handleFeelingGood}
            className="mt-3 inline-flex items-center gap-2 text-sm text-cream/55 hover:text-cloud"
          >
            <Smile size={16} /> I feel fine, just checking in
          </button>
        </div>
      </Card>

      {/* quick access */}
      <section className="mt-6">
        <div className="grid grid-cols-3 gap-3">
          <QuickAccess
            icon={Pill}
            label="Medications"
            onClick={() => navigate('/medications')}
          />
          <QuickAccess
            icon={FolderHeart}
            label="Health Record"
            onClick={() => navigate('/records')}
          />
          <QuickAccess
            icon={Navigation}
            label="Care Finder"
            onClick={() => navigate('/records')}
          />
        </div>
      </section>

      {/* recent check-in / gentle empty state */}
      <section className="mt-7">
        <h3 className="mb-3 text-sm font-semibold text-cream/80">
          Your last check-in
        </h3>
        {lastCheck ? (
          <button
            type="button"
            onClick={() => navigate('/records')}
            className="w-full text-left"
          >
            <Card accent="green" className="flex items-center gap-3.5 py-4">
              <span
                className="h-11 w-11 shrink-0 rounded-full"
                style={{ backgroundColor: TRIAGE_META[lastCheck.level].colorVar }}
              />
              <span className="flex-1">
                <span className="block text-[15px] font-semibold text-cloud">
                  {TRIAGE_META[lastCheck.level].title}
                </span>
                <span className="block text-xs text-cream/55">
                  {relativeDay(lastCheck.createdAt)} ·{' '}
                  {lastCheck.symptomIds.length} symptom
                  {lastCheck.symptomIds.length === 1 ? '' : 's'} logged
                </span>
              </span>
              <ArrowRight size={18} className="text-cream/40" />
            </Card>
          </button>
        ) : (
          <Card accent="gold" className="flex items-center gap-3.5 py-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-forest/40 text-gold">
              <Sparkles size={20} />
            </span>
            <p className="text-sm leading-relaxed text-cream/70">
              No check-ins yet. When something feels off, Aya is right here.
            </p>
          </Card>
        )}
      </section>
    </Screen>
  )
}

function QuickAccess({
  icon: Icon,
  label,
  onClick,
}: {
  icon: LucideIcon
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'flex flex-col items-center gap-2.5 rounded-2xl border border-white/8 bg-white/[0.03] px-2 py-4 text-center transition-all',
        'hover:border-gold/40 hover:bg-white/[0.05] active:scale-[0.98]',
      )}
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-forest/40 text-gold">
        <Icon size={21} strokeWidth={1.9} />
      </span>
      <span className="text-xs font-medium leading-tight text-cream/85">
        {label}
      </span>
    </button>
  )
}
