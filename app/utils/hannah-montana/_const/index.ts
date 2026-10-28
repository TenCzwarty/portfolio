import type { THannahCard, THannahSet } from "./types";

import type { TFinish } from "~sumo/_const/types";

// No checklist exists for these cards (the box has no series or name), so the
// catalog is just numbered placeholders until there are photos.
// TODO: set the real count once the cards are photographed
const CARD_COUNT = 24;

// Card number -> photo file name, filled in as photos come
const SRC: Record<string, string> = {};

const FINISHES: Array<TFinish> = [
  { id: "std", name: "Base", printRun: null },
  { id: "sparkle", name: "Sparkle", printRun: null, effect: "sparkle" },
];

const pad = (n: number) => String(n).padStart(2, "0");

const CARDS: Array<THannahCard> = Array.from({ length: CARD_COUNT }, (_, i) => {
  const number = pad(i + 1);
  return { id: `hm.${number}`, number, src: SRC[number] ?? null, finishes: FINISHES };
});

export const HANNAH_SET: THannahSet = { code: "hm", cards: CARDS };

export const STORAGE_KEY_OWNED_FINISHES = "hannah-montana-owned-finishes";
