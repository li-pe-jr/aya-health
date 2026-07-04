import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { Screen } from '@/components/Screen'
import { ProgressBar } from '@/components/Progress'
import { FOLLOW_UP_QUESTIONS } from '@/lib/symptoms'
import { cn } from '@/lib/cn'
import { useSymptomFlow } from './flow'

export function SymptomStep2() {
  const navigate = useNavigate()
  const { selected, answers, setAnswer } = useSymptomFlow()
  const [index, setIndex] = useState(0)

  // Guard: no symptoms means the flow wasn't started properly.
  useEffect(() => {
    if (selected.length === 0) navigate('/symptoms', { replace: true })
  }, [selected.length, navigate])

  const total = FOLLOW_UP_QUESTIONS.length
  const question = FOLLOW_UP_QUESTIONS[index]
  if (!question) return null

  const current = answers[question.id]

  const goBack = () => {
    if (index > 0) setIndex((i) => i - 1)
    else navigate('/symptoms')
  }

  const choose = (value: string) => {
    setAnswer(question.id, value)
    // small delay so the selection is felt before advancing
    window.setTimeout(() => {
      if (index < total - 1) setIndex((i) => i + 1)
      else navigate('/symptoms/result')
    }, 220)
  }

  return (
    <Screen>
      <header className="mb-8">
        <div className="mb-4 flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-cream/80 hover:text-cloud"
            aria-label="Previous question"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-xs font-medium text-cream/55">
            Question {index + 1} of {total}
          </span>
          <span className="w-10" />
        </div>
        <ProgressBar value={index + 1} max={total} />
      </header>

      <div key={question.id} className="flex flex-1 flex-col animate-fade-up">
        <p className="mb-1 text-sm font-medium text-gold-soft">Tell Aya more</p>
        <h1 className="mb-7 font-display text-[26px] font-bold leading-snug text-cloud">
          {question.question}
        </h1>

        <div className="space-y-3">
          {question.options.map((opt) => {
            const active = current === opt.value
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => choose(opt.value)}
                className={cn(
                  'flex w-full items-center justify-between gap-3 rounded-2xl border px-5 py-4 text-left text-[16px] font-medium transition-all active:scale-[0.99]',
                  active
                    ? 'border-gold bg-gold/12 text-cloud'
                    : 'border-white/12 bg-white/[0.03] text-cream/85 hover:border-gold/40 hover:text-cloud',
                )}
              >
                <span>{opt.label}</span>
                <span
                  className={cn(
                    'flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors',
                    active ? 'border-gold bg-gold' : 'border-white/25',
                  )}
                >
                  {active && <Check size={14} className="text-obsidian" />}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </Screen>
  )
}
