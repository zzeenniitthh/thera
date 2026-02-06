'use client';

interface GlowOrbProps {
  intensity?: number;
  size?: number;
  className?: string;
}

export function GlowOrb({ intensity = 0.5, size = 120, className = '' }: GlowOrbProps) {
  return (
    <div
      className={`rounded-full pointer-events-none ${className}`}
      style={{
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(255,255,255,${intensity * 0.3}) 0%, transparent 70%)`,
        filter: `blur(${8 + intensity * 12}px)`,
      }}
    />
  );
}
