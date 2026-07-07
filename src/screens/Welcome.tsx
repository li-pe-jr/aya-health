import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { Logo } from '@/components/Logo'
import { Button } from '@/components/Button'
import { Input } from '@/components/Input'
import { useAya } from '@/lib/store'

export function Welcome() {
  const navigate = useNavigate()
  const { profile, user, loading, signIn, signUp, signInWithGoogle } = useAya()
  const [isLogin, setIsLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showVerificationMessage, setShowVerificationMessage] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setShowVerificationMessage(false)
    setIsSubmitting(true)

    const result = isLogin
      ? await signIn(email, password)
      : await signUp(email, password)

    setIsSubmitting(false)

    if (result.error) {
      setError(result.error)
    } else if (result.needsVerification) {
      setShowVerificationMessage(true)
    } else if (!isLogin) {
      // Sign up successful, proceed to onboarding
      navigate('/onboarding')
    } else {
      // Sign in successful
      navigate(profile.onboarded ? '/home' : '/onboarding')
    }
  }

  const handleGoogleSignIn = async () => {
    setError('')
    const result = await signInWithGoogle()
    if (result.error) {
      setError(result.error)
    }
  }

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="text-cream/60">Loading...</div>
      </div>
    )
  }

  if (user) {
    // User is already logged in
    navigate(profile.onboarded ? '/home' : '/onboarding')
    return null
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
          {showVerificationMessage ? (
            <div className="w-full space-y-4 text-center">
              <div className="rounded-2xl border border-gold/30 bg-gold/10 p-4">
                <p className="text-sm font-medium text-cloud">
                  Check your email
                </p>
                <p className="mt-2 text-xs text-cream/70">
                  We've sent a confirmation link to your email. Please click it to verify your account.
                </p>
              </div>
              <Button
                fullWidth
                size="lg"
                onClick={() => {
                  setShowVerificationMessage(false)
                  setIsLogin(true)
                }}
              >
                I've verified my email
              </Button>
            </div>
          ) : (
            <>
              <Button
                fullWidth
                size="lg"
                variant="outline"
                onClick={handleGoogleSignIn}
                className="border-white/20 bg-white/[0.05] hover:bg-white/[0.1]"
              >
                Continue with Google
              </Button>

              <div className="flex w-full items-center gap-3">
                <div className="flex-1 h-px bg-white/10" />
                <span className="text-xs text-cream/40">or</span>
                <div className="flex-1 h-px bg-white/10" />
              </div>

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
            </>
          )}
        </div>

        <p className="mt-6 text-center text-[11px] text-cream/40">
          Aya by Radix Studio · Not a substitute for professional care
        </p>
      </div>
    </div>
  )
}
