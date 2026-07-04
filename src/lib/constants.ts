import type { BiologicalSex, ConditionId, LanguageCode } from './types'

export const CONDITIONS: { id: ConditionId; label: string }[] = [
  { id: 'diabetes', label: 'Diabetes' },
  { id: 'hypertension', label: 'Hypertension' },
  { id: 'asthma', label: 'Asthma' },
  { id: 'sickle-cell', label: 'Sickle Cell' },
  { id: 'other', label: 'Other' },
]

export const SEX_OPTIONS: { value: BiologicalSex; label: string }[] = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
  { value: 'unspecified', label: 'Prefer not to say' },
]

export const LANGUAGES: {
  code: LanguageCode
  label: string
  native: string
  flag: string
}[] = [
  { code: 'en', label: 'English', native: 'English', flag: '🇬🇭' },
  { code: 'twi', label: 'Twi', native: 'Twi (Akan)', flag: '🪘' },
  { code: 'ga', label: 'Ga', native: 'Gã', flag: '🐚' },
  { code: 'ewe', label: 'Ewe', native: 'Eʋegbe', flag: '🌿' },
]

export function conditionLabel(id: ConditionId): string {
  return CONDITIONS.find((c) => c.id === id)?.label ?? id
}

export function languageLabel(code: LanguageCode): string {
  return LANGUAGES.find((l) => l.code === code)?.label ?? code
}
