import type React from "react";

import type { THannahCard, THannahSet } from "./types";

import type { TFinish } from "~sumo/_const/types";

// No checklist exists for these cards (the box has no series or name, and the
// cards carry no numbers), so they're numbered in the order they were scanned:
// page by page, row by row. Photos are public/images/utils/hannah-montana/NN.webp,
// made by scripts/hannah-montana/cut-cards.py + export-web.mjs.
const CARD_COUNT = 36;

const FINISHES: Array<TFinish> = [
  { id: "std", name: "Base", printRun: null },
  { id: "sparkle", name: "Sparkle", printRun: null, effect: "starburst" },
];

const pad = (n: number) => String(n).padStart(2, "0");

const CARDS: Array<THannahCard> = Array.from({ length: CARD_COUNT }, (_, i) => {
  const number = pad(i + 1);
  return { id: `hm.${number}`, number, src: `${number}.webp`, finishes: FINISHES };
});

export const HANNAH_SET: THannahSet = { code: "hm", cards: CARDS };

// Where the holo lattice falls on a card (starburst.css). The foil was laid on
// the sheet before cutting, so every card shows it shifted differently; this
// gives each card its own fixed shift within one lattice cell. mask-position %
// is a share of (card - tile), hence the factors: tile = 10.4% of the width,
// card ~1.43 times taller than wide.
export const holoOffset = (card: THannahCard) => {
  const n = Number(card.number);
  const fx = (n * 0.618034) % 1;
  const fy = (n * 0.414214 + 0.37) % 1;
  return {
    "--holo-x": `${(fx * 11.6).toFixed(2)}%`,
    "--holo-y": `${(fy * 7.8).toFixed(2)}%`,
  } as React.CSSProperties;
};

export const STORAGE_KEY_OWNED_FINISHES = "hannah-montana-owned-finishes";
