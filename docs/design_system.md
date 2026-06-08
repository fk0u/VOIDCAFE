# 🎨 Design System & Visual Aesthetics

VOIDCAFE's visual direction combines AESPA's cyber-metallic "metal tech" styling with eerie, subtle horror motifs. It focuses on premium, vibrant neon highlights offset by dark metallic surfaces.

---

## 🔤 Typography

The typography features structured tech headings offset by high-readability body fonts:

| Font Name | Role | Applied Class / Elements | Vibe |
|-----------|------|--------------------------|------|
| **Orbitron** | Headers & Branding | `font-heading` / Logos, Titles, Badges | Sharp, futuristic, cybernetic |
| **Inter** | Primary Body | `font-body` / Threads text, comments, details | Highly readable, clean, modern |
| **Space Grotesk** | Secondary Accents | `font-accent` / Thread lists, cards metadata | Geometrical, technical |
| **Creepster** | Eerie Highlights | `font-eerie` / Eerie horror notifications, glitches | Haunted, gothic, distorted |

---

## 🎨 Color Palette (Tailwind Tokens)

The theme utilizes Tailwind v4 theme variables declared in `src/index.css`:

```css
@theme {
  --color-void-black: #0a0a0a;          /* Deepest background */
  --color-void-deeper: #050505;         /* Terminal/Preloader background */
  --color-void-surface: #111111;        /* Fields, chips backings */
  --color-void-card: #161616;           /* Cards base background */
  --color-void-elevated: #1a1a1a;       /* Active buttons, widgets background */
  --color-void-border: #222222;         /* Main layout border lines */

  --color-metal-100: #e8e8e8;           /* High highlight text */
  --color-metal-200: #c0c0c0;           /* Primary text headings */
  --color-metal-300: #a0a0a0;           /* Body copy text */
  --color-metal-500: #6a6a6a;           /* Secondary metadata text */

  --color-neon-purple: #a855f7;         /* Primary group/interaction color */
  --color-neon-cyan: #22d3ee;           /* Secondary diagnostic / focus color */
  --color-blood-red: #dc2626;           /* Alerts, locks, and corrupted states */
}
```

---

## 💥 Custom CSS Core Effects

### 1. Cyber Glitch Keyframes (`.glitch-text`)
Uses twin pseudo-elements (`::before` and `::after`) offsetting identical content coordinates. The keyframe slices elements at randomized bounds:
- **`glitch-clip-1`**: Red-shifted clip mapping upper borders.
- **`glitch-clip-2`**: Cyan-shifted clip mapping lower borders.
Animations alternate rapidly, creating a digital distortion effect.

### 2. CRT Scanline Filter (`.scanlines`)
Adds a recurring linear gradient across elements:
```css
.scanlines::after {
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.08) 2px,
    rgba(0, 0, 0, 0.08) 4px
  );
}
```

### 3. Glassmorphism Layers (`.glass` & `.glass-heavy`)
Utilizes CSS blur filters merged with semi-transparent card borders to separate pages cleanly:
```css
.glass {
  background: rgba(17, 17, 17, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}
```

### 4. Horror Floating Particles
CSS-animated vector nodes shifting vertically over time. Animates `opacity` and `transform` scales simultaneously:
- Starts fully transparent at 0%.
- Reaches 30% opacity at 10%.
- Floats up and rotates 180° by 50%.
- Fades back into absolute transparency by 100%, mimicking rising ash or cyber-dust.

---

## 🕹️ Interactive Motion System (Framer Motion)

VOIDCAFE utilizes custom spring curves to make items feel physical:
- **Card3D**: Tracks pointer coordinates on `mousemove` to calculate 3D tilt angles:
  `rotateX = (mouseY / cardHeight - 0.5) * -15deg`
  `rotateY = (mouseX / cardWidth - 0.5) * 15deg`
- **Magnetic Button**: Pulls button layout boundaries toward the cursor using a responsive spring transition:
  `stiffness: 150`, `damping: 15`
- **Spotlight**: Computes absolute coordinates of mouse moves to trace a radial gradient mask:
  `mask-image: radial-gradient(circle at {x}px {y}px, rgba(255,255,255,1), transparent)`
- **Page Transitions**: Blur-to-focus transition combined with slight y-axis slides:
  `initial={{ opacity: 0, y: 15, filter: 'blur(4px)' }}`
  `animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}`
