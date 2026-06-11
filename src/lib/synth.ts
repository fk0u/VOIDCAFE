// Eerie Cyber-Metallic Synth using Web Audio API
// Synthesizes a dark industrial hum, spooky generative chime notes, and glitch sound effects.

let audioCtx: AudioContext | null = null
let mainGain: GainNode | null = null
let analyser: AnalyserNode | null = null

// Drone Nodes
let osc1: OscillatorNode | null = null
let osc2: OscillatorNode | null = null
let droneGain: GainNode | null = null
let filterNode: BiquadFilterNode | null = null
let lfoNode: OscillatorNode | null = null
let lfoGainNode: GainNode | null = null

// Sequencer
let sequenceIntervalId: ReturnType<typeof setInterval> | null = null
const SCALE = [110.00, 123.47, 130.81, 146.83, 155.56, 174.61, 196.00, 220.00] // A minor / spooky locrian notes

export function initAudio() {
  if (audioCtx) return

  const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AudioContextClass) return

  audioCtx = new AudioContextClass()
  
  // Analyser node for the visualizer
  analyser = audioCtx.createAnalyser()
  analyser.fftSize = 512

  // Main volume gain
  mainGain = audioCtx.createGain()
  mainGain.gain.value = 0.3 // Default volume 30%

  // Routing: Sources -> Analyser -> Main Gain -> Destination
  analyser.connect(mainGain)
  mainGain.connect(audioCtx.destination)

  setupDrone()
  startSequencer()
}

function setupDrone() {
  if (!audioCtx || !analyser) return

  // Create Detuned low frequency saw/triangle oscillators
  osc1 = audioCtx.createOscillator()
  osc2 = audioCtx.createOscillator()
  droneGain = audioCtx.createGain()
  filterNode = audioCtx.createBiquadFilter()

  osc1.type = 'sawtooth'
  osc1.frequency.value = 55.00 // A1

  osc2.type = 'triangle'
  osc2.frequency.value = 55.50 // Detuned slightly for phasing

  filterNode.type = 'lowpass'
  filterNode.frequency.value = 120 // Deep rumble filter
  filterNode.Q.value = 4.0

  // Low frequency oscillator for the pulsing sweep
  lfoNode = audioCtx.createOscillator()
  lfoGainNode = audioCtx.createGain()
  
  lfoNode.frequency.value = 0.15 // Very slow pulse (0.15 Hz)
  lfoGainNode.gain.value = 40 // Modulation depth in Hz

  // Route LFO to filter frequency
  lfoNode.connect(lfoGainNode)
  lfoGainNode.connect(filterNode.frequency)

  // Route main drone
  osc1.connect(filterNode)
  osc2.connect(filterNode)
  filterNode.connect(droneGain)
  droneGain.connect(analyser)

  // Start oscillators
  osc1.start()
  osc2.start()
  lfoNode.start()

  // Initially mute drone until turned on
  droneGain.gain.value = 0
}

export function startSynth() {
  if (!audioCtx) initAudio()
  
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume()
  }

  if (droneGain && audioCtx) {
    droneGain.gain.setTargetAtTime(0.7, audioCtx.currentTime, 1.5)
  }
}

export function stopSynth() {
  if (droneGain && audioCtx) {
    droneGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.5)
  }
}

export function setVolume(volume: number) {
  if (!audioCtx || !mainGain) return
  mainGain.gain.setTargetAtTime(volume, audioCtx.currentTime, 0.1)
}

export function setGlitchRate(rate: number) {
  // Rate from 0 to 1
  if (!audioCtx || !lfoNode) return
  // Speed up LFO based on rate (0.05Hz to 8Hz)
  const lfoSpeed = 0.05 + rate * 8
  lfoNode.frequency.setTargetAtTime(lfoSpeed, audioCtx.currentTime, 0.2)
}

export function getAnalyser(): AnalyserNode | null {
  return analyser
}

// Spooky sound generator helpers
export function playBeep(freq = 880, duration = 0.05, type: OscillatorType = 'sine') {
  if (!audioCtx || !analyser) return
  if (audioCtx.state === 'suspended') return

  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()

  osc.type = type
  osc.frequency.value = freq

  gain.gain.setValueAtTime(0.15, audioCtx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration)

  osc.connect(gain)
  gain.connect(analyser)

  osc.start()
  osc.stop(audioCtx.currentTime + duration)
}

export function playGlitch() {
  if (!audioCtx || !analyser) return
  if (audioCtx.state === 'suspended') return

  const duration = 0.05 + Math.random() * 0.15
  const osc = audioCtx.createOscillator()
  const filter = audioCtx.createBiquadFilter()
  const gain = audioCtx.createGain()

  // Distorted wave shape or noise simulation
  osc.type = Math.random() > 0.5 ? 'sawtooth' : 'square'
  osc.frequency.setValueAtTime(100 + Math.random() * 800, audioCtx.currentTime)
  
  // Fast frequency sweep
  osc.frequency.exponentialRampToValueAtTime(30 + Math.random() * 100, audioCtx.currentTime + duration)

  filter.type = 'bandpass'
  filter.frequency.setValueAtTime(400 + Math.random() * 1200, audioCtx.currentTime)

  gain.gain.setValueAtTime(0.2, audioCtx.currentTime)
  gain.gain.exponentialRampToValueAtTime(0.0001, audioCtx.currentTime + duration)

  osc.connect(filter)
  filter.connect(gain)
  gain.connect(analyser)

  osc.start()
  osc.stop(audioCtx.currentTime + duration)
}

export function playDecryptSweep() {
  if (!audioCtx || !analyser) return
  if (audioCtx.state === 'suspended') return

  const now = audioCtx.currentTime
  const duration = 1.2
  
  // Rising siren sweep
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()

  osc.type = 'sine'
  osc.frequency.setValueAtTime(220, now)
  osc.frequency.exponentialRampToValueAtTime(1200, now + duration)

  gain.gain.setValueAtTime(0.001, now)
  gain.gain.linearRampToValueAtTime(0.3, now + 0.2)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

  osc.connect(gain)
  gain.connect(analyser)

  osc.start()
  osc.stop(now + duration)
}

function startSequencer() {
  if (sequenceIntervalId) clearInterval(sequenceIntervalId)

  sequenceIntervalId = setInterval(() => {
    if (!audioCtx || audioCtx.state === 'suspended') return

    // Occasionally play a chime (60% chance)
    if (Math.random() < 0.6) {
      // Pick random note from scale, shift up 1 or 2 octaves
      const baseFreq = SCALE[Math.floor(Math.random() * SCALE.length)]
      const octaveShift = Math.random() > 0.6 ? 4 : 2
      const freq = baseFreq * octaveShift
      
      const now = audioCtx.currentTime
      const duration = 1.5 + Math.random() * 2 // Long bell decay
      
      const osc = audioCtx.createOscillator()
      const delay = audioCtx.createDelay()
      const delayGain = audioCtx.createGain()
      const gain = audioCtx.createGain()

      osc.type = 'sine'
      osc.frequency.setValueAtTime(freq, now)
      // Subtle vibrato
      osc.frequency.linearRampToValueAtTime(freq + (Math.random() * 4 - 2), now + duration)

      gain.gain.setValueAtTime(0, now)
      gain.gain.linearRampToValueAtTime(0.12, now + 0.1) // Quick swell
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration)

      // Spooky delay feedback loop
      delay.delayTime.value = 0.35
      delayGain.gain.value = 0.45 // Delay volume

      osc.connect(gain)
      gain.connect(analyser!)

      // Connect to delay feedback loop
      gain.connect(delay)
      delay.connect(delayGain)
      delayGain.connect(delay) // Feedback
      delayGain.connect(analyser!)

      osc.start()
      osc.stop(now + duration + 1)
    }

    // Small cyber glitches (30% chance)
    if (Math.random() < 0.3) {
      playGlitch()
    }
  }, 2000)
}

export function playHover() {
  if (!audioCtx || !analyser) return
  if (audioCtx.state === 'suspended') return

  const now = audioCtx.currentTime
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()

  osc.type = 'sine'
  // Slide frequency up slightly for that clean tech tick
  osc.frequency.setValueAtTime(1400, now)
  osc.frequency.exponentialRampToValueAtTime(2000, now + 0.015)

  gain.gain.setValueAtTime(0.015, now) // Subtle volume
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.015)

  osc.connect(gain)
  gain.connect(analyser)

  osc.start()
  osc.stop(now + 0.015)
}

export function playClick() {
  if (!audioCtx || !analyser) return
  if (audioCtx.state === 'suspended') return

  const now = audioCtx.currentTime
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()

  osc.type = 'triangle'
  osc.frequency.setValueAtTime(120, now)
  osc.frequency.exponentialRampToValueAtTime(30, now + 0.03)

  gain.gain.setValueAtTime(0.04, now)
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03)

  osc.connect(gain)
  gain.connect(analyser)

  osc.start()
  osc.stop(now + 0.03)

  // Tiny contact sound simulation
  const bufferSize = Math.floor(audioCtx.sampleRate * 0.008) // 8ms noise
  if (bufferSize > 0) {
    try {
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1
      }

      const noise = audioCtx.createBufferSource()
      noise.buffer = buffer

      const noiseFilter = audioCtx.createBiquadFilter()
      noiseFilter.type = 'bandpass'
      noiseFilter.frequency.setValueAtTime(1000, now)

      const noiseGain = audioCtx.createGain()
      noiseGain.gain.setValueAtTime(0.015, now)
      noiseGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.008)

      noise.connect(noiseFilter)
      noiseFilter.connect(noiseGain)
      noiseGain.connect(analyser)

      noise.start()
      noise.stop(now + 0.008)
    } catch {
      // Buffer creation fallback
    }
  }
}

export function playSuccess() {
  if (!audioCtx || !analyser) return
  if (audioCtx.state === 'suspended') return

  const now = audioCtx.currentTime

  // Eb minor sweep: Eb5 -> Gb5 -> Bb5
  const notes = [622.25, 739.99, 932.33]
  notes.forEach((freq, idx) => {
    if (!audioCtx || !analyser) return
    const osc = audioCtx.createOscillator()
    const gain = audioCtx.createGain()

    osc.type = 'sine'
    osc.frequency.setValueAtTime(freq, now + idx * 0.06)

    const startTime = now + idx * 0.06
    const duration = 0.3

    gain.gain.setValueAtTime(0, now)
    gain.gain.setValueAtTime(0, startTime)
    gain.gain.linearRampToValueAtTime(0.06, startTime + 0.03)
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration)

    osc.connect(gain)
    gain.connect(analyser)

    osc.start(startTime)
    osc.stop(startTime + duration)
  })
}

