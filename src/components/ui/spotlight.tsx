import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface SpotlightProps {
  children: React.ReactNode
  className?: string
  fill?: string
}

export function Spotlight({ children, className, fill = 'rgba(168, 85, 247, 0.15)' }: SpotlightProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [opacity, setOpacity] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    setPosition({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setOpacity(1)}
      onMouseLeave={() => setOpacity(0)}
      className={cn('relative overflow-hidden', className)}
    >
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-inherit z-10"
        style={{
          background: `radial-gradient(600px circle at ${position.x}px ${position.y}px, ${fill}, transparent 40%)`,
          opacity,
        }}
        animate={{ opacity }}
        transition={{ duration: 0.3 }}
      />
      {children}
    </div>
  )
}
