import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Search, SearchX, Smile } from 'lucide-react'
import { Screen } from '@/components/Screen'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { EmptyState } from '@/components/Feedback'
import { SYMPTOMS } from '@/lib/symptoms'
import { cn } from '@/lib/cn'
import { useSymptomFlow } from './flow'

export function SymptomStep1() {
  const navigate = useNavigate()
  const { selected, toggle, reset, otherSymptom, setOtherSymptom } = useSymptomFlow()
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return SYMPTOMS
    return SYMPTOMS.filter((s) => s.label.toLowerCase().includes(q))
  }, [query])

  const goFine = () => {
    reset()
    navigate('/symptoms/result', { state: { fine: true } })
  }

  const showOtherInput = selected.includes('other')

  return (
    <Screen withNav>
      <header className="mb-5 flex items-start gap-3">
        <button
          type="button"
          onClick={() => navigate('/home')}
          className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 text-cream/80 hover:text-cloud"
          aria-label="Go home"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="font-display text-[26px] font-bold leading-tight text-cloud">
            What are you feeling?
          </h1>
          <p className="mt-1 text-[15px] text-cream/70">
            Tap everything that applies
          </p>
        </div>
      </header>

      {/* search */}
      <div className="relative mb-5">
        <Search
          size={18}
          className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-cream/45"
        />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search symptoms…"
          className="h-[52px] w-full rounded-2xl border border-white/12 bg-white/[0.04] pl-11 pr-4 text-base text-cloud placeholder:text-cream/35 focus:border-gold/70 focus:outline-none"
        />
      </div>

      {/* grid */}
      <div className="flex-1 overflow-y-auto pb-4">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-2 gap-3">
            {filtered.map((s) => {
              const active = selected.includes(s.id)
              const Icon = s.icon
              return (
                <button
                  key={s.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => toggle(s.id)}
                  className={cn(
                    'flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all active:scale-[0.98]',
                    active
                      ? 'border-gold bg-gold/12'
                      : 'border-white/10 bg-white/[0.03] hover:border-gold/40',
                  )}
                >
                  <span
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors',
                      active ? 'bg-gold/20 text-gold' : 'bg-forest/40 text-cream/80',
                    )}
                  >
                    <Icon size={20} strokeWidth={1.9} />
                  </span>
                  <span className="text-[14px] font-medium leading-tight text-cloud">
                    {s.label}
                  </span>
                </button>
              )
            })}
          </div>
        ) : (
          <EmptyState
            className="mt-4"
            icon={<SearchX size={26} />}
            title="No matches"
            description={`Aya couldn't find "${query.trim()}". Try another word, or pick from the list.`}
          />
        )}

        {showOtherInput && (
          <Input
            id="symptom-other"
            className="mt-3"
            placeholder="Please specify your symptom"
            value={otherSymptom}
            onChange={(e) => setOtherSymptom(e.target.value)}
          />
        )}

        {/* feeling fine */}
        <button
          type="button"
          onClick={goFine}
          className="mx-auto mt-6 inline-flex items-center gap-2 text-sm text-cream/55 hover:text-cloud"
        >
          <Smile size={16} /> I feel fine, just checking in
        </button>
      </div>

      <div className="sticky bottom-0 mt-4 bg-gradient-to-t from-[#0a0f0d] via-[#0a0f0d] to-transparent pt-4">
        <Button
          fullWidth
          disabled={selected.length === 0 || (showOtherInput && !otherSymptom.trim())}
          rightIcon={<ArrowRight size={18} />}
          onClick={() => navigate('/symptoms/questions')}
        >
          {selected.length > 0
            ? `Continue with ${selected.length} selected`
            : 'Continue'}
        </Button>
      </div>
    </Screen>
  )
}
