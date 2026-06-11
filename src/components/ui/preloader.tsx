import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldAlert, Lock, Unlock, Loader2 } from 'lucide-react'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { initAudio, playDecryptSweep, playBeep, playGlitch, startSynth } from '@/lib/synth'
import { GlitchText } from './glitch-text'

export function Preloader() {
  const { preloaded, setPreloaded, synthEnabled } = usePreferencesStore()
  const [stage, setStage] = useState<'lock' | 'loading' | 'done'>('lock')
  const [progress, setProgress] = useState(0)
  const [currentText, setCurrentText] = useState('SYSTEM ENCRYPTED')

  // Loading progress simulation
  useEffect(() => {
    if (stage !== 'loading') return

    let timer: ReturnType<typeof setInterval> | null = null
    const runLoading = () => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (timer) clearInterval(timer)
          setStage('done')
          setTimeout(() => {
            setPreloaded(true)
            // If the user has synth enabled in their preferences, start it now that we have interaction
            if (synthEnabled) {
              startSynth()
            }
          }, 800)
          return 100
        }

        // Random increment
        const inc = Math.floor(Math.random() * 8) + 4
        const next = Math.min(prev + inc, 100)

        // Spooky sound ticks
        if (next < 100) {
          if (Math.random() > 0.4) {
            playBeep(300 + next * 8, 0.02, 'sine')
          } else if (Math.random() > 0.8) {
            playGlitch()
          }
        }

        // Update texts based on progress
        if (next < 20) {
          setCurrentText('BOOTING VOID ENGINE v4.06...')
        } else if (next < 40) {
          setCurrentText('CONNECTING TO REMOTE SERVER: KWANGYA-5G.NET...')
        } else if (next < 65) {
          setCurrentText('EXTRACTING AE-AVATAR DATA AND DECRYPTING HASHES...')
        } else if (next < 85) {
          setCurrentText('SYNCHRONIZING CYBER-METALLIC FORUM ARCHIVES...')
        } else {
          setCurrentText('DECRYPTION COMPLETE. CONNECTION STABLE.')
        }

        return next
      })
    }

    timer = setInterval(runLoading, 150 + Math.random() * 150)
    return () => {
      if (timer) clearInterval(timer)
    }
  }, [stage, setPreloaded, synthEnabled])

  const handleUnlock = () => {
    // 1. Initialize AudioContext on click
    initAudio()
    // 2. Play sweep sound
    playDecryptSweep()
    // 3. Move to loading stage
    setStage('loading')
  }

  if (preloaded) return null

  return (
    <AnimatePresence>
      {stage !== 'done' && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          className="fixed inset-0 z-[999] bg-void-deeper flex flex-col items-center justify-center p-6 select-none"
        >
          {/* Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#111111_1px,transparent_1px),linear-gradient(to_bottom,#111111_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />
          
          {/* Cyber scanlines */}
          <div className="absolute inset-0 scanlines opacity-40 pointer-events-none" />

          {/* Glowing Vignette */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,#050505_90%)]" />

          {/* Preloader Frame */}
          <div className="relative z-10 w-full max-w-lg border border-void-border bg-void-card/80 backdrop-blur-md rounded-2xl p-8 shadow-[0_0_50px_rgba(168,85,247,0.05)] overflow-hidden">
            {/* Metallic corner decorations */}
            <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-neon-purple/50" />
            <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-neon-purple/50" />
            <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-neon-purple/50" />
            <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-neon-purple/50" />

            <div className="flex flex-col items-center text-center space-y-6">
              {/* Header Icon */}
              <motion.div
                animate={stage === 'lock' ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: Infinity, duration: 2 }}
                className={`p-3 rounded-full border ${
                  stage === 'lock'
                    ? 'border-blood-red/30 bg-blood-red/5 text-blood-red'
                    : 'border-neon-purple/30 bg-neon-purple/5 text-neon-purple'
                }`}
              >
                {stage === 'lock' ? (
                  <ShieldAlert className="w-8 h-8 animate-pulse" />
                ) : (
                  <Loader2 className="w-8 h-8 animate-spin" />
                )}
              </motion.div>

              {/* Title */}
              <div className="space-y-1">
                <GlitchText
                  text="VOIDCAFE"
                  className="text-4xl font-heading font-black tracking-[0.2em] text-metal-100"
                />
                <p className="text-[10px] font-mono text-metal-500 uppercase tracking-widest">
                  Secure Cyber-Metallic Network
                </p>
              </div>

              {/* Interactive Lock Screen */}
              {stage === 'lock' ? (
                <div className="space-y-6 w-full py-4">
                  <div className="p-4 rounded-xl border border-void-border/60 bg-void-surface/50 text-left font-mono text-xs text-metal-400 space-y-2 leading-relaxed">
                    <p className="text-blood-red font-semibold flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-blood-red animate-ping" />
                      [WARNING: SYSTEM CORRUPTED]
                    </p>
                    <p>
                      Kwangya matrix frequency shield active. Audio driver and state sync require interaction approval.
                    </p>
                    <p className="text-metal-500">
                      STATUS: LOCKED
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleUnlock}
                    className="w-full py-4 rounded-xl font-heading text-sm font-semibold tracking-widest border border-blood-red/40 hover:border-blood-red text-blood-red hover:bg-blood-red/10 shadow-[0_0_20px_rgba(220,38,38,0.1)] hover:shadow-[0_0_30px_rgba(220,38,38,0.2)] transition-all flex items-center justify-center gap-3 relative overflow-hidden group cursor-pointer"
                  >
                    <Lock className="w-4 h-4 group-hover:hidden" />
                    <Unlock className="w-4 h-4 hidden group-hover:block" />
                    CONNECT TO VOID
                  </motion.button>
                </div>
              ) : (
                // Loading Screen
                <div className="space-y-6 w-full py-4">
                  {/* Rotating visual */}
                  <div className="relative w-24 h-24 mx-auto flex items-center justify-center">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-0 rounded-full border-2 border-dashed border-neon-purple/20"
                    />
                    <motion.div
                      animate={{ rotate: -360 }}
                      transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                      className="absolute inset-2 rounded-full border-2 border-dotted border-neon-cyan/40"
                    />
                    <div className="font-mono text-xl font-black text-neon-purple text-glow">
                      {progress}%
                    </div>
                  </div>

                  {/* Console Logs */}
                  <div className="h-20 p-4 rounded-xl border border-void-border/60 bg-void-surface/50 text-left font-mono text-[11px] text-metal-400 space-y-1.5 overflow-hidden">
                    <p className="text-neon-purple flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-neon-purple animate-pulse" />
                      DECRYPTING SOURCE ARCHIVES...
                    </p>
                    <p className="text-metal-300 truncate">
                      &gt; {currentText}
                    </p>
                    <div className="w-full bg-void-black h-1.5 rounded-full border border-void-border overflow-hidden mt-3">
                      <motion.div
                        className="bg-gradient-to-r from-neon-purple to-neon-cyan h-full"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
