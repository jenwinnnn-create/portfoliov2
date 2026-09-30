# Jenwin · UI/UX Portfolio

Personal portfolio built with **React 19 + Vite + Tailwind CSS v4**.

## ✨ Features

- 🌗 **Dark / Light mode** — toggle in the nav, persisted to `localStorage`, respects system preference, no flash on load. Hidden shortcut: press `T`
- 🌌 **Layered interactive background** — drifting aurora gradient blobs + blueprint grid that lights up around your cursor + a live particle constellation (canvas) that links particles together and reacts to your mouse
- 🧲 **Magnetic buttons** — CTAs gently gravitate toward your cursor
- 🃏 **3D tilt cards** — skill/project cards rotate in perspective with an accent glare following your pointer
- 🔆 **Cursor glow trail** — glowing dot + lagging ring follower (desktop only)
- ⌨️ **Scramble/decrypt name** — decrypts on load, **hover it to re-scramble** (custom `useScramble` hook)
- 💻 **Self-typing terminal** — the `whoami.json` card types itself when scrolled into view; click to replay
- 📊 **Live GitHub contribution graph** — real data from your GitHub (theme-aware GitHub greens, hover tooltips, skeleton loading, graceful offline fallback)
- 🧩 **Auto-hiding sections** — leave `projects`, `experience`, or `socials` empty in the config and those sections (and their nav links) disappear; numbering re-adjusts automatically
- 📜 **Scroll-reveal animations** + scroll progress bar + back-to-top button
- 🔠 **Self-hosted variable fonts** — Inter (100–900) + Inconsolata, ~82 KB total, zero layout shift
- ♿ **Accessibility** — `prefers-reduced-motion` disables all animation; semantic HTML; keyboard-friendly
- 🔗 **Zero CDN dependencies at runtime** — all icons inline SVG, fonts bundled
- 📦 **Lightweight** — ~81 kB JS + 8 kB CSS gzipped

## 🚀 Getting Started

```bash
npm install       # install dependencies
npm run dev       # start dev server (http://localhost:5173)
npm run build     # production build → dist/
npm run preview   # preview the production build
```

## ✏️ Customizing

**Everything personal lives in one file: [`src/config.js`](src/config.js)** — name, roles, about text, skills, experience, projects, socials, email, footer. Edit values there and the whole site updates. The file has examples showing how to add projects/socials/experience later.

### Project structure

```
src/
├── config.js            ← ★ all your data here
├── App.jsx              ← section order & auto-hide logic
├── index.css            ← Tailwind + theme tokens (dark/light)
├── icons.jsx            ← inline SVG icon library
├── hooks/
│   ├── useTheme.js      ← dark/light toggle
│   ├── useScramble.js   ← decrypt animation (replayable)
│   └── useTyping.js     ← typewriter effect
└── components/
    ├── Navbar.jsx            ├── Skills.jsx
    ├── Hero.jsx              ├── Experience.jsx
    ├── Section.jsx           ├── Projects.jsx
    ├── About.jsx             ├── Connect.jsx
    ├── ContributionGraph.jsx ├── Contact.jsx
    ├── Reveal.jsx            ├── Footer.jsx
    ├── Magnetic.jsx          ← magnetic-button wrapper
    ├── Tilt.jsx              ← 3D tilt-card wrapper
    ├── CursorGlow.jsx        ← cursor follower
    └── background/
        ├── Aurora.jsx        ← gradient blobs + spotlight grid
        └── ParticleField.jsx ← interactive canvas constellation

public/fonts/            ← self-hosted variable fonts (woff2)
```

### Changing the accent color

Edit the CSS variables under `:root` (light) and `.dark` (dark) in [`src/index.css`](src/index.css) — e.g. change `--accent` from mint `#00e59b` to any color you like.

## 🌐 Deployment

This is a static SPA — deploy anywhere:

- **Vercel**: `vercel` (framework preset: Vite) — or push to GitHub and import
- **Netlify**: build command `npm run build`, publish directory `dist`
- **GitHub Pages**: `npm run build`, then publish the `dist` folder
