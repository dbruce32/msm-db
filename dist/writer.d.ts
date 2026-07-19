import type { Monster, Island } from "./types.js";
/**
 * Convert a monster name to a URL-friendly slug.
 * Same logic as the source filenames: lowercase, replace non-alphanumeric with hyphens.
 */
export declare function toSlug(name: string): string;
/**
 * Write individual monster JSON files and a manifest index.
 */
export declare function writeMonsters(monsters: Monster[]): Promise<void>;
/**
 * Write the islands manifest.
 */
export declare function writeIslands(islands: Island[]): Promise<void>;
//# sourceMappingURL=writer.d.ts.map