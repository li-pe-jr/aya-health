import { cn } from '@/lib/cn'

interface LogoMarkProps {
  size?: number
  className?: string
}

/**
 * Aya mark — inspired by the Adinkra "Aya" (fern) symbol, a Ghanaian emblem of
 * endurance and resourcefulness. Rendered as a gold fern on a forest disc.
 */
export function LogoMark({ size = 72, className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      fill="none"
      role="img"
      aria-label="Aya logo"
      className={className}
    >
      <defs>
        <linearGradient id="ayaFern" x1="48" y1="14" x2="48" y2="84">
          <stop offset="0" stopColor="#e0b64d" />
          <stop offset="1" stopColor="#c9961a" />
        </linearGradient>
      </defs>
      <circle
        cx="48"
        cy="48"
        r="46"
        fill="#1A4D2E"
        stroke="#c9961a"
        strokeOpacity="0.5"
        strokeWidth="2"
      />
      {/* central stem */}
      <path
        d="M48 82C48 82 46 58 46 46C46 30 48 16 48 16C48 16 50 30 50 46C50 58 48 82 48 82Z"
        fill="url(#ayaFern)"
      />
      {/* fern fronds */}
      {[24, 34, 44, 54].map((y, i) => {
        const spread = 26 - i * 4
        return (
          <g key={y} stroke="url(#ayaFern)" strokeWidth="3.4" strokeLinecap="round">
            <path
              d={`M48 ${y + 6}C${48 - spread * 0.5} ${y + 2} ${48 - spread} ${y - 2} ${48 - spread} ${y - 10}`}
              fill="none"
            />
            <path
              d={`M48 ${y + 6}C${48 + spread * 0.5} ${y + 2} ${48 + spread} ${y - 2} ${48 + spread} ${y - 10}`}
              fill="none"
            />
          </g>
        )
      })}
      {/* root loops at base */}
      <g stroke="url(#ayaFern)" strokeWidth="3.4" strokeLinecap="round" fill="none">
        <path d="M48 82C40 82 36 78 36 74C36 70 40 68 44 68" />
        <path d="M48 82C56 82 60 78 60 74C60 70 56 68 52 68" />
      </g>
    </svg>
  )
}

interface LogoProps {
  size?: number
  className?: string
  showTagline?: boolean
}

export function Logo({ size = 84, className, showTagline }: LogoProps) {
  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <LogoMark size={size} />
      <div className="flex flex-col items-center">
        <span className="font-display text-4xl font-extrabold tracking-tight text-cloud">
          Aya
        </span>
        {showTagline && (
          <span className="mt-1 text-sm font-medium text-cream/80">
            Your health companion
          </span>
        )}
      </div>
    </div>
  )
}
