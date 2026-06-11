import { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Volume2, VolumeX, Activity, Radio } from 'lucide-react'
import { usePreferencesStore } from '@/stores/preferencesStore'
import { startSynth, stopSynth, setVolume, setGlitchRate, getAnalyser } from '@/lib/synth'

export function SynthWidget() {
  const {
    synthEnabled,
    synthVolume,
    synthGlitchRate,
    setSynthEnabled,
    setSynthVolume,
    setSynthGlitchRate,
  } = usePreferencesStore()

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number | null>(null)
  const [readout, setReadout] = useState(synthEnabled ? 'MODULATING FREQ: 55.00 Hz' : 'SYS_STANDBY [OFFLINE]')

  // Toggle state
  const handleToggle = () => {
    const nextState = !synthEnabled
    setSynthEnabled(nextState)
    if (nextState) {
      startSynth()
      setVolume(synthVolume)
      setGlitchRate(synthGlitchRate)
      setReadout('MODULATING FREQ: 55.00 Hz')
    } else {
      stopSynth()
      setReadout('SYS_STANDBY [OFFLINE]')
    }
  }

  // Update volume and glitch parameters on the synth
  useEffect(() => {
    if (synthEnabled) {
      setVolume(synthVolume)
    }
  }, [synthVolume, synthEnabled])

  useEffect(() => {
    if (synthEnabled) {
      setGlitchRate(synthGlitchRate)
    }
  }, [synthGlitchRate, synthEnabled])

  // Diagnostic readouts generator
  useEffect(() => {
    if (!synthEnabled) {
      return
    }

    const readouts = [
      'MODULATING FREQ: 55.00 Hz',
      'AE_MATRIX SYNC: 98.4%',
      'LFO OSCILLATOR: STABLE',
      'DECRYPTION KEY: AE_SOUL',
      'VOID EMISSION ACTIVE',
      'RESONANT BANDPASS ENABLD',
      'CORRUPTION DETECTED: 0.04%',
    ]

    const interval = setInterval(() => {
      const idx = Math.floor(Math.random() * readouts.length)
      setReadout(readouts[idx])
    }, 2500)

    return () => clearInterval(interval)
  }, [synthEnabled])

  // Oscilloscope Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set pixel ratio for sharp rendering
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height

    const bufferLength = 256
    const timeData = new Uint8Array(bufferLength)
    const freqData = new Uint8Array(bufferLength)

    const draw = () => {
      animationRef.current = requestAnimationFrame(draw)

      // Clear with slight opacity to create a trails effect
      ctx.fillStyle = 'rgba(10, 10, 10, 0.3)'
      ctx.fillRect(0, 0, width, height)

      const analyser = getAnalyser()

      if (synthEnabled && analyser) {
        // Real time oscilloscope wave & frequency bars
        analyser.getByteTimeDomainData(timeData)
        analyser.getByteFrequencyData(freqData)

        // 1. Draw Frequency Area Graph in neon cyan (background layer)
        ctx.shadowBlur = 0
        ctx.fillStyle = 'rgba(34, 211, 238, 0.08)' // Muted transparent neon cyan
        ctx.strokeStyle = 'rgba(34, 211, 238, 0.25)' // Muted neon cyan border
        ctx.lineWidth = 1
        ctx.beginPath()
        ctx.moveTo(0, height)
        const barWidth = width / bufferLength
        let freqX = 0
        for (let i = 0; i < bufferLength; i++) {
          const val = freqData[i] / 255.0
          const barHeight = val * height * 0.85
          ctx.lineTo(freqX, height - barHeight)
          freqX += barWidth
        }
        ctx.lineTo(width, height)
        ctx.fill()
        ctx.stroke()

        // 2. Draw Time Domain Waveform on top in glowing neon purple
        ctx.lineWidth = 2
        ctx.shadowBlur = 8
        ctx.shadowColor = '#a855f7'
        ctx.strokeStyle = '#c084fc' // Light neon purple
        ctx.beginPath()

        const sliceWidth = width / bufferLength
        let x = 0

        for (let i = 0; i < bufferLength; i++) {
          const v = timeData[i] / 128.0
          const y = (v * height) / 2

          if (i === 0) {
            ctx.moveTo(x, y)
          } else {
            ctx.lineTo(x, y)
          }

          x += sliceWidth
        }

        ctx.lineTo(width, height / 2)
        ctx.stroke()
      } else {
        // Draw flat baseline with micro jitter/noise
        ctx.lineWidth = 1
        ctx.shadowBlur = 0
        ctx.strokeStyle = '#4a5568' // Muted gray
        ctx.beginPath()

        const sliceWidth = width / 64
        let x = 0

        ctx.moveTo(0, height / 2)
        for (let i = 0; i <= 64; i++) {
          // Fake minor vibration
          const jitter = (Math.random() - 0.5) * 1.5
          ctx.lineTo(x, height / 2 + jitter)
          x += sliceWidth
        }
        ctx.stroke()
      }

      // Draw grid overlay lines
      ctx.shadowBlur = 0
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)'
      ctx.lineWidth = 0.5
      // Horizontal center
      ctx.beginPath()
      ctx.moveTo(0, height / 2)
      ctx.lineTo(width, height / 2)
      ctx.stroke()
      // Vertical grids
      for (let gridX = 40; gridX < width; gridX += 40) {
        ctx.beginPath()
        ctx.moveTo(gridX, 0)
        ctx.lineTo(gridX, height)
        ctx.stroke()
      }
    }

    draw()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [synthEnabled])

  return (
    <div className="rounded-xl bg-void-card border border-void-border p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-heading text-sm font-semibold text-metal-200 flex items-center gap-2">
          <Activity className={`w-4 h-4 ${synthEnabled ? 'text-neon-purple animate-pulse' : 'text-metal-500'}`} />
          Void Synth [Audio Engine]
        </h3>
        
        {/* Connection Light */}
        <div className="flex items-center gap-1.5">
          <span className={`w-1.5 h-1.5 rounded-full ${synthEnabled ? 'bg-neon-purple neon-purple-glow animate-pulse' : 'bg-void-border-light'}`} />
          <span className="text-[10px] font-mono text-metal-500 uppercase tracking-widest">
            {synthEnabled ? 'Connected' : 'Offline'}
          </span>
        </div>
      </div>

      {/* Oscilloscope Canvas */}
      <div className="relative h-16 w-full bg-void-deeper rounded-lg overflow-hidden border border-void-border/60">
        <canvas ref={canvasRef} className="w-full h-full block" />
        
        {/* Cyber overlay elements */}
        <div className="absolute top-1 left-2 flex gap-1 items-center">
          <Radio className={`w-2.5 h-2.5 ${synthEnabled ? 'text-neon-cyan animate-pulse' : 'text-metal-600'}`} />
          <span className="text-[9px] font-mono text-metal-500 uppercase tracking-widest">Oscilloscope</span>
        </div>
        <div className="absolute bottom-1 right-2">
          <span className="text-[8px] font-mono text-metal-600">FFT: 512</span>
        </div>
      </div>

      {/* Stats Terminal Readout */}
      <div className="bg-void-deeper/50 p-2.5 rounded-lg border border-void-border/40 font-mono text-[10px] text-metal-500 flex items-center justify-between">
        <span className="truncate">&gt; {readout}</span>
        <span className="text-metal-600 uppercase font-semibold text-[8px] border border-void-border/80 px-1 rounded shrink-0">
          SYS
        </span>
      </div>

      {/* Controls */}
      <div className="space-y-3 pt-1">
        {/* Toggle Button */}
        <button
          onClick={handleToggle}
          className={`w-full py-2 rounded-lg font-heading text-xs font-semibold tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border ${
            synthEnabled
              ? 'bg-neon-purple/20 text-neon-purple border-neon-purple/40 hover:bg-neon-purple/30 shadow-[0_0_15px_rgba(168,85,247,0.1)]'
              : 'bg-void-surface text-metal-400 border-void-border hover:border-metal-600 hover:text-metal-200'
          }`}
        >
          {synthEnabled ? (
            <>
              <Volume2 className="w-3.5 h-3.5" />
              SYNTH: ONLINE
            </>
          ) : (
            <>
              <VolumeX className="w-3.5 h-3.5" />
              SYNTH: OFFLINE
            </>
          )}
        </button>

        {/* Sliders */}
        {synthEnabled && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="space-y-2.5 overflow-hidden"
          >
            {/* Amplitude Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-metal-400">
                <span>AMPLITUDE (VOL)</span>
                <span>{Math.round(synthVolume * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="0.8"
                step="0.05"
                value={synthVolume}
                onChange={(e) => setSynthVolume(parseFloat(e.target.value))}
                className="w-full accent-neon-purple h-1 bg-void-elevated rounded-lg appearance-none cursor-pointer"
              />
            </div>

            {/* Modulation (Glitch Rate) Slider */}
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-mono text-metal-400">
                <span>PULSE RATE (LFO)</span>
                <span>{Math.round(synthGlitchRate * 100)}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="1.0"
                step="0.05"
                value={synthGlitchRate}
                onChange={(e) => setSynthGlitchRate(parseFloat(e.target.value))}
                className="w-full accent-neon-cyan h-1 bg-void-elevated rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
