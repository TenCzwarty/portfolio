import type { THannahCard, THannahSet } from "./types";

import type { TFinish } from "~sumo/_const/types";

// No checklist exists for these cards (the box has no series or name, and the
// cards carry no numbers), so they're numbered in the order they were scanned:
// page by page, row by row. Photos are public/images/utils/hannah-montana/NN.webp,
// made by scripts/hannah-montana/cut-cards.py + export-web.mjs.
const CARD_COUNT = 36;

// Every card is the holo print; there are no plain or other versions
const FINISHES: Array<TFinish> = [
  { id: "holo", name: "Holo", printRun: null, effect: "starburst" },
];

const pad = (n: number) => String(n).padStart(2, "0");

const CARDS: Array<THannahCard> = Array.from({ length: CARD_COUNT }, (_, i) => {
  const number = pad(i + 1);
  return { id: `hm.${number}`, number, src: `${number}.webp`, finishes: FINISHES };
});

export const HANNAH_SET: THannahSet = { code: "hm", cards: CARDS };

export const STORAGE_KEY_OWNED_FINISHES = "hannah-montana-owned-finishes";
