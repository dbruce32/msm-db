# msm-db

A free, static JSON API for [My Singing Monsters](https://www.bigbluebubble.com/my-singing-monsters/) data. No server, no authentication — just JSON files deployed to GitHub Pages.

## API Base URL

```
https://dylanbruce.github.io/msm-db/api
```

## Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /monsters/index.json` | Manifest of all monsters (name, slug, class, elements) |
| `GET /monsters/{slug}.json` | Full data for a single monster including breeding combos |
| `GET /islands/index.json` | All islands with element pools |

## Quick Start

```javascript
// Fetch a specific monster
const res = await fetch('https://dylanbruce.github.io/msm-db/api/monsters/bowgart.json');
const bowgart = await res.json();
console.log(bowgart.breeding['Plant Island'].common);
// { pair: ["Furcorn", "Toe Jammer"], time: "12h", enhanced_time: "9h" }
```

```javascript
// List all monsters
const res = await fetch('https://dylanbruce.github.io/msm-db/api/monsters/index.json');
const { total, monsters } = await res.json();
console.log(`${total} monsters available`);
```

## Development

```bash
npm install          # Install dependencies
npm run build        # Compile TypeScript and generate API files
npm run typecheck    # Type check only
npm run clean        # Remove generated files
npx serve public     # Preview locally at http://localhost:3000
```

## Architecture

```
monsters/*.json + islands.json → src/reader.ts → src/writer.ts → public/api/
```

The build pipeline reads source JSON files from the repo, then writes optimized API output to `public/api/`. GitHub Actions deploys `public/` to GitHub Pages on every push to `main`.

## Data Format

Each monster file contains:

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

## Contributing

Source data lives in `monsters/` (one JSON file per monster) and `islands.json`. Edit those files to update the API — the build pipeline handles the rest.

## License

MIT
