import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Cake,
  Droplet,
  HeartPulse,
  Pill,
  Pencil,
  Languages,
  Bell,
  ShieldCheck,
  Info,
  ChevronRight,
  Stethoscope,
  LogOut,
  type LucideIcon,
} from 'lucide-react'
import { Screen } from '@/components/Screen'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Sheet } from '@/components/Sheet'
import { Toggle } from '@/components/Toggle'
import { EmptyState } from '@/components/Feedback'
import { useAya } from '@/lib/store'
import {
  CONDITIONS,
  LANGUAGES,
  SEX_OPTIONS,
  conditionLabel,
  languageLabel,
} from '@/lib/constants'
import { joinedLabel, relativeDay } from '@/lib/format'
import { symptomById, TRIAGE_META } from '@/lib/symptoms'
import type {
  BiologicalSex,
  ConditionId,
  LanguageCode,
} from '@/lib/types'
import { cn } from '@/lib/cn'

type InfoKind = 'privacy' | 'about' | null

export function Profile() {
  const navigate = useNavigate()
  const { profile, checks, meds, reminder, setReminder, resetAll } = useAya()

  const [editing, setEditing] = useState(false)
  const [info, setInfo] = useState<InfoKind>(null)

  const initial = (profile.name || 'A').charAt(0).toUpperCase()
  const conditionText =
    profile.conditions.length > 0
      ? profile.conditions.map(conditionLabel).join(', ')
      : 'None'

  return (
    <Screen withNav>
      {/* identity */}
      <header className="mb-6 flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-forest to-amethyst text-2xl font-bold text-cloud ring-1 ring-gold/40">
          {initial}
        </div>
        <div className="flex-1">
          <h1 className="font-display text-[22px] font-bold text-cloud">
            {profile.name || 'Friend'}
          </h1>
          <p className="text-[13px] text-cream/55">{joinedLabel(profile.joinedAt)}</p>
        </div>
      </header>

      {/* health summary */}
      <section className="grid grid-cols-2 gap-3">
        <SummaryCard
          icon={Cake}
          label="Age"
          value={profile.age ? `${profile.age} yrs` : 'Not set'}
        />
        <SummaryCard
          icon={Droplet}
          label="Blood Type"
          value={profile.bloodType || 'Not set'}
        />
        <SummaryCard
          icon={HeartPulse}
          label="Conditions"
          value={conditionText}
        />
        <SummaryCard
          icon={Pill}
          label="Medications"
          value={
            meds.length > 0
              ? `${meds.length} tracked`
              : 'None'
          }
        />
      </section>

      <Button
        variant="outline"
        fullWidth
        size="md"
        className="mt-4"
        leftIcon={<Pencil size={16} />}
        onClick={() => setEditing(true)}
      >
        Edit profile
      </Button>

      {/* recent checks */}
      <section className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-cream/80">
            Recent symptom checks
          </h2>
          {checks.length > 0 && (
            <button
              type="button"
              onClick={() => navigate('/records')}
              className="text-xs font-medium text-gold hover:text-gold-soft"
            >
              See all
            </button>
          )}
        </div>
        {checks.length === 0 ? (
          <EmptyState
            icon={<Stethoscope size={24} />}
            title="No checks yet"
            description="Your symptom check history will appear here."
          />
        ) : (
          <ul className="space-y-2.5">
            {checks.slice(0, 3).map((check) => {
              const meta = TRIAGE_META[check.level]
              const first = symptomById(check.symptomIds[0])?.label
              const extra = check.symptomIds.length - 1
              return (
                <li key={check.id}>
                  <div className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.03] p-3.5">
                    <span
                      className="h-9 w-9 shrink-0 rounded-full"
                      style={{ backgroundColor: meta.colorVar }}
                    />
                    <div className="flex-1">
                      <p className="text-[14px] font-semibold text-cloud">
                        {meta.title}
                      </p>
                      <p className="text-xs text-cream/55">
                        {first
                          ? `${first}${extra > 0 ? ` +${extra} more` : ''}`
                          : 'General check-in'}
                      </p>
                    </div>
                    <span className="text-xs text-cream/45">
                      {relativeDay(check.createdAt)}
                    </span>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      {/* settings */}
      <section className="mt-8">
        <h2 className="mb-3 text-sm font-semibold text-cream/80">Settings</h2>
        <Card accent="none" className="divide-y divide-white/6 p-0">
          <SettingRow
            icon={Languages}
            label="Language"
            value={languageLabel(profile.language)}
            onClick={() => setEditing(true)}
          />
          <div className="flex items-center gap-3.5 px-4 py-4">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest/40 text-gold">
              <Bell size={18} />
            </span>
            <div className="flex-1">
              <p className="text-[15px] font-medium text-cloud">Notifications</p>
              <p className="text-xs text-cream/55">Gentle check-in reminders</p>
            </div>
            <Toggle
              checked={reminder}
              onChange={setReminder}
              label="Notifications"
            />
          </div>
          <SettingRow
            icon={ShieldCheck}
            label="Privacy"
            onClick={() => setInfo('privacy')}
          />
          <SettingRow
            icon={Info}
            label="About Aya"
            onClick={() => setInfo('about')}
          />
        </Card>

        <button
          type="button"
          onClick={() => {
            resetAll()
            navigate('/', { replace: true })
          }}
          className="mx-auto mt-6 flex items-center gap-2 text-sm font-medium text-cream/45 hover:text-status-emergency"
        >
          <LogOut size={16} /> Reset & sign out
        </button>
      </section>

      <EditProfileSheet open={editing} onClose={() => setEditing(false)} />
      <Sheet
        open={info !== null}
        onClose={() => setInfo(null)}
        title={info === 'privacy' ? 'Your privacy' : 'About Aya'}
      >
        {info === 'privacy' ? (
          <div className="space-y-3 text-[15px] leading-relaxed text-cream/80">
            <p>
              Aya keeps your health information on your own device. Nothing you
              share here is sent to a server or seen by anyone else.
            </p>
            <p>
              You're always in control — use{' '}
              <span className="text-cloud">Reset &amp; sign out</span> to clear
              everything at any time.
            </p>
          </div>
        ) : (
          <div className="space-y-3 text-[15px] leading-relaxed text-cream/80">
            <p>
              Aya is a warm, Ghanaian health companion by{' '}
              <span className="text-cloud">Radix Studio</span> — like a trusted
              friend who happens to know about health.
            </p>
            <p className="text-cream/60">
              Aya offers guidance, not a diagnosis. Always seek professional care
              for anything serious or urgent.
            </p>
            <p className="text-xs text-cream/40">Version 1.0.0</p>
          </div>
        )}
      </Sheet>
    </Screen>
  )
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon
  label: string
  value: string
}) {
  return (
    <Card accent="gold" className="p-4">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest/40 text-gold">
        <Icon size={18} />
      </span>
      <p className="mt-3 text-xs font-medium text-cream/55">{label}</p>
      <p className="mt-0.5 truncate text-[15px] font-semibold text-cloud">
        {value}
      </p>
    </Card>
  )
}

function SettingRow({
  icon: Icon,
  label,
  value,
  onClick,
}: {
  icon: LucideIcon
  label: string
  value?: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex w-full items-center gap-3.5 px-4 py-4 text-left"
    >
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-forest/40 text-gold">
        <Icon size={18} />
      </span>
      <span className="flex-1 text-[15px] font-medium text-cloud">{label}</span>
      {value && <span className="text-sm text-cream/55">{value}</span>}
      <ChevronRight size={18} className="text-cream/35" />
    </button>
  )
}

function EditProfileSheet({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const { profile, updateProfile } = useAya()
  const [name, setName] = useState(profile.name)
  const [age, setAge] = useState(profile.age)
  const [bloodType, setBloodType] = useState(profile.bloodType)
  const [sex, setSex] = useState<BiologicalSex>(profile.sex)
  const [conditions, setConditions] = useState<ConditionId[]>(
    profile.conditions,
  )
  const [language, setLanguage] = useState<LanguageCode>(profile.language)

  // keep local form in sync when reopened
  const [seenOpen, setSeenOpen] = useState(false)
  if (open && !seenOpen) {
    setSeenOpen(true)
    setName(profile.name)
    setAge(profile.age)
    setBloodType(profile.bloodType)
    setSex(profile.sex)
    setConditions(profile.conditions)
    setLanguage(profile.language)
  }
  if (!open && seenOpen) setSeenOpen(false)

  const toggleCondition = (id: ConditionId) =>
    setConditions((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    )

  const save = () => {
    updateProfile({
      name: name.trim() || 'Friend',
      age,
      bloodType: bloodType.trim(),
      sex,
      conditions,
      language,
    })
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="Edit profile">
      <div className="space-y-5">
        <Input
          id="edit-name"
          label="First name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <div className="grid grid-cols-2 gap-3">
          <Input
            id="edit-age"
            label="Age"
            inputMode="numeric"
            value={age}
            onChange={(e) =>
              setAge(e.target.value.replace(/[^0-9]/g, '').slice(0, 3))
            }
          />
          <Input
            id="edit-blood"
            label="Blood type"
            placeholder="e.g. O+"
            value={bloodType}
            onChange={(e) => setBloodType(e.target.value.slice(0, 3))}
          />
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-cream/80">
            Biological sex
          </span>
          <div className="flex flex-wrap gap-2">
            {SEX_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setSex(opt.value)}
                className={pillClass(sex === opt.value)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-cream/80">
            Conditions
          </span>
          <div className="flex flex-wrap gap-2">
            {CONDITIONS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleCondition(c.id)}
                className={pillClass(conditions.includes(c.id))}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="mb-2 block text-sm font-medium text-cream/80">
            Language
          </span>
          <div className="flex flex-wrap gap-2">
            {LANGUAGES.map((l) => (
              <button
                key={l.code}
                type="button"
                onClick={() => setLanguage(l.code)}
                className={pillClass(language === l.code)}
              >
                {l.flag} {l.label}
              </button>
            ))}
          </div>
        </div>

        <Button fullWidth onClick={save}>
          Save changes
        </Button>
      </div>
    </Sheet>
  )
}

function pillClass(active: boolean): string {
  return cn(
    'rounded-2xl border px-4 py-2.5 text-sm font-medium transition-all',
    active
      ? 'border-gold bg-gold/15 text-cloud'
      : 'border-white/12 bg-white/[0.03] text-cream/80 hover:border-gold/40',
  )
}
