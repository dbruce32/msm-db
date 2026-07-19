# Breeding Data Collection Workflow

This document describes the subagent workflow used to extract breeding combinations from the My Singing Monsters wiki and add them to monster JSON files.

## Overview

Breeding data is scraped from island wiki pages and stored on the **result monster's** JSON file, keyed by island name. The workflow uses parallel subagents to handle multiple islands or data categories simultaneously.

## Steps

### 1. Fetch Wiki Data

Fetch the island's breeding section using the URL pattern:

```
https://mysingingmonsters.fandom.com/wiki/{Island_Name}#Common
```

Use `selective` mode with search terms `"breeding combination pair time enhanced"` to extract the breeding tables.

### 2. Parse Breeding Tables

From the fetched content, extract for each breeding combo:
- **Pair**: The two monsters bred together (e.g., `["Shugabush", "Potbelly"]`)
- **Result**: The monster produced
- **Time**: Normal breeding time (e.g., `"1d 11h"`)
- **Enhanced Time**: Enhanced breeding structure time (e.g., `"1d 2h 15m"`)

Organize data into categories:
- **Common** — standard breeding pairs
- **Epic** — special limited-time breeding combos
- **Special** — seasonals, mythicals, legendaries, expansion monsters

### 3. Identify Target Files

Breeding data is stored on the **result monster's file**, not the parent monsters. Use the filename convention:

```
re.sub(r'[^a-z0-9]+', name.lower()).strip('-') + '.json'
```

### 4. Delegate File Updates to Subagents

Split the work into parallel subagent stages by island or by category. Each stage receives:
- The complete list of monsters to update
- The exact breeding pairs, times, and enhanced times
- Instructions to read each file first and preserve existing data

#### Stage Structure

```
stages:
  - name: island_a_common_and_epic
    role: kiro_default
    prompt_template: |
      Update monster files with Island A breeding data...
      [list of common combos]
      [list of epic combos]
      [list of special combos]

  - name: island_b_common_and_epic
    role: kiro_default
    prompt_template: |
      Update monster files with Island B breeding data...
```

#### Avoiding Race Conditions

When two stages write to the **same file** (e.g., both common and epic agents write to `whisp.json`), the second agent may overwrite the first. Solutions:

1. **Combine common + epic in one stage per island** (preferred) — avoids conflicts entirely
2. **Sequential stages with `depends_on`** — second stage reads what the first wrote
3. **Manual fixup after parallel execution** — verify and patch missing entries

### 5. Validate Results

After all subagents complete, validate:

```bash
cd monsters && python3 -c "
import json, glob
errors = []
for f in glob.glob('*.json'):
    try:
        json.load(open(f))
    except Exception as e:
        errors.append(f'{f}: {e}')
print('All valid' if not errors else errors)
"
```

Also verify counts:

```bash
python3 -c "
import json, glob
count = sum(1 for f in glob.glob('*.json')
            if 'Island Name' in json.load(open(f)).get('breeding', {}))
print(f'Files with Island Name: {count}')
"
```

## JSON Format Reference

Per `AGENTS.md`, breeding data on a monster file looks like:

```json
{
  "name": "Whisp",
  "class": "Ethereal",
  "elements": ["Plasma", "Shadow"],
  "variants": ["Rare Whisp", "Epic Whisp"],
  "breeding": {
    "Ethereal Island": {
      "common": { "pair": ["Ghazt", "Grumpyre"], "time": "1d 18h", "enhanced_time": "1d 7h 30m" },
      "epic": { "pair": ["Nebulob", "Kazilleon"], "time": "1d 16h", "enhanced_time": "1d 6h" }
    }
  }
}
```

Key rules:
- `"common"` — default breeding pair for that monster on that island
- `"epic"` — special combo that produces the Epic variant
- Multiple islands can coexist as sibling keys in the `breeding` object
- If a monster has no common breeding (e.g., single-element monsters), omit the `"common"` key

## Islands Processed

| Island | Monsters Updated | Date |
|--------|-----------------|------|
| Plant Island | ~30 | (pre-existing) |
| Cold Island | ~25 | (pre-existing) |
| Air Island | ~25 | (pre-existing) |
| Water Island | ~25 | (pre-existing) |
| Earth Island | ~25 | (pre-existing) |
| Shugabush Island | 15 | 2026-07-19 |
| Ethereal Island | 16 | 2026-07-19 |
| Fire Haven | 18 | 2026-07-19 |
| Fire Oasis | 19 | 2026-07-19 |
| Mythical Island | 14 | 2026-07-19 |

## Tips

- Fire Islands have longer breeding times for fire-element monsters (10h for doubles vs 8h on naturals)
- Mythical Island and Shugabush Island use a "hub monster" mechanic (Cataliszt / Shugabush required in every combo)
- Ethereal Island allows singles to breed with each other (unlike Natural Islands)
- Some monsters appear on multiple islands with different breeding combos per island — each gets its own key
- Wiki pages are very large (1800+ links); use `selective` fetch mode to avoid context exhaustion
