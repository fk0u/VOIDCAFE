import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface FloatingParticlesProps {
  count?: number
  className?: string
}

function pseudoRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export function FloatingParticles({ count = 20, className }: FloatingParticlesProps) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => {
      const r1 = pseudoRandom(i * 12.345 + 1.23)
      const r2 = pseudoRandom(i * 23.456 + 2.34)
      const r3 = pseudoRandom(i * 34.567 + 3.45)
      const r4 = pseudoRandom(i * 45.678 + 4.56)
      const r5 = pseudoRandom(i * 56.789 + 5.67)
      return {
        id: i,
        left: r1 * 100,
        size: r2 * 3 + 1,
        delay: r3 * 15,
        duration: 12 + r4 * 18,
        opacity: 0.1 + r5 * 0.2,
      }
    })
  }, [count])

  return (
    <div className={cn('fixed inset-0 overflow-hidden pointer-events-none z-0', className)}>
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-neon-purple"
          style={{
            left: `${p.left}%`,
            bottom: '-10px',
            width: `${p.size}px`,
            height: `${p.size}px`,
            opacity: p.opacity,
            animation: `float-particle ${p.duration}s linear ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  )
}
