# MSM Database — Agent Context

## What This Is

A static JSON API for My Singing Monsters data. No server runtime — it's a TypeScript build pipeline that reads local JSON data and writes individual API files deployed to GitHub Pages.

## Architecture

```
Source JSON (monsters/, islands.json) → read → write → GitHub Pages
```

- **Read** (`src/reader.ts`): Loads all monster files from `monsters/` and `islands.json`.
- **Write** (`src/writer.ts`): Outputs `public/api/monsters/{slug}.json` per monster + `public/api/monsters/index.json` manifest + `public/api/islands/index.json`.
- **Orchestrate** (`src/index.ts`): Wires the pipeline.
- **Types** (`src/types.ts`): All TypeScript interfaces.

## Key Files

| File | Purpose |
|------|---------|
| `src/index.ts` | Build entry point |
| `src/types.ts` | All TypeScript interfaces (Monster, Island, etc.) |
| `src/reader.ts` | Reads source JSON from disk |
| `src/writer.ts` | JSON file output to public/api/ |
| `public/index.html` | API documentation landing page |
| `monsters/*.json` | Source data — one file per monster |
| `islands.json` | Source data — island definitions |

## Commands

```bash
npm install          # Install dependencies
npm run build        # Full pipeline: compile TS + read → write
npm run typecheck    # TypeScript type checking only
npm run clean        # Remove dist/ and public/api/
npx serve public     # Local server at http://localhost:3000
```

## Structure

```
msm-db/
├── src/
│   ├── index.ts          # Build orchestrator
│   ├── types.ts          # TypeScript interfaces
│   ├── reader.ts         # Reads monsters/ and islands.json
│   └── writer.ts         # Writes public/api/ output
├── monsters/             # 180 source .json files (one per monster)
├── islands.json          # 28 islands with element pools
├── public/
│   ├── index.html        # API docs landing page (checked in)
│   └── api/              # Generated output (gitignored)
│       ├── monsters/
│       │   ├── index.json        # Manifest of all monsters
│       │   ├── bowgart.json      # Individual monster
│       │   └── ...
│       └── islands/
│           └── index.json        # All islands
├── .github/workflows/
│   └── build-and-deploy.yml     # GitHub Pages deployment
├── package.json
├── tsconfig.json
└── .gitignore
```

## File Formats

### Monster File (`monsters/{name}.json`) — Source Data

Filename convention: `re.sub(r'[^a-z0-9]+', '-', name.lower()).strip('-') + '.json'`

```json
{
  "name": "Bowgart",
  "class": "Natural",
  "elements": ["Plant", "Water", "Cold"],
  "variants": ["Rare Bowgart", "Epic Bowgart"],
  "breeding": {
    "Plant Island": {
      "common": { "pair": ["Furcorn", "Toe Jammer"], "time": "12h", "enhanced_time": "9h" },
      "epic": { "pair": ["Clamble", "Oaktopus"], "time": "1d 5h", "enhanced_time": "21h 45m" }
    }
  }
}
```

Breeding is stored statically (not computed) because epic monsters have hard-assigned combos. The `breeding` object is keyed by island name, with sub-keys:
- `"common"` — default breeding pair for that monster
- `"epic"` — special combo that produces the Epic variant
- `"rare"` — special combo for Rare singles (only applicable to single-element monsters)

### Islands File (`islands.json`) — Source Data

Flat array of island objects with name and element pool:

```json
[
  { "name": "Plant Island", "elements": ["Plant", "Earth", "Water", "Cold"] },
  { "name": "Cold Island", "elements": ["Air", "Plant", "Water", "Cold"] }
]
```

### API Output — Monster Manifest (`public/api/monsters/index.json`)

```json
{
  "total": 180,
  "monsters": [
    { "name": "Bowgart", "slug": "bowgart", "class": "Natural", "elements": ["Plant", "Water", "Cold"] }
  ]
}
```

### API Output — Islands (`public/api/islands/index.json`)

```json
{
  "total": 28,
  "islands": [
    { "name": "Plant Island", "elements": ["Plant", "Earth", "Water", "Cold"] }
  ]
}
```

## Deployment

GitHub Actions (`.github/workflows/build-and-deploy.yml`):
- Triggers: push to main, manual dispatch
- Runs `npm ci` + `npm run build`
- Deploys `public/` to GitHub Pages via `actions/deploy-pages@v4`

## Conventions

- Node.js 20+ required
- ESM only (`"type": "module"` in package.json)
- All types in `src/types.ts`
- Generated output in `public/api/` is gitignored
- `public/index.html` is checked in (landing page with interactive API docs)
- Source data lives in `monsters/` and `islands.json` at the repo root

## Data Completeness

### Breeding Data Added

| Island | Common | Rare Singles | Epic | Special |
|--------|--------|-------------|------|---------|
| Plant Island | ✅ | ✅ | ✅ | ✅ |
| Cold Island | ✅ | ❌ | ✅ | ✅ |
| Air Island | ✅ | ❌ | ✅ | ✅ |
| Water Island | ✅ | ❌ | ✅ | ✅ |
| Earth Island | ✅ | ❌ | ✅ | ✅ |
| Fire Haven | ❌ | ❌ | ❌ | ❌ |
| Fire Oasis | ❌ | ❌ | ❌ | ❌ |
| All others | ❌ | ❌ | ❌ | ❌ |

## Design Decisions

- **One file per monster** — enables O(1) lookup by name without loading the entire dataset
- **Breeding stored on the monster itself** — keyed by island name, since combos differ per island
- **Static breeding data** — not computed from element logic, since Epics/Specials break the rules
- **Kebab-case filenames** — normalized from monster name for URL-friendly paths
- **No separate rare/epic monster files** — variant info is stored as a `variants` array on the base monster
- **No fetch step** — unlike pogo-db-api, data is maintained locally in this repo

## Known Issues

### `islands.json` Element Corrections Needed

- Cold Island currently says `["Air", "Plant", "Earth", "Cold"]` — should be `["Air", "Plant", "Water", "Cold"]`
- Air Island currently says `["Air", "Plant", "Earth", "Water"]` — should be `["Air", "Earth", "Water", "Cold"]`
