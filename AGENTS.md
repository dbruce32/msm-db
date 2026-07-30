# MSM Database — Agent Context

## Project Overview

A static My Singing Monsters database stored as JSON files for future API use. The primary use case is searching for a monster by name and getting its islands and breeding combinations.

## Structure

```
msm-db/
├── README.md
├── AGENTS.md
├── islands.json          # 28 islands with element pools
├── monsters/             # 179 individual .json files (one per monster)
│   ├── bowgart.json
│   ├── deedge.json
│   └── ...
└── Assets/
    ├── Elements/         # 46 element icon PNGs + manifest
    │   ├── elements.json
    │   ├── air.png
    │   └── ...
    ├── Islands/          # 40 island icon PNGs + manifest
    │   ├── islands.json
    │   ├── plant.png
    │   └── ...
    ├── Currency/         # 5 currency icon PNGs + manifest
    │   ├── currency.json
    │   ├── coins.png
    │   └── ...
    └── General/          # 2 general icon PNGs + manifest
        ├── general.json
        ├── 2x2.png
        └── ...
```

## File Formats

### Monster File (`monsters/{name}.json`)

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
    },
    "Cold Island": {
      "common": { "pair": ["Furcorn", "Toe Jammer"], "time": "12h", "enhanced_time": "9h" },
      "epic": { "pair": ["Congle", "Furcorn"], "time": "1d 5h", "enhanced_time": "21h 45m" }
    }
  }
}
```

Breeding is stored statically (not computed) because epic monsters have hard-assigned combos. The `breeding` object is keyed by island name, with sub-keys:
- `"common"` — default breeding pair for that monster
- `"epic"` — special combo that produces the Epic variant
- `"rare"` — special combo for Rare singles (only applicable to single-element monsters)

### Islands File (`islands.json`)

Flat array of island objects with name and element pool:

```json
[
  { "name": "Plant Island", "elements": ["Plant", "Earth", "Water", "Cold"] },
  { "name": "Cold Island", "elements": ["Air", "Plant", "Earth", "Cold"] }
]
```

A monster can appear on an island if all its elements are a subset of that island's element pool.

### Elements Manifest (`Assets/Elements/elements.json`)

Provides a discoverable index of all 46 element icon assets with pre-built raw GitHub URLs:

```json
{
  "description": "Element icon assets for My Singing Monsters",
  "base_url": "https://raw.githubusercontent.com/dbruce32/msm-db/main/Assets/Elements",
  "elements": [
    {
      "name": "Air",
      "file": "air.png",
      "url": "https://raw.githubusercontent.com/dbruce32/msm-db/main/Assets/Elements/air.png"
    }
  ]
}
```

Usage:
- Fetch the manifest to discover all available element icons
- Use the `url` field directly, or construct URLs with `base_url + "/" + file`
- Icons are PNG format, named with lowercase/underscore convention (except `SummerSong.png`)

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

### Rare Single Breeding Pattern (Not Yet Stored for All Islands)

Rare single-element monsters are bred by combining two different triples that share the target element. Same formula on all Natural Islands:
- Time: 6h / Enhanced: 4h 30m
- Pair: `["Any [Element] Triple", "Any [Element] Triple"]`

Rare multi-element monsters use the same combos as their common counterparts (no separate entry needed).

### Special Monsters Per Island

Special breeding entries (stored under the monster's own file) include:
- **Ethereals** (e.g., Grumpyre on Cold Island): bred via Quad + Triple
- **Seasonals** (e.g., Yool on Cold Island): specific combos, only available during events
- **Mythicals** (e.g., Strombonin on Cold Island): specific combos
- **Legendaries** (e.g., Bbli$zard on Cold Island): specific combos

## Known Issues

### `islands.json` Element Corrections Needed

Based on wiki data, the following are the correct element pools (missing element noted):

| Island | Elements | Missing |
|--------|----------|---------|
| Plant Island | Plant, Earth, Water, Cold | Air |
| Cold Island | Air, Plant, Water, Cold | Earth |
| Air Island | Air, Earth, Water, Cold | Plant |
| Water Island | Air, Plant, Earth, Water | Cold |
| Earth Island | Air, Plant, Earth, Cold | Water |

**Current `islands.json` has errors:**
- Cold Island currently says `["Air", "Plant", "Earth", "Cold"]` — should be `["Air", "Plant", "Water", "Cold"]` (Water, not Earth)
- Air Island currently says `["Air", "Plant", "Earth", "Water"]` — should be `["Air", "Earth", "Water", "Cold"]` (Cold, not Plant)

These need to be fixed.

## Design Decisions

- **One file per monster** — enables O(1) lookup by name without loading the entire dataset
- **Breeding stored on the monster itself** — keyed by island name, since combos differ per island
- **Static breeding data** — not computed from element logic, since Epics/Specials break the rules
- **Kebab-case filenames** — normalized from monster name for URL-friendly paths
- **No separate rare/epic monster files** — variant info is stored as a `variants` array on the base monster; epic breeding is stored as `"epic"` key within the island breeding object

## Next Steps

1. Fix `islands.json` element pools (Cold Island and Air Island are wrong)
2. Add rare single-element breeding data to Cold, Air, Water, Earth Islands
3. Add breeding data for Fire Haven and Fire Oasis
4. Add breeding data for Mirror islands (same combos as originals)
5. Consider adding Fire, Magical, Ethereal, and other class breeding data
