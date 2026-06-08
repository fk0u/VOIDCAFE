import { motion } from 'framer-motion'
import { useEffect } from 'react'
import { playGlitch } from '@/lib/synth'

interface PageTransitionProps {
  children: React.ReactNode
}

export function PageTransition({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Play a tiny, very subtle glitch chirp when entering a new page for that cyber vibe!
    playGlitch()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
    >
      {children}
    </motion.div>
  )
}
