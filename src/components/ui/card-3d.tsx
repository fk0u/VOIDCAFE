import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface Card3DProps {
  children: React.ReactNode
  className?: string
  containerClassName?: string
}

export function Card3D({ children, className, containerClassName }: Card3DProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const x = e.clientX - centerX
    const y = e.clientY - centerY
    setRotateX(-y / 15)
    setRotateY(x / 15)
  }

  const handleMouseLeave = () => {
    setRotateX(0)
    setRotateY(0)
  }

  return (
    <div
      className={cn('perspective-1000', containerClassName)}
      style={{ perspective: '1000px' }}
    >
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        animate={{ rotateX, rotateY }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className={cn(
          'relative rounded-xl transition-shadow duration-300',
          className
        )}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {children}
      </motion.div>
    </div>
  )
}

export function CardBody({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={cn('relative', className)}
      style={{ transform: 'translateZ(50px)', transformStyle: 'preserve-3d' }}
    >
      {children}
    </div>
  )
}
