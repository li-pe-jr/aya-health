import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/Button'
import { useAya } from '@/lib/store'

export function Welcome() {
  const navigate = useNavigate()
  const { profile } = useAya()

  return (
    <div className="relative flex h-full flex-col overflow-hidden">
      {/* animated gold + green aurora */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-forest/50 blur-3xl animate-drift" />
        <div className="absolute -right-20 top-24 h-64 w-64 rounded-full bg-gold/25 blur-3xl animate-drift-slow" />
        <div className="absolute bottom-10 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-amethyst/40 blur-3xl animate-drift" />
      </div>

      <div className="relative z-10 flex flex-1 flex-col px-6 pb-10 pt-6">
        <div className="flex flex-1 flex-col items-center justify-center">
          <div className="animate-fade-up">
            <Logo size={104} showTagline />
          </div>
          <p className="mt-6 max-w-[16rem] text-center text-sm leading-relaxed text-cream/70 animate-fade-up">
            Warm, trusted health guidance — made in Ghana, for you.
          </p>
        </div>

        <div className="flex flex-col items-center gap-4">
          <Button
            fullWidth
            size="lg"
            rightIcon={<ArrowRight size={18} />}
            onClick={() => navigate('/onboarding')}
          >
            Get Started
          </Button>
          <button
            type="button"
            onClick={() => navigate(profile.onboarded ? '/home' : '/onboarding')}
            className="text-sm font-medium text-cream/80 underline-offset-4 hover:text-cloud hover:underline"
          >
            I already have an account
          </button>
        </div>

        <p className="mt-6 text-center text-[11px] text-cream/40">
          Aya by Radix Studio · Not a substitute for professional care
        </p>
      </div>
    </div>
  )
}
