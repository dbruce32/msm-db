import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";
import type { Monster, Island } from "./types.js";

const DATA_DIR = "monsters";
const ISLANDS_FILE = "islands.json";

/**
 * Read all monster JSON files from the monsters/ directory.
 */
export async function readMonsters(): Promise<Monster[]> {
  const files = await readdir(DATA_DIR);
  const jsonFiles = files.filter((f) => f.endsWith(".json")).sort();

  const monsters: Monster[] = [];

  for (const file of jsonFiles) {
    const content = await readFile(join(DATA_DIR, file), "utf-8");
    const monster: Monster = JSON.parse(content);
    monsters.push(monster);
  }

  console.log(`  Read ${monsters.length} monsters from ${DATA_DIR}/`);
  return monsters;
}

/**
 * Read islands.json.
 */
export async function readIslands(): Promise<Island[]> {
  const content = await readFile(ISLANDS_FILE, "utf-8");
  const islands: Island[] = JSON.parse(content);
  console.log(`  Read ${islands.length} islands from ${ISLANDS_FILE}`);
  return islands;
}
