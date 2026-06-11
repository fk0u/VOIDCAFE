# 🎨 Design System & Custom CSS Effects

VOIDCAFE utilizes a custom design system that merges the cyber-metallic styling of futuristic tech grids with eerie horror elements. This document defines the tokens, custom animations, and layout classes.

---

## 🔤 Typography Configuration

We import four specific typefaces from Google Fonts in [index.html](file:///d:/Project/VOIDCAFE/index.html) to style different content types:

| Font Name | Role | Class Token | Vibe |
|-----------|------|-------------|------|
| **Orbitron** | Tech Headings / Branding | `font-heading` | Sharp, blocky, sci-fi |
| **Inter** | Core Body Text & Comments | `font-body` | Clean, modern, highly readable |
| **Space Grotesk** | Metadata / Code-like stats | `font-accent` | Tech-grotesque, monospace-like |
| **Creepster** | Horror Glitches / warnings | `font-eerie` | Eerie, horror, distressed |

---

## 🎨 Color Palette (Tailwind v4 Theme Variables)

Unlike Tailwind v3 config files, Tailwind v4 handles the theme declarations directly inside your primary CSS file, [src/index.css](file:///d:/Project/VOIDCAFE/src/index.css), using the `@theme` directive:

```css
@theme {
  /* Surface Backings */
  --color-void-black: #0a0a0a;          /* Main application dark background */
  --color-void-deeper: #050505;         /* Terminal overlay / preloader backings */
  --color-void-surface: #111111;        /* Form input fields & community chips */
  --color-void-card: #161616;           /* Post cards background */
  --color-void-elevated: #1a1a1a;       /* Active state cards, buttons, sidebar items */
  --color-void-border: #222222;         /* Grid layout border lines */
  --color-void-border-light: #2a2a2a;   /* Hover-highlight borders */

  /* Metal Shimmer Text */
  --color-metal-100: #e8e8e8;           /* Heading pure highlight */
  --color-metal-200: #c0c0c0;           /* Secondary headers */
  --color-metal-300: #a0a0a0;           /* Paragraph details */
  --color-metal-500: #6a6a6a;           /* Timestamp metadata */

  /* Vibrant Accents */
  --color-neon-purple: #a855f7;         /* Active state highlights, likes, main glows */
  --color-neon-cyan: #22d3ee;           /* System status, terminal messages, focus boundaries */
  --color-blood-red: #dc2626;           /* Warnings, locked preloader state, glitched text */
}
```

---

## 💥 Custom Visual CSS Effects

### 1. Cyber Glitch Animations (`.glitch-text`)
The glitch text effect applies rapid keyframe clipping to pseudo-elements to create digital distortion:
- ** twin pseudo-elements (`::before` and `::after`)** duplicate the text node content.
- **`glitch-clip-1` & `glitch-clip-2`**: Alternate clipping regions using `clip-path: inset(top right bottom left)`.
- **Shift values**: The blue-shifted (`::before`) and red-shifted (`::after`) copy layers shift offset positions by ±2px via `transform: translate()` keys.

### 2. CRT Scanline Gradients (`.scanlines`)
Simulates old terminal displays. A repeating linear gradient is drawn as an absolute overlay layer over components:
```css
.scanlines::after {
  content: '';
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.08) 2px,
    rgba(0, 0, 0, 0.08) 4px
  );
  pointer-events: none;
}
```

### 3. Glassmorphic Card Wrappers (`.glass` & `.glass-heavy`)
Used to overlay modals and navigation panels:
```css
.glass-heavy {
  background: rgba(17, 17, 17, 0.85);
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid rgba(255, 255, 255, 0.08);
}
```

---

## 🕹️ Interactive Spring Physics (Framer Motion)

VOIDCAFE configures custom spring physics to make the UI feel reactive:

### 1. Magnetic Buttons (`MagneticButton.tsx`)
Pulls the layout toward the hover pointer, then snaps back:
- **Spring curve**:
  - `stiffness: 150`
  - `damping: 15`
  - `mass: 0.8`

### 2. 3D Card Tilts (`Card3D.tsx`)
Calculates coordinates relative to the card border during mouse moves and applies dynamic CSS transforms:
- **Math formulas**:
  - `rotateX = (mouseY / cardHeight - 0.5) * -15` (maximum 15-degree vertical tilt)
  - `rotateY = (mouseX / cardWidth - 0.5) * 15` (maximum 15-degree horizontal tilt)
- **CSS setup**: Parent elements are given `perspective: 1000px`, and cards apply `transform-style: preserve-3d` to render content cleanly in 3D space.

### 3. Page Fade-Blur Transitions (`PageTransition.tsx`)
Controls page entrances:
- **Transitions config**:
  - `initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}`
  - `animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}`
  - `exit={{ opacity: 0, y: -15, filter: 'blur(4px)' }}`
  - `transition={{ duration: 0.35, ease: 'easeOut' }}`
