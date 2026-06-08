import { useMemo } from 'react'
import { cn } from '@/lib/utils'

interface FloatingParticlesProps {
  count?: number
  className?: string
}

export function FloatingParticles({ count = 20, className }: FloatingParticlesProps) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 15,
      duration: 12 + Math.random() * 18,
      opacity: 0.1 + Math.random() * 0.2,
    }))
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
