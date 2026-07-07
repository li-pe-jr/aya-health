import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { Screen } from '@/components/Screen'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Chip } from '@/components/Chip'
import { StepDots } from '@/components/Progress'
import { cn } from '@/lib/cn'
import { CONDITIONS, LANGUAGES, SEX_OPTIONS, MARITAL_STATUS_OPTIONS, RELIGION_OPTIONS } from '@/lib/constants'
import { useAya } from '@/lib/store'
import type {
  BiologicalSex,
  ConditionId,
  LanguageCode,
  MaritalStatus,
  Religion,
} from '@/lib/types'

const TOTAL = 5

export function Onboarding() {
  const navigate = useNavigate()
  const { completeOnboarding } = useAya()

  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [sex, setSex] = useState<BiologicalSex>('unspecified')
  const [conditions, setConditions] = useState<ConditionId[]>([])
  const [conditionsOther, setConditionsOther] = useState('')
  const [language, setLanguage] = useState<LanguageCode>('en')
  const [maritalStatus, setMaritalStatus] = useState<MaritalStatus>('prefer-not-to-say')
  const [maritalStatusOther, setMaritalStatusOther] = useState('')
  const [religion, setReligion] = useState<Religion>('prefer-not-to-say')
  const [religionOther, setReligionOther] = useState('')

  const toggleCondition = (id: ConditionId) => {
    setConditions((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )
  }

  const finish = () => {
    completeOnboarding({
      name: name.trim() || 'Friend',
      age,
      sex,
      conditions,
      conditionsOther,
      language,
      maritalStatus,
      maritalStatusOther,
      religion,
      religionOther,
    })
    navigate('/home', { replace: true })
  }

  const goNext = () => {
    if (step < TOTAL) setStep((s) => s + 1)
    else finish()
  }

  const goBack = () => {
    if (step > 1) setStep((s) => s - 1)
    else navigate('/')
  }

  const canContinue = step === 1 ? name.trim().length > 0 : true
  const canSkip = step === 3 || step === 4 || step === 5

  return (
    <Screen contentClassName="pt-4">
      {/* header: progress + back */}
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-cream/80 transition-colors hover:text-cloud"
            aria-label="Go back"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-xs font-medium text-cream/50">
            Step {step} of {TOTAL}
          </span>
          {canSkip ? (
            <button
              type="button"
              onClick={goNext}
              className="text-sm font-medium text-cream/60 hover:text-cloud"
            >
              Skip
            </button>
          ) : (
            <span className="w-10" />
          )}
        </div>
        <StepDots total={TOTAL} current={step} />
      </div>

      <div className="flex-1">
        {step === 1 && (
          <StepName name={name} setName={setName} onEnter={goNext} />
        )}
        {step === 2 && (
          <StepAbout
            age={age}
            setAge={setAge}
            sex={sex}
            setSex={setSex}
          />
        )}
        {step === 3 && (
          <StepConditions
            conditions={conditions}
            conditionsOther={conditionsOther}
            setConditionsOther={setConditionsOther}
            toggle={toggleCondition}
            clear={() => setConditions([])}
          />
        )}
        {step === 4 && (
          <StepLanguage language={language} setLanguage={setLanguage} />
        )}
        {step === 5 && (
          <StepPersonal
            maritalStatus={maritalStatus}
            setMaritalStatus={setMaritalStatus}
            maritalStatusOther={maritalStatusOther}
            setMaritalStatusOther={setMaritalStatusOther}
            religion={religion}
            setReligion={setReligion}
            religionOther={religionOther}
            setReligionOther={setReligionOther}
          />
        )}
      </div>

      <Button
        fullWidth
        className="mt-8"
        disabled={!canContinue}
        rightIcon={
          step === TOTAL ? <Check size={18} /> : <ArrowRight size={18} />
        }
        onClick={goNext}
      >
        {step === TOTAL ? 'Finish' : 'Continue'}
      </Button>
    </Screen>
  )
}

function StepHeading({ title, sub }: { title: string; sub: string }) {
  return (
    <div className="mb-7">
      <h1 className="font-display text-[27px] font-bold leading-tight text-cloud">
        {title}
      </h1>
      <p className="mt-2 text-[15px] leading-relaxed text-cream/70">{sub}</p>
    </div>
  )
}

function StepName({
  name,
  setName,
  onEnter,
}: {
  name: string
  setName: (v: string) => void
  onEnter: () => void
}) {
  return (
    <div>
      <StepHeading
        title="What should Aya call you?"
        sub="Just your first name — so this feels a little more like home."
      />
      <Input
        id="name"
        autoFocus
        placeholder="e.g. Ama"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && name.trim()) onEnter()
        }}
      />
    </div>
  )
}

function StepAbout({
  age,
  setAge,
  sex,
  setSex,
}: {
  age: string
  setAge: (v: string) => void
  sex: BiologicalSex
  setSex: (v: BiologicalSex) => void
}) {
  return (
    <div>
      <StepHeading
        title="Tell Aya about yourself"
        sub="This helps Aya give guidance that fits you better."
      />
      <div className="space-y-6">
        <Input
          id="age"
          label="Age"
          inputMode="numeric"
          placeholder="e.g. 28"
          value={age}
          onChange={(e) =>
            setAge(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))
          }
        />
        <div>
          <span className="mb-2 block text-sm font-medium text-cream/80">
            Biological sex
          </span>
          <div className="grid gap-2.5">
            {SEX_OPTIONS.map((opt) => {
              const active = sex === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setSex(opt.value)}
                  className={cn(
                    'flex h-14 items-center justify-between rounded-2xl border px-4 text-left text-[15px] font-medium transition-all',
                    active
                      ? 'border-gold bg-gold/12 text-cloud'
                      : 'border-white/12 bg-white/[0.03] text-cream/80 hover:border-gold/40',
                  )}
                >
                  {opt.label}
                  <span
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full border',
                      active ? 'border-gold bg-gold' : 'border-white/25',
                    )}
                  >
                    {active && <Check size={13} className="text-obsidian" />}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

function StepConditions({
  conditions,
  conditionsOther,
  setConditionsOther,
  toggle,
  clear,
}: {
  conditions: ConditionId[]
  conditionsOther: string
  setConditionsOther: (v: string) => void
  toggle: (id: ConditionId) => void
  clear: () => void
}) {
  const none = conditions.length === 0
  const showOtherInput = conditions.includes('other')
  return (
    <div>
      <StepHeading
        title="Any existing conditions?"
        sub="Tap any that apply. You can always update this later."
      />
      <div className="flex flex-wrap gap-2.5">
        {CONDITIONS.map((c) => (
          <Chip
            key={c.id}
            label={c.label}
            selected={conditions.includes(c.id)}
            onClick={() => toggle(c.id)}
          />
        ))}
        <Chip label="None" selected={none} onClick={clear} />
      </div>
      {showOtherInput && (
        <Input
          id="conditions-other"
          className="mt-3"
          placeholder="Please specify"
          value={conditionsOther}
          onChange={(e) => setConditionsOther(e.target.value)}
        />
      )}
    </div>
  )
}

function StepPersonal({
  maritalStatus,
  setMaritalStatus,
  maritalStatusOther,
  setMaritalStatusOther,
  religion,
  setReligion,
  religionOther,
  setReligionOther,
}: {
  maritalStatus: MaritalStatus
  setMaritalStatus: (v: MaritalStatus) => void
  maritalStatusOther: string
  setMaritalStatusOther: (v: string) => void
  religion: Religion
  setReligion: (v: Religion) => void
  religionOther: string
  setReligionOther: (v: string) => void
}) {
  return (
    <div>
      <StepHeading
        title="About you"
        sub="This helps Aya understand you better. All optional."
      />
      <div className="space-y-6">
        <div>
          <span className="mb-2 block text-sm font-medium text-cream/80">
            Marital status
          </span>
          <div className="grid gap-2.5">
            {MARITAL_STATUS_OPTIONS.map((opt) => {
              const active = maritalStatus === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setMaritalStatus(opt.value)}
                  className={cn(
                    'flex h-14 items-center justify-between rounded-2xl border px-4 text-left text-[15px] font-medium transition-all',
                    active
                      ? 'border-gold bg-gold/12 text-cloud'
                      : 'border-white/12 bg-white/[0.03] text-cream/80 hover:border-gold/40',
                  )}
                >
                  {opt.label}
                  <span
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full border',
                      active ? 'border-gold bg-gold' : 'border-white/25',
                    )}
                  >
                    {active && <Check size={13} className="text-obsidian" />}
                  </span>
                </button>
              )
            })}
          </div>
          {maritalStatus === 'other' && (
            <Input
              id="marital-status-other"
              className="mt-3"
              placeholder="Please specify"
              value={maritalStatusOther}
              onChange={(e) => setMaritalStatusOther(e.target.value)}
            />
          )}
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-cream/80">
            Religion
          </span>
          <div className="grid gap-2.5">
            {RELIGION_OPTIONS.map((opt) => {
              const active = religion === opt.value
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setReligion(opt.value)}
                  className={cn(
                    'flex h-14 items-center justify-between rounded-2xl border px-4 text-left text-[15px] font-medium transition-all',
                    active
                      ? 'border-gold bg-gold/12 text-cloud'
                      : 'border-white/12 bg-white/[0.03] text-cream/80 hover:border-gold/40',
                  )}
                >
                  {opt.label}
                  <span
                    className={cn(
                      'flex h-5 w-5 items-center justify-center rounded-full border',
                      active ? 'border-gold bg-gold' : 'border-white/25',
                    )}
                  >
                    {active && <Check size={13} className="text-obsidian" />}
                  </span>
                </button>
              )
            })}
          </div>
          {religion === 'other' && (
            <Input
              id="religion-other"
              className="mt-3"
              placeholder="Please specify"
              value={religionOther}
              onChange={(e) => setReligionOther(e.target.value)}
            />
          )}
        </div>
      </div>
    </div>
  )
}

function StepLanguage({
  language,
  setLanguage,
}: {
  language: LanguageCode
  setLanguage: (v: LanguageCode) => void
}) {
  return (
    <div>
      <StepHeading
        title="Choose your language"
        sub="Aya will speak with you in the language you're most at ease with."
      />
      <div className="grid gap-2.5">
        {LANGUAGES.map((lang) => {
          const active = language === lang.code
          return (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              className={cn(
                'flex h-16 items-center gap-3.5 rounded-2xl border px-4 text-left transition-all',
                active
                  ? 'border-gold bg-gold/12'
                  : 'border-white/12 bg-white/[0.03] hover:border-gold/40',
              )}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-obsidian text-2xl">
                {lang.flag}
              </span>
              <span className="flex-1">
                <span className="block text-[15px] font-semibold text-cloud">
                  {lang.label}
                </span>
                <span className="block text-xs text-cream/55">
                  {lang.native}
                </span>
              </span>
              <span
                className={cn(
                  'flex h-5 w-5 items-center justify-center rounded-full border',
                  active ? 'border-gold bg-gold' : 'border-white/25',
                )}
              >
                {active && <Check size={13} className="text-obsidian" />}
              </span>
            </button>
          )
        })}
      </div>
      <p className="mt-4 text-xs text-cream/50">
        Full language support coming soon
      </p>
    </div>
  )
}
