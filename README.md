# Hanzi copybook — React + TypeScript + Vite

## Run

Node.js >= 22.18 (`engines` in `package.json`).

```bash
npm install
npm run dev
```

Opens http://localhost:5173. The `Network: http://192.168.x.x:5173` line is the address for a phone on the same Wi-Fi network.

## Build

```bash
npm run build     # static site in dist/, including the PWA
npm run preview   # serve the build locally
```

`vite-plugin-pwa` builds a standalone app (portrait, English). PNG icons, `favicon.ico` and the Apple touch icon are generated from `public/icon.svg` and injected into the manifest and `index.html`. The service worker caches the app shell and every `public/hanzi/*.json`, so an installed build works offline and updates itself on the next launch (`registerType: 'autoUpdate'`).

## Checks

```bash
npm run check         # lint, format:check, typecheck and test
npm run lint          # ESLint
npm run format:check  # Prettier (no writes)
npm run typecheck     # TypeScript
npm test              # Vitest
```

Auto-fix lint: `npm run lint:fix`. Format: `npm run format`.

## Layout

```
src/
  app/                    — composition root: wires features together
    main.tsx              — entry point
    router.tsx            — all routes, each page loaded lazily as its own chunk
    redirects.tsx         — short and old addresses (e.g. '/hsk/1/3' → '/hsk/1/topics/3')
    RootLayout.tsx        — page outlet and scroll restoration
    CopybookScreen.tsx    — copybook pages; the character set always comes from the URL, Header.tsx
  domain/                 — pure TypeScript, no React
    types.ts              — CharEntry, CharGroup, GridKind, StrokePaths
    grading.ts            — Grade, score per attempt and per copybook, normalizeBest
    charFile.ts           — stroke-data file name (shared with scripts/)
  data/
    decks/*.json          — which characters exist, one file per deck (edit this)
    chars.ts              — character list (ALL, charAt, indexOfChar)
    charData.ts           — on-demand stroke data loading (cached)
    useCharData.ts        — loading/ready/error state + retry, prefetch of neighbors
    hsk.ts, hsk/<level>/  — HSK characters, words and topic lessons
    courseLessons.ts      — lessons of the Lessons tab: dialogues, words, practice parts
  features/               — one folder per feature, with its own CSS
    writer/               — WritingCell (HanziWriter wrapper) and its contract (types.ts)
    copybook/             — copybook mode: useCopybook, steps, CopybookSteps, SummaryOverlay, Controls,
                            copybookStore (open character per set, settings)
    stroke-order/         — "Stroke order" strip
    picker/               — character picker sheet
    settings/             — settings model (settings.ts) and SettingsPanel
    progress/             — per-character and per-lesson progress (v2 schema, migration); one shared
                            in-memory copy per tab (progressStore + useSyncExternalStore)
    home/                 — home page
    hsk/                  — HSK character list, selection (hskStore) and worksheet PDF
    lesson/               — level page, topics ('/hsk/<level>/topics/<n>', words grouped by theme),
                            lessons of the Lessons tab ('/hsk/<level>/lessons/<n>', parts),
                            quizzes (QuizPage, QuizRunner)
  shared/                 — reusable, knows nothing about features
    ui/                   — CanvasCell, Seg
    lib/                  — draw, storage (createStore), haptics, plural
    hooks/                — useCellSize, usePersistentState
    i18n/en.ts            — all interface strings (English only)
    theme.ts              — canvas/HanziWriter colors, layout width
  styles/base.css         — CSS variables, reset, .label/.status/.btn
public/icon.svg           — PWA icon source; raster icons are generated at build
public/hanzi/<code>.json  — stroke data, one file per character (generated, not in git)
scripts/build-data.ts     — generator for public/hanzi/
```

Dependency direction: `app → features → data/shared → domain`. A feature may use `writer` (other
modes drive it through `features/writer/types.ts`); `shared` and `domain` never import from features.
Each feature owns its localStorage keys in its own `*Store.ts` (all under the `hanzi:` prefix); `app/`
holds none.

## Add an exercise mode

Create `src/features/<mode>/` with a hook like `useCopybook` (state machine over `QuizCallbacks`
and `WriterHandle` from `features/writer/types.ts`) and its components, then add a route for it in `src/app/router.tsx`.

## Add characters

1. Append to a deck in `src/data/decks/`: `{ "c": "水", "py": "shuǐ", "en": "water" }` (or add a new group).
   A new deck is a new file there (an array of groups, same format); decks are ordered by file name.
2. That is enough. `npm run dev` and `npm run build` regenerate stroke data themselves (or run `npm run data` by hand). Stroke data is not part of the JS bundle: each character is fetched as its own file (~0.5 KB) when opened. The source is the `hanzi-writer-data` package (~9000 characters).

## Easy to change

- Step count and outline fade — `src/features/copybook/steps.ts` (labels in `en.ts`, `t.steps`).
- Star scoring — `src/domain/grading.ts`.
- Copy — `src/shared/i18n/en.ts`.
- Interface colors — variables at the top of `src/styles/base.css`; canvas and writing-cell colors — `src/shared/theme.ts`.
- Quiz tuning (stroke width, animation speed) — `new HanziWriter(...)` in `src/features/writer/WritingCell.tsx`.
