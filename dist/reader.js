import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
const DATA_DIR = "monsters";
const ISLANDS_FILE = "islands.json";
/**
 * Read all monster JSON files from the monsters/ directory.
 */
export async function readMonsters() {
    const files = await readdir(DATA_DIR);
    const jsonFiles = files.filter((f) => f.endsWith(".json")).sort();
    const monsters = [];
    for (const file of jsonFiles) {
        const content = await readFile(join(DATA_DIR, file), "utf-8");
        const monster = JSON.parse(content);
        monsters.push(monster);
    }
    console.log(`  Read ${monsters.length} monsters from ${DATA_DIR}/`);
    return monsters;
}
/**
 * Read islands.json.
 */
export async function readIslands() {
    const content = await readFile(ISLANDS_FILE, "utf-8");
    const islands = JSON.parse(content);
    console.log(`  Read ${islands.length} islands from ${ISLANDS_FILE}`);
    return islands;
}
//# sourceMappingURL=reader.js.map