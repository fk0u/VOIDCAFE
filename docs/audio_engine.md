# 🔊 Web Audio API Synthesizer & Acoustic Feedback Engine

VOIDCAFE features an advanced, native browser audio engine built in [synth.ts](file:///d:/Project/VOIDCAFE/src/lib/synth.ts). It generates real-time audio, melodies, and user interface click/hover sound effects without utilizing external media assets or audio packages.

---

## 📐 Node Routing Architecture

The synthesizer connects multiple audio sources to the hardware outputs through a shared real-time analyser and volume controller:

```
[ Oscillators (Detuned Saw/Tri) ] ───► [ lowpass Filter ] ───┐
                                                            ├─► [ AnalyserNode ] ──► [ main Gain ] ──► [ Destination ]
[ Generative Chimes / Glitches ] ───────────────────────────┤        (512 FFT)          (Volume)          (Speakers)
                                                            │
[ UI Click / Hover / Success Sounds ] ──────────────────────┘
```

---

## 🛸 Core Audio Modules

### 1. The Sub-Drone Hum
Produces a deep, industrial cybernetic atmosphere:
- **Oscillators**: Merges `OscillatorNode` #1 (sawtooth at 55Hz - A1) and `OscillatorNode` #2 (triangle at 55.5Hz) detuned by 0.5Hz. The slight tuning mismatch creates organic phase cancellation (beating), making the drone feel alive.
- **Filter**: Feeds the oscillators into a `BiquadFilterNode` configured as a `lowpass` filter with a cutoff frequency of 120Hz and resonance `Q = 4.0`.
- **Filter Modulation (LFO)**: A slow Low-Frequency Oscillator (`lfoNode` at 0.15Hz) sweeps the lowpass filter frequency up and down by ±40Hz. This creates the pulsing, breathing "horror swell" effect.

### 2. Generative Spooky Chimes
Every 2 seconds, an interval runs to simulate background ambient chimes:
- **Spooky Scale**: Picks random frequencies from an eerie Locrian/Minor scale:
  `SCALE = [110.00Hz, 123.47Hz, 130.81Hz, 146.83Hz, 155.56Hz, 174.61Hz, 196.00Hz, 220.00Hz] (A Spooky Locrian)`
- **Sequencer**: Shifts the base note up by 2 or 4 octaves and plays a sine wave chime with a quick attack and a long decay envelope (1.5s - 3.5s).
- **Spatial Delay Loop**: Feeds the chime into a `DelayNode` (0.35s delay time) routed in a feedback loop using a `GainNode` set to `0.45` feedback volume. This creates repeating, decaying echoes.

### 3. Cyber-Acoustic Feedback Synthesis
Dynamic sounds generated instantly when interacting with the UI:
- **Hover Blip (`playHover()`)**:
  - Waveform: `sine`
  - Pitch: Rapid pitch slide up (`1400Hz` -> `2000Hz`) over `0.015` seconds.
  - Vibe: A clean, futuristic high-tech tick.
- **Click Relay (`playClick()`)**:
  - Waveform: `triangle` pitch sweep (`120Hz` -> `30Hz`) over `0.03` seconds.
  - Noise Burst: Generates an 8ms buffer of randomized numbers (white noise) filtered through a bandpass filter (1000Hz) to simulate mechanical relay contact clicks.
- **Success Chime (`playSuccess()`)**:
  - Notes: Plays an Eb minor arpeggio sequence (`Eb5` - 622Hz, `Gb5` - 739Hz, `Bb5` - 932Hz) offset by 60ms.
  - Vibe: A rewarding, metallic neon confirmation.

---

## 📊 Live Oscilloscope Visualizer (`synth-widget.tsx`)

The canvas-based waveform visualizer is connected directly to the synth's `AnalyserNode`:

1. **FFT configuration**: The analyser is set to `fftSize = 512`, storing 256 time-domain data frames.
2. **Reading data**: On every frame in a `requestAnimationFrame` loop, the canvas draws the wave using `getByteTimeDomainData()`:
   ```typescript
   analyser.getByteTimeDomainData(dataArray);
   ```
3. **Canvas Drawing**:
   - Iterates through the data array, calculating layout heights:
     `v = dataArray[i] / 128.0`
     `y = (v * height) / 2`
   - Connects points using standard canvas `lineTo` commands.
   - Applies glowing neon styles:
     `ctx.strokeStyle = '#c084fc'` (light neon purple)
     `ctx.shadowColor = '#a855f7'`
     `ctx.shadowBlur = 6`
4. **Offline Mode**: If the synth engine is disabled, the loop draws a flat gray horizontal baseline incorporating minor randomized vertical vibration offsets (micro-noise) to represent system standby.
