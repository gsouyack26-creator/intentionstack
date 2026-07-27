# IntentionStack

> **Daily Focus & Intention Setter** — an offline-first PWA for building a powerful morning-to-evening intention ritual.

[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8-purple?logo=vite)](https://vite.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-4-06b6d4?logo=tailwindcss)](https://tailwindcss.com)
[![PWA](https://img.shields.io/badge/PWA-offline--first-green)](https://web.dev/pwa)

---

## What is IntentionStack?

IntentionStack structures your day into three rituals:

1. **Morning** — Set exactly 3 intentions. No more, no less. Clarity through constraint.
2. **Focus** — Work in Pomodoro sprints (25 min focus / 5 min break). The timer tracks which intention you're tackling.
3. **Evening** — Check off what you accomplished, rate your energy (1-5), and write a quick reflection.

Your history builds into streaks, heatmaps, and trend charts that reveal your productivity patterns over time.

---

## Screenshots

> _Screenshots coming in v1.0_

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Build | Vite 8 |
| Styling | TailwindCSS v4 |
| Database | Dexie.js (IndexedDB) |
| Charts | Recharts |
| Icons | Lucide React |
| PWA | vite-plugin-pwa + Workbox |

---

## Install & Run

### Prerequisites
- Node.js 18+ or Bun 1.x

### Development

```bash
# Clone the repo
git clone https://github.com/yourusername/intentionstack.git
cd intentionstack

# Install dependencies
npm install
# or
bun install

# Start dev server
npm run dev
# or
bun dev
```

Open http://localhost:5173 in your browser.

### Build

```bash
npm run build
# or
bun run build
```

The production build outputs to `dist/`. Includes:
- Fully minified JS/CSS
- PWA service worker (offline support)
- Web app manifest (installable)

### Preview Production Build

```bash
npm run preview
```

---

## Deploy

### GitHub Pages

1. Set `base` in `vite.config.ts` to your repo name:
   ```ts
   export default defineConfig({ base: '/intentionstack/', ... })
   ```
2. Push to GitHub and enable Pages from the `dist` branch, or use a GitHub Action:
   ```yaml
   # .github/workflows/deploy.yml
   - uses: actions/upload-pages-artifact@v3
     with:
       path: dist
   ```

### Netlify / Vercel

Just connect the repo — both auto-detect Vite. Build command: `npm run build`, output: `dist`.

---

## Architecture

```
src/
  db/db.ts              Dexie schema + helper functions
  types/index.ts        TypeScript interfaces
  components/           React UI components
  hooks/                Custom React hooks (Dexie live queries)
  utils/                Pure utility functions
  App.tsx               Root component + routing logic
  main.tsx              Vite entry point
```

---

## License

MIT License — see [LICENSE](LICENSE) for details.
