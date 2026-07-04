import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Medication, SymptomCheck, UserProfile } from './types'

const PROFILE_KEY = 'aya.profile.v1'
const CHECKS_KEY = 'aya.checks.v1'
const REMINDER_KEY = 'aya.reminder.v1'
const MEDS_KEY = 'aya.meds.v1'

export const EMPTY_PROFILE: UserProfile = {
  name: '',
  age: '',
  sex: 'unspecified',
  conditions: [],
  language: 'en',
  bloodType: '',
  joinedAt: 0,
  onboarded: false,
}

function load<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    return JSON.parse(raw) as T
  } catch {
    return fallback
  }
}

interface AyaContextValue {
  profile: UserProfile
  checks: SymptomCheck[]
  meds: Medication[]
  reminder: boolean
  ready: boolean
  updateProfile: (patch: Partial<UserProfile>) => void
  completeOnboarding: (patch: Partial<UserProfile>) => void
  addCheck: (check: SymptomCheck) => void
  addMed: (med: Medication) => void
  removeMed: (id: string) => void
  setReminder: (value: boolean) => void
  resetAll: () => void
}

const AyaContext = createContext<AyaContextValue | null>(null)

export function AyaProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(EMPTY_PROFILE)
  const [checks, setChecks] = useState<SymptomCheck[]>([])
  const [meds, setMeds] = useState<Medication[]>([])
  const [reminder, setReminderState] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setProfile(load<UserProfile>(PROFILE_KEY, EMPTY_PROFILE))
    setChecks(load<SymptomCheck[]>(CHECKS_KEY, []))
    setMeds(load<Medication[]>(MEDS_KEY, []))
    setReminderState(load<boolean>(REMINDER_KEY, false))
    setReady(true)
  }, [])

  useEffect(() => {
    if (ready) localStorage.setItem(PROFILE_KEY, JSON.stringify(profile))
  }, [profile, ready])

  useEffect(() => {
    if (ready) localStorage.setItem(CHECKS_KEY, JSON.stringify(checks))
  }, [checks, ready])

  useEffect(() => {
    if (ready) localStorage.setItem(MEDS_KEY, JSON.stringify(meds))
  }, [meds, ready])

  useEffect(() => {
    if (ready) localStorage.setItem(REMINDER_KEY, JSON.stringify(reminder))
  }, [reminder, ready])

  const updateProfile = useCallback((patch: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }))
  }, [])

  const completeOnboarding = useCallback((patch: Partial<UserProfile>) => {
    setProfile((prev) => ({
      ...prev,
      ...patch,
      onboarded: true,
      joinedAt: prev.joinedAt || Date.now(),
    }))
  }, [])

  const addCheck = useCallback((check: SymptomCheck) => {
    setChecks((prev) => [check, ...prev].slice(0, 50))
  }, [])

  const addMed = useCallback((med: Medication) => {
    setMeds((prev) => [...prev, med])
  }, [])

  const removeMed = useCallback((id: string) => {
    setMeds((prev) => prev.filter((m) => m.id !== id))
  }, [])

  const setReminder = useCallback((value: boolean) => {
    setReminderState(value)
  }, [])

  const resetAll = useCallback(() => {
    setProfile(EMPTY_PROFILE)
    setChecks([])
    setMeds([])
    setReminderState(false)
  }, [])

  const value = useMemo<AyaContextValue>(
    () => ({
      profile,
      checks,
      meds,
      reminder,
      ready,
      updateProfile,
      completeOnboarding,
      addCheck,
      addMed,
      removeMed,
      setReminder,
      resetAll,
    }),
    [
      profile,
      checks,
      meds,
      reminder,
      ready,
      updateProfile,
      completeOnboarding,
      addCheck,
      addMed,
      removeMed,
      setReminder,
      resetAll,
    ],
  )

  return <AyaContext.Provider value={value}>{children}</AyaContext.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAya(): AyaContextValue {
  const ctx = useContext(AyaContext)
  if (!ctx) throw new Error('useAya must be used within an AyaProvider')
  return ctx
}
