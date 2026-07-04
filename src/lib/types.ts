export type BiologicalSex = 'male' | 'female' | 'unspecified'

export type LanguageCode = 'en' | 'twi' | 'ga' | 'ewe'

export type ConditionId =
  | 'diabetes'
  | 'hypertension'
  | 'asthma'
  | 'sickle-cell'
  | 'other'

export interface UserProfile {
  name: string
  age: string
  sex: BiologicalSex
  conditions: ConditionId[]
  language: LanguageCode
  bloodType: string
  joinedAt: number
  onboarded: boolean
}

export interface Medication {
  id: string
  name: string
  dose: string
  schedule: string
}

export type TriageLevel = 'home' | 'pharmacist' | 'clinic' | 'emergency'

export interface SymptomCheck {
  id: string
  createdAt: number
  symptomIds: string[]
  answers: Record<string, string>
  level: TriageLevel
}
