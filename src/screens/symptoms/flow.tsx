import { createContext, useContext, useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { BottomNav } from '@/components/BottomNav'

interface SymptomFlowValue {
  selected: string[]
  toggle: (id: string) => void
  clear: () => void
  answers: Record<string, string>
  setAnswer: (questionId: string, value: string) => void
  reset: () => void
  otherSymptom: string
  setOtherSymptom: (value: string) => void
}

const SymptomFlowContext = createContext<SymptomFlowValue | null>(null)

export function SymptomFlowLayout() {
  const [selected, setSelected] = useState<string[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [otherSymptom, setOtherSymptom] = useState('')

  const value = useMemo<SymptomFlowValue>(
    () => ({
      selected,
      answers,
      otherSymptom,
      toggle: (id) =>
        setSelected((prev) =>
          prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
        ),
      clear: () => setSelected([]),
      setAnswer: (questionId, val) =>
        setAnswers((prev) => ({ ...prev, [questionId]: val })),
      setOtherSymptom,
      reset: () => {
        setSelected([])
        setAnswers({})
        setOtherSymptom('')
      },
    }),
    [selected, answers, otherSymptom],
  )

  const location = useLocation()
  const showNav = location.pathname === '/symptoms'

  return (
    <SymptomFlowContext.Provider value={value}>
      <div className="relative flex h-full flex-col">
        <div className="flex-1 overflow-hidden">
          <Outlet />
        </div>
        {showNav && <BottomNav />}
      </div>
    </SymptomFlowContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useSymptomFlow(): SymptomFlowValue {
  const ctx = useContext(SymptomFlowContext)
  if (!ctx)
    throw new Error('useSymptomFlow must be used within SymptomFlowLayout')
  return ctx
}
