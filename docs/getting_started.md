# 🚀 Getting Started & Template Customization Guide

Welcome to the **Getting Started Guide** for VOIDCAFE. This document will walk you through setting up your environment, running the project, understanding hotkeys/commands, and customizing the template for your own hobby or production projects.

---

## 🛠️ Prerequisites & Setup

Ensure you have the following installed on your machine:
- **Node.js**: Version 18.0.0 or higher is required (React 19 support).
- **npm**: Version 9.0.0 or higher.

### Installation

1. Clone the project to your local directory.
2. Open your shell and run the following command to download dependencies:
   ```bash
   npm install
   ```

### Development Server

Start the local development server with hot-reloading:
   ```bash
   npm run dev
   ```
   The application will boot at **http://localhost:5173**. Changes to your TSX or CSS files will immediately reflect in the browser.

### Production Build & Validation

Validate TypeScript types and build a production-minified bundle:
   ```bash
   npm run build
   ```
   This generates optimized, code-split chunks in the `/dist` directory. You can preview this build locally using:
   ```bash
   npm run preview
   ```

---

## ⌨️ Global Keyboard Shortcuts

VOIDCAFE listens for key-press events globally on the document level.
*(Note: Keypresses are automatically ignored if the cursor is focused inside an input field, input element, or textarea to avoid interfering with user typing).*

| Key | Action | Code Location |
|-----|--------|---------------|
| `N` / `n` | Opens the **Create Thread** modal | [useKeyboardShortcuts.ts](file:///d:/Project/VOIDCAFE/src/hooks/useKeyboardShortcuts.ts) |
| `/` | Focuses and opens the **Global Search Overlay** | [useKeyboardShortcuts.ts](file:///d:/Project/VOIDCAFE/src/hooks/useKeyboardShortcuts.ts) |
| `` ` `` (Backtick) | Toggles the **VOID-Terminal Console** overlay | [useKeyboardShortcuts.ts](file:///d:/Project/VOIDCAFE/src/hooks/useKeyboardShortcuts.ts) |
| `Escape` | Closes active modals, blurs inputs, and closes terminal | Managed in individual modal state overlays |

---

## 🖥️ VOID-Terminal Diagnostics Console

Open the terminal via `` ` `` and execute diagnostic commands:

| Command | Action | Description |
|---------|--------|-------------|
| `help` | Lists commands | Prints all available console commands |
| `status` | Checks server stats | Checks core engine nodes, memory, temperature, and sync levels |
| `lore` | Decrypts transcripts | Prints random encrypted lore from the Kwangya database |
| `hack` | Glitch trigger | Simulates cache decryption sequence with noise audio effects |
| `ascii` | Cyber Logo | Prints the retro metal-cyber VOIDCAFE logo in ASCII art |
| `play` | Synth Sweep | Fires a synthesized high-to-low laser sweep frequency scan |
| `unlock <key>` | Decrypt Files | Decrypts secret files. Supported keys: `blackmamba`, `aespa`, `naevis` |
| `clear` | Purge console | Clears command logs history |
| `exit` | Terminate link | Disconnects and closes the terminal console overlay |

---

## 🔧 Step-by-Step Customization Guide

Because VOIDCAFE is a frontend template, it is built to be easily customizable. Follow these steps to adapt it to your own theme or community.

### Step 1: Renaming & Rebranding
To rename the app from "VOIDCAFE" to your own brand:
1. **HTML Title**: Open [index.html](file:///d:/Project/VOIDCAFE/index.html) and change the `<title>` tag and `<meta name="description">` description content:
   ```html
   <title>MY_BRAND — Enter The Tech Portal</title>
   ```
2. **Logo & Text Branding**: Search for `VOIDCAFE` across the codebase and change it. Major locations:
   - [navbar.tsx](file:///d:/Project/VOIDCAFE/src/components/layout/navbar.tsx): Logo text rendering.
   - [index.tsx](file:///d:/Project/VOIDCAFE/src/routes/index.tsx): Hero section headline.
   - [void-terminal.tsx](file:///d:/Project/VOIDCAFE/src/components/common/void-terminal.tsx): Terminal header and ASCII logo command.

### Step 2: Customizing Communities
VOIDCAFE includes 10 K-pop communities by default. You can change these to represent anything (e.g. gaming, tech, movies).
1. Open [seed.ts](file:///d:/Project/VOIDCAFE/src/data/seed.ts).
2. Locate the `COMMUNITIES` array:
   ```typescript
   const COMMUNITIES: Community[] = [
     {
       id: 'aespa',
       name: 'AESPA',
       description: 'Next Level in the KWANGYA...',
       memberCount: 24300,
       threadCount: 892,
       gradient: 'from-violet-600 via-purple-500 to-cyan-400',
       icon: '⚡'
     },
     // Add, edit or delete entries here...
   ]
   ```
3. Update [utils.ts](file:///d:/Project/VOIDCAFE/src/lib/utils.ts) to map color hexes for your new community badges in the `COMMUNITY_COLORS` object:
   ```typescript
   export const COMMUNITY_COLORS: Record<string, string> = {
     AESPA: '#a855f7',
     // Add your custom community color mapping
   }
   ```

### Step 3: Modifying Seed Threads & Comments
All content is seeded on first load into the browser's `localStorage` via the seeder.
1. Open [seed.ts](file:///d:/Project/VOIDCAFE/src/data/seed.ts).
2. Locate `USERS`, `THREADS`, and `COMMENTS` arrays.
3. Edit the static text, author references, like counts, and tag arrays.
4. **Testing seed resets**: To see your changes, you must clear your browser's local storage (run `localStorage.clear()` in developer tools console) and refresh the page, which triggers a re-seed.

### Step 4: Modifying Keyboard Shortcuts
To add new shortcuts or change keybindings:
1. Open [useKeyboardShortcuts.ts](file:///d:/Project/VOIDCAFE/src/hooks/useKeyboardShortcuts.ts).
2. Add new key cases inside the `handleKeyDown` listener:
   ```typescript
   switch (e.key.toLowerCase()) {
     case 'n':
       e.preventDefault()
       setCreateModalOpen(true)
       break
     // Add your custom shortcut here
   }
   ```

### Step 5: Updating PWA Manifest
Update web app metadata for installation on mobile devices:
1. Edit [manifest.json](file:///d:/Project/VOIDCAFE/public/manifest.json) in the `public/` folder.
2. Update the `name`, `short_name`, and swap out icon file paths in the `icons` array.
