import {
  Thermometer,
  Brain,
  Wind,
  Soup,
  Bone,
  BatteryLow,
  Speech,
  Waypoints,
  HeartPulse,
  Stethoscope,
  Salad,
  Sparkles,
  type LucideIcon,
} from 'lucide-react'
import type { TriageLevel } from './types'

export interface Symptom {
  id: string
  label: string
  icon: LucideIcon
  /** symptoms that push the triage towards emergency care */
  red?: boolean
}

export const SYMPTOMS: Symptom[] = [
  { id: 'fever', label: 'Fever', icon: Thermometer },
  { id: 'headache', label: 'Headache', icon: Brain },
  { id: 'cough', label: 'Cough', icon: Wind },
  { id: 'stomach-pain', label: 'Stomach Pain', icon: Soup },
  { id: 'body-aches', label: 'Body Aches', icon: Bone },
  { id: 'fatigue', label: 'Fatigue', icon: BatteryLow },
  { id: 'sore-throat', label: 'Sore Throat', icon: Speech },
  { id: 'dizziness', label: 'Dizziness', icon: Waypoints },
  { id: 'chest-pain', label: 'Chest Pain', icon: HeartPulse, red: true },
  {
    id: 'difficulty-breathing',
    label: 'Difficulty Breathing',
    icon: Stethoscope,
    red: true,
  },
  { id: 'nausea', label: 'Nausea', icon: Salad },
  { id: 'rash', label: 'Rash', icon: Sparkles },
]

export function symptomById(id: string): Symptom | undefined {
  return SYMPTOMS.find((s) => s.id === id)
}

export interface FollowUpOption {
  value: string
  label: string
  /** weight added to the severity score */
  weight: number
}

export interface FollowUpQuestion {
  id: string
  question: string
  options: FollowUpOption[]
}

export const FOLLOW_UP_QUESTIONS: FollowUpQuestion[] = [
  {
    id: 'duration',
    question: 'How long have you had these symptoms?',
    options: [
      { value: 'today', label: 'Just started today', weight: 0 },
      { value: 'few-days', label: 'A few days', weight: 1 },
      { value: 'week', label: 'More than a week', weight: 2 },
      { value: 'month', label: 'Over a month', weight: 3 },
    ],
  },
  {
    id: 'severity',
    question: 'How much is this affecting your day?',
    options: [
      { value: 'mild', label: "Barely — I'm still going about my day", weight: 0 },
      { value: 'moderate', label: "It's slowing me down", weight: 1 },
      { value: 'severe', label: "I can't do my normal activities", weight: 3 },
    ],
  },
  {
    id: 'temperature',
    question: 'Do you feel hot or have a measured fever?',
    options: [
      { value: 'no', label: 'No, I feel normal', weight: 0 },
      { value: 'warm', label: 'A little warm', weight: 1 },
      { value: 'high', label: 'Yes, quite hot (38°C+)', weight: 2 },
    ],
  },
  {
    id: 'appetite',
    question: 'How is your eating and drinking?',
    options: [
      { value: 'normal', label: 'Eating and drinking normally', weight: 0 },
      { value: 'reduced', label: 'Less than usual', weight: 1 },
      { value: 'none', label: "Can't keep food or water down", weight: 3 },
    ],
  },
]

const LEVEL_ORDER: TriageLevel[] = [
  'home',
  'pharmacist',
  'clinic',
  'emergency',
]

export function triage(
  symptomIds: string[],
  answers: Record<string, string>,
): TriageLevel {
  // Any red-flag symptom escalates straight to emergency.
  const hasRedFlag = symptomIds.some((id) => symptomById(id)?.red)
  if (hasRedFlag) return 'emergency'

  let score = symptomIds.length >= 4 ? 2 : symptomIds.length >= 2 ? 1 : 0

  for (const q of FOLLOW_UP_QUESTIONS) {
    const answer = answers[q.id]
    if (!answer) continue
    const opt = q.options.find((o) => o.value === answer)
    if (opt) score += opt.weight
  }

  let index = 0
  if (score >= 8) index = 3
  else if (score >= 5) index = 2
  else if (score >= 2) index = 1

  return LEVEL_ORDER[index]
}

export interface TriageMeta {
  level: TriageLevel
  title: string
  colorVar: string
  headline: string
  explanation: string
  steps: string[]
}

export const TRIAGE_META: Record<TriageLevel, TriageMeta> = {
  home: {
    level: 'home',
    title: 'Home Care',
    colorVar: 'var(--color-status-home)',
    headline: 'You can look after this at home',
    explanation:
      "From what you've shared, this looks mild and should ease with rest. Take it easy today and keep an eye on how you feel.",
    steps: [
      'Rest and drink plenty of clean water',
      'Eat light, warm meals when you can',
      'Check in with Aya again if things change',
    ],
  },
  pharmacist: {
    level: 'pharmacist',
    title: 'See a Pharmacist',
    colorVar: 'var(--color-status-pharm)',
    headline: 'A pharmacist can help you feel better',
    explanation:
      "Your symptoms are uncomfortable but manageable. A licensed pharmacist can suggest safe over-the-counter relief and tell you what to watch for.",
    steps: [
      'Visit a nearby licensed pharmacy',
      'Describe your symptoms and any conditions you have',
      'Ask which medicine is safe for you and how to take it',
    ],
  },
  clinic: {
    level: 'clinic',
    title: 'Visit a Clinic',
    colorVar: 'var(--color-status-clinic)',
    headline: "It's worth seeing a clinician",
    explanation:
      "These symptoms have been around a while or feel strong. A nurse or doctor at a clinic should take a proper look to be sure.",
    steps: [
      'Book or walk in to a clinic today',
      'Bring a list of your symptoms and medications',
      'Follow the clinician’s advice and any prescription',
    ],
  },
  emergency: {
    level: 'emergency',
    title: 'Seek Emergency Care',
    colorVar: 'var(--color-status-emergency)',
    headline: 'Please get help right away',
    explanation:
      "Some of what you've described can be serious and shouldn't wait. It's safest to get to emergency care now — you don't have to manage this alone.",
    steps: [
      'Go to the nearest hospital emergency department',
      'Call an ambulance on 112 if you cannot travel safely',
      'Ask someone to stay with you until you are seen',
    ],
  },
}
