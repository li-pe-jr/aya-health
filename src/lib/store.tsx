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
import { supabase } from './supabase'

export const EMPTY_PROFILE: UserProfile = {
  name: '',
  age: '',
  sex: 'unspecified',
  conditions: [],
  conditionsOther: '',
  language: 'en',
  bloodType: '',
  maritalStatus: 'prefer-not-to-say',
  maritalStatusOther: '',
  religion: 'prefer-not-to-say',
  religionOther: '',
  joinedAt: 0,
  onboarded: false,
}

interface AyaContextValue {
  profile: UserProfile
  checks: SymptomCheck[]
  meds: Medication[]
  reminder: boolean
  ready: boolean
  user: any
  loading: boolean
  updateProfile: (patch: Partial<UserProfile>) => void
  completeOnboarding: (patch: Partial<UserProfile>) => void
  addCheck: (check: SymptomCheck) => void
  addMed: (med: Medication) => void
  removeMed: (id: string) => void
  setReminder: (value: boolean) => void
  resetAll: () => void
  signUp: (email: string, password: string) => Promise<{ error: string | null; needsVerification?: boolean }>
  signIn: (email: string, password: string) => Promise<{ error: string | null; needsVerification?: boolean }>
  signOut: () => Promise<void>
}

const AyaContext = createContext<AyaContextValue | null>(null)

export function AyaProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile>(EMPTY_PROFILE)
  const [checks, setChecks] = useState<SymptomCheck[]>([])
  const [meds, setMeds] = useState<Medication[]>([])
  const [reminder, setReminderState] = useState(false)
  const [ready, setReady] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check for active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  // Load user data from Supabase when user changes
  useEffect(() => {
    if (!user) {
      setProfile(EMPTY_PROFILE)
      setChecks([])
      setMeds([])
      setReminderState(false)
      setReady(true)
      return
    }

    const loadUserData = async () => {
      try {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (profileData) {
          setProfile(profileData)
        }

        const { data: checksData } = await supabase
          .from('symptom_checks')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(50)

        if (checksData) {
          setChecks(checksData)
        }

        const { data: medsData } = await supabase
          .from('medications')
          .select('*')
          .eq('user_id', user.id)

        if (medsData) {
          setMeds(medsData)
        }

        const { data: reminderData } = await supabase
          .from('settings')
          .select('reminder_enabled')
          .eq('user_id', user.id)
          .single()

        if (reminderData) {
          setReminderState(reminderData.reminder_enabled)
        }
      } catch (error) {
        console.error('Error loading user data:', error)
      } finally {
        setReady(true)
      }
    }

    loadUserData()
  }, [user])

  // Save profile to Supabase
  useEffect(() => {
    if (!ready || !user) return

    const saveProfile = async () => {
      try {
        const { error } = await supabase
          .from('profiles')
          .upsert({ id: user.id, ...profile })
        if (error) console.error('Error saving profile:', error)
      } catch (error) {
        console.error('Error saving profile:', error)
      }
    }

    saveProfile()
  }, [profile, ready, user])

  // Save checks to Supabase
  useEffect(() => {
    if (!ready || !user) return

    const saveChecks = async () => {
      try {
        if (checks.length > 0) {
          const { error } = await supabase
            .from('symptom_checks')
            .upsert(checks.map(c => ({ ...c, user_id: user.id })), { onConflict: 'id' })
          if (error) console.error('Error saving checks:', error)
        }
      } catch (error) {
        console.error('Error saving checks:', error)
      }
    }

    saveChecks()
  }, [checks, ready, user])

  // Save medications to Supabase
  useEffect(() => {
    if (!ready || !user) return

    const saveMeds = async () => {
      try {
        if (meds.length > 0) {
          const { error } = await supabase
            .from('medications')
            .upsert(meds.map(m => ({ ...m, user_id: user.id })), { onConflict: 'id' })
          if (error) console.error('Error saving medications:', error)
        }
      } catch (error) {
        console.error('Error saving medications:', error)
      }
    }

    saveMeds()
  }, [meds, ready, user])

  // Save reminder to Supabase
  useEffect(() => {
    if (!ready || !user) return

    const saveReminder = async () => {
      try {
        const { error } = await supabase
          .from('settings')
          .upsert({ user_id: user.id, reminder_enabled: reminder })
        if (error) console.error('Error saving reminder:', error)
      } catch (error) {
        console.error('Error saving reminder:', error)
      }
    }

    saveReminder()
  }, [reminder, ready, user])

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

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) {
        if (error.message.includes('already registered')) {
          return { error: 'An account with this email already exists. Please sign in instead.' }
        }
        return { error: error.message }
      }
      // If sign up successful but email not confirmed
      if (data.user && !data.user.email_confirmed_at) {
        return { error: null, needsVerification: true }
      }
      return { error: null }
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }, [])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          return { error: 'Invalid email or password. Please check your credentials and try again.' }
        }
        if (error.message.includes('Email not confirmed')) {
          return { error: 'Please check your email for the confirmation link to verify your account.', needsVerification: true }
        }
        return { error: error.message }
      }
      // Check if email is verified
      if (data.user && !data.user.email_confirmed_at) {
        return { error: 'Please check your email for the confirmation link to verify your account.', needsVerification: true }
      }
      return { error: null }
    } catch (error) {
      return { error: 'An unexpected error occurred' }
    }
  }, [])

  const signOut = useCallback(async () => {
    resetAll()
    await supabase.auth.signOut()
  }, [resetAll])

  const value = useMemo<AyaContextValue>(
    () => ({
      profile,
      checks,
      meds,
      reminder,
      ready,
      user,
      loading,
      updateProfile,
      completeOnboarding,
      addCheck,
      addMed,
      removeMed,
      setReminder,
      resetAll,
      signUp,
      signIn,
      signOut,
    }),
    [
      profile,
      checks,
      meds,
      reminder,
      ready,
      user,
      loading,
      updateProfile,
      completeOnboarding,
      addCheck,
      addMed,
      removeMed,
      setReminder,
      resetAll,
      signUp,
      signIn,
      signOut,
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
