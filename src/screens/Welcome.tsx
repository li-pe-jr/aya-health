import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useAya } from '@/lib/store'

export function Welcome() {
  const navigate = useNavigate()
  const { profile, user, loading, signIn, signUp } = useAya()
  const [isLogin, setIsLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    const result = isLogin
      ? await signIn(email, password)
      : await signUp(email, password)

    setIsSubmitting(false)

    if (result.error) {
      setError(result.error)
    } else {
      // Auth successful - redirect based on onboarding status
      navigate(profile.onboarded ? '/home' : '/onboarding')
    }
  }

  // Redirect authenticated users away from the Welcome screen
  useEffect(() => {
    if (!loading && user) {
      navigate(profile.onboarded ? '/home' : '/onboarding', { replace: true })
    }
  }, [user, loading, profile.onboarded, navigate])

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-cream/60">Loading...</div>
      </div>
    )
  }


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
          {isLogin ? (
            <form onSubmit={handleSubmit} className="w-full space-y-3">
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && (
                <p className="text-xs text-red-400">{error}</p>
              )}
              <Button
                fullWidth
                size="lg"
                type="submit"
                disabled={isSubmitting}
                rightIcon={<ArrowRight size={18} />}
              >
                {isSubmitting ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="w-full space-y-3">
              <Input
                id="email"
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                id="password"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {error && (
                <p className="text-xs text-red-400">{error}</p>
              )}
              <Button
                fullWidth
                size="lg"
                type="submit"
                disabled={isSubmitting}
                rightIcon={<ArrowRight size={18} />}
              >
                {isSubmitting ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>
          )}

          <button
            type="button"
            onClick={() => {
              setIsLogin(!isLogin)
              setError('')
              setEmail('')
              setPassword('')
            }}
            className="text-sm font-medium text-cream/80 underline-offset-4 hover:text-cloud hover:underline"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>

        <p className="mt-6 text-center text-[11px] text-cream/40">
          Aya by Radix Studio · Not a substitute for professional care
        </p>
      </div>
    </div>
  )
}
