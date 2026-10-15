#!/usr/bin/env node
// -----------------------------------------------------------------------------
// Writes the parallels from finishes.json into cards.json as extra finishes.
//
// Usage (run from scripts/sumo/):
//   node apply-finishes.mjs            # rewrite cards.json
//   node apply-finishes.mjs --dry-run  # print counts only
//
// Idempotent: every card is reset to its first (standard) finish, then the
// parallels listed for its set are appended in the order of finishes.json.
// -----------------------------------------------------------------------------

import { readFile, writeFile } from "node:fs/promises";

const FINISHES_PATH = "finishes.json";
const CARDS_PATH = "../../app/utils/sumo/_const/cards.json";

// finishes.json id -> finish written to cards.json (see TFinish in types.ts)
const FINISHES = {
  kira: { id: "kira", name: "Kira", printRun: null, effect: "sparkle" },
  "kira-heart": { id: "kira-heart", name: "Heart kira", printRun: null, effect: "sparkle" },
  "kira-star": { id: "kira-star", name: "Star kira", printRun: null, effect: "sparkle" },
};

const dryRun = process.argv.includes("--dry-run");

// "01-42" -> [1..42], "90" -> [90]
const expand = (range) => {
  const [from, to = from] = range.split("-").map(Number);
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
};

const main = async () => {
  const { sets: rules } = JSON.parse(await readFile(FINISHES_PATH, "utf8"));
  const cardsRaw = await readFile(CARDS_PATH, "utf8");
  const sets = JSON.parse(cardsRaw);

  for (const set of sets) {
    const rule = rules[set.code];
    if (!rule) throw new Error(`no finishes.json entry for set ${set.code}`);

    for (const card of set.cards) card.finishes = card.finishes.slice(0, 1);

    for (const { finish, cards } of rule.parallels) {
      if (!FINISHES[finish]) throw new Error(`unknown finish ${finish} in ${set.code}`);
      for (const number of cards.flatMap(expand)) {
        const card = set.cards.find((c) => Number(c.number) === number);
        if (!card) throw new Error(`${set.code} has no card #${number}`);
        card.finishes.push({ ...FINISHES[finish] });
      }
    }

    const withParallels = set.cards.filter((c) => c.finishes.length > 1).length;
    console.log(`${set.code}: ${withParallels}/${set.cards.length} cards with parallels`);
  }

  if (dryRun) return;
  await writeFile(
    CARDS_PATH,
    JSON.stringify(sets, null, 2) + (cardsRaw.endsWith("\n") ? "\n" : "")
  );
  console.log(`\nupdated ${CARDS_PATH}`);
};

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
