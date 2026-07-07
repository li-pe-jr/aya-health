export type BiologicalSex = 'male' | 'female' | 'unspecified'

export type LanguageCode = 'en' | 'twi' | 'ga' | 'ewe'

export type ConditionId =
  | 'diabetes'
  | 'hypertension'
  | 'asthma'
  | 'sickle-cell'
  | 'other'

export type MaritalStatus = 'single' | 'married' | 'divorced' | 'widowed' | 'prefer-not-to-say' | 'other'

export type Religion = 'christianity' | 'islam' | 'traditional-african' | 'other' | 'prefer-not-to-say'

export interface UserProfile {
  name: string
  age: string
  sex: BiologicalSex
  conditions: ConditionId[]
  conditionsOther?: string
  language: LanguageCode
  bloodType: string
  maritalStatus: MaritalStatus
  maritalStatusOther?: string
  religion: Religion
  religionOther?: string
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
