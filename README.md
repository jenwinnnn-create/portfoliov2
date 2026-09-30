# Jenwin · UI/UX Portfolio

Personal portfolio built with **React 19 + Vite + Tailwind CSS v4 + Lenis**.

## ✨ Features

- 🧭 **Animated sidebar navigation** — spring-loaded active indicator that bounces between items as you scroll (scroll-spy), staggered slide-in entrance, scrambling logo, morphing theme icon, vertical progress rail. Mobile gets a slide-in drawer
- 🌀 **Lenis butter scrolling** — cinematic inertia scroll (the Awwwards-library); anchor links glide instead of jumping
- 🤸 **Velocity skew** — fling the page and the content physically bends with scroll speed, then settles back
- 🎬 **Scroll cinema** — clip-path title reveals, rules that draw themselves, staggered entrance cascades, hero parallax fade
- 🌗 **Dark / Light mode** — persisted to `localStorage`, respects system preference, no flash on load. Hidden shortcut: press `T`
- 🌌 **Layered interactive background** — drifting aurora gradient blobs + cursor-lit blueprint grid + live particle constellation
- 🧲 **Magnetic buttons**, 🃏 **3D tilt cards**, 🔆 **cursor glow trail** (desktop)
- ⌨️ **Scramble/decrypt name** — decrypts on load, hover to re-scramble
- 💻 **Self-typing terminal** — the `whoami.json` card types itself into view; click to replay
- 📊 **Live GitHub contribution graph** — real data, theme-aware greens, offline fallback
- 🧩 **Auto-hiding sections** — empty config lists hide sections + sidebar links automatically
- 🔠 **Self-hosted variable fonts** — Inter + Inconsolata, ~82 KB
- ♿ `prefers-reduced-motion` support, semantic HTML

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
├── App.jsx              ← sections, Lenis loop, velocity skew, parallax
├── index.css            ← Tailwind + theme tokens (dark/light)
├── icons.jsx            ← inline SVG icon library
├── lib/
│   └── scroll.js        ← Lenis smooth-scroll engine
├── hooks/
│   ├── useTheme.js      ← dark/light toggle
│   ├── useScramble.js   ← decrypt animation (replayable)
│   └── useTyping.js     ← typewriter effect
└── components/
    ├── Sidebar.jsx           ← animated sidebar nav (desktop + mobile drawer)
    ├── Hero.jsx              ├── Skills.jsx
    ├── Section.jsx           ├── Experience.jsx
    ├── About.jsx             ├── Projects.jsx
    ├── ContributionGraph.jsx ├── Connect.jsx
    ├── Reveal.jsx            ├── Contact.jsx
    ├── Magnetic.jsx          ├── Footer.jsx
    ├── Tilt.jsx              └── CursorGlow.jsx
    └── background/
        ├── Aurora.jsx        ← gradient blobs + spotlight grid
        └── ParticleField.jsx ← interactive canvas constellation

public/fonts/            ← self-hosted variable fonts (woff2)
```

### Changing the accent color

Edit the CSS variables under `:root` (light) and `.dark` (dark) in [`src/index.css`](src/index.css).

## 🌐 Deployment

This is a static SPA — deploy anywhere:

- **Vercel**: `vercel` (framework preset: Vite) — or push to GitHub and import
- **Netlify**: build command `npm run build`, publish directory `dist`
- **GitHub Pages**: `npm run build`, then publish the `dist` folder
