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
import type { TriageLevel, UserProfile } from './types'

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
  { id: 'other', label: 'Other', icon: Sparkles },
]

export function symptomById(id: string): Symptom | undefined {
  return SYMPTOMS.find((s) => s.id === id)
}

export interface FollowUpOption {
  value: string
  label: string
  /** weight added to the severity score */
  weight: number
  /** severity code for response key generation */
  code?: string
  /** flags that trigger emergency overrides */
  triggers?: string[]
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
      { value: 'mild', label: "Barely — I'm still going about my day", weight: 0, code: 'S1' },
      { value: 'moderate', label: "It's slowing me down", weight: 1, code: 'S2' },
      { value: 'severe', label: "I can't do my normal activities", weight: 3, code: 'S3' },
      { value: 'excruciating', label: "I can barely function at all", weight: 5, code: 'S4' },
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

// Symptom-specific follow-up questions
export const SYMPTOM_SPECIFIC_QUESTIONS: Record<string, FollowUpQuestion[]> = {
  'body-aches': [
    {
      id: 'ba-severity',
      question: 'How would you describe your body aches?',
      options: [
        { value: 'mild', label: 'Mild — uncomfortable but manageable', weight: 0, code: 'S1' },
        { value: 'moderate', label: 'Moderate — noticeably affecting my day', weight: 1, code: 'S2' },
        { value: 'severe', label: 'Severe — I can barely function', weight: 3, code: 'S3' },
        { value: 'excruciating', label: 'Excruciating — the worst I have felt', weight: 5, code: 'S4' },
      ],
    },
  ],
  'headache': [
    {
      id: 'hd-severity',
      question: 'How would you describe your headache?',
      options: [
        { value: 'mild', label: 'Mild — uncomfortable but manageable', weight: 0, code: 'S1' },
        { value: 'moderate', label: 'Moderate — affecting my concentration', weight: 1, code: 'S2' },
        { value: 'severe', label: 'Severe — hard to function', weight: 3, code: 'S3' },
        { value: 'excruciating', label: 'Excruciating — worst I have felt', weight: 5, code: 'S4' },
      ],
    },
    {
      id: 'hd-onset',
      question: 'How did the headache come on?',
      options: [
        { value: 'gradual', label: 'Gradually — it has been building', weight: 0 },
        { value: 'sudden', label: 'Suddenly — it hit hard within minutes', weight: 4, triggers: ['RED_FLAG_THUNDERCLAP'] },
        { value: 'neck', label: 'Concentrated at the back of my head and neck', weight: 4, triggers: ['RED_FLAG_NECK'] },
        { value: 'worst', label: 'Suddenly and is the most intense pain I have felt', weight: 6, triggers: ['EMERGENCY_OVERRIDE'] },
      ],
    },
  ],
  'chest-pain': [
    {
      id: 'cp-type',
      question: 'How does the chest pain feel?',
      options: [
        { value: 'sharp', label: 'Sharp pain when I breathe or cough', weight: 1, code: 'CP_SHARP' },
        { value: 'tight', label: 'Tight squeezing or pressure feeling', weight: 5, triggers: ['EMERGENCY_OVERRIDE'] },
        { value: 'crushing', label: 'Crushing — like something pressing on my chest', weight: 6, triggers: ['EMERGENCY_OVERRIDE'] },
        { value: 'spreading', label: 'Pain spreading to my arm jaw or back', weight: 6, triggers: ['EMERGENCY_OVERRIDE'] },
      ],
    },
  ],
  'stomach-pain': [
    {
      id: 'sp-location',
      question: 'Where is the pain located?',
      options: [
        { value: 'general', label: 'General — all over or hard to pinpoint', weight: 1, code: 'SP_GENERAL' },
        { value: 'upper', label: 'Upper abdomen — above my navel', weight: 2, code: 'SP_UPPER' },
        { value: 'lower-right', label: 'Lower right — below and right of my navel', weight: 3, code: 'SP_LOWER_RIGHT', triggers: ['APPENDICITIS_FLAG'] },
        { value: 'lower', label: 'Lower abdomen — across or below my navel', weight: 2, code: 'SP_LOWER' },
      ],
    },
  ],
  'difficulty-breathing': [
    {
      id: 'db-severity',
      question: 'How is your breathing affected?',
      options: [
        { value: 'mild', label: 'Slightly harder than usual after activity', weight: 1, code: 'DB_MILD' },
        { value: 'rest', label: 'Harder than usual even at rest', weight: 4, code: 'DB_REST' },
        { value: 'struggling', label: 'I am struggling to breathe right now', weight: 6, triggers: ['EMERGENCY_OVERRIDE'] },
        { value: 'sentence', label: 'I cannot complete a sentence without stopping', weight: 6, triggers: ['EMERGENCY_OVERRIDE'] },
      ],
    },
  ],
  'fatigue': [
    {
      id: 'ft-severity',
      question: 'How would you describe your fatigue?',
      options: [
        { value: 'tired', label: 'Tired — I could use more rest', weight: 0, code: 'S1' },
        { value: 'low-energy', label: 'Noticeably low energy — affecting my day', weight: 1, code: 'S2' },
        { value: 'exhausted', label: 'Exhausted — I can barely do anything', weight: 3, code: 'S3' },
        { value: 'cannot-function', label: 'I cannot get up or function at all', weight: 5, code: 'S4' },
      ],
    },
  ],
}

const LEVEL_ORDER: TriageLevel[] = [
  'home',
  'pharmacist',
  'clinic',
  'emergency',
]

// Helper function to get profile code from user conditions
function getProfileCode(userProfile: UserProfile): string {
  const conditions = userProfile.conditions || []
  
  // Check for combined conditions first
  if (conditions.includes('diabetes') && conditions.includes('hypertension')) {
    return 'D_HT'
  }
  
  // Check for pregnancy
  if (conditions.includes('pregnancy')) {
    return 'P'
  }
  
  // Single conditions in priority order
  if (conditions.includes('sickle-cell')) return 'SC'
  if (conditions.includes('asthma')) return 'AS'
  if (conditions.includes('diabetes')) return 'D'
  if (conditions.includes('hypertension')) return 'HT'
  
  // Default to healthy
  return 'H'
}

// Helper function to get severity code from answers
function getSeverityCode(answers: Record<string, string>): string {
  // Check symptom-specific severity answers first
  const severityMap: Record<string, string> = {
    'ba-severity': answers['ba-severity'],
    'hd-severity': answers['hd-severity'],
    'ft-severity': answers['ft-severity'],
  }
  
  // Map severity values to codes
  const codeMap: Record<string, string> = {
    'mild': 'S1',
    'moderate': 'S2',
    'severe': 'S3',
    'excruciating': 'S4',
    'tired': 'S1',
    'low-energy': 'S2',
    'exhausted': 'S3',
    'cannot-function': 'S4',
  }
  
  // Find the highest severity code
  for (const [, answer] of Object.entries(severityMap)) {
    if (answer && codeMap[answer]) {
      return codeMap[answer]
    }
  }
  
  // Fall back to generic severity
  const genericSeverity = answers['severity']
  if (genericSeverity && codeMap[genericSeverity]) {
    return codeMap[genericSeverity]
  }
  
  // Default to S1 if no severity specified
  return 'S1'
}

// Helper function to get symptom abbreviation
function getSymptomAbbreviation(symptomId: string): string {
  const abbreviations: Record<string, string> = {
    'fever': 'FV',
    'headache': 'HD',
    'cough': 'CG',
    'stomach-pain': 'SP',
    'body-aches': 'BA',
    'fatigue': 'FT',
    'sore-throat': 'ST',
    'dizziness': 'DZ',
    'chest-pain': 'CP',
    'difficulty-breathing': 'DB',
    'nausea': 'NA',
    'rash': 'RS',
  }
  return abbreviations[symptomId] || ''
}

// Helper function to get duration code
function getDurationCode(answers: Record<string, string>): string {
  const duration = answers['duration']
  const durationMap: Record<string, string> = {
    'today': 'T1',
    'few-days': 'T2',
    'week': 'T2',
    'month': 'T2',
  }
  return durationMap[duration || ''] || 'T1'
}

// Helper function to get location-specific code for stomach pain
function getStomachLocationCode(answers: Record<string, string>): string {
  const location = answers['sp-location']
  const locationMap: Record<string, string> = {
    'general': 'SP_GENERAL',
    'upper': 'SP_UPPER',
    'lower-right': 'SP_LOWER_RIGHT',
    'lower': 'SP_LOWER',
  }
  return locationMap[location || ''] || ''
}

// Helper function to get chest pain type code
function getChestPainCode(answers: Record<string, string>): string {
  const type = answers['cp-type']
  const typeMap: Record<string, string> = {
    'sharp': 'CP_SHARP',
  }
  return typeMap[type || ''] || ''
}

// Helper function to get dizziness type code
function getDizzinessCode(answers: Record<string, string>): string {
  // This would need specific dizziness follow-up questions
  // For now, return generic based on severity
  const severity = answers['severity']
  if (severity === 'excruciating') return 'DZ_SUDDEN'
  if (severity === 'severe') return 'DZ_CONSTANT'
  if (severity === 'moderate') return 'DZ_LIGHTHEADED'
  return 'DZ_SPINNING'
}

// Helper function to get rash type code
function getRashCode(answers: Record<string, string>): string {
  const temperature = answers['temperature']
  if (temperature === 'high') return 'RS_FEVER'
  return 'RS_ITCHY'
}

// Helper function to get nausea severity code
function getNauseaCode(answers: Record<string, string>): string {
  const severity = answers['severity']
  if (severity === 'severe' || severity === 'excruciating') return 'S3_S4'
  return 'S1_S2'
}

// Helper function to collect all triggered flags
function collectTriggeredFlags(answers: Record<string, string>): string[] {
  const flags: string[] = []
  
  // Check all symptom-specific questions for triggers
  for (const questions of Object.values(SYMPTOM_SPECIFIC_QUESTIONS)) {
    for (const question of questions) {
      const answer = answers[question.id]
      if (!answer) continue
      const option = question.options.find((o) => o.value === answer)
      if (option?.triggers) {
        flags.push(...option.triggers)
      }
    }
  }
  
  return flags
}

export function triage(
  symptomIds: string[],
  answers: Record<string, string>,
  userProfile: UserProfile,
): { level: TriageLevel; responseKey: string } {
  const conditions = userProfile.conditions || []
  
  // Check for automatic override triggers FIRST
  const triggeredFlags = collectTriggeredFlags(answers)
  
  // Check emergency override triggers
  if (triggeredFlags.includes('EMERGENCY_OVERRIDE')) {
    return { level: 'emergency', responseKey: 'EMERGENCY_OVERRIDE' }
  }
  
  if (triggeredFlags.includes('RED_FLAG_THUNDERCLAP')) {
    return { level: 'emergency', responseKey: 'RED_FLAG_THUNDERCLAP' }
  }
  
  if (triggeredFlags.includes('RED_FLAG_NECK')) {
    return { level: 'emergency', responseKey: 'RED_FLAG_NECK' }
  }
  
  // Check appendicitis flag with severity
  if (triggeredFlags.includes('APPENDICITIS_FLAG')) {
    const severity = getSeverityCode(answers)
    if (severity === 'S3' || severity === 'S4') {
      return { level: 'emergency', responseKey: 'APPENDICITIS_FLAG' }
    }
  }
  
  // Sickle cell overrides
  if (conditions.includes('sickle-cell')) {
    // Any pain symptom at S3/S4
    const hasPain = symptomIds.some(id => ['body-aches', 'stomach-pain', 'headache'].includes(id))
    const severity = getSeverityCode(answers)
    if (hasPain && (severity === 'S3' || severity === 'S4')) {
      return { level: 'emergency', responseKey: 'SC_BA_S3_S4' }
    }
    // Difficulty breathing any severity
    if (symptomIds.includes('difficulty-breathing')) {
      return { level: 'emergency', responseKey: 'AS_DB_ANY' }
    }
    // Cough any severity
    if (symptomIds.includes('cough')) {
      return { level: 'clinic', responseKey: 'SC_CG_ANY' }
    }
  }
  
  // Pregnant user overrides
  if (conditions.includes('pregnancy')) {
    const stomachLocation = getStomachLocationCode(answers)
    if (stomachLocation === 'SP_LOWER') {
      return { level: 'clinic', responseKey: 'P_SP_LOWER_ANY' }
    }
    if (stomachLocation && (stomachLocation === 'SP_UPPER' || stomachLocation === 'SP_LOWER')) {
      const severity = getSeverityCode(answers)
      if (severity === 'S2' || severity === 'S3' || severity === 'S4') {
        return { level: 'emergency', responseKey: 'P_SP_UPPER_S2_S3_S4' }
      }
    }
    // Stomach pain with fever
    if (symptomIds.includes('stomach-pain') && symptomIds.includes('fever')) {
      return { level: 'emergency', responseKey: 'P_FV_ANY_S3_S4' }
    }
  }
  
  // Diabetic user overrides
  if (conditions.includes('diabetes')) {
    const appetite = answers['appetite']
    if (appetite === 'none') {
      return { level: 'emergency', responseKey: 'D_NA_ANY' }
    }
  }
  
  // Duration override - any symptom lasting over a month
  if (answers['duration'] === 'month') {
    return { level: 'clinic', responseKey: 'UNCERTAINTY_OVERRIDE' }
  }
  
  // Other symptom only
  if (symptomIds.length === 1 && symptomIds[0] === 'other') {
    return { level: 'pharmacist', responseKey: 'UNCERTAINTY_OVERRIDE' }
  }
  
  // Generate response key based on profile, symptoms, and severity
  const profileCode = getProfileCode(userProfile)
  const severityCode = getSeverityCode(answers)
  const durationCode = getDurationCode(answers)
  
  // Build symptom abbreviations
  const symptomAbbrs = symptomIds
    .map(id => getSymptomAbbreviation(id))
    .filter(Boolean)
    .join('_')
  
  // Special cases for specific symptom combinations
  if (symptomIds.includes('stomach-pain')) {
    const locationCode = getStomachLocationCode(answers)
    if (locationCode) {
      const responseKey = `${profileCode}_${locationCode}_${severityCode}`
      return { level: determineLevelFromKey(responseKey), responseKey }
    }
  }
  
  if (symptomIds.includes('chest-pain')) {
    const chestCode = getChestPainCode(answers)
    if (chestCode) {
      const responseKey = `${profileCode}_${chestCode}`
      return { level: determineLevelFromKey(responseKey), responseKey }
    }
  }
  
  if (symptomIds.includes('dizziness')) {
    const dizzinessCode = getDizzinessCode(answers)
    const responseKey = `${profileCode}_${dizzinessCode}`
    return { level: determineLevelFromKey(responseKey), responseKey }
  }
  
  if (symptomIds.includes('rash')) {
    const rashCode = getRashCode(answers)
    const responseKey = `${profileCode}_${rashCode}`
    return { level: determineLevelFromKey(responseKey), responseKey }
  }
  
  if (symptomIds.includes('nausea')) {
    const nauseaCode = getNauseaCode(answers)
    const responseKey = `${profileCode}_NA_${nauseaCode}`
    return { level: determineLevelFromKey(responseKey), responseKey }
  }
  
  // Standard response key format: PROFILE_SYMPTOMS_SEVERITY_DURATION
  let responseKey: string
  if (symptomAbbrs) {
    responseKey = `${profileCode}_${symptomAbbrs}_${severityCode}_${durationCode}`
  } else {
    responseKey = `${profileCode}_ANY_${severityCode}`
  }
  
  // Handle special cases for sickle cell and pregnancy
  if (profileCode === 'SC') {
    if (symptomIds.includes('fever')) {
      responseKey = 'SC_FV_ANY'
    } else if (symptomIds.includes('fatigue')) {
      responseKey = 'SC_FT_ANY'
    } else if (symptomIds.includes('sore-throat')) {
      responseKey = 'SC_ST_ANY'
    } else if (symptomIds.includes('stomach-pain')) {
      responseKey = 'SC_SP_ANY'
    }
  }
  
  if (profileCode === 'P') {
    if (symptomIds.includes('fever')) {
      responseKey = `P_FV_ANY_${severityCode}`
    }
  }
  
  // Calculate triage level based on score
  let score = symptomIds.length >= 4 ? 2 : symptomIds.length >= 2 ? 1 : 0
  
  for (const q of FOLLOW_UP_QUESTIONS) {
    const answer = answers[q.id]
    if (!answer) continue
    const opt = q.options.find((o) => o.value === answer)
    if (opt) score += opt.weight
  }
  
  // Add weights from symptom-specific questions
  for (const questions of Object.values(SYMPTOM_SPECIFIC_QUESTIONS)) {
    for (const question of questions) {
      const answer = answers[question.id]
      if (!answer) continue
      const option = question.options.find((o) => o.value === answer)
      if (option) score += option.weight
    }
  }
  
  let index = 0
  if (score >= 8) index = 3
  else if (score >= 5) index = 2
  else if (score >= 2) index = 1
  
  const level = LEVEL_ORDER[index]
  
  return { level, responseKey }
}

// Helper function to determine level from response key
function determineLevelFromKey(responseKey: string): TriageLevel {
  // Emergency-level keys
  if (responseKey.includes('S4') || 
      responseKey.includes('EMERGENCY') ||
      responseKey.includes('RED_FLAG') ||
      responseKey.includes('APPENDICITIS') ||
      responseKey.includes('STROKE')) {
    return 'emergency'
  }
  
  // Clinic-level keys
  if (responseKey.includes('S3') ||
      responseKey.includes('PROLONGED') ||
      responseKey.includes('CLINIC')) {
    return 'clinic'
  }
  
  // Pharmacist-level keys
  if (responseKey.includes('S2') ||
      responseKey.includes('UNCERTAINTY')) {
    return 'pharmacist'
  }
  
  // Default to home
  return 'home'
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
