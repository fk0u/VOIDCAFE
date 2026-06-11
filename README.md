# 🌑 VOIDCAFE

> **The darkest interactive K-pop fan portal template. Enter the void.**

VOIDCAFE is a premium, cutting-edge frontend template built to demonstrate advanced browser interactions, custom audio synthesis, and modern state-driven layouts. Inspired by AESPA's futuristic "metal tech" aesthetic merged with eerie cyberpunk and retro sci-fi motifs, VOIDCAFE is designed for developers who want to build highly immersive, interactive communities.

This project is built as a complete, production-ready frontend boilerplate, featuring zero external media asset dependencies, a fully client-side storage-backed simulation engine, and strict, error-free TypeScript code.

---

## ✨ Features Breakdown

### 🎨 Visual & Motion Aesthetics
- **Aceternity UI-Inspired Mechanics**: Includes advanced pointer-tracking spotlight masks, dynamic 3D tilting cards (`Card3D`), and interactive magnetic springs (`MagneticButton`).
- **Retro Cyber Overlays**: CSS-driven scanlines (CRT scan effect), neon text glows, and metallic overlays create a tactile hardware feel.
- **Impure-Purity Particles**: Floating dust/ash nodes animated using pure, deterministic pseudo-random seed algorithms, preventing React render-purity warnings.
- **Glitch Text Engine**: Twin pseudo-element keyframe animations simulating high-frequency digital channel noise.

### 🔊 Interactive Web Audio Synthesizer
- **Analytic Sub-Drone Hum**: A constant, detuned dual-oscillator drone (55Hz Saw + 55.5Hz Triangle) running through a low-pass filter modulated by an LFO to create a breathing, industrial atmosphere.
- **Generative Spooky Chimes**: Background algorithmic chimes picking random notes from a Locrian scale, routed through an echo feedback delay loop.
- **Tactile UI Audio Feedback**: Real-time synthesized click relays, hover blips, and Eb minor confirmation arpeggios that fire with 0ms latency.
- **Live Canvas Oscilloscope**: Real-time visualization of the audio engine's output connected directly to the Web Audio `AnalyserNode`.

### ⚡ Technical Stack & Architecture
- **React 19 + TypeScript**: Strict mode verification with zero lint errors and zero type warnings.
- **Tailwind CSS v4**: Built on the latest Tailwind engine utilizing pure CSS-in-JS variables.
- **TanStack Router**: State-safe, fully typed, file-based routing with automatic chunk split-loads.
- **TanStack Query v5**: Handles simulated network queries with custom staleTimes, placeholder data-keeping, and adjacent prefetching.
- **Optimistic Updates**: Comment likes and thread likes update the UI instantly, with a robust rollback snapshot in case of simulated server rejection.
- **Zustand State Engine**: Persistent auth profiles and user preferences, utilizing partialization to exclude overlay states (like terminal/modal states) from local storage.

---

## 🚀 Getting Started

To run this template locally:

1. **Clone the repository and install dependencies**:
   ```bash
   npm install
   ```

2. **Start the development server**:
   ```bash
   npm run dev
   ```
   *The template runs at `http://localhost:5173`.*

3. **Verify code quality (Linter)**:
   ```bash
   npm run lint
   ```

4. **Build the production package**:
   ```bash
   npm run build
   ```

---

## ⌨️ Global Keyboard Shortcuts

The site binds global event listeners (ignored when input fields or textareas are focused) for quick navigation:

| Key | Action |
|-----|--------|
| `N` / `n` | Opens the **Create Thread** modal |
| `/` | Opens the **Global Search Overlay** |
| `` ` `` (Backtick) | Toggles the **VOID-Terminal Console** |
| `Escape` | Closes any active modal, blurs inputs, and disconnects the terminal |

---

## 🖥️ VOID-Terminal Diagnostics Console

Press `` ` `` to toggle the secure terminal overlay and run diagnostic commands:

- `help` — Lists all cognitive commands.
- `status` — Reads core server nodes, memory usage, liquid metal temperature, and sync levels.
- `lore` — Decrypts and prints encrypted ae-portal transcripts and transcripts from Kwangya.
- `hack` — Triggers a simulated cache decryption matrix cascade accompanied by sound glitches.
- `ascii` — Prints the metallic retro VOIDCAFE logo in large ASCII art.
- `play` — Fires a synthesized high-to-low laser sweep scan.
- `unlock <key>` — Decrypts secret files. Keys: `blackmamba`, `aespa`, `naevis`.
- `clear` — Purges terminal log history.
- `exit` — Closes the terminal overlay.

---

## 📁 Documentation Roadmap

For in-depth explanations, configuration guides, and customization paths, explore the files in the [docs/](file:///d:/Project/VOIDCAFE/docs/) directory:

1. **[🚀 Getting Started Guide](file:///d:/Project/VOIDCAFE/docs/getting_started.md)**: Detailed commands, local deployment details, and a step-by-step **Customization Guide** to rename the template and inject custom communities/seed data.
2. **[📁 Project Structure Mapping](file:///d:/Project/VOIDCAFE/docs/project_structure.md)**: Explains the role of every folder, directory layout, routing conventions, and includes a **Backend Migration Guide** to transition from local storage mocks to real API queries.
3. **[🏗️ System Architecture](file:///d:/Project/VOIDCAFE/docs/architecture.md)**: Detail-rich description of Zustand stores, TanStack file routing, TanStack Query caching parameters, and the code-level flow of optimistic updates with snapshot rollbacks.
4. **[🎨 Design System & CSS Effects](file:///d:/Project/VOIDCAFE/docs/design_system.md)**: Deep dive into the custom CSS glitch keyframes, CRT scanline repeating gradients, backdrop-blur glassmorphism classes, and spring parameters in Framer Motion.
5. **[🔊 Audio Engine & Synth Schematics](file:///d:/Project/VOIDCAFE/docs/audio_engine.md)**: Diagrams the Web Audio API routing graph. Explains how the oscillators, LFO filter modulations,Locrian scale chime sequencers, and Canvas oscilloscope data arrays are structured and how to tweak them.

---

## 📄 License

This project is licensed under the MIT License. Enter the void with 🖤.
