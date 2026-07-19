/**
 * MSM Database Types
 *
 * These types represent the source data format (monsters/*.json and islands.json)
 * as well as the API output format.
 */

// --- Source Data Types ---

export interface BreedingEntry {
  pair: [string, string];
  time: string;
  enhanced_time: string;
}

export interface IslandBreeding {
  common?: BreedingEntry | null;
  rare?: BreedingEntry | null;
  epic?: BreedingEntry | null;
}

export interface Monster {
  name: string;
  class: string;
  elements: string[];
  variants: string[];
  breeding: Record<string, IslandBreeding>;
}

export interface Island {
  name: string;
  elements: string[];
}

// --- API Output Types ---

export interface MonsterManifestEntry {
  name: string;
  slug: string;
  class: string;
  elements: string[];
}

export interface MonsterManifest {
  total: number;
  monsters: MonsterManifestEntry[];
}

export interface IslandManifest {
  total: number;
  islands: Island[];
}
