#!/usr/bin/env node
// -----------------------------------------------------------------------------
// Writes the base-set chapters from subsets.json into cards.json: each set gets
// `themes` (id + English and Japanese names, in checklist order) and each card
// its `theme` id.
//
// Usage (run from scripts/sumo/):
//   node apply-subsets.mjs            # rewrite cards.json
//   node apply-subsets.mjs --dry-run  # validate and print only
//
// Fails unless every card of every set falls in exactly one theme.
// -----------------------------------------------------------------------------

import { readFile, writeFile } from "node:fs/promises";

const SUBSETS_PATH = "subsets.json";
const CARDS_PATH = "../../app/utils/sumo/_const/cards.json";

const dryRun = process.argv.includes("--dry-run");

const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

// "1-42" -> [1..42], "90" -> [90]
const expand = (range) => {
  const [from, to = from] = range.split("-").map(Number);
  return Array.from({ length: to - from + 1 }, (_, i) => from + i);
};

const main = async () => {
  const { sets: rules } = JSON.parse(await readFile(SUBSETS_PATH, "utf8"));
  const cardsRaw = await readFile(CARDS_PATH, "utf8");
  const sets = JSON.parse(cardsRaw);

  for (const set of sets) {
    const rule = rules[set.code];
    if (!rule) throw new Error(`no subsets.json entry for set ${set.code}`);

    const byNumber = new Map(set.cards.map((card) => [Number(card.number), card]));
    const assigned = new Set();

    set.themes = rule.themes.map(({ ja, en, cards }) => {
      const id = slugify(en);
      for (const number of expand(cards)) {
        const card = byNumber.get(number);
        if (!card) throw new Error(`${set.code} has no card #${number}`);
        if (assigned.has(number)) throw new Error(`${set.code} #${number} is in two themes`);
        assigned.add(number);
        card.theme = id;
      }
      return { id, name: en, nameJa: ja };
    });

    const missing = set.cards.filter((card) => !assigned.has(Number(card.number)));
    if (missing.length) {
      throw new Error(`${set.code}: no theme for #${missing.map((c) => c.number).join(", #")}`);
    }

    console.log(`${set.code}: ${set.themes.map((t) => t.name).join(" · ")}`);
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
