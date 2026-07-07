import type { BiologicalSex, ConditionId, LanguageCode, MaritalStatus, Religion } from './types'

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

export const MARITAL_STATUS_OPTIONS: { value: MaritalStatus; label: string }[] = [
  { value: 'single', label: 'Single' },
  { value: 'married', label: 'Married' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
  { value: 'other', label: 'Other' },
]

export const RELIGION_OPTIONS: { value: Religion; label: string }[] = [
  { value: 'christianity', label: 'Christianity' },
  { value: 'islam', label: 'Islam' },
  { value: 'traditional-african', label: 'Traditional/African' },
  { value: 'other', label: 'Other' },
  { value: 'prefer-not-to-say', label: 'Prefer not to say' },
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

export function maritalStatusLabel(status: MaritalStatus): string {
  return MARITAL_STATUS_OPTIONS.find((s) => s.value === status)?.label ?? status
}

export function religionLabel(religion: Religion): string {
  return RELIGION_OPTIONS.find((r) => r.value === religion)?.label ?? religion
}

export function languageLabel(code: LanguageCode): string {
  return LANGUAGES.find((l) => l.code === code)?.label ?? code
}
