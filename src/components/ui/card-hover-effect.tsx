import { useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardHoverEffectProps {
  children: React.ReactNode[]
  className?: string
}

export function CardHoverEffect({ children, className }: CardHoverEffectProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  return (
    <div className={cn('grid gap-4', className)}>
      {children.map((child, idx) => (
        <div
          key={idx}
          className="relative group"
          onMouseEnter={() => setHoveredIndex(idx)}
          onMouseLeave={() => setHoveredIndex(null)}
        >
          {hoveredIndex === idx && (
            <motion.span
              className="absolute inset-0 bg-neon-purple/5 rounded-xl z-0"
              layoutId="hoverBackground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.15 } }}
              exit={{ opacity: 0, transition: { duration: 0.15, delay: 0.2 } }}
            />
          )}
          <div className="relative z-10">{child}</div>
        </div>
      ))}
    </div>
  )
}
