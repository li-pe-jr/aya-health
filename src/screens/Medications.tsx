import { useState } from 'react'
import { Pill, Plus, Trash2, Clock } from 'lucide-react'
import { Screen } from '@/components/Screen'
import { Card } from '@/components/Card'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { Sheet } from '@/components/Sheet'
import { EmptyState } from '@/components/Feedback'
import { useAya } from '@/lib/store'
import type { Medication } from '@/lib/types'

const SCHEDULES = ['Once daily', 'Twice daily', 'Three times daily', 'As needed']

export function Medications() {
  const { meds, addMed, removeMed } = useAya()
  const [open, setOpen] = useState(false)
  const [name, setName] = useState('')
  const [dose, setDose] = useState('')
  const [schedule, setSchedule] = useState(SCHEDULES[0])

  const submit = () => {
    if (!name.trim()) return
    const med: Medication = {
      id: `med_${Date.now()}`,
      name: name.trim(),
      dose: dose.trim() || '—',
      schedule,
    }
    addMed(med)
    setName('')
    setDose('')
    setSchedule(SCHEDULES[0])
    setOpen(false)
  }

  return (
    <Screen withNav>
      <header className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="font-display text-[26px] font-bold text-cloud">
            Medications
          </h1>
          <p className="mt-1 text-[15px] text-cream/70">
            Keep track of what you take.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Add medication"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gold text-obsidian shadow-lg shadow-gold/20"
        >
          <Plus size={22} />
        </button>
      </header>

      {meds.length === 0 ? (
        <EmptyState
          className="mt-6"
          icon={<Pill size={26} />}
          title="No medications yet"
          description="Add the medicines you take and Aya will keep them handy for your check-ins."
          action={
            <Button size="md" leftIcon={<Plus size={17} />} onClick={() => setOpen(true)}>
              Add medication
            </Button>
          }
        />
      ) : (
        <ul className="space-y-3">
          {meds.map((med) => (
            <li key={med.id}>
              <Card accent="green" className="flex items-center gap-3.5 py-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-forest/40 text-gold">
                  <Pill size={20} />
                </span>
                <div className="flex-1">
                  <p className="text-[15px] font-semibold text-cloud">
                    {med.name}
                  </p>
                  <p className="mt-0.5 flex items-center gap-2 text-xs text-cream/55">
                    <span>{med.dose}</span>
                    <span className="text-cream/25">·</span>
                    <span className="inline-flex items-center gap-1">
                      <Clock size={12} /> {med.schedule}
                    </span>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => removeMed(med.id)}
                  aria-label={`Remove ${med.name}`}
                  className="flex h-9 w-9 items-center justify-center rounded-full text-cream/45 hover:bg-white/5 hover:text-status-emergency"
                >
                  <Trash2 size={17} />
                </button>
              </Card>
            </li>
          ))}
        </ul>
      )}

      <Sheet open={open} onClose={() => setOpen(false)} title="Add medication">
        <div className="space-y-5">
          <Input
            id="med-name"
            label="Name"
            autoFocus
            placeholder="e.g. Metformin"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            id="med-dose"
            label="Dose"
            placeholder="e.g. 500mg"
            value={dose}
            onChange={(e) => setDose(e.target.value)}
          />
          <div>
            <span className="mb-2 block text-sm font-medium text-cream/80">
              Schedule
            </span>
            <div className="flex flex-wrap gap-2">
              {SCHEDULES.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSchedule(s)}
                  className={
                    'rounded-2xl border px-4 py-2.5 text-sm font-medium transition-all ' +
                    (schedule === s
                      ? 'border-gold bg-gold/15 text-cloud'
                      : 'border-white/12 bg-white/[0.03] text-cream/80 hover:border-gold/40')
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
          <Button fullWidth disabled={!name.trim()} onClick={submit}>
            Save medication
          </Button>
        </div>
      </Sheet>
    </Screen>
  )
}
