import { useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

interface BackgroundBeamsProps {
  className?: string
}

export function BackgroundBeams({ className }: BackgroundBeamsProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    // Animate paths subtly
    const paths = svgRef.current?.querySelectorAll('path')
    if (!paths) return

    paths.forEach((path, i) => {
      const length = path.getTotalLength()
      path.style.strokeDasharray = `${length}`
      path.style.strokeDashoffset = `${length}`
      path.style.animation = `beam-draw ${3 + i * 0.5}s ease-in-out ${i * 0.3}s infinite alternate`
    })
  }, [])

  return (
    <div className={cn('absolute inset-0 overflow-hidden pointer-events-none', className)}>
      <svg
        ref={svgRef}
        className="absolute inset-0 w-full h-full opacity-20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="beam-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a855f7" stopOpacity="0" />
            <stop offset="50%" stopColor="#a855f7" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="beam-gradient-2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#22d3ee" stopOpacity="0" />
            <stop offset="50%" stopColor="#22d3ee" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M0 200 Q 400 100 800 300 T 1600 200" stroke="url(#beam-gradient-1)" strokeWidth="1.5" fill="none" />
        <path d="M0 400 Q 300 200 600 400 T 1200 350 T 1800 400" stroke="url(#beam-gradient-2)" strokeWidth="1" fill="none" />
        <path d="M200 0 Q 400 300 200 600 T 400 900" stroke="url(#beam-gradient-1)" strokeWidth="1" fill="none" />
        <path d="M800 0 Q 600 200 800 500 T 600 800" stroke="url(#beam-gradient-2)" strokeWidth="0.8" fill="none" />
        <path d="M1200 0 Q 1000 400 1200 600 T 1000 900" stroke="url(#beam-gradient-1)" strokeWidth="0.6" fill="none" />
      </svg>
      <style>{`
        @keyframes beam-draw {
          0% { stroke-dashoffset: var(--length, 2000); opacity: 0.1; }
          50% { opacity: 0.4; }
          100% { stroke-dashoffset: 0; opacity: 0.1; }
        }
      `}</style>
    </div>
  )
}
