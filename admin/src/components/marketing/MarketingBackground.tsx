type MarketingBackgroundProps = {
  variant?: 'hero' | 'auth'
}

export default function MarketingBackground({ variant = 'hero' }: MarketingBackgroundProps) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-tsai-bg" aria-hidden>
      {/* Base vertical blend like the marketing site footer/hero */}
      <div className="absolute inset-0 bg-linear-to-b from-tsai-bg via-tsai-bg to-tsai-surface-deep" />

      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />

      {/* Center cyan glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,240,255,0.14)_0%,transparent_72%)]" />

      {/* Top blue glow — hero is stronger */}
      <div
        className={`absolute top-[12%] left-1/2 -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(0,18,184,0.28)_0%,transparent_72%)] ${
          variant === 'hero' ? 'h-[520px] w-[900px]' : 'h-[380px] w-[640px] opacity-80'
        }`}
      />

      {/* Bottom cyan wash */}
      <div className="absolute right-0 bottom-0 left-0 h-[45%] bg-[radial-gradient(ellipse_at_50%_100%,rgba(0,240,255,0.08)_0%,transparent_70%)]" />

      {/* Side accent beams */}
      <div className="absolute top-1/3 -left-32 h-64 w-64 rounded-full bg-[radial-gradient(circle,rgba(18,61,255,0.2)_0%,transparent_70%)] blur-2xl" />
      <div className="absolute top-1/4 -right-24 h-72 w-72 rounded-full bg-[radial-gradient(circle,rgba(18,215,245,0.15)_0%,transparent_70%)] blur-2xl" />

      {/* Hero-only horizon line */}
      {variant === 'hero' ? (
        <div className="absolute right-0 bottom-[18%] left-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />
      ) : null}

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(1,11,36,0.85)_100%)]" />
    </div>
  )
}
