import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";
const OUTPUT_DIR = "public/api";
const MONSTERS_DIR = join(OUTPUT_DIR, "monsters");
const ISLANDS_DIR = join(OUTPUT_DIR, "islands");
/**
 * Convert a monster name to a URL-friendly slug.
 * Same logic as the source filenames: lowercase, replace non-alphanumeric with hyphens.
 */
export function toSlug(name) {
    return name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}
/**
 * Write individual monster JSON files and a manifest index.
 */
export async function writeMonsters(monsters) {
    await mkdir(MONSTERS_DIR, { recursive: true });
    // Write individual files
    for (const monster of monsters) {
        const slug = toSlug(monster.name);
        const filePath = join(MONSTERS_DIR, `${slug}.json`);
        await writeFile(filePath, JSON.stringify(monster, null, 2) + "\n");
    }
    // Write manifest
    const manifestEntries = monsters.map((m) => ({
        name: m.name,
        slug: toSlug(m.name),
        class: m.class,
        elements: m.elements,
    }));
    const manifest = {
        total: monsters.length,
        monsters: manifestEntries,
    };
    await writeFile(join(MONSTERS_DIR, "index.json"), JSON.stringify(manifest, null, 2) + "\n");
    console.log(`  Wrote ${monsters.length} monster files + index.json to ${MONSTERS_DIR}/`);
}
/**
 * Write the islands manifest.
 */
export async function writeIslands(islands) {
    await mkdir(ISLANDS_DIR, { recursive: true });
    const manifest = {
        total: islands.length,
        islands,
    };
    await writeFile(join(ISLANDS_DIR, "index.json"), JSON.stringify(manifest, null, 2) + "\n");
    console.log(`  Wrote islands index.json to ${ISLANDS_DIR}/`);
}
//# sourceMappingURL=writer.js.map