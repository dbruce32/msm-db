import { readMonsters, readIslands } from "./reader.js";
import { writeMonsters, writeIslands } from "./writer.js";

async function main(): Promise<void> {
  console.log("🎵 MSM Database — Static API Build\n");

  const startTime = Date.now();

  // Read source data
  console.log("Reading source data...");
  const [monsters, islands] = await Promise.all([
    readMonsters(),
    readIslands(),
  ]);

  // Write API output
  console.log("\nWriting API output...");
  await writeMonsters(monsters);
  await writeIslands(islands);

  const elapsed = ((Date.now() - startTime) / 1000).toFixed(2);
  console.log(`\n✅ Build complete in ${elapsed}s`);
  console.log(`   ${monsters.length} monsters, ${islands.length} islands`);
  console.log(`   Output: public/api/`);
}

main().catch((err) => {
  console.error("❌ Build failed:", err);
  process.exit(1);
});
