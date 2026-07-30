# msm-db

A static My Singing Monsters database stored as JSON files, with an automated build pipeline that generates a REST-like API deployed to GitHub Pages.

## Live API

Once deployed, the API is available at:

```
https://dbruce32.github.io/msm-db/api/
```

### Endpoints

| Endpoint | Description |
|----------|-------------|
| `/api/monsters/index.json` | Monster manifest (all monsters with name, slug, class, elements) |
| `/api/monsters/{slug}.json` | Individual monster data (elements, variants, breeding combos) |
| `/api/islands/index.json` | All islands with element pools |

### Element Assets

Element icon PNGs are available via raw GitHub content:

```
https://raw.githubusercontent.com/dbruce32/msm-db/main/Assets/Elements/{filename}.png
```

A discoverable manifest listing all 46 icons is at:

```
https://raw.githubusercontent.com/dbruce32/msm-db/main/Assets/Elements/elements.json
```

## Project Structure

```
msm-db/
├── monsters/             # Source data — one JSON file per monster
├── islands.json          # Source data — island definitions with element pools
├── Assets/Elements/      # Element icon PNGs + manifest
├── src/                  # TypeScript build scripts
│   ├── index.ts          # Build entry point
│   ├── reader.ts         # Reads source JSON files
│   ├── writer.ts         # Generates API output in public/api/
│   └── types.ts          # Type definitions
├── public/               # Deployed to GitHub Pages
│   ├── index.html        # API documentation page
│   └── api/              # Generated — do not edit manually
└── .github/workflows/    # CI + GitHub Pages deployment
```

## Prerequisites

- [Node.js](https://nodejs.org/) >= 20.0.0
- npm (included with Node.js)

## Setup

```bash
# Clone the repository
git clone https://github.com/dbruce32/msm-db.git
cd msm-db

# Install dependencies
npm install
```

## Build

The build reads all monster/island JSON source files and generates the static API output in `public/api/`.

```bash
npm run build
```

This runs the TypeScript compiler and then executes the build script, producing:
- `public/api/monsters/index.json` — monster manifest
- `public/api/monsters/{slug}.json` — individual monster files
- `public/api/islands/index.json` — islands manifest

## Other Commands

```bash
# Type-check without emitting
npm run typecheck

# Preview the site locally (serves the public/ directory)
npm run serve

# Remove build artifacts
npm run clean
```

## Deployment

Deployment is automated via GitHub Actions. On every push to `main`:

1. **CI** (`ci.yml`) — runs type-checking and build to verify no errors
2. **Build and Deploy** (`build-and-deploy.yml`) — builds the API output and deploys `public/` to GitHub Pages

No manual deployment steps are required.

## Data Format

### Monster (`monsters/{slug}.json`)

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

### Island (`islands.json`)

```json
[
  { "name": "Plant Island", "elements": ["Plant", "Earth", "Water", "Cold"] }
]
```

Filename convention: lowercase name with non-alphanumeric characters replaced by hyphens (e.g., `Toe Jammer` → `toe-jammer.json`).

## Contributing

1. Add or edit monster files in `monsters/` following the existing format
2. Run `npm run build` to verify the data parses correctly
3. Submit a pull request — CI will validate the build automatically

## License

MIT
